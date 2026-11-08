import { firebaseConfig } from './firebase-config.js';

export async function createSync(onRemote, onStatus) {
  if (!firebaseConfig?.apiKey || !firebaseConfig?.projectId || !firebaseConfig?.authDomain) {
    onStatus('Firebase belum dikonfigurasi lengkap');
    return null;
  }
  try {
    const [appMod, authMod, fireMod] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js')
    ]);
    const app = appMod.getApps().length ? appMod.getApp() : appMod.initializeApp(firebaseConfig);
    const auth = authMod.getAuth(app);
    const fs = fireMod.getFirestore(app);
    let currentUid = null;
    let unsubscribers = [];
    let authReadyResolve;
    const authReady = new Promise(resolve => { authReadyResolve = resolve; });
    const googleProvider = new authMod.GoogleAuthProvider();

    authMod.onAuthStateChanged(auth, user => {
      unsubscribers.forEach(unsub => unsub());
      unsubscribers = [];
      currentUid = user?.uid || null;
      document.getElementById('login').hidden = !!currentUid;
      document.getElementById('logout').hidden = !currentUid;
      if (!currentUid) {
        onStatus('Lokal • belum login');
        authReadyResolve();
        return;
      }
      onStatus('Firebase • login berhasil, memuat catatan');
      for (const store of ['notes', 'collections']) {
        unsubscribers.push(fireMod.onSnapshot(
          fireMod.collection(fs, 'users', currentUid, store),
          snapshot => {
            Promise.resolve(onRemote(store, snapshot.docs.map(d => d.data())))
              .catch(err => onStatus('Sinkron lokal gagal: ' + err.message));
          },
          err => onStatus('Firestore gagal: ' + err.message + ' (periksa rules)')
        ));
      }
      authReadyResolve();
    }, err => {
      onStatus('Firebase Auth gagal: ' + err.message);
      authReadyResolve();
    });

    return {
      async login() {
        await authReady;
        try {
          await authMod.signInWithPopup(auth, googleProvider);
        } catch (err) {
          const code = err?.code || '';
          if (code === 'auth/unauthorized-domain') {
            throw new Error('Domain GitHub Pages belum diizinkan. Tambahkan murozie-12.github.io di Firebase Authentication > Settings > Authorized domains.');
          }
          if (code === 'auth/operation-not-allowed') {
            throw new Error('Provider Google belum diaktifkan di Firebase Authentication > Sign-in method.');
          }
          if (code === 'auth/popup-blocked') {
            throw new Error('Popup login diblokir. Buka website langsung di Chrome, izinkan pop-up, lalu coba lagi.');
          }
          if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
            throw new Error('Jendela login Google ditutup sebelum selesai.');
          }
          throw new Error(`${code || 'Login gagal'}: ${err?.message || 'Kesalahan tidak diketahui'}`);
        }
      },
      logout: () => authMod.signOut(auth),
      get uid() { return currentUid; },
      async push(store, item) {
        if (!currentUid) return;
        if (!['notes', 'collections'].includes(store)) throw new Error('Koleksi tidak dikenal');
        await fireMod.setDoc(fireMod.doc(fs, 'users', currentUid, store, item.id), item);
        onStatus('Firebase • tersinkron');
      }
    };
  } catch (err) {
    onStatus('Firebase tidak tersedia: ' + err.message);
    return null;
  }
}
