// Panel guru: ringkasan, pemantauan + buka kembali, bank soal, hasil, jurnal, kelas, pengaturan
let gTab = 'ringkasan', gTimer = null, stimCache = [];
const GMENU = [['ringkasan', '📊 Ringkasan & Analitik'], ['bank', '❓ Bank Soal'], ['pantau', '🖥️ Pemantauan Asesmen 3'], ['hasil', '🧾 Hasil & Nilai'], ['jurnal', '📓 Jurnal Refleksi'], ['kelas', '👥 Kelola Kelas & Kelompok'], ['atur', '⚙️ Pengaturan']];
const GP = {};
function loginGuru() {
  M.innerHTML = `<main class="wrap" style="max-width:460px;padding-top:40px"><div class="card"><h2>🔐 Masuk Guru</h2><form id="f"><label for="u">Nama pengguna</label><input id="u" required autocomplete="username"><label for="p">Kata sandi</label><input id="p" type="password" required autocomplete="current-password"><p id="er" style="color:#B84A39;min-height:1.5em"></p><button class="btn" type="submit">Masuk</button> <button class="btn sec" type="button" id="b">Kembali</button></form></div></main>`;
  b.onclick = landing;
  f.onsubmit = async e => { e.preventDefault(); const bt = e.submitter; bt.disabled = true; const r = await api('auth.guru', { username: u.value, password: p.value }); bt.disabled = false; if (!r.success) return er.textContent = r.message; S.tok = r.data.token; S.nama = r.data.nama; localStorage.pp_tok = S.tok; localStorage.pp_nama = S.nama; localStorage.pp_gt = S.tok; guruPanel('ringkasan'); };
}
function guruPanel(tab) {
  gTab = tab || gTab; clearInterval(gTimer); document.body.classList.remove('has-nav', 'exam'); document.body.classList.add('guru');
  M.innerHTML = `<div class="gur"><aside class="gside"><b>🍕 Petualangan Pecahan<br><small>Portal Guru • ${esc(S.nama)}</small></b>${GMENU.map(m => `<button data-g="${m[0]}" class="${gTab === m[0] ? 'on' : ''}">${m[1]}</button>`).join('')}<button id="gk">🚪 Keluar</button></aside><section class="gmain" id="gm">Memuat…</section></div>`;
  M.querySelectorAll('[data-g]').forEach(b => b.onclick = () => guruPanel(b.dataset.g)); document.getElementById('gk').onclick = () => { localStorage.removeItem('pp_gt'); keluar(); };
  GP[gTab]();
}
const gm = h => { const e = document.getElementById('gm'); if (e) e.innerHTML = h; };
const gErr = r => `<div class="card">${esc(r.message || 'Gagal memuat.')} <button class="btn" onclick="guruPanel()">Coba lagi</button></div>`;
const CH = { berjalan: ['b', 'Berjalan'], selesai: ['a', 'Selesai'], dihentikan: ['d', 'Dihentikan'], dibuka_kembali: ['r', 'Dibuka Kembali'] };

GP.ringkasan = async () => {
  const r = await api('guru.ringkasan'); if (!r.success) return gm(gErr(r)); const d = r.data;
  gm(`<h2>Ringkasan & Analitik</h2><div class="grid"><div class="stat m"><b>${d.siswa}</b>Siswa terdaftar</div><div class="stat k"><b>${d.ujianSelesai}</b>Ujian resmi selesai</div><div class="stat s"><b>${d.rataA3}</b>Rata-rata Asesmen 3</div><div class="stat"><b>${d.selesaiPerTahap.A3 || 0}</b>Menuntaskan Asesmen 3</div></div>
  <h3 style="margin-top:18px">Siswa menyelesaikan per tahap</h3><div class="card">${['A1', 'R1', 'A2', 'R2', 'A3', 'R3'].map(k => `<p style="margin:6px 0"><b>${k}</b> — ${d.selesaiPerTahap[k] || 0}/${d.siswa}<span class="bar"><i class="sv" style="width:${d.siswa ? Math.round(100 * (d.selesaiPerTahap[k] || 0) / d.siswa) : 0}%"></i></span></p>`).join('')}</div>
  <h3 style="margin-top:18px">Ketercapaian Tujuan Pembelajaran (Asesmen 3)</h3><div class="card">${d.tp.map(t => `<p style="margin:8px 0"><b>${esc(t.tp)}</b> — ${t.persen}% ${t.persen < 70 ? '<span class="chp d">Perlu penguatan</span>' : ''}<span class="bar"><i class="${t.persen >= 85 ? 'sv' : t.persen >= 70 ? 'sk' : 'sr'}" style="width:${t.persen}%"></i></span></p>`).join('') || '<p>Belum ada ujian resmi yang selesai.</p>'}</div>
  <h3 style="margin-top:18px">Soal paling sering salah</h3>${d.palingSalah.map(z => `<div class="card" style="margin:8px 0"><b>${esc(z.id)}</b> • ${Math.round(100 * z.salah / z.total)}% siswa keliru<p>${esc(z.teks)}</p><button class="btn sec" data-bs="${esc(z.id)}">Buka di bank soal</button></div>`).join('') || '<p>Belum ada data.</p>'}`);
  M.querySelectorAll('[data-bs]').forEach(b => b.onclick = () => guruPanel('bank'));
};

GP.pantau = async () => {
  const r = await api('guru.pemantauan'); if (!r.success) return gm(gErr(r));
  const buka = document.getElementById('modal').hidden;
  if (buka || !document.getElementById('gm').dataset.ok) {
    gm(`<h2>Pemantauan Asesmen 3 <small style="font-weight:600">(diperbarui otomatis tiap 10 dtk)</small></h2><div class="card scroll"><table class="tbl"><tr><th>Siswa</th><th>Kelas</th><th>Mode</th><th>Status</th><th>Peringatan</th><th>Skor</th><th>Kode bukti</th><th>Aksi</th></tr>${r.data.map(x => { const c = CH[x.status] || ['g', x.status]; return `<tr><td><b>${esc(x.siswa)}</b></td><td>${esc(x.kelas)}</td><td>${esc(x.mode)}</td><td><span class="chp ${c[0]}">${c[1]}</span></td><td>${x.pelanggaran}/3${x.log.length ? `<details><summary>log</summary>${x.log.map(l => `<small>${esc(String(l.waktu).slice(11, 19))} • ${esc(l.jenis)}</small><br>`).join('')}</details>` : ''}</td><td>${esc(x.skor)}</td><td><code>${esc(x.kode)}</code></td><td>${x.bisaBuka ? `<button class="btn" data-bk="${esc(x.idSesi)}" data-nm="${esc(x.siswa)}" style="min-height:40px">Buka Kembali</button>` : ''}</td></tr>`; }).join('') || '<tr><td colspan="8">Belum ada sesi.</td></tr>'}</table></div>`);
    document.getElementById('gm').dataset.ok = '1';
    M.querySelectorAll('[data-bk]').forEach(b => b.onclick = () => bukaKembaliForm(b.dataset.bk, b.dataset.nm));
  }
  clearInterval(gTimer); gTimer = setInterval(() => { if (gTab === 'pantau' && document.getElementById('modal').hidden) { const e = document.getElementById('gm'); if (e) delete e.dataset.ok; GP.pantau(); } else if (gTab !== 'pantau') clearInterval(gTimer); }, 10000);
};
function bukaKembaliForm(id, nama) {
  kunciModal(0); modal(`<span class="tag">AUDIT PROKTOR & PEMULIHAN SESI</span><h2>Buka Kembali Pengerjaan: ${esc(nama)}</h2><p>Waktu <b>tidak ditambah</b> (dilanjutkan dari sisa saat dihentikan), jawaban tetap utuh, peringatan direset ke 0, dan skor sementara dibatalkan. Tindakan ini tercatat permanen di audit log.</p>
  <label for="kt">Alasan pedagogis</label><select id="kt"><option>Kendala teknis perangkat sekolah di luar kendali siswa</option><option>Panggilan darurat resmi</option><option>Gangguan jaringan sekolah</option><option>Lainnya (jelaskan)</option></select>
  <label for="al">Klarifikasi tatap muka & saksi proktor <small id="cn">0/30</small></label><textarea id="al" rows="4" placeholder="Jelaskan hasil konfirmasi langsung (minimal 30 karakter)"></textarea>
  <p style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sec" id="x">Batal</button><button class="btn" id="kf" disabled>🔓 Konfirmasi buka kembali</button></p>`);
  al.oninput = () => { cn.textContent = al.value.trim().length + '/30'; kf.disabled = al.value.trim().length < 30; };
  kf.onclick = async () => { kf.disabled = true; const r = await api('guru.bukaKembali', { idSesi: id, alasan: kt.value + ' — ' + al.value.trim() }); toast(r.message); if (r.success) { tutupModal(); guruPanel('pantau'); } else kf.disabled = false; };
}

// ---- bank soal ----
const CSVH = ['id', 'asesmen', 'jenis', 'teks', 'pilihan', 'kunci', 'penjelasan', 'tp', 'topik', 'stimulus', 'status'];
function parseCSV(t) {
  const rows = []; let r = [], c = '', q = false;
  for (let i = 0; i < t.length; i++) { const ch = t[i]; if (q) { if (ch === '"') { if (t[i + 1] === '"') { c += '"'; i++; } else q = false; } else c += ch; } else if (ch === '"') q = true; else if (ch === ',') { r.push(c); c = ''; } else if (ch === '\n' || ch === '\r') { if (ch === '\r' && t[i + 1] === '\n') i++; r.push(c); c = ''; if (r.some(x => x !== '')) rows.push(r); r = []; } else c += ch; }
  r.push(c); if (r.some(x => x !== '')) rows.push(r); return rows;
}
GP.bank = async () => {
  const [r, s] = await Promise.all([api('guru.bank.list'), api('guru.stimulus.list')]); if (!r.success) return gm(gErr(r)); stimCache = s.success ? s.data : [];
  window._bank = r.data; const f = window._bf || '';
  gm(`<h2>Bank Soal</h2><p style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><select id="fa" aria-label="Filter asesmen"><option value="">Semua asesmen</option><option>1</option><option>2</option><option>3</option></select><button class="btn" id="nw">＋ Soal baru</button><button class="btn sec" id="st">＋ Stimulus</button><button class="btn sec" id="im">⬆ Impor CSV</button></p>
  <div class="card scroll"><table class="tbl"><tr><th>ID</th><th>Asesmen</th><th>Jenis</th><th>Soal</th><th>Kunci</th><th>TP</th><th>Status</th><th></th></tr>${r.data.filter(q => !f || String(q.asesmen) === f).map((q, i) => `<tr><td>${esc(q.id)}</td><td>${esc(q.asesmen)}</td><td>${esc(q.jenis)}</td><td>${esc(String(q.teks).slice(0, 80))}</td><td>${esc(q.kunci)}</td><td>${esc(q.tp)}</td><td><span class="chp ${q.status === 'nonaktif' ? 'd' : 'a'}">${esc(q.status)}</span></td><td><button class="btn sec" data-e="${esc(q.id)}" style="min-height:40px">Ubah</button></td></tr>`).join('')}</table></div>`);
  fa.value = f; fa.onchange = () => { window._bf = fa.value; GP.bank(); };
  nw.onclick = () => formSoal(null); st.onclick = formStimulus; im.onclick = formImpor;
  M.querySelectorAll('[data-e]').forEach(b => b.onclick = () => formSoal(window._bank.find(q => q.id === b.dataset.e)));
};
function formSoal(q) {
  q = q || { id: '', asesmen: 3, jenis: 'PG', teks: '', pilihan: [], kunci: '', penjelasan: '', tp: '', topik: '', stimulus: '', status: 'aktif' };
  kunciModal(0); modal(`<h2>${q.id ? 'Ubah' : 'Tambah'} soal</h2><div class="grid"><div><label for="fi">ID soal</label><input id="fi" value="${esc(q.id)}" ${q.id ? 'readonly' : ''}></div><div><label for="fas">Asesmen</label><select id="fas">${[1, 2, 3].map(n => `<option ${n == q.asesmen ? 'selected' : ''}>${n}</option>`).join('')}</select></div><div><label for="fj">Jenis</label><select id="fj">${[['PG', 'Pilihan ganda'], ['PGK', 'PG kompleks'], ['KAT', 'Benar/Salah'], ['ISI', 'Isian']].map(j => `<option value="${j[0]}" ${j[0] === q.jenis ? 'selected' : ''}>${j[1]}</option>`).join('')}</select></div></div>
  <label for="ft">Teks soal</label><textarea id="ft" rows="3">${esc(q.teks)}</textarea><label for="fp">Pilihan / pernyataan (satu per baris)</label><textarea id="fp" rows="4">${esc((q.pilihan || []).join('\n'))}</textarea>
  <label for="fk">Kunci <small id="fh"></small></label><input id="fk" value="${esc(q.kunci)}"><label for="fe">Penjelasan</label><textarea id="fe" rows="2">${esc(q.penjelasan)}</textarea>
  <div class="grid"><div><label for="ftp">TP</label><input id="ftp" value="${esc(q.tp)}" placeholder="TP-4"></div><div><label for="fto">Topik materi</label><input id="fto" value="${esc(q.topik)}"></div><div><label for="fs">Stimulus</label><select id="fs"><option value="">— tanpa —</option>${stimCache.map(s => `<option value="${esc(s.id)}" ${s.id === q.stimulus ? 'selected' : ''}>${esc(s.id)} — ${esc(s.judul)}</option>`).join('')}</select></div><div><label for="fst">Status</label><select id="fst"><option ${q.status !== 'nonaktif' ? 'selected' : ''}>aktif</option><option ${q.status === 'nonaktif' ? 'selected' : ''}>nonaktif</option></select></div></div>
  <p style="display:flex;gap:8px"><button class="btn sec" id="x">Batal</button><button class="btn" id="sv">Simpan</button></p>`);
  const h = () => fh.textContent = { PG: '(satu huruf, mis. B)', PGK: '(beberapa huruf, mis. A,C)', KAT: '(B/S per pernyataan, mis. B,S,B)', ISI: '(jawaban; alternatif dipisah |, mis. 2/4|1/2)' }[fj.value]; h(); fj.onchange = h;
  sv.onclick = async () => { sv.disabled = true; const r = await api('guru.bank.simpan', { soal: [{ id: fi.value.trim(), asesmen: fas.value, jenis: fj.value, teks: ft.value.trim(), pilihan: fp.value.split('\n').map(x => x.trim()).filter(Boolean), kunci: fk.value.trim(), penjelasan: fe.value.trim(), tp: ftp.value.trim(), topik: fto.value.trim(), stimulus: fs.value, status: fst.value }] }); sv.disabled = false; toast(r.message); if (r.success) { tutupModal(); GP.bank(); } };
}
function formStimulus() {
  kunciModal(0); modal(`<h2>Stimulus bacaan / tabel</h2><label for="si">ID (mis. ST-02)</label><input id="si"><label for="sj">Jenis</label><select id="sj"><option value="teks">Teks bacaan</option><option value="tabel">Tabel (kolom dipisah |)</option></select><label for="sl">Judul</label><input id="sl"><label for="sx">Isi</label><textarea id="sx" rows="6"></textarea><p style="display:flex;gap:8px"><button class="btn sec" id="x">Batal</button><button class="btn" id="sv">Simpan</button></p>`);
  sv.onclick = async () => { const r = await api('guru.stimulus.simpan', { id: si.value, jenis: sj.value, judul: sl.value, isi: sx.value }); toast(r.message); if (r.success) { tutupModal(); GP.bank(); } };
}
function formImpor() {
  kunciModal(0); modal(`<h2>Impor soal dari CSV</h2><p>Kolom: <code>${CSVH.join(', ')}</code>. Pisahkan pilihan dengan <code>||</code>.</p><p><button class="btn sec" id="tp">⬇ Unduh templat</button></p><input type="file" id="fl" accept=".csv,text/csv"><label for="ct">atau tempel isi CSV</label><textarea id="ct" rows="6"></textarea><div id="lp" class="pre" hidden></div><p style="display:flex;gap:8px"><button class="btn sec" id="x">Batal</button><button class="btn" id="go">Impor</button></p>`);
  tp.onclick = () => { const b = new Blob(['\ufeff' + CSVH.join(',') + '\nA3-90,3,PG,"Contoh soal?",3/5||3/8||5/8||8/3,B,Penjelasan,TP-1,Representasi,,aktif\n'], { type: 'text/csv' }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'templat-bank-soal.csv'; a.click(); };
  fl.onchange = () => { const f = fl.files[0]; if (f) { const rd = new FileReader(); rd.onload = () => ct.value = rd.result; rd.readAsText(f); } };
  go.onclick = async () => { const rw = parseCSV(ct.value.replace(/^\ufeff/, '')); if (rw.length < 2) return toast('CSV kosong.'); const h = rw[0].map(x => x.trim().toLowerCase()); const soal = rw.slice(1).map(r => { const o = {}; h.forEach((k, i) => o[k] = (r[i] || '').trim()); o.pilihan = (o.pilihan || '').split('||').map(x => x.trim()).filter(Boolean); return o; }); go.disabled = true; const r = await api('guru.bank.simpan', { soal }); go.disabled = false; toast(r.message || 'Selesai'); lp.hidden = false; lp.textContent = r.success ? `Baru: ${r.data.baru}, diubah: ${r.data.diubah}\n${(r.data.galat || []).join('\n')}` : r.message; if (r.success && !(r.data.galat || []).length) { tutupModal(); GP.bank(); } };
}

// ---- hasil & jurnal ----
GP.hasil = async () => {
  const r = await api('guru.hasil'); if (!r.success) return gm(gErr(r)); window._hasil = r.data;
  const kl = [...new Set(r.data.resmi.map(x => x.kelas))].filter(Boolean), f = window._hk || '';
  gm(`<h2>Hasil & Nilai Siswa</h2><p style="display:flex;gap:8px;flex-wrap:wrap"><select id="hk"><option value="">Semua kelas</option>${kl.map(k => `<option ${k === f ? 'selected' : ''}>${esc(k)}</option>`).join('')}</select><button class="btn" id="xl">⬇ Ekspor Excel</button><button class="btn sec" id="pd">🖨️ Cetak laporan</button></p>
  <div class="card scroll" id="tbl"><table class="tbl"><tr><th>Siswa</th><th>Kelas</th><th>Asesmen</th><th>Nilai</th><th>Status</th><th>Refleksi</th><th>Tanggal</th></tr>${r.data.resmi.filter(x => !f || x.kelas === f).map(x => `<tr><td>${esc(x.siswa)}</td><td>${esc(x.kelas)}</td><td>${esc(x.asesmen)}</td><td><b>${esc(x.skor)}</b></td><td><span class="chp ${x.status === 'YA' ? 'a' : 'd'}">${x.status === 'YA' ? 'Resmi' : esc(x.status)}</span></td><td>${x.refleksi ? '✅' : '—'}</td><td>${esc(String(x.tanggal).slice(0, 10))}</td></tr>`).join('') || '<tr><td colspan="7">Belum ada hasil.</td></tr>'}</table></div>`);
  hk.onchange = () => { window._hk = hk.value; GP.hasil(); }; pd.onclick = () => { let c = document.getElementById('cetak'); if (!c) { c = document.createElement('div'); c.id = 'cetak'; document.body.appendChild(c); } c.innerHTML = '<h2>Rekap Hasil Petualangan Pecahan</h2>' + document.getElementById('tbl').innerHTML; print(); };
  xl.onclick = async () => {
    const rows = [['Siswa', 'Kelas', 'Asesmen', 'Nilai', 'Status', 'Refleksi', 'Tanggal']].concat(r.data.resmi.filter(x => !f || x.kelas === f).map(x => [x.siswa, x.kelas, x.asesmen, x.skor, x.status, x.refleksi ? 'Ya' : 'Belum', String(x.tanggal).slice(0, 10)]));
    try { if (!window.XLSX) await new Promise((ok, no) => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), 'Nilai Resmi'); XLSX.writeFile(wb, 'rekap-petualangan-pecahan.xlsx'); }
    catch (e) { const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n'), a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv' })); a.download = 'rekap-petualangan-pecahan.csv'; a.click(); toast('Excel tidak tersedia, diunduh sebagai CSV.'); }
  };
};
GP.jurnal = async () => { const r = await api('guru.jurnal'); if (!r.success) return gm(gErr(r)); gm(`<h2>Jurnal Refleksi Siswa</h2>${r.data.map(x => `<div class="card" style="margin:10px 0"><b>${esc(x.siswa)}</b> • Asesmen ${esc(x.asesmen)} ${esc(x.perasaan)} <small>${esc(String(x.waktu).slice(0, 10))}</small><p>${esc(x.isi)}</p><p><i>Rencana: ${esc(x.rencana)}</i></p></div>`).join('') || '<p>Belum ada refleksi.</p>'}`); };

// ---- kelas, kelompok, buka kunci ----
GP.kelas = async () => {
  const r = await api('guru.siswa.list'); if (!r.success) return gm(gErr(r));
  gm(`<h2>Kelola Kelas & Kelompok</h2><div class="card"><h3>Tambah siswa</h3><p><small>Satu siswa per baris: <code>Nama Lengkap, Kelas</code> (mis. Budi Pratama, VII-A). Nama dipakai untuk login.</small></p><textarea id="ns" rows="4"></textarea><p><button class="btn" id="as">Tambahkan</button></p></div>
  <div class="card" style="margin-top:12px"><h3>Kelompok belajar</h3><p>Bentuk otomatis per kelas, ukuran <select id="uk">${[3, 4, 5, 6].map(n => `<option ${n === 4 ? 'selected' : ''}>${n}</option>`).join('')}</select> <button class="btn sec" id="bk">Bentuk kelompok</button></p></div>
  <div class="card" style="margin-top:12px"><h3>Buka kunci tahap manual</h3><p><select id="ks" aria-label="Siswa">${r.data.map(s => `<option>${esc(s.nama)}</option>`).join('')}</select> <select id="kt2" aria-label="Tahap">${['A1', 'R1', 'A2', 'R2', 'A3', 'R3'].map(t => `<option>${t}</option>`).join('')}</select> <button class="btn sec" id="bu">Buka tahap</button></p></div>
  <div class="card scroll" style="margin-top:12px"><table class="tbl"><tr><th>Nama</th><th>Kelas</th><th>Kelompok</th></tr>${r.data.map(s => `<tr><td>${esc(s.nama)}</td><td>${esc(s.kelas)}</td><td>${esc(s.kelompok)}</td></tr>`).join('')}</table></div>`);
  as.onclick = async () => { const siswa = ns.value.split('\n').map(l => l.split(',')).filter(a => a[0].trim()).map(a => ({ nama: a[0].trim(), kelas: (a[1] || '').trim() })); const x = await api('guru.siswa.simpan', { siswa }); toast(x.success ? x.data.ditambah + ' siswa ditambahkan.' : x.message); GP.kelas(); };
  bk.onclick = async () => { const x = await api('guru.kelompok.bentuk', { ukuran: +uk.value }); toast(x.message); GP.kelas(); };
  bu.onclick = async () => { const x = await api('guru.bukaKunci', { siswa: ks.value, tahap: kt2.value }); toast(x.message); };
};

// ---- pengaturan & migrasi ----
GP.atur = async () => {
  const p = await api('guru.pengaturan'); if (!p.success) return gm(gErr(p));
  gm(`<h2>Pengaturan</h2><div class="card"><h3>Asesmen 3</h3><label for="aj">Jumlah soal (5–40)</label><input id="aj" type="number" value="${esc(p.data.A3_JUMLAH)}"><label for="am">Durasi menit (10–120)</label><input id="am" type="number" value="${esc(p.data.A3_MENIT)}"><p><button class="btn" id="sa">Simpan</button></p></div>
  <div class="card" style="margin-top:12px"><h3>Migrasi data aplikasi lama</h3><p><small>Tempel URL/ID spreadsheet aplikasi lama. Hanya dibaca. Selalu mulai dengan uji coba.</small></p><input id="ms" placeholder="https://docs.google.com/spreadsheets/d/…"><p><button class="btn sec" id="dr">Uji coba (tidak menulis)</button> <button class="btn" id="mj">Jalankan migrasi</button></p><div id="mr" class="pre" hidden></div></div>`);
  sa.onclick = async () => { const x = await api('guru.pengaturan', { simpan: 1, A3_JUMLAH: aj.value, A3_MENIT: am.value }); toast(x.success ? 'Tersimpan.' : x.message); GP.atur(); };
  const mig = async dry => { if (!ms.value.trim()) return toast('Isi URL/ID spreadsheet lama.'); if (!dry && !confirm('Jalankan migrasi sungguhan? Pastikan uji coba sudah sesuai.')) return; mr.hidden = false; mr.textContent = 'Memproses…'; const x = await api('guru.migrasi', { sumber: ms.value.trim(), dryRun: dry }); mr.textContent = x.success ? (dry ? 'UJI COBA (tidak ada yang ditulis)\n' : 'SELESAI\n') + JSON.stringify(x.data, null, 1) : x.message; };
  dr.onclick = () => mig(true); mj.onclick = () => mig(false);
};
landing();
