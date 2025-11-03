import React from 'react';
import { useAuth } from '../contexts/AuthContext';
const STRIPE_LINK_GP='https://buy.stripe.com/test_gp_placeholder';
const STRIPE_LINK_PRO='https://buy.stripe.com/test_pro_placeholder';
export default function Subscribe(){
  const { user, loading } = useAuth();
  if(loading) return <div className="loader">Chargement…</div>;
  if(!user){ window.location.hash='#/auth'; return null; }
  return (<div className="container section">
    <h1 style={{fontSize:28}}>Choisir un pack</h1><p style={{opacity:.8}}>Paiement sécurisé via Stripe.</p>
    <div className="grid cards" style={{marginTop:16}}>
      <div className="card"><div style={{fontWeight:600,fontSize:18,color:'var(--gold)'}}>Pack Grand Public</div>
        <ul style={{margin:'8px 0 0 18px',opacity:.85}}><li>Accompagnement OVP simple</li><li>Affichage riverains</li><li>Suivi standard</li></ul>
        <a className="btn btn-gold" style={{marginTop:10}} href={STRIPE_LINK_GP} target="_blank" rel="noreferrer">Souscrire GP</a></div>
      <div className="card"><div style={{fontWeight:600,fontSize:18,color:'var(--gold)'}}>Pack Professionnel</div>
        <ul style={{margin:'8px 0 0 18px',opacity:.85}}><li>Gestion complète dossier</li><li>Optimisation coûts/délais</li><li>Support prioritaire</li></ul>
        <a className="btn btn-gold" style={{marginTop:10}} href={STRIPE_LINK_PRO} target="_blank" rel="noreferrer">Souscrire PRO</a></div>
    </div></div>);
}
