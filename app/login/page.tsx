"use client";
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
export default function LoginPage(){const[message,setMessage]=useState('');async function login(fd:FormData){const email=String(fd.get('email')||'');const supabase=createSupabaseBrowserClient();const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:location.origin+'/admin'}});setMessage(error?error.message:'Check your email for the login link.')}return <section className="mx-auto max-w-md px-4 py-12"><form action={login} className="card space-y-4 p-6"><h1 className="text-3xl font-black">Admin login</h1><input className="input" name="email" type="email" placeholder="admin@example.com"/><button className="btn-primary">Send magic link</button>{message&&<p className="text-sm text-slate-600">{message}</p>}</form></section>}

