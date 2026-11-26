// Abre o jogo no Chrome sem janela e roda um teste. Uso: node tests/harness.js tests/sim.js
const CHROME=process.env.CHROME||'/usr/bin/google-chrome';
let chromium;try{({chromium}=require('playwright'))}catch(e){({chromium}=require('/opt/npm-tools/node_modules/playwright'))}
const path=require('path');
(async()=>{
  const b=await chromium.launch({executablePath:CHROME,args:['--no-sandbox']});
  const p=await b.newPage({viewport:{width:390,height:844}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  p.on('console',m=>{if(m.type()==='error'&&!/ERR_FAILED|net::|Failed to load/.test(m.text()))errs.push('CONSOLE '+m.text())});
  await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());
  await p.goto('file://'+path.resolve(__dirname,'..','index.html'));await p.waitForTimeout(300);
  try{await require(path.resolve(process.argv[2]))(p)}catch(e){errs.push('TESTERR '+e.message)}
  console.log(errs.length?errs.join('\n'):'no page errors');
  await b.close();
})();
