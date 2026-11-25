// percorre os 10 arcos com batalhas vencidas automaticamente, para checar a história inteira
module.exports=async p=>{
 const ev=s=>p.evaluate(s2=>__T(s2),s);
 await ev(`(function(){try{localStorage.clear()}catch(e){}document.querySelector('#bRG').click();window.ST={seen:{},deaths:{},bats:[],fin:null,arcs:{}};
  var d0=rgDie;rgDie=function(id){ST.deaths[id]=(ST.deaths[id]||0)+1;d0(id)};
  startBattle=function(cfg){ST.bats.push(RG.arc+':'+cfg.enemy+':'+(cfg.allies||[]).join('/'));N[cfg.win].run()};
  var f0=rgFinale;rgFinale=function(){f0();ST.fin=document.querySelector('#overlay').innerText.slice(0,400)};})()`);
 for(let i=0;i<9000;i++){
  const r=await ev(`(function(){
   if(ST.fin)return 'fin';
   var o=document.querySelector('#overlay');
   if(!o.hidden){var bs=[].filter.call(o.querySelectorAll('button'),function(b){return !b.disabled});var dis=o.querySelector('button[disabled]');if(!bs.length&&dis){dis.disabled=false;bs=[dis]}if(bs.length){var pr=bs.filter(function(b){return /primary/.test(b.className)});(pr[0]||bs[0]).click()}else o.hidden=true;return}
   var scr=document.querySelector('.screen:not([hidden])');
   if(scr.id==='rg'&&RG&&RG.cur){var c=RG.cur;ST.seen[c.id]=1;ST.arcs[RG.arc]=(ST.arcs[RG.arc]||0)+1;
     for(var i=0;i<4;i++){if(RG.m[i]<25)RG.m[i]=45;if(RG.m[i]>79)RG.m[i]=62}
     function sc(k){var s=Math.random()*5;if(k.x&&k.x.die&&!(k.x.sm&&rm(k.x.sm)))s+=40;return s}
     var d=sc(c.L)<=sc(c.R)?'L':'R';if(Math.random()<0.15)d=d==='L'?'R':'L';rgPick(d);return}
   if(scr.id==='title')document.querySelector('#bRG').click();
  })()`);
  if(r==='fin')break;
 }
 console.log(await ev(`JSON.stringify({arc:RG.arc,fin:ST.fin,arcs:ST.arcs,deaths:ST.deaths,bats:ST.bats,flags:RG.flags,unseen:Object.keys(RC).filter(function(k){return /^h\\d/.test(k)&&!ST.seen[k]&&!/_p\\d/.test(k)})},null,1)`));
};
