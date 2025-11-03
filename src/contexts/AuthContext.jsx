import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
const Ctx = createContext(null); export const useAuth = () => useContext(Ctx);
export default function AuthProvider({children}){
  const [user,setUser]=useState(null),[profile,setProfile]=useState(null),[loading,setLoading]=useState(true);
  useEffect(()=>{ (async()=>{ const {data:{session}}=await supabase.auth.getSession(); setUser(session?.user||null); if(session?.user) await load(session.user.id); setLoading(false); })();
    const {data:sub}=supabase.auth.onAuthStateChange(async(_e,session)=>{ setUser(session?.user||null); if(session?.user) await load(session.user.id); else setProfile(null); });
    return ()=>sub.subscription.unsubscribe();
  },[]);
  async function load(uid){ const {data}=await supabase.from('profiles').select('role,is_active').eq('id',uid).single(); setProfile(data||null); }
  return <Ctx.Provider value={{user,profile,loading}}>{children}</Ctx.Provider>;
}
