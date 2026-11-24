// Mesin kuis lengkap: Asesmen 1-2 (umpan balik instan) dan Asesmen 3 (mode ujian, sesi & timer di server)
const LJ = 'ABCDEFGH';
function pizi(m, w) {
  const mo = { wave: 'M44 70q8 8 16 0', cheer: 'M42 66q10 14 20 0z', encourage: 'M46 72q6-4 12 0', alarm: 'M48 70q4-7 8 0q-4 7-8 0', sleepy: 'M46 72h12' }[m] || 'M44 70q8 8 16 0';
  const ey = m === 'sleepy' ? '<path d="M39 54h9M56 54h9" stroke="#2B1B4D" stroke-width="3" stroke-linecap="round"/>' : '<circle cx="44" cy="54" r="4.5" fill="#2B1B4D"/><circle cx="60" cy="54" r="4.5" fill="#2B1B4D"/>';
  const br = m === 'alarm' ? '<path d="M38 46l10 4M66 46l-10 4" stroke="#2B1B4D" stroke-width="3" stroke-linecap="round"/>' : m === 'encourage' ? '<path d="M39 47q5-3 9 0M56 47q5-3 9 0" stroke="#2B1B4D" stroke-width="2.5" fill="none" stroke-linecap="round"/>' : '';
  return `<svg class="pz" viewBox="0 0 104 124" width="${w || 110}" role="img" aria-label="Pizi, maskot pizza"><path d="M52 118L12 34q40-20 80 0z" fill="#FFC93C"/><path d="M12 34q40-20 80 0l-3 8q-37-15-74 0z" fill="#E8A33D"/><circle cx="34" cy="48" r="5" fill="#F2705C"/><circle cx="72" cy="48" r="5" fill="#F2705C"/><circle cx="52" cy="92" r="5" fill="#F2705C"/><circle cx="36" cy="66" r="4" fill="#FFA08F" opacity=".7"/><circle cx="68" cy="66" r="4" fill="#FFA08F" opacity=".7"/>${ey}${br}<path d="${mo}" fill="${m === 'cheer' ? '#7A1218' : 'none'}" stroke="#2B1B4D" stroke-width="3" stroke-linecap="round"/><path d="M28 32q24-30 48 0z" fill="#5B2A9A"/><rect x="24" y="30" width="56" height="7" rx="3.5" fill="#3A1A6B"/></svg>`;
}
const adaJ = (s, j) => j !== undefined && j !== null && (s.jenis === 'ISI' ? String(j).trim() !== '' : s.jenis === 'KAT' ? Array.isArray(j) && j.length === s.pilihan.length && j.every(Boolean) : Array.isArray(j) ? j.length > 0 : !!j);
const cocokK = (s, j) => { if (!adaJ(s, j)) return false; const k = String(s.kunci); if (s.jenis === 'ISI') { const x = String(j).toLowerCase().replace(/\s/g, ''); return k.split('|').some(y => y.toLowerCase().replace(/\s/g, '') === x); } if (s.jenis === 'KAT') return [].concat(j).join(',') === k.split(',').map(z => z.trim()).join(','); return [].concat(j).sort().join(',') === k.split(',').map(z => z.trim()).sort().join(','); };
const pelDots = n => [0, 1, 2].map(i => `<i class="${i < n ? 'on' : ''}"></i>`).join('');
const kunciModal = on => { const m = document.getElementById('modal'); if (on) m.dataset.lock = '1'; else delete m.dataset.lock; };
const tutupModal = () => { kunciModal(0); document.getElementById('modal').hidden = true; };
const mmss = s => String(Math.floor(Math.max(0, s) / 60)).padStart(2, '0') + ':' + String(Math.max(0, s) % 60).padStart(2, '0');
const draftKey = n => 'pp_d_' + S.nama + '_' + n;

function petunjuk(n) {
  if (n !== '3') return kuis(n);
  M.innerHTML = `<main class="wrap" style="max-width:760px;padding-top:24px"><div class="card"><div style="text-align:center">${pizi('wave', 100)}</div><h2>Aturan Asesmen 3: Mode Ujian TKA</h2>
  <p>Ujian individu, ber-timer dari server. Baca dulu ya:</p><ul style="line-height:1.9">
  <li>🕒 Waktu berjalan di server. Menutup atau memuat ulang halaman <b>tidak</b> menghentikan waktu.</li>
  <li>🛡️ Pindah tab, meminimalkan jendela, keluar layar penuh, atau menyalin soal = <b>1 peringatan</b>. Peringatan ke-3 mengakhiri ujian otomatis dan nilai terkunci.</li>
  <li>💾 Jawabanmu tersimpan otomatis ke server setiap kali kamu memilih.</li>
  <li>🚩 Ragu-ragu? Tandai soalnya dan tinjau lagi sebelum mengumpulkan.</li>
  <li>🔒 Nilai dari pengerjaan pertama menjadi <b>nilai resmi</b>. Setelah itu kamu bisa latihan ulang tanpa mengubah nilai resmi.</li>
  <li>🧰 Gunakan kertas buram untuk mencoret-coret. Jangan menekan tombol Windows atau Alt+Tab.</li></ul>
  <label style="display:flex;gap:10px;align-items:center;min-height:48px"><input type="checkbox" id="ck" style="width:28px;height:28px"> Saya sudah membaca dan siap mengerjakan dengan jujur.</label>
  <p><button class="btn" id="go" disabled>Mulai Ujian ▶</button> <button class="btn sec" id="bk">Kembali ke peta</button></p></div></main>`;
  ck.onchange = () => go.disabled = !ck.checked; bk.onclick = peta;
  go.onclick = () => { bunyi(0); try { document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); } catch (e) {} kuis('3'); };
}

async function kuis(n) {
  M.innerHTML = `<p class="wrap" style="padding:40px">Menyiapkan soal…</p>`;
  const r = await api('asesmen.get', { asesmen: n, v: 2 }); if (!r.success) { toast(r.message); return peta(); }
  const a3 = n === '3', d = r.data;
  if (!d.soal.length) { toast('Bank soal masih kosong. Hubungi gurumu.'); return peta(); }
  const idS = d.soal.map(s => s.id).join();
  Q = { n, a3, soal: d.soal, i: 0, j: Object.assign({}, d.jawaban || {}), cek: {}, ragu: {}, sv: {}, idKirim: 'K' + Date.now() + Math.random().toString(36).slice(2, 7), idSesi: d.idSesi || '', stop: false, pel: a3 ? d.sesi.pelanggaran : 0, mode: a3 ? d.sesi.mode : '' };
  if (a3) {
    if (d.sesi.status !== 'berjalan') { Q.stop = true; return kirim(); }
    Q.akhir = Date.now() + d.sesi.sisaDetik * 1000; Object.keys(Q.j).forEach(k => Q.sv[k] = JSON.stringify(Q.j[k]));
    document.body.classList.add('exam'); jaga(); Q.tm = setInterval(tick, 1000); Q.fs = !!document.fullscreenElement;
  } else {
    try { const dr = JSON.parse(localStorage[draftKey(n)] || 'null'); if (dr && dr.ids === idS) Q.j = dr.j; } catch (e) {}
    Q.tm = setInterval(() => { if (!Q || document.hidden) return; const dj = Q.soal.filter(x => adaJ(x, Q.j[x.id])).length; api('asesmen.progres', { asesmen: n, dijawab: dj, total: Q.soal.length }); }, 20000);
  }
  tampil(); if (a3 && Q.pel > 0) peringatan(Q.pel);
}
function stimHtml(st) {
  if (!st) return ''; let b;
  if (st.jenis === 'tabel') { const rw = String(st.isi).split('\n').filter(Boolean).map(r => r.split('|').map(c => c.trim())); b = `<div class="scroll"><table>${rw.map((r, i) => `<tr>${r.map(c => i ? `<td>${esc(c)}</td>` : `<th>${esc(c)}</th>`).join('')}</tr>`).join('')}</table></div>`; }
  else b = String(st.isi).split('\n').map(l => `<p>${esc(l)}</p>`).join('');
  return `<aside class="stim"><span class="tag">📖 Bacaan & data</span><h3>${esc(st.judul)}</h3>${b}</aside>`;
}
function bodySoal(s, j, cek) {
  const kn = String(s.kunci || '').split(',').map(x => x.trim());
  if (s.jenis === 'ISI') return `<input class="isi" id="isi" value="${esc(j || '')}" autocomplete="off" aria-label="Tuliskan jawabanmu" placeholder="mis. 3/8">${cek ? `<p>${cocokK(s, j) ? '✅ Tepat!' : '❌ Kunci: <b>' + esc(String(s.kunci).split('|')[0]) + '</b>'}</p>` : ''}`;
  if (s.jenis === 'KAT') return s.pilihan.map((t, k) => { const v = (j || [])[k]; const f = v => cek ? (kn[k] === v ? 'ok' : (j || [])[k] === v ? 'no' : '') : ((j || [])[k] === v ? 'sel' : ''); return `<div class="kat"><span>${esc(t)}</span><span class="bs"><button data-r="${k}" data-v="B" class="${f('B')}">Benar</button><button data-r="${k}" data-v="S" class="${f('S')}">Salah</button></span></div>`; }).join('');
  return s.pilihan.map((t, k) => { const h = s.huruf ? s.huruf[k] : LJ[k], sel = [].concat(j || []).includes(h), fb = cek ? (kn.includes(h) ? 'ok' : sel ? 'no' : '') : ''; return `<button class="opt ${sel && !cek ? 'sel' : ''} ${fb}" data-h="${h}" role="${s.jenis === 'PGK' ? 'checkbox' : 'radio'}" aria-checked="${sel}"><b>${LJ[k]}</b><span>${esc(t)}</span></button>`; }).join('');
}
function tampil() {
  const q = Q; if (!q || q.stop) return; const s = q.soal[q.i], j = q.j[s.id], a3 = q.a3, cek = !!q.cek[s.id], tot = q.soal.length;
  const dj = q.soal.filter(x => adaJ(x, q.j[x.id])).length, akhir = q.i === tot - 1;
  M.innerHTML = `<header class="top"><b>${a3 ? 'Asesmen 3 • Mode Ujian TKA' : 'Asesmen ' + q.n}</b><span class="chip">Soal ${q.i + 1}/${tot}</span>${a3 ? `<span class="timer" id="tm">⏱ ${mmss(Math.round((q.akhir - Date.now()) / 1000))}</span><span class="pel" id="pel" title="Peringatan">🛡️ ${pelDots(q.pel)}</span>` : `<button class="btn sec" id="pt" style="min-height:40px">Peta</button>`}</header>
  <main class="wrap"><div class="split ${s.stimulus ? 'has' : ''}">${stimHtml(s.stimulus)}<section class="card exam"><span class="tag">${{ PG: 'Pilih satu', PGK: 'Pilih semua yang benar', KAT: 'Benar atau Salah', ISI: 'Isian' }[s.jenis] || ''}${s.tp ? ' • ' + esc(s.tp) : ''}</span><h3 style="margin-top:8px">${esc(s.teks)}</h3>${bodySoal(s, j, cek)}
  ${cek ? `<div class="card" style="background:#E3F7E8;margin-top:10px"><b>${cocokK(s, j) ? 'Hebat sekali! 🎉' : 'Ayo coba lagi! 💪'}</b><p>${esc(s.penjelasan || '')}</p></div>` : ''}<small id="sv" style="color:#5E5278">${a3 ? 'Tersimpan otomatis ke server' : ''}</small></section></div>
  <section class="card" style="margin-top:12px"><b>Peta soal</b> <small>(${dj} terjawab dari ${tot})</small><div class="grid5">${q.soal.map((x, k) => `<button class="${adaJ(x, q.j[x.id]) ? 'done' : ''} ${q.ragu[x.id] ? 'rg' : ''} ${k === q.i ? 'cur' : ''}" data-g="${k}" aria-label="Soal ${k + 1}${q.ragu[x.id] ? ' ragu-ragu' : ''}${adaJ(x, q.j[x.id]) ? ' terjawab' : ''}">${k + 1}${q.ragu[x.id] ? '🚩' : ''}</button>`).join('')}</div></section>
  <p style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn sec" id="pv" ${q.i ? '' : 'disabled'}>← Sebelumnya</button>
  ${a3 ? `<button class="btn sun" id="rg">🚩 ${q.ragu[s.id] ? 'Batal ragu' : 'Ragu-ragu'}</button>` : `<button class="btn sun" id="ck" ${adaJ(s, j) ? '' : 'disabled'}>Periksa jawaban</button>`}
  ${akhir ? `<button class="btn" id="fin">${a3 ? 'Selesai & Ringkasan' : 'Selesai & Kirim'} ✓</button>` : `<button class="btn" id="nx">Berikutnya →</button>`}</p>${!a3 && q.n === '2' ? '<div id="tim"></div>' : ''}</main>`;
  M.querySelectorAll('[data-h]').forEach(b => b.onclick = () => { if (q.cek[s.id]) return; const h = b.dataset.h; let a = [].concat(q.j[s.id] || []); q.j[s.id] = s.jenis === 'PGK' ? (a.includes(h) ? a.filter(x => x !== h) : a.concat(h)) : [h]; jawab(s); tampil(); });
  M.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { if (q.cek[s.id]) return; const a = (q.j[s.id] || []).slice(); a.length = s.pilihan.length; a[+b.dataset.r] = b.dataset.v; q.j[s.id] = Array.from(a, x => x || ''); jawab(s); tampil(); });
  const isi = document.getElementById('isi'); if (isi) { isi.oninput = () => { q.j[s.id] = isi.value; jawab(s, true); const c = document.getElementById('ck'); if (c) c.disabled = !adaJ(s, q.j[s.id]); }; isi.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); const c = document.getElementById('ck'); if (c && !c.disabled) c.click(); } }; if (!cek) isi.focus(); }
  M.querySelectorAll('[data-g]').forEach(b => b.onclick = () => { q.i = +b.dataset.g; tampil(); });
  document.getElementById('pv').onclick = () => { q.i--; tampil(); };
  const nx = document.getElementById('nx'); if (nx) nx.onclick = () => { q.i++; tampil(); };
  const rg = document.getElementById('rg'); if (rg) rg.onclick = () => { q.ragu[s.id] = !q.ragu[s.id]; tampil(); };
  const ck = document.getElementById('ck'); if (ck) ck.onclick = () => { q.cek[s.id] = true; bunyi(0); tampil(); };
  const pt = document.getElementById('pt'); if (pt) pt.onclick = () => { clearInterval(q.tm); Q = null; peta(); };
  const fn = document.getElementById('fin'); if (fn) fn.onclick = () => a3 ? ringkasan() : (q.soal.every(x => adaJ(x, q.j[x.id])) ? kirim() : toast('Masih ada soal yang belum dijawab.'));
  if (q.n === '2') timStatus();
}
function jawab(s, tanpaRender) {
  if (!Q) return; if (Q.a3) simpan(s.id); else { try { localStorage[draftKey(Q.n)] = JSON.stringify({ ids: Q.soal.map(x => x.id).join(), j: Q.j }); } catch (e) {} }
}
function simpan(id) {
  const q = Q; clearTimeout((q.dt = q.dt || {})[id]);
  q.dt[id] = setTimeout(async () => {
    if (Q !== q || q.stop) return; const v = JSON.stringify(q.j[id]); const r = await api('a3.simpan', { idSesi: q.idSesi, id, jawaban: q.j[id] });
    const el = document.getElementById('sv');
    if (r.success) { q.sv[id] = v; if (el) el.textContent = 'Tersimpan otomatis ke server ✓'; }
    else if (r.code === 'CLOSED') { kirim(); } else if (el) el.textContent = r.net ? '⚠️ Belum tersimpan (koneksi). Akan dicoba lagi…' : r.message;
  }, 450);
}
function tick() {
  const q = Q; if (!q || q.stop) return; const sisa = Math.round((q.akhir - Date.now()) / 1000), t = document.getElementById('tm');
  if (t) { t.textContent = '⏱ ' + mmss(sisa); t.classList.toggle('warn', sisa <= 300); }
  if (document.fullscreenElement) q.fs = true;
  if (sisa % 15 === 0) q.soal.forEach(s => { if (q.j[s.id] !== undefined && q.sv[s.id] !== JSON.stringify(q.j[s.id])) simpan(s.id); });   // kirim ulang yang tertunda
  if (sisa <= 0) kirim();
}
function ringkasan() {
  const q = Q, jw = q.soal.filter(x => adaJ(x, q.j[x.id])).length, rg = q.soal.filter(x => q.ragu[x.id]).length, kosong = q.soal.length - jw;
  kunciModal(1); modal(`<div style="text-align:center">${pizi('wave', 90)}<h2>Yakin ingin mengumpulkan sekarang?</h2></div>
  <div class="grid" style="grid-template-columns:repeat(3,1fr);text-align:center"><div class="stat m"><b>${jw}</b>terjawab</div><div class="stat s"><b>${rg}</b>ragu-ragu</div><div class="stat ${kosong ? 'c' : 'k'}"><b>${kosong}</b>belum dijawab</div></div>
  <p>⏱ Sisa waktu: <b>${mmss(Math.round((q.akhir - Date.now()) / 1000))}</b>. Nilai pengerjaan pertama dikunci sebagai nilai resmi. Soal yang belum dijawab bernilai 0.</p>
  <label style="display:flex;gap:10px;align-items:center;min-height:48px"><input type="checkbox" id="jj" style="width:28px;height:28px"> Saya, ${esc(S.nama)}, mengerjakan dengan jujur dan mandiri.</label>
  <p style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sec" id="kb">← Kembali periksa</button><button class="btn" id="ya" disabled>🚀 Ya, kumpulkan!</button></p>`);
  jj.onchange = () => ya.disabled = !jj.checked; kb.onclick = tutupModal; ya.onclick = () => { tutupModal(); kirim(); };
}

// ---- penjaga integritas (hanya Asesmen 3) ----
let jagaOn = false, lastLapor = 0;
function jaga() {
  if (jagaOn) return; jagaOn = true; const on = () => Q && Q.a3 && !Q.stop;
  document.addEventListener('visibilitychange', () => { if (document.hidden && on()) lapor('pindah tab'); });
  addEventListener('blur', () => setTimeout(() => { if (on() && !document.hasFocus() && !document.hidden) lapor('jendela tidak aktif'); }, 500));
  document.addEventListener('fullscreenchange', () => { if (on() && Q.fs && !document.fullscreenElement) { Q.fs = false; lapor('keluar layar penuh'); } });
  document.addEventListener('contextmenu', e => { if (on()) { e.preventDefault(); lapor('klik kanan'); } });
  ['copy', 'cut', 'paste'].forEach(t => document.addEventListener(t, e => { if (on()) { e.preventDefault(); lapor('mencoba menyalin soal'); } }));
  document.addEventListener('keydown', e => { if (on() && (e.ctrlKey || e.metaKey) && 'cxvuspa'.includes(e.key.toLowerCase())) { e.preventDefault(); if ('cx'.includes(e.key.toLowerCase())) lapor('mencoba menyalin soal'); } });
  addEventListener('beforeunload', e => { if (on()) { e.preventDefault(); e.returnValue = ''; } });
}
async function lapor(jenis) {
  const q = Q; if (!q || !q.a3 || q.stop || Date.now() - lastLapor < 4000) return; lastLapor = Date.now();
  const r = await api('a3.pelanggaran', { idSesi: q.idSesi, jenis }); if (!r.success || Q !== q) return;
  q.pel = r.data.pelanggaran; if (r.data.status === 'dihentikan') { q.stop = true; clearInterval(q.tm); return kirim(); }
  const p = document.getElementById('pel'); if (p) p.innerHTML = '🛡️ ' + pelDots(q.pel); peringatan(q.pel);
}
function peringatan(n) {
  bunyi(1); kunciModal(1);
  modal(`<div style="text-align:center"><div class="band" style="background:#F2705C;color:#fff;border-radius:16px;padding:8px;font-weight:800">🔔 PERINGATAN INTEGRITAS UJIAN TKA</div>${pizi('alarm', 110)}<h2>Peringatan ke-${n} dari 3!</h2>
  <p style="background:#FFE1DB;border-radius:14px;padding:10px">Kamu terdeteksi berpindah tab, keluar dari halaman ujian, atau mencoba menyalin soal.</p><div class="pel" style="justify-content:center;font-size:1.2rem">${pelDots(n)} &nbsp; Sisa toleransi: ${3 - n}</div>
  <p><b>Peringatan ke-3 otomatis menyelesaikan ujian</b> dan mengunci skormu. Timer tetap berjalan dari server, dan log pelanggaran dikirim ke dashboard guru.</p><button class="btn" id="oke">Saya mengerti, kembali ke ujian</button><p><small>💾 Jawaban yang sudah kamu pilih tersimpan aman di server.</small></p></div>`);
  oke.onclick = () => { tutupModal(); try { !document.fullscreenElement && document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); } catch (e) {} };
}

// ---- kirim & hasil ----
async function kirim() {
  const q = Q; if (!q) return; clearInterval(q.tm); q.stop = true; tutupModal(); try { document.fullscreenElement && document.exitFullscreen(); } catch (e) {} document.body.classList.remove('exam');
  M.innerHTML = `<p class="wrap" style="padding:40px">Mengirim jawabanmu…</p>`;
  const r = await api('asesmen.kirim', { asesmen: q.n, jawaban: q.j, idKirim: q.idKirim, idSesi: q.idSesi });
  if (!r.success) {
    if (r.net) { localStorage.pp_tunda = JSON.stringify({ asesmen: q.n, jawaban: q.j, idKirim: q.idKirim, idSesi: q.idSesi }); M.innerHTML = `<main class="wrap" style="padding:40px">${pizi('encourage', 90)}<p>${r.message} Jawabanmu aman di perangkat dan tersimpan di server.</p><button class="btn" id="u">Kirim ulang</button></main>`; document.getElementById('u').onclick = () => { Q = q; kirim(); }; return; }
    toast(r.message); Q = null; return peta();
  }
  localStorage.removeItem('pp_tunda'); localStorage.removeItem(draftKey(q.n)); Q = null; q.n === '3' ? hasilA3(r.data) : hasil(r.data, q.n);
}
function fmtJ(p, v, kunci) {
  const a = [].concat(v === undefined || v === null || v === '' ? [] : v);
  if (p.jenis === 'ISI') return kunci ? esc(String(p.kunci).split('|')[0]) : (a.length ? esc(a[0]) : '<i>tidak dijawab</i>');
  if (p.jenis === 'KAT') { const src = kunci ? String(p.kunci).split(',').map(x => x.trim()) : a; return (p.pilihan || []).map((t, k) => `${esc(t)}: <b>${src[k] === 'B' ? 'Benar' : src[k] === 'S' ? 'Salah' : '—'}</b>`).join('<br>'); }
  const hs = kunci ? String(p.kunci).split(',').map(x => x.trim()) : a; return hs.length ? hs.map(h => `${LJ.indexOf(h) + 1 ? LJ[LJ.indexOf(h)] : h}. ${esc((p.pilihan || [])[LJ.indexOf(h)] || '')}`).join('<br>') : '<i>tidak dijawab</i>';
}
const kartuBahas = p => `<div class="card" style="margin:10px 0;border-left:6px solid ${p.benar ? '#3E8E2F' : '#F2705C'}"><b>${p.benar ? '✓ Benar' : '✗ Perlu diperbaiki'}</b> <small>${esc(p.tp || '')}</small><p>${esc(p.teks)}</p>${p.benar ? '' : `<div class="mis"><small>Jawabanmu</small><br>${fmtJ(p, p.jawaban, 0)}</div>`}<div class="mis" style="background:#E3F7E8"><small>Kunci jawaban</small><br>${fmtJ(p, 0, 1)}</div>${p.penjelasan ? `<p>💡 ${esc(p.penjelasan)}</p>` : ''}</div>`;
function hasil(h, n) {
  M.innerHTML = `<main class="wrap" style="max-width:760px"><section><div class="card" style="text-align:center">${pizi(h.skor >= 70 ? 'cheer' : 'encourage', 100)}<h2>Jawabanmu terkirim! 🎉</h2><div class="ring" style="--p:${h.skor}%"><span>${h.skor}</span></div><p>${h.benar} benar dari ${h.total} soal${h.resmi === false ? ' • latihan (nilai resmi tidak berubah)' : ' • nilai resmi tercatat'}</p></div>
  <h3 style="margin-top:20px">Pembahasan</h3>${(h.pembahasan || []).sort((a, b) => a.benar - b.benar).map(kartuBahas).join('')}<p><button class="btn" id="rf">Lanjut ke refleksi</button> <button class="btn sec" id="pk">Kembali ke peta</button></p></section></main>`;
  document.getElementById('rf').onclick = () => refleksi(n); document.getElementById('pk').onclick = peta;
}
async function hasilA3(h) {
  if (!h) { const r = await api('a3.hasil', {}); if (!r.success) { toast(r.message); return peta(); } h = r.data; }
  if (h.status === 'dihentikan' && !h.lihat) return layarDihentikan(h);
  const tp = {}; h.pembahasan.forEach(p => { const t = tp[p.tp || '—'] = tp[p.tp || '—'] || { b: 0, t: 0 }; t.t++; if (p.benar) t.b++; });
  const predikat = h.skor >= 85 ? 'Sangat Memuaskan' : h.skor >= 70 ? 'Memuaskan' : h.skor >= 55 ? 'Cukup' : 'Perlu Penguatan';
  M.innerHTML = `<main class="wrap" style="max-width:860px"><section><div class="card" style="text-align:center">${pizi(h.skor >= 70 ? 'cheer' : 'encourage', 110)}<span class="tag">${h.mode === 'resmi' ? '🔒 Nilai resmi terkunci' : 'Latihan ulang • nilai resmi tidak berubah'}</span><h2>Skor ${h.status === 'dihentikan' ? 'sementara ' : ''}Asesmen 3</h2><div class="ring" style="--p:${h.skor}%"><span>${h.skor}</span></div><b>${predikat}</b><p>${h.benar} benar dari ${h.total} soal • ${h.pelanggaran} peringatan</p><p class="tag">Kode bukti: ${esc(h.kode || '')}</p></div>
  <h3 style="margin-top:20px">1. Ketercapaian per TP</h3><div class="card">${Object.keys(tp).sort().map(k => { const p = Math.round(100 * tp[k].b / tp[k].t); return `<p style="margin:8px 0"><b>${esc(k)}</b> — ${p}% ${p >= 85 ? '(Mahir)' : p >= 70 ? '(Cakap)' : '(Perlu penguatan)'}<span class="bar"><i class="${p >= 85 ? 'sv' : p >= 70 ? 'sk' : 'sr'}" style="width:${p}%"></i></span></p>`; }).join('')}</div>
  <h3 style="margin-top:20px">2. Pembahasan (yang perlu diperbaiki di atas)</h3>${h.pembahasan.map(kartuBahas).join('')}
  <h3 style="margin-top:20px">3. Tindak lanjut mandiri</h3><div class="card">${h.topikUlang.length ? `<p>Topik yang perlu kamu ulang:</p><ul>${h.topikUlang.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : '<p>🎉 Semua soal benar. Pertahankan!</p>'}<button class="btn sun" id="lt">🔁 Latihan ulang (nilai resmi tidak berubah)</button></div>
  <p><button class="btn" id="rf">Lanjut ke refleksi</button> <button class="btn sec" id="pk">Kembali ke peta</button></p></section></main>`;
  document.getElementById('rf').onclick = () => refleksi('3'); document.getElementById('pk').onclick = peta; document.getElementById('lt').onclick = () => petunjuk('3');
}
function layarDihentikan(h) {
  M.innerHTML = `<main class="wrap" style="max-width:640px;padding-top:30px"><div class="card"><div class="band" style="background:#B91C1C;color:#fff;border-radius:16px;padding:10px;font-weight:800">🔒 UJIAN TELAH DIHENTIKAN OTOMATIS</div><div style="text-align:center">${pizi('sleepy', 100)}</div><h2>Batas pelanggaran tercapai</h2>
  <p>Kamu menerima <b>3 peringatan</b> integritas, jadi sistem mengunci sesi ujianmu demi keadilan semua peserta.</p><div class="pel" style="font-size:1.2rem">${pelDots(3)} 3 dari 3 pelanggaran</div>
  <p>Jawaban tersimpan: <b>${Object.keys(h.pembahasan).length}</b> butir • Skor sementara: <b>${h.skor}</b></p><p class="mis" style="background:#F1EBFF">Jika penghentian ini karena kendala teknis perangkat atau panggilan darurat resmi, guru proktor dapat meninjau log dan membuka kembali ujianmu lewat dashboard guru.</p>
  <p><button class="btn" id="ls">Lihat skor & pembahasan sementara</button> <button class="btn sec" id="pk">Kembali ke peta</button></p></div></main>`;
  document.getElementById('ls').onclick = () => { h.lihat = true; hasilA3(h); }; document.getElementById('pk').onclick = peta;
}
// ---- status kelompok (Asesmen 2) ----
async function timStatus() {
  const el = document.getElementById('tim'); if (!el || Q === null) return; const r = await api('kelompok.saya'); if (!r.success || !r.data.kelompok || !document.getElementById('tim')) return;
  document.getElementById('tim').innerHTML = `<div class="card"><b>👥 Kelompok ${esc(r.data.kelompok)}</b>${r.data.anggota.map(a => `<p style="margin:6px 0">${esc(a.nama)} • ${a.tahapSelesai}/6 tahap ${a.aktif ? '• sedang mengerjakan ' + esc(a.aktif) : ''}</p>`).join('')}</div>`;
}
