// Nome do protagonista: diálogo na primeira partida, troca nos textos da tela e botão na tela inicial.
module.exports=async p=>{
 const ev=s=>p.evaluate(s2=>__T(s2),s);
 const st=async(n,s)=>{try{console.log(n+':',JSON.stringify(await ev(s)))}catch(e){console.log('FAIL '+n+': '+e.message)}};
 await ev(`try{localStorage.clear()}catch(e){};toTitle()`);
 await st('botão',`document.querySelector('#bNome').textContent`);
 await st('diálogo',`(function(){heroAsk(function(){newRG()});var i=document.querySelector('#hNome');i.value='beatriz da serra';document.querySelector('#hOk').click();return [gget('amp_nome'),document.querySelector('#overlay').hidden]})()`);
 await p.waitForTimeout(300);
 await st('inválido',`(function(){heroAsk(null,true);document.querySelector('#hNome').value='<b>x</b>';document.querySelector('#hOk').click();var r=[gget('amp_nome'),document.querySelector('#hErr').textContent];document.querySelector('#hNo').click();return r})()`);
 for(let i=0;i<14;i++){await ev(`(function(){var o=document.querySelector('#overlay');if(!o.hidden){o.hidden=true}if(RG&&RG.cur)rgPick(Math.random()<.5?'L':'R')})()`)}
 await p.waitForTimeout(300);
 await ev(`document.querySelector('#overlay').hidden=true;rgShow(RC.h1_abade)`);await p.waitForTimeout(200);
 await st('texto do jogo',`(function(){var t=document.body.innerText;return {tomas:(t.match(/Tomás|Tomazito/g)||[]).length,nome:(t.match(/Beatriz da serra/g)||[]).length,amostra:document.querySelector('#rgq').textContent.slice(0,90)}})()`);
 await st('volta ao padrão',`(function(){heroAsk(null,true);document.querySelector('#hNome').value='';document.querySelector('#hOk').click();return [gget('amp_nome'),heroName(),document.querySelector('#bNome').textContent]})()`);
 const r=await ev(`(function(){var t=document.body.innerText;return (t.match(/Beatriz da serra/g)||[]).length})()`);
 console.log(r===0?'padrão ok':'FAIL padrão');
};
