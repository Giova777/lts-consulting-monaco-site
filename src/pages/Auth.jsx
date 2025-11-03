import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
export default function AuthPage(){
  const { user } = useAuth();
  const [mode,setMode]=useState('login'); const [email,setEmail]=useState(''); const [pass,setPass]=useState(''); const [role,setRole]=useState('GP'); const [msg,setMsg]=useState('');
  if(user) return <div className="container section"><h2>Vous êtes connecté.</h2><a className="btn btn-gold" href="#/account">Aller à mon compte</a></div>;
  async function onSubmit(e){ e.preventDefault(); setMsg('');
    try{ if(mode==='signup'){ const {data,error}=await supabase.auth.signUp({email,password:pass}); if(error) throw error;
      if(data.user){ await supabase.from('profiles').upsert({id:data.user.id,role}); } setMsg('Compte créé. Vérifie tes emails si besoin.');
    } else { const {error}=await supabase.auth.signInWithPassword({email,password:pass}); if(error) throw error; window.location.hash='#/account'; } }
    catch(err){ setMsg(err.message); } }
  return (<div className="container section" style={{maxWidth:480}}>
    <h1 style={{fontSize:28,marginBottom:8}}>{mode==='signup'?'Créer un compte':'Se connecter'}</h1>
    <form onSubmit={onSubmit} className="grid" style={{gap:10}}>
      <input className="input" type="email" placeholder="vous@exemple.com" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input className="input" type="password" placeholder="Mot de passe" value={pass} onChange={e=>setPass(e.target.value)} required />
      {mode==='signup' && <div style={{display:'flex',gap:12}}>
        <label><input type="radio" name="role" value="GP" checked={role==='GP'} onChange={()=>setRole('GP')} /> Grand Public</label>
        <label><input type="radio" name="role" value="PRO" checked={role==='PRO'} onChange={()=>setRole('PRO')} /> Professionnel</label>
      </div>}
      <button className="btn btn-gold" type="submit">{mode==='signup'?'Créer le compte':'Connexion'}</button>
    </form>
    <div style={{marginTop:10}}>
      {mode==='signup'?<button className="btn" onClick={()=>setMode('login')}>Déjà un compte ? Se connecter</button>:<button className="btn" onClick={()=>setMode('signup')}>Créer un compte</button>}
    </div>
    {msg && <p style={{marginTop:10,color:'#C6A24A'}}>{msg}</p>}
  </div>);
}
