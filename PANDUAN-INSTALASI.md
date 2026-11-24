# Panduan Instalasi — Petualangan Pecahan (versi lengkap)

## Isi paket
- `Kode.gs` + `Modul.gs` → backend (Google Apps Script). **Keduanya wajib dipasang di satu proyek.**
- ZIP ini → frontend (GitHub Pages). `index.html` ada di akar ZIP.

## A. Backend — pakai akun Google yang SAMA dengan aplikasi lama
1. Buka https://script.google.com → **Proyek baru** (jangan ubah proyek lama). Ganti nama `Code.gs` menjadi `Kode`, tempel isi `Kode.gs`. Klik **＋ → Script**, beri nama `Modul`, tempel isi `Modul.gs`.
2. Pilih fungsi `setupAppEnvironment` → **Run** → izinkan akses. Aman diulang (sheet/kolom baru hanya ditambahkan, data tidak disentuh).
3. Buka **Execution log**: catat sandi guru. Nama pengguna: `guru`. Sandi hanya tampil sekali; lupa → jalankan `resetAksesGuru`.
4. **Deploy → New deployment → Web app** → Execute as: **Me**, Who has access: **Anyone** → salin URL berakhiran `/exec`.
5. Setelah mengubah kode: **Deploy → Manage deployments → ✏️ → New version**.

## B. Data lama (aman, hanya dibaca)
Aplikasi lama punya sheet `Log`, `Jawaban`, `Progres` tanpa daftar siswa. Migrasi menyusun daftar siswa dari kolom Nama + Kelas dan menyalin Progres/Jawaban lama ke sheet arsip (`Arsip_Progres_Lama`, `Arsip_Jawaban_Lama`). Progres lama TIDAK dijadikan tahap baru, agar tidak ada nilai resmi yang terbuka keliru.
1. Buat salinan spreadsheet lama (File → Buat salinan).
2. Masuk sebagai guru → **Pengaturan → Migrasi data aplikasi lama** → tempel URL spreadsheet lama → **Uji coba** → baca laporannya → bila sesuai, **Jalankan migrasi**. (Alternatif di editor: `importDataLama('URL', true)`.)
3. Aman diulang tanpa data dobel. **Perhatikan peringatan nama kembar** — login memakai nama saja, jadi beri nama pembeda pada siswa yang namanya sama di kelas berbeda.

## B2. Peringatan tentang aplikasi lama
Aplikasi lama menyimpan sandi guru di dalam kode dan punya aksi `reset` yang bisa menghapus semua baris. Selama masih online, siapa pun yang tahu sandinya dapat menghapus datanya. Ganti sandinya atau batasi aksesnya sampai pindahan selesai. Sistem baru tidak memiliki aksi hapus massal.

## C. Rahasia
Tidak ada token atau kunci API yang perlu Anda isi. Sandi guru dan kunci sesi dibuat otomatis oleh setup dan disimpan di Script Properties (bukan di kode atau sheet). Notifikasi WhatsApp sudah dihapus dari sistem; satu-satunya hubungan dengan WhatsApp adalah tombol mengambang "Chat WhatsApp" yang membuka obrolan ke `WA_NOMOR` di `js/config.js`.

## D. Frontend (GitHub Pages)
1. Ekstrak ZIP. **Folder hasil ekstraksi adalah folder yang di-`git init`** (di dalamnya langsung terlihat `index.html`).
2. Edit `js/config.js`: isi `GAS_URL` dengan URL `/exec` dan `WA_NOMOR` (format `62812…`).
3. Buat repository **Public** di GitHub (jangan centang README). Dari folder tadi, di terminal:
```
dir            (pastikan index.html muncul)
git init
git add .
git commit -m "Rilis pertama"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```
4. GitHub → Settings → Pages → Branch `main`, folder `/ (root)` → Save. Tunggu 1–2 menit, buka situs, tekan Ctrl+Shift+R.
Jangan memakai tombol "Upload files" di web GitHub (struktur folder rusak). Kalau `git push` meminta kata sandi, pakai Personal Access Token, bukan sandi akun.

## D2. Jika yang tampil hanya tulisan "💬 Chat WhatsApp" (halaman polos)
Artinya `index.html` terbuka, tetapi folder `css/` dan `js/` tidak ditemukan di sampingnya (error 404). Penyebab paling umum: file naik ke GitHub bukan dari dalam folder hasil ekstraksi, sehingga terbentuk satu folder tambahan di dalam repo.
1. Buka repository di github.com. Daftar file di halaman utama harus langsung menampilkan: `index.html`, `css`, `js`, `sw.js`, `manifest.json`, `icon.svg`. Kalau yang terlihat hanya satu folder (mis. `petualangan-pecahan-frontend`), itulah masalahnya.
2. Tes cepat: buka `https://USERNAME.github.io/NAMA-REPO/js/app.js`. Kalau muncul "404", strukturnya salah. Kalau muncul kode, tekan Ctrl+Shift+R di halaman utama.
3. Perbaikan paling aman: ulangi dari terminal di dalam folder yang berisi `index.html` (lihat langkah D3). Jika repo sudah berisi struktur salah, buat repository baru yang kosong lalu ulangi D3.
4. Settings → Pages harus: Branch `main`, folder `/ (root)`.
Jangan unggah lewat tombol "Upload files" di web GitHub.

## E. Uji setelah terpasang
1. Beranda terbuka, slideshow berputar, tombol WhatsApp ada, kursor `+` mengikuti mouse.
2. Panel Guru: tombol **Guru** → masuk (`guru` + sandi dari langkah A3) → **Kelola Kelas** → tambahkan siswa → **Bank Soal** (isi atau impor CSV).
3. Masuk sebagai `siswa contoh` → Asesmen 1 → refleksi → Asesmen 2 terbuka.
4. Asesmen 3: muat ulang halaman = 1 peringatan, soal tetap sama, timer tidak mundur; pindah tab sampai peringatan ke-3 → ujian berhenti, skor muncul. Guru: **Pemantauan Asesmen 3 → Buka Kembali** (alasan ≥ 30 karakter).

## F. Fitur yang tersedia
Landing (hero & kartu slideshow, testimoni flip + pop up, tombol WA, kursor `+` berpartikel) • login nama • peta 3 dunia • Asesmen 1–2 (4 jenis soal, umpan balik instan, simpan draf, status kelompok) • Asesmen 3 mode TKA (timer & sesi di server, 3 peringatan, simpan otomatis, ragu-ragu, ringkasan) • hasil berurutan (skor → pembahasan → tindak lanjut) • refleksi • Materi • Progres & Lencana • sertifikat cetak • Mode Tamu • PWA • panel guru (ringkasan TP, pemantauan + buka kembali, bank soal + impor CSV + stimulus, hasil + ekspor Excel, jurnal, kelas & kelompok otomatis, buka kunci manual, pengaturan, migrasi).

## G. Yang sengaja belum ada
Testimoni di beranda masih contoh statis (ubah di `js/app.js`, daftar `TESTI`). Materi video memakai tautan https dari sheet `Materi`. Sertifikat memakai nama guru pada desain Anda dan tidak memuat nomor dokumen resmi sekolah.
