// Simula partidas completas com dois tipos de jogador e mede mortes, cartas e finais.
// MODE=smart|random  RUNS=número de partidas
module.exports=async p=>{
 const res=await p.evaluate(({mode,runs})=>{
  const G=window.__G,out={runs:[],ends:{},deathIds:{}};
  for(let r=0;r<runs;r++){
   try{localStorage.clear()}catch(e){}
   localStorage.setItem('amp2_nome',JSON.stringify(''));
   G.reset();
   G.newGame();
   let steps=0,act={};const st={deaths:0,perAct:{},swipes:{}};
   while(steps++<6000){
    const ov=document.querySelector('#ov');
    if(!ov.hidden){
      const t=ov.innerText;
      if(/^Final \d/m.test(t)||/Final \d de/.test(t)){const k=G.S.ended;out.ends[k]=(out.ends[k]||0)+1;st.end=k;break}
      if(/Retorno|Não foi você/.test(ov.querySelector('.kick')?ov.querySelector('.kick').textContent:"")){st.deaths++;st.perAct[G.S.act]=(st.perAct[G.S.act]||0)+1}
      const b=ov.querySelector('.btn.main');b.click();continue;
    }
    const c=G.cur();if(!c){break}
    const S=G.S;st.swipes[S.act]=(st.swipes[S.act]||0)+1;
    if(c.narr){G.pick('L');continue}
    let side;
    if(mode==='random')side=Math.random()<.5?'L':'R';
    else{
      const sc=o=>{let s=0;for(let i=0;i<4;i++){const v=S.m[i]+o.e[i];s+=Math.pow(Math.abs(v-50),1.6)}
        const D=o.x.die;if(D){const known=(window.__G.META().mems||[]);s+=1e6*(known.length&&known.indexOf((({}).x||0))>=0?1:0)}
        return s+Math.random()*40};
      const danger=o=>{const btn=o===c.L?document.querySelector('#gL'):document.querySelector('#gR');return btn.classList.contains('mem')};
      let a=sc(c.L)+(danger(c.L)?1e9:0),b=sc(c.R)+(danger(c.R)?1e9:0);
      side=a<=b?'L':'R';
    }
    G.pick(side);
   }
   out.runs.push(st);
   (G.META().deaths||[]).forEach(d=>out.deathIds[d]=(out.deathIds[d]||0)+1);
  }
  return out;
 },{mode:process.env.MODE||'smart',runs:+(process.env.RUNS||20)});
 const n=res.runs.length,avg=k=>{const a={};res.runs.forEach(r=>Object.keys(r[k]||{}).forEach(x=>{a[x]=(a[x]||0)+r[k][x]}));Object.keys(a).forEach(x=>a[x]=+(a[x]/n).toFixed(1));return a};
 console.log('partidas',n,'· finais',JSON.stringify(res.ends),'· sem final',res.runs.filter(r=>!r.end).length);
 console.log('mortes por ato (média)',JSON.stringify(avg('perAct')));
 console.log('cartas por ato (média)',JSON.stringify(avg('swipes')));
 console.log('mortes totais média',(res.runs.reduce((a,r)=>a+r.deaths,0)/n).toFixed(1));
 console.log('tipos de morte',JSON.stringify(res.deathIds));
};
