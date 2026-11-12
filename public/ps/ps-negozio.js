(function(){
const SOGLIA = 69;
let NONCE = null;
const euro = n => n.toFixed(2).replace('.', ',') + ' €';
async function leggi() {
  try {
    const r = await fetch('/wp-json/wc/store/v1/cart', {credentials:'same-origin'});
    NONCE = r.headers.get('Nonce') || NONCE;
    disegna(await r.json());
  } catch (e) {}
}
function disegna(c) {
  if (!c || !c.totals) return;
  const n = c.items_count || 0;
  const div = Math.pow(10, c.totals.currency_minor_unit || 2);
  const tot = (parseInt(c.totals.total_items||0,10) + parseInt(c.totals.total_items_tax||0,10)) / div;
  document.getElementById('ps-nCarr').textContent = n;
  document.getElementById('ps-tot').textContent = euro(tot) + (n ? ' · ' + n + (n===1?' pezzo':' pezzi') : '');
  const manca = SOGLIA - tot;
  document.getElementById('ps-sped').textContent = n === 0 ? '' :
    (manca > 0 ? euro(manca) + ' alla spedizione gratis' : 'Spedizione gratuita inclusa');
  document.getElementById('ps-progI').style.width = Math.min(100, tot/SOGLIA*100) + '%';
  document.getElementById('ps-barra').classList.toggle('ps-on', n > 0);
}
document.addEventListener('click', async e => {
  const a = e.target.closest('[data-agg]');
  if (!a) return;
  e.preventDefault();
  if (!NONCE) await leggi();
  const vecchio = a.textContent; a.textContent = '...';
  try {
    const r = await fetch('/wp-json/wc/store/v1/cart/add-item', {
      method:'POST', credentials:'same-origin',
      headers:{'Content-Type':'application/json','Nonce':NONCE},
      body: JSON.stringify({id: parseInt(a.dataset.agg,10), quantity: 1})});
    const nn = r.headers.get('Nonce'); if (nn) NONCE = nn;
    if (!r.ok) throw new Error('no');
    disegna(await r.json());
    a.textContent = 'Aggiunto \u2713'; a.classList.add('ps-fatto');
    setTimeout(() => { a.textContent = vecchio; a.classList.remove('ps-fatto'); }, 1500);
  } catch (err) {
    location.href = '/carrello/?add-to-cart=' + a.dataset.agg;
  }
});
const oss = new IntersectionObserver(v => v.forEach(x => {
  if (x.isIntersecting) { x.target.classList.add('ps-on'); oss.unobserve(x.target); }
}), {threshold:.12});
document.querySelectorAll('.ps-rev').forEach((e,i) => { e.style.transitionDelay = (i%4*.05)+'s'; oss.observe(e); });
if (matchMedia('(hover:hover)').matches) {
  document.querySelectorAll('.ps-im').forEach(im => {
    const inn = im.querySelector('.ps-in');
    im.addEventListener('mousemove', ev => {
      const r = im.getBoundingClientRect();
      const x = (ev.clientX-r.left)/r.width-.5, y = (ev.clientY-r.top)/r.height-.5;
      inn.style.transform = 'rotateY('+(x*14)+'deg) rotateX('+(-y*11)+'deg) translateZ(14px)';
    });
    im.addEventListener('mouseleave', () => { inn.style.transform=''; });
  });
}
leggi();
})();