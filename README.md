# Petualangan Pecahan — Kelas VII

Frontend statis (satu berkas `index.html`) untuk GitHub Pages. Backend ada di Google Apps Script (berkas `Kode.gs` dan `Modul.gs`, tidak termasuk di repository ini).

## Sebelum push
Buka `index.html` dengan Notepad, tekan Ctrl+F, cari `GANTI_DENGAN_URL_EXEC`, lalu ganti dengan alamat `/exec` dari Apps Script (tetap di dalam tanda kutip). Simpan.

## Update setelah ada perubahan
```
git add .
git commit -m "Update"
git push
```
