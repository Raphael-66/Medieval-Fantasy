// Celular de verdade (toque, zoom): desliza até uma morte e confere que a tela não sai do enquadramento.
let chromium;try{({chromium}=require('playwright'))}catch(e){({chromium}=require('/opt/npm-tools/node_modules/playwright'))}
const path=require('path');
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());
 await p.goto('file://'+path.resolve(__dirname,'..','index.html'));
 await p.evaluate(()=>{const G=window.__G;G.reset();G.newGame()});await p.waitForTimeout(200);
 await p.click('#oGo');
 // anda até o banquete e arrasta a carta de verdade para a esquerda (beber = morte)
 for(let i=0;i<40;i++){const id=await p.evaluate(()=>window.__G.cur().id);if(id==='i_banquete')break;await p.evaluate(()=>{const c=window.__G.cur();window.__G.pick(c.narr?'L':(c.L.x.die?'R':'L'))});const ov=await p.$('#ov:not([hidden])');if(ov){const bt=await p.$('#ov .btn.main');if(bt)await bt.click()}}
 const bb=await (await p.$('#gCard')).boundingBox();
 await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.mouse.down();await p.mouse.move(bb.x-250,bb.y+bb.height/2,{steps:8});await p.mouse.up();
 await p.waitForTimeout(700);
 const m=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,iw:innerWidth,scale:visualViewport.scale,vw:visualViewport.width,morte:!document.querySelector('#ov').hidden,card:document.querySelector('#gCard').style.transform||'nenhum'}));
 console.log(JSON.stringify(m));
 await p.screenshot({path:'/tmp/morte.png'});
 console.log(m.sw<=m.iw&&m.scale===1&&m.morte&&m.card==='nenhum'?'ok':'FAIL enquadramento');
 console.log(errs.length?errs.join('\n'):'no page errors');await b.close();
})();
