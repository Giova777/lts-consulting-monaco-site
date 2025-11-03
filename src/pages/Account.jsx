import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
export default function Account(){
  const { user, profile, loading } = useAuth();
  if(loading) return <div className="loader">Chargement…</div>;
  if(!user){ window.location.hash='#/auth'; return null; }
  async function logout(){ await supabase.auth.signOut(); window.location.hash='#/'; }
  return (<div className="container section">
    <h1 style={{fontSize:28}}>Mon compte</h1>
    <p style={{opacity:.8}}>Email : {user.email}</p>
    <p>Type de compte : <strong>{profile?.role||'—'}</strong></p>
    <p>Statut : <strong>{profile?.is_active?'Actif':'Inactif'}</strong></p>
    <div style={{display:'flex',gap:10,marginTop:14}}>
      <a className="btn btn-gold" href="#/subscribe">Souscrire à un pack</a>
      <button className="btn" onClick={logout}>Se déconnecter</button>
    </div>
  </div>);
}
