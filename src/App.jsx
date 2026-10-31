import {useEffect,useMemo,useState} from "react";
const PL=[
 {id:"google",name:"Google Search",parts:[["Headline 1",30,"h"],["Headline 2",30,"h"],["Headline 3",30,"h"],["Description",90,"b"]]},
 {id:"meta",name:"Facebook & Instagram",parts:[["Primary text",125,"b"],["Headline",40,"h"]]},
 {id:"linkedin",name:"LinkedIn",parts:[["Intro text",150,"b"],["Headline",70,"h"]]},
 {id:"x",name:"X (Twitter)",parts:[["Post",280,"b"]]},
 {id:"tiktok",name:"TikTok",parts:[["Caption",100,"b"]]}];
const H={
 benefit:["{B}","{P} for {a}","{B} with {p}","Meet {p}","{P}, made simple"],
 problem:["Done with {n}?","Say goodbye to {n}","{B}, not {n}","Stop {n}","{P} fixes {n}"],
 urgency:["{O}","{B} today","Don't miss out","Limited time: {p}","Start today: {p}"],
 curiosity:["What if {b}?","The easy way to {b}","How {a} can {b}","Want to {b}?","{a}: seen this?"],
 direct:["{P}","{P} for {a}","{p}: {b}","{C}: {p}","Try {p} today"]};
const B={
 benefit:["{P} helps {a} {b}. {O} {C}.","{a}: {b} with {p}. {C}.","{B} with {p}. Made for {a}. {C}."],
 problem:["Tired of {n}? {P} helps {a} {b}. {C}.","{N} is stressful. {P} makes it simple. {C}.","Say goodbye to {n} and {b} with {p}. {C}."],
 urgency:["{O} {P} helps {a} {b}. {C} today.","Don't wait: {b} with {p}. {C}.","{O} {C} now."],
 curiosity:["What if {b} was easy? See how {p} helps {a}. {C}.","The simple way {a} {b}. {C}.","Curious how {p} works? {C}."],
 direct:["{P}. {B}. {C}.","{P} for {a}. {O} {C}.","{B} with {p}. {C}."]};
const ANG={benefit:"Benefit",problem:"Problem to solution",urgency:"Urgency",curiosity:"Curiosity",direct:"Simple and direct"};
const CTAS=["Shop now","Learn more","Get started","Book a demo","Sign up","Try it free"];
const SAMPLE={brand:"Fresh Fork (sample)",p:"meal-prep delivery",a:"busy professionals",b:"eat well without cooking",n:"cooking after work",o:"20% off your first box",c:"Shop now"};
const EMPTY={brand:"",p:"",a:"",b:"",n:"",o:"",c:"Learn more"};
const cap=s=>s?s.charAt(0).toUpperCase()+s.slice(1):"";
const clean=s=>s.replace(/\s+([.,?!:])/g,"$1").replace(/([.?!])\.+/g,"$1").replace(/\s+/g," ").trim();
const render=(t,f)=>{const v={p:f.p,P:cap(f.p),a:f.a,b:f.b,B:cap(f.b),n:f.n,N:cap(f.n),o:f.o,O:f.o?cap(f.o)+".":"",c:f.c,C:cap(f.c)};
 const toks=[...t.matchAll(/\{(\w)\}/g)].map(m=>m[1]);if(toks.some(k=>!v[k]?.trim()))return null;
 return cap(clean(t.replace(/\{(\w)\}/g,(_,k)=>v[k])))};
function build(pl,angle,seed,f){
 const used={h:new Set(),b:new Set()};
 return [0,1,2].map(vi=>pl.parts.map(([label,max,kind],j)=>{
  const pool=[...(kind==="h"?H:B)[angle],...(kind==="h"?H:B).direct],start=(seed+vi*3+j*2)%pool.length;
  let best=null,pick=null;
  for(let k=0;k<pool.length&&!pick;k++){const r=render(pool[(start+k)%pool.length],f);if(!r)continue;
   if(!best||r.length<best.length)best=r;if(r.length<=max&&!used[kind].has(r))pick=r}
  const text=pick||best||clean(cap(f.p)||"Your headline");used[kind].add(text);return{label,max,text}}));
}
const load=(k,d)=>{try{const s=JSON.parse(localStorage.getItem(k));if(s)return s}catch{}return d};

function Preview({id,parts,brand}){
 const t=i=>parts[i]?.text||"",nm=brand||"Your brand";
 if(id==="google")return <div className="pv g"><small>Sponsored · www.yourbrand.com</small><h4>{t(0)} | {t(1)} | {t(2)}</h4><p>{t(3)}</p></div>;
 if(id==="x")return <div className="pv x"><b>{nm}</b> <small>@yourbrand · Ad</small><p>{t(0)}</p></div>;
 const body=id==="tiktok"?t(0):t(0),head=id==="tiktok"?"":t(1);
 return <div className={"pv s "+id}><div className="ph"><i/><span><b>{nm}</b><small>Sponsored</small></span></div><p>{body}</p><div className="img" aria-hidden="true">{head&&<strong>{head}</strong>}</div></div>;
}
function Variant({pl,parts,n,starred,onStar,brand,onCopy}){
 const ok=parts.every(p=>p.text.length<=p.max);
 const all=parts.map(p=>p.label+": "+p.text).join("\n");
 const prompt=`Improve this ${pl.name} ad copy. Keep every part within its character limit, keep the meaning, and give me 3 alternative versions.\n\n${all}\n\nLimits: ${parts.map(p=>p.label+" "+p.max).join(", ")}.`;
 return <article className={"vc "+(ok?"":"bad")}><div className="vh"><b>Variant {n}</b><span className={"fit "+(ok?"y":"n")}>{ok?"Fits all limits":"Too long, edit before use"}</span>
  <button className={"star "+(starred?"on":"")} onClick={onStar} aria-pressed={starred} aria-label={starred?"Remove from swipe file":"Save to swipe file"}>{starred?"★":"☆"}</button></div>
  <Preview id={pl.id} parts={parts} brand={brand}/>
  <ul className="pts">{parts.map(p=><li key={p.label}><span>{p.label}</span><em className={p.text.length>p.max?"over":""}>{p.text.length}/{p.max}</em><div className="cb"><i className={p.text.length>p.max?"over":""} style={{width:Math.min(100,p.text.length/p.max*100)+"%"}}/></div></li>)}</ul>
  <div className="va"><button className="btn sm" onClick={()=>onCopy(all,"Copied variant")}>Copy copy</button><button className="btn sm ghost" onClick={()=>onCopy(prompt,"Copied AI prompt")}>Copy AI prompt</button></div></article>;
}

export default function App(){
 const [f,setF]=useState(()=>load("ac-form",EMPTY)),[sel,setSel]=useState(()=>load("ac-plats",PL.map(p=>p.id))),[angle,setAngle]=useState("benefit"),[seed,setSeed]=useState(0);
 const [fav,setFav]=useState(()=>load("ac-fav",[])),[msg,setMsg]=useState(""),[tab,setTab]=useState(PL[0].id);
 useEffect(()=>{try{localStorage.setItem("ac-form",JSON.stringify(f));localStorage.setItem("ac-plats",JSON.stringify(sel));localStorage.setItem("ac-fav",JSON.stringify(fav))}catch{}},[f,sel,fav]);
 useEffect(()=>{if(!msg)return;const t=setTimeout(()=>setMsg(""),1800);return()=>clearTimeout(t)},[msg]);
 const ready=f.p.trim()&&f.a.trim()&&f.b.trim();
 const active=PL.filter(p=>sel.includes(p.id)),cur=active.find(p=>p.id===tab)||active[0];
 const ff=useMemo(()=>({...f,c:f.c||"Learn more"}),[f]);
 const vars=useMemo(()=>ready&&cur?build(cur,angle,seed,ff):[],[ready,cur,angle,seed,ff]);
 const copy=async(t,m)=>{try{await navigator.clipboard.writeText(t);setMsg(m)}catch{setMsg("Copy failed")}};
 const key=(pl,parts)=>pl.id+"|"+parts.map(p=>p.text).join("|");
 const toggleFav=(pl,parts)=>{const k=key(pl,parts);setFav(fav.some(x=>x.k===k)?fav.filter(x=>x.k!==k):[{k,pid:pl.id,name:pl.name,angle,parts},...fav])};
 const csv=()=>{const rows=[["Platform","Angle","Part","Text","Characters","Limit"],...fav.flatMap(x=>x.parts.map(p=>[x.name,ANG[x.angle],p.label,p.text,p.text.length,p.max]))];
  const u=URL.createObjectURL(new Blob([rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(",")).join("\n")],{type:"text/csv"}));const a=document.createElement("a");a.href=u;a.download="swipe-file.csv";a.click();URL.revokeObjectURL(u)};
 const set=(k,v)=>setF({...f,[k]:v});
 const fld=(k,l,ph,req)=><label className="fld">{l}{req?<em> required</em>:<em> optional</em>}<input value={f[k]} placeholder={ph} onChange={e=>set(k,e.target.value)}/></label>;
 const togP=id=>setSel(sel.includes(id)?sel.filter(x=>x!==id):[...sel,id]);
 return <div className="app">
  <header><div><span className="tag">V2 · Template engine with live previews</span><h1>AdCraft<span>AI</span></h1><p>One brief in. Ad copy for every platform out, sized to fit.</p></div></header>
  <div className="layout">
   <section className="panel form"><div className="th"><h2>The brief</h2><button className="link" onClick={()=>setF(SAMPLE)}>Load sample</button></div>
    {fld("brand","Brand name","e.g. Fresh Fork")}{fld("p","Product or service","e.g. meal-prep delivery",1)}{fld("a","Audience","e.g. busy professionals",1)}{fld("b","Main benefit (starts with a verb)","e.g. eat well without cooking",1)}{fld("n","Problem it removes","e.g. cooking after work")}{fld("o","Offer","e.g. 20% off your first box")}
    <label className="fld">Call to action<select value={f.c} onChange={e=>set("c",e.target.value)}>{CTAS.map(c=><option key={c}>{c}</option>)}</select></label>
    <div className="fld">Angle<div className="chips" role="group" aria-label="Angle">{Object.entries(ANG).map(([k,l])=><button key={k} aria-pressed={angle===k} className={angle===k?"on":""} onClick={()=>setAngle(k)}>{l}</button>)}</div></div>
    <div className="fld">Platforms<div className="chips" role="group" aria-label="Platforms">{PL.map(p=><button key={p.id} aria-pressed={sel.includes(p.id)} className={sel.includes(p.id)?"on":""} onClick={()=>togP(p.id)}>{p.name}</button>)}</div></div>
    <button className="btn big" disabled={!ready} onClick={()=>setSeed(seed+1)}>Generate new variants</button>
   </section>
   <section className="res">
    {!ready?<div className="empty big2"><h2>Start with three things</h2><p>Add your product, audience and main benefit, or tap <strong>Load sample</strong> to see how it works.</p></div>
    :!active.length?<div className="empty"><p>Choose at least one platform.</p></div>:<>
    <div className="tabs" role="tablist">{active.map(p=><button key={p.id} role="tab" aria-selected={cur.id===p.id} className={cur.id===p.id?"on":""} onClick={()=>setTab(p.id)}>{p.name}</button>)}</div>
    <div className="vgrid">{vars.map((parts,i)=><Variant key={cur.id+i+seed} pl={cur} parts={parts} n={i+1} brand={f.brand} starred={fav.some(x=>x.k===key(cur,parts))} onStar={()=>toggleFav(cur,parts)} onCopy={copy}/>)}</div></>}
    <p className="msg" role="status">{msg}</p>
   </section>
  </div>
  <section className="panel swipe"><div className="th"><h2>Swipe file <span>{fav.length}</span></h2>{fav.length>0&&<div className="hb"><button className="btn sm" onClick={csv}>Export CSV</button><button className="btn sm ghost" onClick={()=>copy(fav.map(x=>x.name+" ("+ANG[x.angle]+")\n"+x.parts.map(p=>p.label+": "+p.text).join("\n")).join("\n\n"),"Copied all")}>Copy all</button></div>}</div>
   {fav.length?<ul>{fav.map(x=><li key={x.k}><div><strong>{x.name}</strong><small>{ANG[x.angle]}</small><p>{x.parts.map(p=>p.text).join(" · ")}</p></div><button className="del" aria-label="Remove" onClick={()=>setFav(fav.filter(y=>y.k!==x.k))}>×</button></li>)}</ul>:<p className="empty">Star a variant to keep it here. Your swipe file is saved in this browser.</p>}</section>
  <footer>Copy is built by a template engine in your browser, not a live AI model. Character limits are common guidelines: check each platform's current rules before you run ads.</footer>
 </div>;
}
