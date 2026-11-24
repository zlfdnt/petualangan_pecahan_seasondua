// Petualangan Pecahan — frontend (vanilla JS). Semua data lewat fetch ke GAS.
const CFG = window.APP_CONFIG, M = document.getElementById('app');
const S = { tok: localStorage.pp_tok || '', nama: localStorage.pp_nama || '' };
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ok = () => !/GANTI|XXXX/.test(CFG.GAS_URL);
const toast = m => { const n = document.getElementById('notif'); n.textContent = m; n.className = 'show'; setTimeout(() => n.className = '', 3000); };

async function api(a, d) {
  if (!ok()) return { success: false, message: 'Konfigurasi belum lengkap: isi GAS_URL di js/config.js.' };
  try {
    const r = await fetch(CFG.GAS_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: a, token: S.tok, data: d || {} }) });
    const j = await r.json(); if (j.code === 'AUTH') { keluar(); toast(j.message); } return j;
  } catch (e) { return { success: false, message: 'Koneksi bermasalah. Coba lagi.', net: true }; }
}
const keluar = () => { S.tok = S.nama = ''; localStorage.removeItem('pp_tok'); localStorage.removeItem('pp_nama'); landing(); };

// ---- gambar orisinal (SVG) untuk slideshow ----
function art(e, a, b) {
  return 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><circle cx="520" cy="80" r="46" fill="#fff" opacity=".55"/><path d="M0 300Q160 250 320 300T640 290V360H0Z" fill="#fff" opacity=".35"/><text x="320" y="225" font-size="140" text-anchor="middle">${e}</text></svg>`);
}
const slider = (arr, alt) => `<div class="sl" role="img" aria-label="${esc(alt)}">${arr.map((x, i) => `<img src="${x}" alt="" class="${i ? '' : 'on'}" loading="lazy">`).join('')}<div class="dots">${arr.map((x, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div></div>`;
setInterval(() => document.querySelectorAll('.sl').forEach(s => {
  const im = s.querySelectorAll('img'), dt = s.querySelectorAll('.dots i'); let i = [...im].findIndex(x => x.classList.contains('on'));
  im[i].classList.remove('on'); dt[i].classList.remove('on'); i = (i + 1) % im.length; im[i].classList.add('on'); dt[i].classList.add('on');
}), 3500);

const DUNIA = [
  { c: 'w1', n: 'Dunia 1: Pantai Hijau', t: 'Kedai pizza kelapa: pecahan senilai dan gambar dasar.', i: [art('🍕', '#D6F2DA', '#7CCB93'), art('🏖️', '#BFEBCB', '#3E9B5F'), art('🥥', '#E3F7E8', '#7CCB93')] },
  { c: 'w2', n: 'Dunia 2: Pulau Senja', t: 'Peti harta karun: tambah dan kurang pecahan.', i: [art('🗝️', '#FFEFB5', '#F29A1F'), art('🌅', '#FFD2A8', '#FFD36B'), art('🧰', '#FFF3C4', '#F29A1F')] },
  { c: 'w3', n: 'Dunia 3: Samudra Biru', t: 'Pompong dan mercusuar: soal literasi-numerasi ala TKA.', i: [art('⛵', '#D5F0FB', '#2E9BD6'), art('🗼', '#8FD3F4', '#D7F1FC'), art('🧭', '#D5F0FB', '#4DB6E8')] }
];
const TESTI = [
  { e: '🍕', j: 'Seru seperti main game', s: 'Pecahan terasa nyata karena pakai pizza dan resep.', f: 'Pecahan jadi mudah dibayangkan karena belajarnya lewat pizza, resep, dan diskon toko. Saya tidak takut salah lagi, karena ada penjelasan setelah menjawab dan boleh mengulang.', o: 'Contoh testimoni siswa' },
  { e: '👩‍🏫', j: 'Guru terbantu', s: 'Hasil dan refleksi siswa tercatat rapi.', f: 'Nilai pertama tersimpan resmi, latihan ulang tercatat terpisah, dan refleksi siswa menunjukkan bagian yang masih sulit. Tindak lanjut jadi lebih tepat sasaran.', o: 'Contoh testimoni guru' },
  { e: '👨‍👩‍👧', j: 'Orang tua tenang', s: 'Bisa belajar mandiri dari rumah.', f: 'Anak bisa berlatih di rumah dengan jalur yang jelas dan progres yang kelihatan. Nilai resmi tetap adil karena dihitung di server sekolah.', o: 'Contoh testimoni orang tua' }
];

// ---- landing ----
function landing() {
  document.body.classList.remove('exam');
  M.innerHTML = `<header class="top"><b style="font:800 1.2rem 'Baloo 2'">🍕 Petualangan Pecahan</b><span>${S.tok ? `<button class="btn" id="goMap" style="min-height:44px">Lanjutkan</button>` : `<button class="btn sec" id="goLogin" style="min-height:44px">Masuk</button>`}</span></header>
  <main class="wrap">
  <section class="hero"><div><h1>Petualangan Pecahan: jelajahi tiga dunia, kuasai pecahan.</h1>
  <p>Untuk siswa Kelas VII SMP Maitreyawira Bintan Center. Mulai dari pantai, seberangi pulau senja, lalu berlayar ke samudra biru.</p>
  <div class="row"><button class="btn" id="mulai">🚀 Mulai petualangan</button><a class="btn sec" href="#info">Lihat tiga dunia</a></div></div>
  ${slider([art('🍕', '#FFD2A8', '#E4DAFB'), art('⛵', '#D5F0FB', '#EDE7FA'), art('⭐', '#FFF3C4', '#FFD2A8')], 'Ilustrasi petualangan pecahan')}</section>
  <section id="info"><h2>Tiga dunia, tiga tantangan</h2><div class="grid">${DUNIA.map(d => `<article class="card glow ${d.c}">${slider(d.i, d.n)}<h3 style="margin-top:12px">${d.n}</h3><p>${d.t}</p><button class="btn" data-m>Mulai di sini</button></article>`).join('')}</div></section>
  <section><h2>Kata mereka</h2><p>Ketuk kartu untuk membaca selengkapnya.</p><div class="grid" id="tm">${TESTI.map((t, i) => `<div class="fl" data-i="${i}" tabindex="0" role="button" aria-label="Buka testimoni ${esc(t.j)}"><div><div class="f"><span class="em">${t.e}</span><h3>${t.j}</h3></div><div class="b"><p>“${t.s}”</p><span class="tag">${t.o}</span></div></div></div>`).join('')}</div></section>
  </main>
  <footer class="wrap" style="padding:24px 16px;color:var(--mut)">© SMP Maitreyawira Bintan Center • Kurikulum Merdeka Fase D</footer>`;
  document.getElementById('mulai').onclick = () => S.tok ? peta() : loginView();
  M.querySelectorAll('[data-m]').forEach(b => b.onclick = () => S.tok ? peta() : loginView());
  const gl = document.getElementById('goLogin'), gm = document.getElementById('goMap'); if (gl) gl.onclick = loginView; if (gm) gm.onclick = peta;
  M.querySelectorAll('.fl').forEach(c => { const o = () => modal(`<h3>${TESTI[c.dataset.i].e} ${TESTI[c.dataset.i].j}</h3><p>${TESTI[c.dataset.i].f}</p><span class="tag">${TESTI[c.dataset.i].o}</span><p><button class="btn" id="x">Tutup</button></p>`); c.onclick = o; c.onkeydown = e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), o()); });
}
let flipI = 0; setInterval(() => { const c = document.querySelectorAll('#tm .fl'); if (!c.length || document.hidden) return; c.forEach(x => x.classList.remove('flip')); c[flipI++ % c.length].classList.add('flip'); }, 4000);
function modal(h) { const m = document.getElementById('modal'); m.innerHTML = `<div class="card" role="dialog" aria-modal="true">${h}</div>`; m.hidden = false; const x = m.querySelector('#x'); if (x) x.onclick = () => m.hidden = true; m.onclick = e => { if (e.target === m && !m.dataset.lock) m.hidden = true; }; }

// ---- login & peta ----
function loginView() {
  M.innerHTML = `<main class="wrap" style="max-width:460px;padding-top:40px"><div class="card"><h2>🍕 Hai, penjelajah!</h2><p>Tulis namamu untuk masuk (huruf besar atau kecil tidak masalah).</p><form id="f"><label for="n">Nama lengkap</label><input id="n" required autocomplete="name"><p id="er" style="color:#B84A39;min-height:1.5em"></p><button class="btn" type="submit">Masuk</button> <button class="btn sec" type="button" id="b">Kembali</button></form></div></main>`;
  document.getElementById('b').onclick = landing;
  document.getElementById('f').onsubmit = async e => {
    e.preventDefault(); const b = e.submitter; b.disabled = true; const r = await api('auth.login', { nama: n.value }); b.disabled = false;
    if (!r.success) return er.textContent = r.message;
    S.tok = r.data.token; S.nama = r.data.nama; localStorage.pp_tok = S.tok; localStorage.pp_nama = S.nama; peta();
  };
}
const TAHAP = { A1: ['🍕', 'Asesmen 1: Pesta Pizza', 'Dunia 1 • Mudah, bernarasi'], R1: ['📝', 'Refleksi 1', 'Dunia 1'], A2: ['🗝️', 'Asesmen 2: Peti Harta', 'Dunia 2 • Menengah'], R2: ['📝', 'Refleksi 2', 'Dunia 2'], A3: ['⛵', 'Asesmen 3: Mode Ujian TKA', 'Dunia 3 • Individu, 3 peringatan'], R3: ['🏅', 'Refleksi 3 & Lencana', 'Dunia 3'] };
async function peta() {
  document.body.classList.remove('exam'); M.innerHTML = `<p class="wrap" style="padding:40px">Memuat petamu…</p>`;
  const r = await api('progres.get'); if (!r.success) return r.net ? (M.innerHTML = `<p class="wrap" style="padding:40px">${r.message} <button class="btn" onclick="peta()">Coba lagi</button></p>`) : (S.tok ? toast(r.message) : loginView());
  const st = r.data.status, tuntas = st.filter(x => x.status === 'selesai').length;
  M.innerHTML = `<header class="top"><b>Hai, ${esc(S.nama)}! 👋</b><span class="chip">⭐ ${tuntas * 15}</span><span><button class="btn sec" id="k" style="min-height:40px">Keluar</button></span></header>
  <main class="wrap"><section><h2>Peta Petualangan</h2><p>Progres: ${tuntas} dari 6 tahap selesai</p><progress max="6" value="${tuntas}" style="width:100%;height:14px"></progress>
  ${st.map(x => { const t = TAHAP[x.kode]; return `<div class="node ${x.status === 'terbuka' ? 't' : x.status === 'terkunci' ? 'k' : ''}"><span style="font-size:2rem">${t[0]}</span><div><h3 style="margin:0">${t[1]}</h3><small>${t[2]}</small></div><span class="st">${x.status === 'selesai' ? '✓ Selesai' : x.status === 'terbuka' ? '▶ MULAI' : '🔒 Terkunci'}</span>${x.status === 'terbuka' ? `<button class="btn" data-k="${x.kode}">Buka</button>` : ''}</div>`; }).join('')}</section></main>`;
  document.getElementById('k').onclick = keluar;
  M.querySelectorAll('[data-k]').forEach(b => b.onclick = () => b.dataset.k[0] === 'A' ? petunjuk(b.dataset.k[1]) : refleksi(b.dataset.k[1]));
}
function petunjuk(n) {
  if (n !== '3') return kuis(n);
  modal(`<h3>Aturan Asesmen 3</h3><p>Ujian individu bergaya TKA. Pindah tab, meminimalkan jendela, atau menyalin soal akan memicu alarm. <b>Peringatan ke-3 mengakhiri ujian otomatis.</b> Timer berjalan dari server.</p><p><button class="btn" id="go">Saya mengerti, mulai</button> <button class="btn sec" id="x">Batal</button></p>`);
  document.getElementById('go').onclick = () => { bunyi(0); document.getElementById('modal').hidden = true; kuis('3'); };
}

// ---- kuis (Asesmen 1, 2 dan 3) ----
let Q = null, ac = null;
function bunyi(on) { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (!on) return; const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = 880; o.connect(g); g.connect(ac.destination); g.gain.setValueAtTime(.2, ac.currentTime); o.start(); o.stop(ac.currentTime + .5); navigator.vibrate && navigator.vibrate(300); } catch (e) {} }
async function kuis(n) {
  const r = await api('asesmen.get', { asesmen: n }); if (!r.success) return toast(r.message);
  Q = { n, soal: r.data.soal, i: 0, j: {}, cek: {}, idKirim: 'K' + Date.now() + Math.random().toString(36).slice(2, 7), sesi: r.data.sesi, stop: false };
  if (!Q.soal.length) return toast('Bank soal masih kosong. Hubungi gurumu.');
  if (n === '3') { document.body.classList.add('exam'); Q.sisa = Q.sesi.sisaDetik; Q.tm = setInterval(() => { Q.sisa--; const t = document.getElementById('tm3'); if (t) { t.textContent = fmt(Q.sisa); t.classList.toggle('low', Q.sisa < 300); } if (Q.sisa <= 0) kirim(); }, 1000); pasangJaga(); }
  soal();
}
const fmt = s => Math.max(0, Math.floor(s / 60)) + ':' + String(Math.max(0, s % 60)).padStart(2, '0');
function soal() {
  const s = Q.soal[Q.i], a3 = Q.n === '3', multi = s.jenis === 'PGK', jw = Q.j[s.id] || [], dc = Q.cek[s.id], last = Q.i === Q.soal.length - 1;
  const kunci = !a3 && dc ? s.kunci.split(',') : [];
  M.innerHTML = `<header class="top"><b>Soal ${Q.i + 1} / ${Q.soal.length}</b>${a3 ? `<span class="timer" id="tm3">${fmt(Q.sisa)}</span>` : ''}<button class="btn sec" id="kb" style="min-height:40px">Peta</button></header>
  <main class="wrap" style="max-width:760px"><section class="card ${a3 ? 'exam' : ''}" ${a3 ? 'oncopy="return false"' : ''}><span class="tag">${esc(s.tp || '')} • ${multi ? 'Pilih semua yang benar' : 'Pilih satu jawaban'}</span><h3 style="color:var(--ink);margin-top:10px">${esc(s.teks)}</h3>
  ${s.pilihan.map((p, k) => { const L = 'ABCDEFGH'[k], on = jw.includes(L); let c = on ? 'sel' : ''; if (dc) c = kunci.includes(L) ? 'ok' : on ? 'no' : ''; return `<button class="opt ${c}" data-l="${L}" ${dc ? 'disabled' : ''}><b>${L}</b><span>${esc(p)}</span></button>`; }).join('')}
  ${dc ? `<p class="card" style="background:#E3F7E8">${Q.cek[s.id] === 'ok' ? '🎉 Hebat sekali! ' : '💪 Ayo coba lagi nanti. '}${esc(s.penjelasan)}</p>` : ''}
  ${a3 ? `<div class="grid5" style="margin:14px 0">${Q.soal.map((x, k) => `<button data-g="${k}" class="${Q.j[x.id] ? 'done' : ''} ${k === Q.i ? 'cur' : ''}">${k + 1}</button>`).join('')}</div>` : ''}
  <div class="row" style="margin-top:14px">${Q.i ? '<button class="btn sec" id="pv">← Sebelumnya</button>' : ''}${!a3 && !dc ? '<button class="btn sun" id="pk">Periksa</button>' : ''}${last ? '<button class="btn" id="kr">Selesai & Kirim</button>' : '<button class="btn" id="nx">Berikutnya →</button>'}</div></section></main>`;
  M.querySelectorAll('.opt').forEach(b => b.onclick = () => { const L = b.dataset.l; let a = (Q.j[s.id] || []).slice(); a = multi ? (a.includes(L) ? a.filter(x => x !== L) : a.concat(L)) : [L]; Q.j[s.id] = a; soal(); });
  M.querySelectorAll('[data-g]').forEach(b => b.onclick = () => { Q.i = +b.dataset.g; soal(); });
  const g = id => document.getElementById(id);
  if (g('pv')) g('pv').onclick = () => { Q.i--; soal(); }; if (g('nx')) g('nx').onclick = () => { Q.i++; soal(); };
  if (g('pk')) g('pk').onclick = () => { if (!jw.length) return toast('Pilih jawaban dulu.'); Q.cek[s.id] = [...jw].sort().join(',') === s.kunci.split(',').sort().join(',') ? 'ok' : 'no'; soal(); };
  if (g('kr')) g('kr').onclick = () => { const k = Q.soal.length - Object.keys(Q.j).length; if (k) return toast(k + ' soal belum dijawab.'); kirim(); };
  g('kb').onclick = () => { if (Q.n === '3') return toast('Selesaikan ujian dulu.'); if (confirm('Keluar dari asesmen? Jawabanmu belum terkirim.')) { Q = null; peta(); } };
}
function pasangJaga() {
  const lapor = async j => { if (!Q || Q.n !== '3' || Q.stop) return; bunyi(1); const r = await api('a3.pelanggaran', { jenis: j }); if (!r.success) return; if (r.data.status === 'dihentikan') { Q.stop = true; modal(`<div class="band">Ujian dihentikan otomatis</div><p>Kamu sudah menerima 3 peringatan. Jawaban yang tersimpan akan dinilai.</p><p><button class="btn" id="x">Lihat skor</button></p>`); document.getElementById('modal').dataset.lock = 1; document.getElementById('x').onclick = () => { document.getElementById('modal').hidden = true; delete document.getElementById('modal').dataset.lock; kirim(); }; }
    else modal(`<div class="band">⚠️ Peringatan ke-${r.data.pelanggaran} dari 3</div><p>Kamu terdeteksi ${esc(j)}. Peringatan ke-3 akan mengakhiri ujian otomatis.</p><p><button class="btn" id="x">Saya mengerti, kembali ke ujian</button></p>`); };
  document.addEventListener('visibilitychange', () => document.hidden && lapor('pindah tab'));
  ['copy', 'cut', 'contextmenu'].forEach(ev => document.addEventListener(ev, e => { if (Q && Q.n === '3') { e.preventDefault(); lapor('mencoba menyalin soal'); } }));
}
async function kirim() {
  if (!Q) return; clearInterval(Q.tm); const q = Q; document.body.classList.remove('exam');
  M.innerHTML = `<p class="wrap" style="padding:40px">Mengirim jawabanmu…</p>`;
  const r = await api('asesmen.kirim', { asesmen: q.n, jawaban: q.j, idKirim: q.idKirim });
  if (!r.success) { if (r.net) { localStorage.pp_tunda = JSON.stringify({ asesmen: q.n, jawaban: q.j, idKirim: q.idKirim }); M.innerHTML = `<p class="wrap" style="padding:40px">${r.message} Jawabanmu aman di perangkat. <button class="btn" id="u">Kirim ulang</button></p>`; document.getElementById('u').onclick = () => { Q = q; kirim(); }; return; } toast(r.message); return peta(); }
  localStorage.removeItem('pp_tunda'); Q = null; hasil(r.data, q.n);
}
function hasil(h, n) {
  M.innerHTML = `<main class="wrap" style="max-width:760px"><section><div class="card" style="text-align:center"><h2>Jawabanmu terkirim! 🎉</h2><div class="sc" style="--p:${h.skor}%"><span>${h.skor}</span></div><p>${h.benar} benar dari ${h.total} soal${h.resmi === false ? ' • latihan (nilai resmi tidak berubah)' : ' • nilai resmi tercatat'}</p><p class="tag">Kode bukti: ${esc(h.kode)}</p></div>
  <h3 style="margin-top:20px">Pembahasan</h3>${(h.pembahasan || []).sort((a, b) => a.benar - b.benar).map(p => `<div class="card" style="margin:10px 0;border-left:6px solid ${p.benar ? 'var(--grn)' : 'var(--cor)'}"><b>${p.benar ? '✓ Benar' : '✗ Perlu diperbaiki'}</b> • Kunci: ${esc(p.kunci)} • ${esc(p.tp || '')}<p>${esc(p.penjelasan)}</p></div>`).join('')}
  <p><button class="btn" id="rf">Lanjut ke refleksi</button></p></section></main>`;
  document.getElementById('rf').onclick = () => refleksi(n);
}

// ---- refleksi ----
function refleksi(n) {
  let fe = '';
  M.innerHTML = `<main class="wrap" style="max-width:720px;background:var(--cream)"><section><h2>Refleksi ${n}</h2><div class="card"><label>Bagaimana perasaanmu?</label><div class="emo">${['🤩', '😊', '😌', '🤔', '💪'].map(e => `<button type="button" data-e="${e}" aria-label="Perasaan ${e}">${e}</button>`).join('')}</div>
  <label for="r1">Apa yang sudah kamu pahami? <small id="c1">0/30</small></label><textarea id="r1"></textarea><label for="r2">Apa rencana belajarmu berikutnya? <small id="c2">0/30</small></label><textarea id="r2"></textarea>
  <p><button class="btn" id="sv">Simpan & lanjutkan petualangan</button></p></div></section></main>`;
  M.querySelectorAll('[data-e]').forEach(b => b.onclick = () => { fe = b.dataset.e; M.querySelectorAll('[data-e]').forEach(x => x.classList.toggle('sel', x === b)); });
  const h = (a, c) => document.getElementById(a).oninput = e => document.getElementById(c).textContent = e.target.value.trim().length + '/30'; h('r1', 'c1'); h('r2', 'c2');
  document.getElementById('sv').onclick = async e => {
    if (!fe) return toast('Pilih perasaanmu dulu.'); e.target.disabled = true;
    const r = await api('refleksi.simpan', { asesmen: n, perasaan: fe, isi: r1.value, rencana: r2.value }); e.target.disabled = false;
    if (!r.success) return toast(r.message); toast(r.message); n === '3' ? lencana() : peta();
  };
}
function lencana() { modal(`<h2>🏅 Lencana Nakhoda Samudra Biru</h2><p>Selamat, ${esc(S.nama)}! Petualangan pecahanmu tuntas.</p><p><button class="btn" id="x">Kembali ke peta</button></p>`); document.getElementById('x').addEventListener('click', peta); }

// ---- WhatsApp mengambang ----
document.getElementById('wa').href = 'https://wa.me/' + CFG.WA_NOMOR + '?text=' + encodeURIComponent('Halo, saya ingin bertanya tentang Petualangan Pecahan.');

// ---- kursor "+" dengan partikel hidup ----
(function () {
  if (!matchMedia('(pointer:fine)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  document.documentElement.classList.add('cur');
  const cv = document.createElement('canvas'), x = cv.getContext('2d'), pl = document.createElement('div'), P = [], C = ['#5B2A9A', '#3E8E2F', '#FFC93C', '#4DB6E8', '#F2705C'];
  cv.id = 'pc'; pl.id = 'plus'; document.body.append(cv, pl);
  const rs = () => { cv.width = innerWidth; cv.height = innerHeight; }; rs(); addEventListener('resize', rs);
  let mx = -50, my = -50;
  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY; pl.style.transform = `translate(${mx}px,${my}px)`;
    pl.classList.toggle('h', !!e.target.closest('a,button,[role=button],input,textarea,.opt'));
    for (let i = 0; i < 2; i++) P.push({ x: mx, y: my, vx: (Math.random() - .5) * 2.2, vy: (Math.random() - .5) * 2.2 - .4, l: 1, r: 1.5 + Math.random() * 2.5, c: C[Math.random() * 5 | 0] });
    if (P.length > 160) P.splice(0, P.length - 160);
  });
  (function loop() {
    x.clearRect(0, 0, cv.width, cv.height);
    for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; p.x += p.vx; p.y += p.vy; p.l -= .025; if (p.l <= 0) { P.splice(i, 1); continue; } x.globalAlpha = p.l; x.fillStyle = p.c; x.beginPath(); x.arc(p.x, p.y, p.r * p.l, 0, 6.3); x.fill(); }
    requestAnimationFrame(loop);
  })();
})();

// kirim ulang jawaban yang tertunda saat koneksi pulih
addEventListener('online', async () => { const t = localStorage.pp_tunda; if (!t || !S.tok) return; const r = await api('asesmen.kirim', JSON.parse(t)); if (r.success) { localStorage.removeItem('pp_tunda'); toast('Jawaban tertunda berhasil terkirim.'); } });
