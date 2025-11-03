import React, { useEffect, useMemo, useState } from 'react';
import AuthPage from './pages/Auth.jsx';
import Account from './pages/Account.jsx';
import Subscribe from './pages/Subscribe.jsx';
import { useAuth } from './contexts/AuthContext.jsx';

const LANG_KEY='lts_lang_v1'; const ADMIN_KEY='lts_admin_v2'; const ADMIN_AUTH_KEY='lts_admin_auth_v1';
async function loadLang(lang){ try{ const m=await import(`./i18n/${lang}.json`); return m.default; }catch{ const fb=(await import('./i18n/fr.json')).default; return fb; } }

function Header({t,lang,setLang,logoUrl,pages,user}){
  return (<header className="header"><div className="container nav">
    <div className="brand"><img src={logoUrl||'/logo.png'} alt="LTS Consulting Monaco"/><div><div style={{fontWeight:600}}>{t.companyName}</div><div className="small">{t.tagline}</div></div></div>
    <nav className="menu" style={{display:'flex',alignItems:'center'}}>
      <a href="#services">Services</a><a href="#offres">Offres</a><a href="#contact">Contact</a>
      {(pages||[]).filter(p=>p.showInNav).map(p=><a key={p.slug} href={`#/p/${p.slug}`}>{p.title}</a>)}
      <a href="#/admin">Admin</a>
      {user?<a href="#/account" className="btn btn-outline" style={{marginLeft:8}}>Mon compte</a>:<a href="#/auth" className="btn btn-outline" style={{marginLeft:8}}>Se connecter</a>}
      <a href="#/subscribe" className="btn btn-gold" style={{marginLeft:8}}>Souscrire</a>
      <div style={{marginLeft:12,display:'inline-flex',gap:8,alignItems:'center'}}>
        <button onClick={()=>setLang('fr')} className="btn btn-outline" style={{padding:'6px 10px',opacity:lang==='fr'?1:.7}}>FR</button>
        <button onClick={()=>setLang('en')} className="btn btn-outline" style={{padding:'6px 10px',opacity:lang==='en'?1:.7}}>EN</button>
        <button onClick={()=>setLang('it')} className="btn btn-outline" style={{padding:'6px 10px',opacity:lang==='it'?1:.7}}>IT</button>
      </div>
    </nav></div></header>);
}
function Footer({t,contact,logoUrl,pages}){
  return (<footer className="footer"><div className="container" style={{display:'flex',justifyContent:'space-between',gap:20,flexWrap:'wrap',alignItems:'center'}}>
    <div className="brand"><img src={logoUrl||'/logo.png'} alt=""/><div><div style={{fontWeight:600}}>{t.companyName}</div><div className="small">{t.tagline}</div></div></div>
    <div><div style={{color:'var(--gold)',fontWeight:600,marginBottom:8}}>Société</div>{(pages||[]).filter(p=>p.showInNav).map(p=><div key={p.slug}><a href={`#/p/${p.slug}`}>{p.title}</a></div>)}</div>
    <div><div style={{color:'var(--gold)',fontWeight:600,marginBottom:8}}>Contact</div>
      <div><a href={contact.phoneHref}>+33 7 61 31 91 63</a></div><div><a href={`mailto:${contact.email}`}>{contact.email}</a></div>
      <div><a target="_blank" rel="noreferrer" href={contact.whatsappHref} style={{color:'var(--gold)'}}>WhatsApp</a></div>
    </div></div></footer>);
}
function Assistant({t,setBrief}){
  const fields=t.assistant?.fields||[]; const [open,setOpen]=useState(false); const [step,setStep]=useState(0); const [val,setVal]=useState(''); const [answers,setAnswers]=useState({});
  if(!fields.length) return null; const current=fields[step]||fields[0];
  const onNext=()=>{ if(current.required && !val.trim()) return; const nxt={...answers,[current.key]:val.trim()}; setAnswers(nxt);
    if(step<fields.length-1){ setStep(step+1); setVal(nxt[fields[step+1].key]||''); }
    else{ const lines=Object.entries(nxt).map(([k,v])=>`- ${k}: ${v}`).join('\n'); setBrief(`${t.assistant.brief_intro}\n${lines}${t.assistant.brief_outro}`); setOpen(false); } };
  return (<><button className="btn btn-outline" onClick={()=>{setOpen(true);setStep(0);setVal(answers[fields[0].key]||'')}}>{t.assistant_button}</button>
    {open&&(<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',display:'grid',placeItems:'end'}} onClick={()=>setOpen(false)}>
      <div style={{background:'#101010',border:'1px solid rgba(255,255,255,.1)',borderRadius:14,maxWidth:560,width:'100%',margin:'0 16px 16px',padding:14}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}><strong>{t.assistant.title}</strong><button className="btn" onClick={()=>setOpen(false)}>✖</button></div>
        <div style={{margin:'12px 0 8px 0'}}>{current.label}</div>
        <input className="input" value={val} onChange={e=>setVal(e.target.value)} placeholder={current.placeholder||''}/>
        <div style={{marginTop:10,display:'flex',gap:8,justifyContent:'flex-end'}}><button className="btn" onClick={()=>setOpen(false)}>Annuler</button><button className="btn btn-gold" onClick={onNext}>Suivant ▶</button></div>
      </div></div>)} </>);
}
function Admin(){
  const ADMIN_KEY='lts_admin_v2', ADMIN_AUTH='lts_admin_auth_v1';
  const [ok,setOk]=useState(localStorage.getItem(ADMIN_AUTH)==='ok');
  const [u,setU]=useState(''),[p,setP]=useState('');
  if(!ok){return(<div className="container section" style={{maxWidth:360}}>
    <h1 style={{fontSize:26,marginBottom:6}}>Connexion Admin</h1>
    <input className="input" placeholder="Utilisateur" value={u} onChange={e=>setU(e.target.value)} />
    <input className="input" placeholder="Mot de passe" type="password" value={p} onChange={e=>setP(e.target.value)} style={{marginTop:8}} />
    <button className="btn btn-gold" style={{marginTop:10}} onClick={()=>{ if(u==='admin'&&p==='lts2025'){localStorage.setItem(ADMIN_AUTH,'ok');setOk(true);} else alert('Identifiants invalides'); }}>Entrer</button>
  </div>);}
  const defaults={branding:{logoDataUrl:'/logo.png'},contact:{email:'contact@lts-consulting.mc',phoneHref:'tel:+33761319163',whatsappHref:'https://api.whatsapp.com/send?phone=33761319163'},
  offers:[{name:'Essentiel',price:'à partir de 120€',features:['Évaluation du besoin','Dépôt de demande OVP','Suivi standard']},{name:'Pro',price:'à partir de 290€',features:['Gestion complète du dossier','Plan de signalisation','Affichage riverains','Suivi prioritaire'],featured:true},{name:'Premium',price:'sur devis',features:['Coordination multi-intervenants','Présence terrain jour J','Optimisation coûts/risques','Reporting & photos']}],
  services:[{title:'Particuliers & conciergeries',desc:'Déménagement, stationnement ponctuel, monte-meuble.'},{title:'BTP & concessionnaires',desc:'Chantiers, palissades, voirie.'},{title:'Événementiel',desc:'Inaugurations, privatisations, affichage.'}],
  pages:[{title:'CGV',slug:'cgv',showInNav:true,content:'<h2>Conditions Générales de Vente</h2><p>Ajoutez vos CGV ici.</p>'}], options:{showWhatsappBubble:true}, i18n_overrides:{fr:{},en:{},it:{}}};
  const [data,setData]=useState(()=>{try{return {...defaults, ...(JSON.parse(localStorage.getItem(ADMIN_KEY)||'{}'))};}catch{return defaults;}});
  const save=()=>{localStorage.setItem(ADMIN_KEY,JSON.stringify(data)); alert('Enregistré ✔');};
  const setPath=(path,val)=>{ const parts=path.split('.'); setData(prev=>{const c=structuredClone(prev); let o=c; for(let i=0;i<parts.length-1;i++) o=o[parts[i]]; o[parts.at(-1)]=val; return c; }); };
  return (<div className="container admin" style={{padding:'24px 0'}}>
    <h1 style={{fontSize:26,marginBottom:6}}>Admin — LTS Consulting Monaco</h1>
    <div className="tabs">{['branding','contact','offers','services','pages','texts','options'].map(k=>(<button key={k} onClick={()=>setPath('_tab',k)} className={(data._tab||'branding')===k?'active':''}>{k}</button>))}
      <button onClick={save} style={{marginLeft:6}} className="btn btn-gold">💾 Enregistrer</button><a href="#/" className="btn" style={{marginLeft:8}}>👀 Voir le site</a></div>
    {(data._tab||'branding')==='branding' && (<div className="card" style={{padding:16}}>
      <div>Logo :</div><input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>setPath('branding.logoDataUrl', r.result); r.readAsDataURL(f);}} />
      {data.branding.logoDataUrl && <img src={data.branding.logoDataUrl} style={{height:40,marginTop:10,borderRadius:8}}/>}
    </div>)}
    {(data._tab||'branding')==='contact' && (<div className="card" style={{padding:16,display:'grid',gap:10}}>
      <input className="input" value={data.contact.email} onChange={e=>setPath('contact.email', e.target.value)} placeholder="Email"/>
      <input className="input" value={data.contact.phoneHref} onChange={e=>setPath('contact.phoneHref', e.target.value)} placeholder="tel:+33761319163"/>
      <input className="input" value={data.contact.whatsappHref} onChange={e=>setPath('contact.whatsappHref', e.target.value)} placeholder="https://api.whatsapp.com/send?phone=33761319163"/>
    </div>)}
    {(data._tab||'branding')==='offers' && (<div className="grid cards">
      {data.offers.map((o,idx)=>(<div className="card" key={idx}>
        <input className="input" value={o.name} onChange={e=>{const a=[...data.offers]; a[idx]={...o,name:e.target.value}; setData({...data,offers:a});}} placeholder="Nom"/>
        <input className="input" value={o.price} onChange={e=>{const a=[...data.offers]; a[idx]={...o,price:e.target.value}; setData({...data,offers:a});}} placeholder="Prix"/>
        <label style={{display:'inline-flex',alignItems:'center',gap:8,margin:'8px 0'}}>
          <input type="checkbox" checked={!!o.featured} onChange={e=>{const a=[...data.offers]; a[idx]={...o,featured:e.target.checked}; setData({...data,offers:a});}}/> Populaire
        </label>
        <textarea className="input code" value={(o.features||[]).join('\n')} onChange={e=>{const a=[...data.offers]; a[idx]={...o,features:e.target.value.split('\n').filter(Boolean)}; setData({...data,offers:a});}}/>
      </div>))}
    </div>)}
    {(data._tab||'branding')==='services' && (<div className="grid cards">
      {data.services.map((s,idx)=>(<div className="card" key={idx}>
        <input className="input" value={s.title} onChange={e=>{const a=[...data.services]; a[idx]={...s,title:e.target.value}; setData({...data,services:a});}} placeholder="Titre"/>
        <input className="input" value={s.desc} onChange={e=>{const a=[...data.services]; a[idx]={...s,desc:e.target.value}; setData({...data,services:a});}} placeholder="Description"/>
      </div>))}
    </div>)}
    {(data._tab||'branding')==='pages' && (<div className="grid cards">
      {data.pages.map((p,idx)=>(<div className="card" key={idx}>
        <div style={{display:'grid',gap:8,gridTemplateColumns:'1fr 1fr'}}>
          <input className="input" value={p.title} onChange={e=>{const a=[...data.pages]; a[idx]={...p,title:e.target.value}; setData({...data,pages:a});}} placeholder="Titre"/>
          <input className="input" value={p.slug} onChange={e=>{const a=[...data.pages]; a[idx]={...p,slug:e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'-')}; setData({...data,pages:a});}} placeholder="Slug"/>
        </div>
        <label style={{display:'inline-flex',alignItems:'center',gap:8,margin:'8px 0'}}>
          <input type="checkbox" checked={!!p.showInNav} onChange={e=>{const a=[...data.pages]; a[idx]={...p,showInNav:e.target.checked}; setData({...data,pages:a});}}/> Afficher dans le menu
        </label>
        <textarea className="input code" value={p.content||''} onChange={e=>{const a=[...data.pages]; a[idx]={...p,content:e.target.value}; setData({...data,pages:a});}} placeholder="<h2>Titre</h2><p>Contenu HTML…</p>"/>
      </div>))}
    </div>)}
    {(data._tab||'branding')==='texts' && (<div className="card" style={{padding:16}}>
      <div>Overrides i18n (FR) en JSON :</div>
      <textarea className="input code" value={JSON.stringify(data.i18n_overrides?.fr||{},null,2)} onChange={e=>{try{const o=JSON.parse(e.target.value||'{}'); setPath('i18n_overrides.fr', o);}catch{}}} />
    </div>)}
    {(data._tab||'branding')==='options' && (<div className="card" style={{padding:16}}>
      <label style={{display:'inline-flex',alignItems:'center',gap:8}}><input type="checkbox" checked={data.options.showWhatsappBubble!==false} onChange={e=>setPath('options.showWhatsappBubble', e.target.checked)} /> Afficher la bulle WhatsApp</label>
    </div>)}
  </div>);
}
function PageView({page}){ if(!page) return (<div className="container section"><h2 className="text-gold">Page introuvable</h2></div>);
  const safe=(page.content||'').replace(/<\/?script[^>]*>/gi,''); return (<div className="container section"><h1 className="text-gold" style={{fontSize:28,marginBottom:12}}>{page.title}</h1><div dangerouslySetInnerHTML={{__html:safe}}/></div>); }
export default function App(){
  const { user } = useAuth();
  const [hash,setHash]=useState(window.location.hash||'#/'); const [lang,setLang]=useState(localStorage.getItem(LANG_KEY)||'fr'); const [t,setT]=useState({});
  const [email,setEmail]=useState(''); const [brief,setBrief]=useState('');
  useEffect(()=>{ const onHash=()=>setHash(window.location.hash||'#/'); window.addEventListener('hashchange',onHash); return ()=>window.removeEventListener('hashchange',onHash); },[]);
  useEffect(()=>{ localStorage.setItem(LANG_KEY,lang); loadLang(lang).then(base=>{ const overrides=((JSON.parse(localStorage.getItem(ADMIN_KEY)||'{}')).i18n_overrides||{})[lang]||{}; setT({...base,...overrides}); }); },[lang]);
  if(!t.companyName) return (<div className="loader">Chargement…</div>);
  const admin=JSON.parse(localStorage.getItem(ADMIN_KEY)||'{}'); const logoUrl=admin.branding?.logoDataUrl||'/logo.png'; const pages=admin.pages||[];
  const contact=useMemo(()=>{ const c=admin.contact||{}; return {email:c.email||'contact@lts-consulting.mc', phoneHref:c.phoneHref||'tel:+33761319163', whatsappHref:c.whatsappHref||'https://api.whatsapp.com/send?phone=33761319163'}; },[admin]);
  const services=admin.services||[{title:'Particuliers & conciergeries',desc:'Déménagement, stationnement ponctuel, monte-meuble.'},{title:'BTP & concessionnaires',desc:'Chantiers, palissades, voirie.'},{title:'Événementiel',desc:'Inaugurations, privatisations, affichage.'}];
  const offers=admin.offers||[{name:'Essentiel',price:'à partir de 120€',features:['Évaluation du besoin','Dépôt de demande OVP','Suivi standard']},{name:'Pro',price:'à partir de 290€',features:['Gestion complète du dossier','Plan de signalisation','Affichage riverains','Suivi prioritaire'],featured:true},{name:'Premium',price:'sur devis',features:['Coordination multi-intervenants','Présence terrain jour J','Optimisation coûts/risques','Reporting & photos']}];
  if (hash.startsWith('#/admin')) return <Admin/>; if (hash.startsWith('#/auth')) return <AuthPage/>; if (hash.startsWith('#/account')) return <Account/>; if (hash.startsWith('#/subscribe')) return <Subscribe/>;
  if (hash.startsWith('#/p/')){ const slug=decodeURIComponent(hash.replace('#/p/','')); const page=pages.find(p=>p.slug===slug);
    return (<><Header t={t} lang={lang} setLang={setLang} logoUrl={logoUrl} pages={pages} user={user}/><PageView page={page}/>
      <a href="#contact" className="cta-fixed">Demande de devis</a>{(admin.options?.showWhatsappBubble!==false)&&(<a className="whatsapp" href={contact.whatsappHref} target="_blank" rel="noreferrer"><span style={{color:'var(--gold)',fontWeight:600}}>WhatsApp</span></a>)}
      <Footer t={t} contact={contact} logoUrl={logoUrl} pages={pages}/></>); }
  return (<>
    <Header t={t} lang={lang} setLang={setLang} logoUrl={logoUrl} pages={pages} user={user}/>
    <section className="hero"><div className="container">
      <div style={{display:'inline-flex',alignItems:'center',gap:8,border:'1px solid rgba(255,255,255,.1)',padding:'6px 10px',borderRadius:'999px',fontSize:12,opacity:.85,marginBottom:12}}>
        <span style={{display:'inline-block',width:8,height:8,borderRadius:'999px',background:'var(--gold)'}}></span> Expert OVP : stationnement, chantiers & événements
      </div>
      <h1 className="h1">Gagnez du temps et sécurisez vos <span className="text-gold">occupations de voie publique</span></h1>
      <p style={{opacity:.85,maxWidth:680}}>Nous gérons pour vous les demandes, autorisations, signalisation réglementaire et relations avec les services concernés.</p>
      <div style={{marginTop:16,display:'flex',gap:10,flexWrap:'wrap'}}>
        <a href="#offres" className="btn btn-gold">Voir les offres</a><a href="#contact" className="btn btn-outline">Parler à un expert</a>
      </div></div></section>
    <section id="services" className="section"><div className="container">
      <h2 style={{fontSize:28,margin:'0 0 10px 0'}}>Nos services</h2>
      <div className="grid cards">{services.map(s=>(<div className="card" key={s.title}><div style={{color:'var(--gold)',fontWeight:600}}>{s.title}</div><div style={{opacity:.85,marginTop:6}}>{s.desc}</div></div>))}</div>
    </div></section>
    <section id="offres" className="section"><div className="container">
      <h2 style={{fontSize:28,margin:'0 0 8px 0'}}>Offres claires, résultats concrets</h2><div style={{opacity:.75,marginBottom:12}}>Trois niveaux selon votre besoin. Facturation transparente.</div>
      <div className="grid cards">{offers.map(o=>(<div className="card" key={o.name}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{fontWeight:600}}>{o.name}</div>{o.featured && <span style={{fontSize:12,border:'1px solid rgba(198,162,74,.5)',borderRadius:10,padding:'3px 8px',color:'var(--gold)'}}>Populaire</span>}</div>
       <div style={{ marginTop: 6, color: "var(--gold)", fontWeight: 600 }}>
  {o.price}
</div>
        <ul style={{ opacity: 0.85, margin: "8px 0 18px" }}>{(o.features||[]).map(f=><li key={f}>{f}</li>)}</ul>
        <a href="#contact" className="btn btn-gold" style={{marginTop:10}}>Choisir</a>
      </div>))}</div>
    </div></section>
    <section id="contact" className="section"><div className="container">
      <div className="card"><div className="grid" style={{gridTemplateColumns:'1fr 1fr',gap:16}}>
        <div><div style={{fontSize:22,fontWeight:600}}>Parlez-nous de votre besoin</div><div style={{opacity:.85,marginTop:6}}>Réponse sous 24h ouvrées. Devis gratuit.</div></div>
        <form className="grid" style={{gap:10}}><input className="input" placeholder="vous@exemple.com" value={email} onChange={e=>setEmail(e.target.value)} />
          <textarea className="input" placeholder="Déménagement, chantier, terrasse, événement…" value={brief} onChange={e=>setBrief(e.target.value)}></textarea>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}><button type="button" className="btn btn-gold">Envoyer ▶</button>
            <Assistant setBrief={setBrief} t={t}/>
          </div>
        </form>
      </div></div>
    </div></section>
    <a href="#contact" className="cta-fixed">Demande de devis</a>
    <a className="whatsapp" href={contact.whatsappHref} target="_blank" rel="noreferrer"><span style={{color:'var(--gold)',fontWeight:600}}>WhatsApp</span></a>
    <Footer t={t} contact={contact} logoUrl={logoUrl} pages={pages}/>
  </>);
}
