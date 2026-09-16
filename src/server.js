import http from 'node:http';
import { Money } from './domain/Money.js';
import { SeatTier } from './domain/SeatTier.js';
import { Booking } from './domain/Booking.js';
import { PricingEngine } from './pricing/PricingEngine.js';
import { ReceiptFormatter } from './receipt/ReceiptFormatter.js';
import { PriceListImporter } from './domain/PriceListImporter.js';

const port = Number(process.env.PORT) || 3000;

function billFrom(input) {
  const tiers = [
    new SeatTier('Silver', Money.fromRupees(Number(input.silverPrice)), input.silverAvailable),
    new SeatTier('Gold', Money.fromRupees(Number(input.goldPrice)), input.goldAvailable),
    new SeatTier('Recliner', Money.fromRupees(Number(input.reclinerPrice)), input.reclinerAvailable)
  ];
  const quantities = [input.silverQuantity, input.goldQuantity, input.reclinerQuantity];
  const items = tiers.map((tier, index) => ({ tier, quantity: Number(quantities[index]) || 0 }))
    .filter((item) => item.quantity > 0);
  const booking = new Booking(items);
  const engine = new PricingEngine({
    festivalDiscount: Money.fromRupees(Number(input.festivalDiscount)),
    memberDiscountPercent: Number(input.memberDiscountPercent),
    memberDiscountCap: Money.fromRupees(Number(input.memberDiscountCap)),
    convenienceFeePerTicket: Money.fromRupees(Number(input.convenienceFee)),
    gstPercent: Number(input.gstPercent)
  });
  return engine.price(booking, { festival: input.festival, member: input.member });
}

function page() {
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Multiplex Pricing Engine</title><style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
  :root{--ink:#202326;--muted:#73756f;--cream:#f5f1e8;--paper:#fffdf8;--teal:#146b63;--teal-dark:#0d4c48;--coral:#e77455;--line:#ded8ca;--shadow:0 20px 55px #253e3820}*{box-sizing:border-box}body{font-family:'DM Sans',sans-serif;max-width:1160px;margin:0 auto;padding:42px 28px 64px;background:radial-gradient(circle at 8% 0,#f7d8bf 0,transparent 28%),var(--cream);color:var(--ink)}header{display:flex;justify-content:space-between;align-items:end;margin-bottom:28px}h1,h2{font-family:'Space Grotesk',sans-serif}h1{font-size:clamp(2rem,4vw,3.7rem);line-height:1;margin:0;letter-spacing:-.06em}.eyebrow{color:var(--coral);font-size:.75rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;margin:0 0 10px}.status{background:#dceee5;color:var(--teal-dark);border-radius:99px;padding:8px 13px;font-size:.8rem;font-weight:700}main{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(320px,.9fr);gap:22px;align-items:start}section{background:color-mix(in srgb,var(--paper) 94%,transparent);border:1px solid #fff8;border-radius:18px;padding:28px;box-shadow:var(--shadow)}h2{font-size:1.1rem;margin:0 0 22px}.tier{border:1px solid var(--line);border-radius:13px;padding:16px;margin-bottom:12px;background:#fffaf2}.tier-head{display:flex;justify-content:space-between;align-items:center}.tier-name{font-family:'Space Grotesk';font-size:1.1rem}.tier-price{color:var(--teal);font-weight:700}.field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}.field label{display:block;color:var(--muted);font-size:.76rem;font-weight:700;margin:12px 0 5px}.field input{width:100%;border:1px solid var(--line);border-radius:8px;background:#fff;padding:10px;color:var(--ink);font:inherit}.availability{color:var(--teal);font-size:.78rem;font-weight:700;display:flex;align-items:center;gap:7px;margin-top:14px}.availability input,.checks input{accent-color:var(--teal);width:auto}.charges{border-top:1px solid var(--line);margin-top:22px;padding-top:22px}.charge-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 14px}.checks{display:flex;gap:20px;margin-top:18px;font-size:.84rem;font-weight:700}.checks label{display:flex;align-items:center;gap:7px}button{width:100%;background:var(--teal);color:#fff;border:0;border-radius:9px;padding:13px 18px;margin-top:24px;cursor:pointer;font:700 .9rem 'DM Sans';transition:background .2s,transform .2s}button:hover{background:var(--teal-dark);transform:translateY(-2px)}.receipt-panel{background:var(--teal-dark);color:#f8f5eb;min-height:480px;position:sticky;top:20px}.receipt-panel h2{color:#fff}.receipt{white-space:pre-line;line-height:2;font-size:.92rem;color:#d4e1d9}.receipt::first-line{color:#fff}.total{border-top:1px solid #ffffff55;margin-top:18px;padding-top:18px;font-size:1.6rem;font-family:'Space Grotesk';color:#fff}.error{color:#ffb09b;margin-top:14px;font-size:.85rem}@media(max-width:760px){body{padding:28px 16px 45px}header{display:block}.status{display:inline-block;margin-top:18px}main{grid-template-columns:1fr}.receipt-panel{position:static}.charge-grid{grid-template-columns:1fr}}
  </style><style>
  .subhead{color:var(--muted);max-width:420px;margin:16px 0 0;line-height:1.55;font-size:.95rem}.status{box-shadow:0 4px 12px #146b6320}.receipt-panel{overflow:hidden}.receipt-panel:before{content:'RECEIPT / LIVE QUOTE';display:block;letter-spacing:.14em;font-size:.68rem;color:#a9d2c2;margin-bottom:30px;font-weight:700}.receipt-panel h2{font-size:1.5rem}.receipt-panel .receipt{padding:8px 0 20px}.receipt-panel .receipt div:last-child{font-size:1.25rem}.receipt-panel .total{color:#fff}details{background:#f1ede3;border-radius:11px;padding:14px 16px;margin-bottom:20px}summary{font-family:'Space Grotesk';font-weight:600;cursor:pointer;color:var(--teal-dark)}details p{color:var(--muted);font-size:.82rem;line-height:1.4}textarea{width:100%;border:1px solid var(--line);border-radius:8px;padding:10px;background:#fffdf8;font: .78rem monospace;resize:vertical}details button{background:var(--coral);margin-top:12px;padding:10px;font-size:.8rem}.import-report{margin-top:10px;color:var(--teal-dark);font-size:.78rem;line-height:1.5}
  </style></head><body><header><div><p class="eyebrow">Counter console / 01</p><h1>Make the moment<br>count.</h1><p class="subhead">Build a precise ticket quote for every seat, offer and charge.</p></div><div class="status">● Pricing engine online</div></header><main><section><h2>Build a booking</h2><details><summary>Import seat price list</summary><p>Paste JSON rows with <code>name</code> and <code>price</code>.</p><textarea id="price-list" rows="4">[{"name":"silver","price":"₹150"},{"name":"GOLD","price":"250 INR"},{"name":"Recliner","price":450}]</textarea><button type="button" id="import">Clean and import prices</button><div id="import-report" class="receipt import-report"></div></details><form id="form">
  <div class="tier"><div class="tier-head"><span class="tier-name">Silver</span><span class="tier-price">₹150 / seat</span></div><div class="field-row"><div class="field"><label>Price per ticket<input name="silverPrice" type="number" min="0" step="0.01" value="150" required></label></div><div class="field"><label>Tickets<input name="silverQuantity" type="number" min="0" step="1" value="0"></label></div></div><label class="availability"><input name="silverAvailable" type="checkbox" checked> Tier available</label></div>
  <div class="tier"><div class="tier-head"><span class="tier-name">Gold</span><span class="tier-price">₹250 / seat</span></div><div class="field-row"><div class="field"><label>Price per ticket<input name="goldPrice" type="number" min="0" step="0.01" value="250" required></label></div><div class="field"><label>Tickets<input name="goldQuantity" type="number" min="0" step="1" value="2"></label></div></div><label class="availability"><input name="goldAvailable" type="checkbox" checked> Tier available</label></div>
  <div class="tier"><div class="tier-head"><span class="tier-name">Recliner</span><span class="tier-price">₹450 / seat</span></div><div class="field-row"><div class="field"><label>Price per ticket<input name="reclinerPrice" type="number" min="0" step="0.01" value="450" required></label></div><div class="field"><label>Tickets<input name="reclinerQuantity" type="number" min="0" step="1" value="0"></label></div></div><label class="availability"><input name="reclinerAvailable" type="checkbox" checked> Tier available</label></div>
  <div class="charges"><h2>Offers and charges</h2><div class="charge-grid"><div class="field"><label>Festival discount<input name="festivalDiscount" type="number" min="0" step="0.01" value="50" required></label></div><div class="field"><label>Member discount (%)<input name="memberDiscountPercent" type="number" min="0" step="0.01" value="10" required></label></div><div class="field"><label>Member discount cap<input name="memberDiscountCap" type="number" min="0" step="0.01" value="40" required></label></div><div class="field"><label>Convenience fee / ticket<input name="convenienceFee" type="number" min="0" step="0.01" value="20" required></label></div><div class="field"><label>GST (%)<input name="gstPercent" type="number" min="0" step="0.01" value="18" required></label></div></div><div class="checks"><label><input name="festival" type="checkbox" checked> Festival offer</label><label><input name="member" type="checkbox" checked> Member</label></div></div><button>Calculate bill →</button></form></section><section class="receipt-panel"><h2>Bill breakdown</h2><div id="receipt" class="receipt">Enter booking details and calculate the bill.</div><div id="error" class="error"></div></section></main>
  <script>document.querySelector('#form').addEventListener('submit',async(e)=>{e.preventDefault();const f=e.target;const input=Object.fromEntries(new FormData(f));for(const n of ['silverAvailable','goldAvailable','reclinerAvailable','festival','member'])input[n]=f.elements[n].checked;try{const r=await fetch('/api/quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});const x=await r.json();if(!r.ok)throw Error(x.error);document.querySelector('#receipt').innerHTML=x.receipt.split(String.fromCharCode(10)).map((line,index)=>'<div class="'+(index===7?'total':'')+'">'+line+'</div>').join('');document.querySelector('#error').textContent=''}catch(x){document.querySelector('#error').textContent=x.message}});document.querySelector('#import').addEventListener('click',async()=>{const report=document.querySelector('#import-report');try{const r=await fetch('/api/import-prices',{method:'POST',headers:{'Content-Type':'application/json'},body:document.querySelector('#price-list').value});const x=await r.json();if(!r.ok)throw Error(x.error);for(const item of x.prices){const key=item.name.toLowerCase();const field={silver:'silverPrice',gold:'goldPrice',recliner:'reclinerPrice'}[key];if(field)document.querySelector('[name='+field+']').value=(item.pricePaisa/100).toFixed(2)}report.textContent='Imported '+x.report.imported+' | De-duplicated '+x.report.deDuplicated+' | Rejected '+x.report.rejected+(x.rejected.length?' ('+x.rejected.map((item)=>item.name||'unnamed').join(', ')+')':'')}catch(x){report.textContent=x.message}});</script></body></html>`;
}

const server = http.createServer((request, response) => {
  if (request.method === 'GET' && request.url === '/api/demo-bill') {
    const demoInput = {
      silverPrice: 150, silverQuantity: 0, silverAvailable: true,
      goldPrice: 250, goldQuantity: 2, goldAvailable: true,
      reclinerPrice: 450, reclinerQuantity: 0, reclinerAvailable: true,
      festivalDiscount: 50, memberDiscountPercent: 10, memberDiscountCap: 40,
      convenienceFee: 20, gstPercent: 18, festival: true, member: true
    };
    const bill = billFrom(demoInput);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(bill));
    return;
  }

  if (request.method === 'POST' && request.url === '/api/import-prices') {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', () => {
      try { const result = new PriceListImporter().import(JSON.parse(body)); response.writeHead(200, { 'Content-Type': 'application/json' }); response.end(JSON.stringify(result)); }
      catch (error) { response.writeHead(400, { 'Content-Type': 'application/json' }); response.end(JSON.stringify({ error: error.message })); }
    });
    return;
  }

  if (request.method === 'POST' && request.url === '/api/quote') {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', () => {
      try { const bill = billFrom(JSON.parse(body)); response.writeHead(200, { 'Content-Type': 'application/json' }); response.end(JSON.stringify({ bill, receipt: new ReceiptFormatter().format(bill) })); }
      catch (error) { response.writeHead(400, { 'Content-Type': 'application/json' }); response.end(JSON.stringify({ error: error.message })); }
    });
    return;
  }
  if (request.url === '/' || request.url === '/index.html' || request.url === '/index.html/') { response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); response.end(page()); return; }
  response.writeHead(404, { 'Content-Type': 'text/plain' }); response.end('Not found');
});

server.listen(port, () => console.log(`Pricing engine running at http://localhost:${port}`));
