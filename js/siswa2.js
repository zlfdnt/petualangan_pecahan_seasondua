// Sisi siswa: peta 3 dunia, navigasi, materi, progres & lencana, sertifikat, profil, mode tamu
const isGuru = () => S.tok && localStorage.pp_gt === S.tok;
const DUNIA_T = { A1: 0, R1: 0, A2: 1, R2: 1, A3: 2, R3: 2 }, NAMA_D = ['Dunia 1: Pantai Hijau', 'Dunia 2: Pulau Senja', 'Dunia 3: Samudra Biru'];
const COVER = [['🍕', '#D6F2DA', '#7CCB93'], ['🗝️', '#FFEFB5', '#F29A1F'], ['⛵', '#D5F0FB', '#2E9BD6']];
let tabD = 0;
const _landing = landing;
landing = function () {
  document.body.classList.remove('guru'); _landing(); const h = M.querySelector('header span'); if (!h) return;
  h.insertAdjacentHTML('afterbegin', `<button class="btn sec" id="goTamu" style="min-height:44px">Mode tamu</button> <button class="btn sec" id="goGuru" style="min-height:44px">Guru</button> `);
  document.getElementById('goTamu').onclick = tamu; document.getElementById('goGuru').onclick = loginGuru;
};
function nav(on) {
  return `<nav class="navp" aria-label="Menu utama">${[['peta', '🏝️', 'Beranda'], ['materi', '📖', 'Materi'], ['asesmenTab', '📝', 'Asesmen'], ['progres', '🏆', 'Progres'], ['profil', '👤', 'Profil']].map(x => `<button data-n="${x[0]}" class="${on === x[0] ? 'on' : ''}" ${on === x[0] ? 'aria-current="page"' : ''}><b>${x[1]}</b>${x[2]}</button>`).join('')}</nav>`;
}
function pasangNav() { M.querySelectorAll('[data-n]').forEach(b => b.onclick = () => window[b.dataset.n]()); document.body.classList.add('has-nav'); }
const memuat = t => `<p class="wrap" style="padding:40px">${t || 'Memuat…'}</p>`;
async function peta() {
  document.body.classList.remove('exam', 'guru'); if (isGuru()) return guruPanel();
  M.innerHTML = memuat('Memuat petamu…'); const r = await api('progres.get');
  if (!r.success) return r.net ? (M.innerHTML = `<main class="wrap" style="padding:40px">${pizi('sleepy', 90)}<p>${r.message}</p><button class="btn" onclick="peta()">Coba lagi</button></main>`) : (S.tok ? toast(r.message) : loginView());
  const st = r.data.status, tuntas = st.filter(x => x.status === 'selesai').length;
  const tampilD = d => tabD === 0 || tabD === d + 1;
  M.innerHTML = `<header class="top"><b>Hai, ${esc(S.nama)}! 👋</b><span class="chip">⭐ ${r.data.bintang}</span></header><main class="wrap"><section>
  ${r.data.dibukaKembali ? `<div class="banner"><div style="display:flex;gap:12px;align-items:center">${pizi('cheer', 70)}<div><b>Guru membuka kembali pengerjaanmu!</b><br>Tenang, kendala teknismu sudah diverifikasi. Waktu dilanjutkan dari sisa terakhir, jawabanmu tetap utuh, dan batas peringatan kembali ke 0.</div></div><p><button class="btn" id="lj">▶ Lanjutkan ujian sekarang</button></p></div>` : ''}
  <h2>Peta Petualangan</h2><p>${tuntas} dari 6 tahap selesai</p><progress max="6" value="${tuntas}" style="width:100%;height:14px" aria-label="Progres petualangan"></progress>
  <div class="tabs" role="tablist">${['Semua dunia', 'Dunia 1', 'Dunia 2', 'Dunia 3'].map((t, i) => `<button role="tab" data-t="${i}" class="${tabD === i ? 'on' : ''}">${t}</button>`).join('')}</div>
  ${[0, 1, 2].filter(tampilD).map(d => `<div class="world w${d + 1}"><h3>${NAMA_D[d]}</h3>${st.filter(x => DUNIA_T[x.kode] === d).map(x => { const t = TAHAP[x.kode]; return `<div class="node ${x.status === 'terbuka' ? 't' : x.status === 'terkunci' ? 'k' : 'done'}"><img alt="" width="64" height="36" style="border-radius:10px" src="${art(...COVER[d].map((v, i) => i ? v : v))}"><div style="flex:1"><h3 style="margin:0">${t[1]}</h3><small>${t[2]}</small></div><span class="badge">${x.status === 'selesai' ? '✅ Selesai' : x.status === 'terbuka' ? '▶ MULAI' : '🔒 Terkunci'}</span>${x.status === 'terbuka' ? `<button class="btn" data-k="${x.kode}">Buka</button>` : ''}</div>`; }).join('')}</div>`).join('')}
  <div id="tim"></div><div class="card" style="display:flex;gap:12px;align-items:center">${pizi('wave', 70)}<p style="margin:0">“Selesaikan misi dan isi refleksimu ya!” ✨</p></div></section></main>${nav('peta')}`;
  M.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { tabD = +b.dataset.t; peta(); });
  M.querySelectorAll('[data-k]').forEach(b => b.onclick = () => b.dataset.k[0] === 'A' ? petunjuk(b.dataset.k[1]) : refleksi(b.dataset.k[1]));
  const lj = document.getElementById('lj'); if (lj) lj.onclick = () => kuis('3');
  pasangNav(); timPeta();
}
async function timPeta() {
  const r = await api('kelompok.saya'); const el = document.getElementById('tim'); if (!r.success || !r.data.kelompok || !el) return;
  el.innerHTML = `<div class="card"><b>👥 Kelompok belajar ${esc(r.data.kelompok)}</b>${r.data.anggota.map(a => `<p style="margin:6px 0">${esc(a.nama)} • ${a.tahapSelesai}/6 tahap ${a.aktif ? '• ' + esc(a.aktif) : ''}</p>`).join('')}</div>`;
}
async function asesmenTab() {
  const r = await api('progres.get'); if (!r.success) return toast(r.message);
  const x = r.data.status.find(s => s.status === 'terbuka' && s.kode[0] === 'A'); x ? petunjuk(x.kode[1]) : (toast('Belum ada asesmen yang terbuka. Selesaikan refleksi dulu ya.'), peta());
}
async function materi() {
  M.innerHTML = memuat('Memuat materi…'); const r = await api('materi.list'); if (!r.success) { toast(r.message); return peta(); }
  M.innerHTML = `<header class="top"><b>📖 Materi</b></header><main class="wrap"><section><h2>Belajar bersama Pizi</h2>${r.data.map(m => `<details class="card" style="margin:10px 0"><summary style="font:700 1.1rem Nunito,sans-serif;min-height:48px;cursor:pointer">${esc(m.judul)}</summary><p>${esc(m.penjelasan)}</p>${/^https:\/\//.test(m.video || '') ? `<a class="btn sec" target="_blank" rel="noopener" href="${esc(m.video)}">▶ Tonton video</a>` : ''}</details>`).join('') || '<p>Materi belum tersedia.</p>'}</section></main>${nav('materi')}`; pasangNav();
}
async function profilData() { const r = await api('siswa.profil'); return r.success ? r.data : null; }
async function progres() {
  M.innerHTML = memuat('Memuat progresmu…'); const p = await profilData(); if (!p) { toast('Gagal memuat progres.'); return peta(); }
  const s = p.selesai || [], L = [['Pantai Hijau', 'A1', 'R1', '🏖️'], ['Pulau Senja', 'A2', 'R2', '🏝️'], ['Samudra Biru', 'A3', 'R3', '⛵']];
  M.innerHTML = `<header class="top"><b>🏆 Progres & Lencana</b></header><main class="wrap"><section><div class="grid">${L.map(l => { const ok = s.includes(l[1]) && s.includes(l[2]); return `<div class="card ${ok ? '' : 'k'}" style="text-align:center;opacity:${ok ? 1 : .6}"><div style="font-size:3rem">${ok ? l[3] : '🔒'}</div><h3>Lencana ${l[0]}</h3><small>${ok ? 'Diraih ✅' : 'Selesaikan asesmen + refleksi'}</small></div>`; }).join('')}</div>
  <h3 style="margin-top:20px">Nilai resmi</h3><div class="card scroll"><table class="tbl"><tr><th>Asesmen</th><th>Nilai</th><th>Tanggal</th></tr>${p.resmi.map(x => `<tr><td>Asesmen ${esc(x.asesmen)}</td><td><b>${esc(x.skor)}</b></td><td>${esc(String(x.tanggal).slice(0, 10))}</td></tr>`).join('') || '<tr><td colspan="3">Belum ada nilai resmi.</td></tr>'}</table></div>
  <h3 style="margin-top:20px">Riwayat latihan</h3><div class="card scroll"><table class="tbl"><tr><th>Asesmen</th><th>Nilai</th><th>Jenis</th></tr>${p.latihan.map(x => `<tr><td>${esc(x.asesmen)}</td><td>${esc(x.skor)}</td><td>${esc(x.mode)}</td></tr>`).join('') || '<tr><td colspan="3">Belum ada latihan.</td></tr>'}</table></div>
  ${s.includes('R3') ? '<p><button class="btn" id="sr">🏅 Lihat Lencana Tertinggi & Sertifikat</button></p>' : ''}</section></main>${nav('progres')}`; pasangNav();
  const sr = document.getElementById('sr'); if (sr) sr.onclick = lencana;
}
async function profil() {
  const p = await profilData();
  M.innerHTML = `<header class="top"><b>👤 Profil</b></header><main class="wrap" style="max-width:560px"><section><div class="card" style="text-align:center">${pizi('wave', 90)}<h2>${esc(S.nama)}</h2><p>${p ? 'Kelas ' + esc(p.kelas) : ''} • SMP Maitreyawira Bintan Center</p><p><small>Tip: pasang aplikasi ini di layar utama lewat menu browser ("Tambahkan ke layar utama") agar lebih cepat dibuka.</small></p><button class="btn cor" id="kl">Keluar</button></div></section></main>${nav('profil')}`; pasangNav(); document.getElementById('kl').onclick = keluar;
}
async function lencana() {
  const p = await profilData(); if (!p) return peta();
  const a3 = p.resmi.find(x => String(x.asesmen) === '3');
  kunciModal(0); modal(`<div style="text-align:center">${pizi('cheer', 110)}<span class="tag">🎉 SELAMAT! PETUALANGAN PECAHAN TUNTAS</span><h2>Lencana Tertinggi: Nakhoda Samudra Biru!</h2><p>${esc(S.nama)} (Kelas ${esc(p.kelas)}) telah menuntaskan 3 dunia dan refleksi.</p></div><div class="grid"><div class="stat m"><b>${a3 ? esc(a3.skor) : '—'}</b>Nilai resmi Asesmen 3</div><div class="stat s"><b>3/3</b>Dunia selesai</div></div>
  <p style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="ct">📜 Lihat sertifikat</button><button class="btn sec" id="x">Kembali ke peta</button></p>`);
  document.getElementById('x').onclick = () => { tutupModal(); peta(); }; document.getElementById('ct').onclick = () => sertifikat(p, a3);
}
function sertifikat(p, a3) {
  const sk = a3 ? Number(a3.skor) : 0, pr = sk >= 85 ? 'SANGAT MEMUASKAN' : sk >= 70 ? 'MEMUASKAN' : sk >= 55 ? 'CUKUP' : 'PERLU PENGUATAN';
  const html = `<div class="crt"><small>SMP MAITREYAWIRA BINTAN CENTER • KURIKULUM MERDEKA • FASE D</small><h2>SERTIFIKAT PENYELESAIAN PETUALANGAN PECAHAN</h2><p>Diberikan dengan bangga kepada:</p><div class="nm">${esc(String(S.nama).toUpperCase())}</div><p>Kelas ${esc(p.kelas)}</p><p>telah menuntaskan tiga dunia (Pantai Hijau, Pulau Senja, Samudra Biru), Asesmen Sumatif ala TKA, dan Jurnal Refleksi, dengan nilai resmi <b>${sk}</b> (${pr}) dan <b>${p.pelanggaranA3}</b> peringatan integritas.</p><p>Gelar: <b>Nakhoda Samudra Biru</b></p><p style="margin-top:24px">Guru Pengampu Matematika<br><b>Ibu Zulfa Dianti, S.Pd., M.Pd., Gr.</b></p><small>Kode bukti asesmen: ${esc(p.kodeA3 || '—')}</small></div>`;
  kunciModal(0); modal(`${html}<p style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="pr">🖨️ Cetak / simpan PDF</button><button class="btn sec" id="x">Tutup</button></p>`);
  document.getElementById('pr').onclick = () => { let c = document.getElementById('cetak'); if (!c) { c = document.createElement('div'); c.id = 'cetak'; document.body.appendChild(c); } c.innerHTML = html; print(); };
}
async function tamu() {
  const r = await api('tamu.contoh'); const d = r.success ? r.data : { soal: { teks: 'Pizza dipotong 8 sama besar. Adi makan 3 potong. Bagian yang dimakan Adi?', pilihan: ['3/5', '3/8', '5/8', '8/3'], kunci: 'B' } };
  const q = d.soal; let jw = null;
  const gambar = () => {
    M.innerHTML = `<header class="top"><b>🎈 Mode Tamu</b><button class="btn sec" id="kb" style="min-height:40px">Kembali</button></header><main class="wrap" style="max-width:640px"><section><div class="banner">Ini hanya contoh. Tidak ada nilai atau data yang tersimpan.</div><div class="card"><h3>${esc(q.teks)}</h3>${q.pilihan.map((t, k) => `<button class="opt ${jw !== null ? (LJ[k] === q.kunci ? 'ok' : jw === k ? 'no' : '') : ''}" data-k="${k}"><b>${LJ[k]}</b><span>${esc(t)}</span></button>`).join('')}${jw !== null ? `<p>${LJ[jw] === q.kunci ? '🎉 Hebat sekali!' : '💪 Ayo coba lagi!'} Pizza terbagi 8 bagian dan Adi mengambil 3 bagian, jadi 3/8.</p>` : ''}</div><p><button class="btn" id="msk">Masuk untuk mulai petualangan</button></p></section></main>`;
    document.getElementById('kb').onclick = landing; document.getElementById('msk').onclick = () => S.tok ? peta() : loginView();
    M.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { if (jw === null) { jw = +b.dataset.k; gambar(); } });
  }; gambar();
}
