# SECOND BRAIN OS V2.1 — Smart Study Assistant

Fitur: kartu belajar dari catatan, tampilkan jawaban, tandai paham/ulangi, progres lokal. Tidak menggunakan AI generatif atau API berbayar. Materi otomatis bersifat heuristik dan harus diperiksa pengguna.

## Deploy
1. Ekspor JSON dari aplikasi lama untuk cadangan.
2. Unggah seluruh isi ZIP ke root repository GitHub Pages, termasuk `study.js`, folder `icons`, dan file konfigurasi Firebase yang sudah benar.
3. **Penting:** paket ini menyertakan `firebase-config.js` dari sumber V2.0. Periksa kecocokannya sebelum mengganti file yang sudah berfungsi di GitHub. Bila berbeda, pertahankan file konfigurasi Firebase milik Anda.
4. Commit dan tunggu deployment. Buka PWA lalu menu Smart Study.

## APK vs PWA
ZIP ini berisi aplikasi web PWA, **bukan APK**. Chrome dapat memasang PWA ke layar utama, tetapi untuk file APK Android diperlukan proses build terpisah, misalnya Trusted Web Activity dengan Bubblewrap/Android Studio atau Capacitor. Tidak ada file APK dalam ZIP ini.
