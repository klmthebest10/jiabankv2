# JiaBank

Aplikasi catatan keuangan pribadi (PWA) dengan asisten AI **Jia** berbasis Gemini.
Live: https://jiabank.vercel.app

## Fitur
- Saldo, pemasukan/pengeluaran per periode tutup buku (tanggal bisa diatur)
- Kategori otomatis (termasuk kata kunci Korea: 편의점, 버스, 월세, dll.)
- Anggaran total & per kategori, proyeksi akhir periode, batas aman per hari
- Grafik pengeluaran harian, komposisi kategori, tren 6 periode
- Riwayat dengan pencarian, filter periode/kategori/tipe, ekspor CSV
- **Jia AI**: chat analisis keuangan, bisa mencatat transaksi, mengatur anggaran, menyesuaikan saldo (selalu dengan konfirmasi)
- Input ketik/suara bahasa sehari-hari ("makan 9.500, bus 1500 kemarin, gaji 2,3jt")
- Scan nota dengan AI (bisa diperiksa sebelum disimpan)
- Kunci pola (tersimpan sebagai hash), kunci otomatis, sembunyikan saldo
- Mode terang/gelap, bisa offline, bisa dipasang di HP
- Cadangan & pulihkan JSON

## Struktur
| File | Isi |
|---|---|
| `index.html` | Seluruh aplikasi (HTML, CSS, JS) |
| `sw.js` | Service worker (HTML network-first agar update langsung terlihat) |
| `manifest.json` | Pengaturan PWA |

## Data
Firebase Auth (email/password) + Firestore:
`jiabank_users/{uid}/config/user_settings` dan `jiabank_users/{uid}/transactions/*`.

## AI
Isi API key Gemini di **Pengaturan → Jia AI** (key hanya disimpan di perangkat).
Model default `gemini-3.8-flash`, otomatis pindah ke model lain jika tidak tersedia atau kuota habis.
