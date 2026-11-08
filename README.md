# SECOND BRAIN OS V1.0

Aplikasi catatan pribadi PWA dengan IndexedDB dan sinkronisasi Firebase opsional.

## Deploy
1. Upload seluruh isi folder ke root repo GitHub Pages. Aktifkan Pages dari branch main.
2. Buat Firebase project (Spark), tambah Web App, aktifkan Authentication > Google, dan buat Firestore database.
3. Isi `firebase-config.js` dengan object konfigurasi web Firebase (`export const firebaseConfig = {...};`). Ini konfigurasi publik, **jangan** masukkan private key/service account.
4. Salin `firestore.rules` ke Firestore Rules dan Publish. Tambahkan domain GitHub Pages ke Authentication > Settings > Authorized domains.
5. Refresh website. Data lokal tetap dapat dipakai tanpa Firebase.

## Penting
- Simpan backup JSON berkala. Data lokal dapat hilang bila browser dihapus.
- Sinkronisasi V1.0 berbasis timestamp perangkat, belum merupakan conflict-resolution multi-device penuh. Jangan edit catatan yang sama serentak di dua perangkat.
- Autosave memerlukan browser terbuka sampai indikator tersimpan.
- Pratinjau Markdown V1.0 menampilkan teks mentah secara aman; editor menerima sintaks Markdown.
- File PDF/gambar belum didukung; simpan tautannya di catatan.
- PWA notifikasi push dan AI belum tersedia.
