# SECOND BRAIN OS V2.1 — Perbaikan PWA Android

1. **Backup dahulu:** buka V2.1 yang berjalan lalu Ekspor JSON.
2. Ekstrak ZIP dan upload **isi folder** ke root repo GitHub Pages, bukan folder pembungkusnya. Pastikan `install.html`, `sw.js`, `manifest.webmanifest`, `study.js`, dan folder `icons/` ikut terunggah.
3. Jangan mengganti `firebase-config.js` yang telah berfungsi jika berbeda dengan paket ini.
4. Commit, tunggu GitHub Pages terbit, lalu buka `https://<username>.github.io/<repo>/install.html` melalui Chrome Android.
5. Periksa diagnostik. Jika ada tombol Instal, tekan. Jika tidak, gunakan menu ⋮ → Instal aplikasi / Tambahkan ke layar utama.
6. Jika Chrome berkata aplikasi sudah terinstal, periksa daftar aplikasi Android sebelum menghapus apa pun.

**Penting:** Ini PWA, bukan APK. Tidak semua versi Chrome/Android menampilkan tombol instal. Jangan hapus data situs/aplikasi tanpa backup; data lokal dapat hilang. `beforeinstallprompt` tidak selalu dipicu meski aplikasi bisa ditambahkan ke layar utama.
