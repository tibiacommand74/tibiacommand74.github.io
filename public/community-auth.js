'use strict';
(()=>{
 const API='https://tibia-command-74.calmstronglife.chatgpt.site';
 let client=null,initializing=null,recovery=false;
 const callback=new URLSearchParams(location.hash.slice(1));
 const hasCallback=callback.has('access_token')||callback.has('error_description');
 const errorText=error=>/invalid.login.credentials/i.test(error?.message||'')?'E-mail ou senha incorretos.':/email.not.confirmed/i.test(error?.message||'')?'Confirme seu e-mail antes de entrar.':/rate.limit|too.many/i.test(error?.message||'')?'Muitas tentativas. Aguarde alguns minutos.':error?.message||'Não foi possível concluir. Tente novamente.';
 const ready=()=>initializing||(initializing=(async()=>{const response=await fetch(API+'/api/market/auth-config');const config=await response.json();if(!response.ok||!config.configured)return {configured:false};await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=API+'/vendor/supabase-2.117.3.js';script.onload=resolve;script.onerror=()=>reject(Error('Não foi possível carregar o acesso da comunidade.'));document.head.append(script);});client=window.supabase.createClient(config.url,config.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'tibia-command-community-auth'}});client.auth.onAuthStateChange(event=>{if(event==='PASSWORD_RECOVERY')recovery=true;});await client.auth.initialize();if(hasCallback){history.replaceState(null,'',location.pathname+location.search+'#classificados');window.dispatchEvent(new Event('hashchange'));}return{configured:true};})().catch(()=>({configured:false})));
 async function requireClient(){if(!(await ready()).configured)throw Error('O cadastro da comunidade ainda está sendo ativado. Tente novamente em breve.');return client;}
 async function token(){await ready();if(!client)return null;const {data,error}=await client.auth.getSession();if(error)throw Error(errorText(error));return data.session?.access_token||null;}
 const redirectTo=()=>location.origin===API?API+'/classificados.html':'https://tibiacommand74.github.io/#classificados';
 window.CommunityAuth={ready,token,isRecovery:()=>recovery,
  async feedbackUser(){const c=await requireClient();const {data,error}=await c.auth.getUser();if(error)return null;return data.user?{alias:data.user.user_metadata?.communityProfile?.alias||''}:null;},
  async feedbackList(category='',page=0){const c=await requireClient();let q=c.from('community_feedback').select('id,alias,category,rating,message,created_at',{count:'exact'}).order('created_at',{ascending:false}).range(page*20,page*20+19);if(category)q=q.eq('category',category);const {data,count,error}=await q;if(error)throw Error('Não foi possível carregar os comentários. Tente novamente.');return {rows:data||[],total:count||0};},
  async feedbackSend(entry){const c=await requireClient();const {error}=await c.from('community_feedback').insert(entry);if(error)throw Error(/Aguarde|limite/.test(error.message)?error.message:'Não foi possível publicar. Confira sua conta e tente novamente.');},
  async signIn(email,password){const c=await requireClient();const {error}=await c.auth.signInWithPassword({email,password});if(error)throw Error(errorText(error));},
  async signUp(email,password,profile){const c=await requireClient();const {data,error}=await c.auth.signUp({email,password,options:{emailRedirectTo:redirectTo(),data:{communityProfile:profile}}});if(error)throw Error(errorText(error));return {signedIn:!!data.session};},
  async recover(email){const c=await requireClient();const {error}=await c.auth.resetPasswordForEmail(email,{redirectTo:redirectTo()});if(error)throw Error(errorText(error));},
  async changePassword(password){const c=await requireClient();const {error}=await c.auth.updateUser({password});if(error)throw Error(errorText(error));recovery=false;},
  async signOut(){const c=await requireClient();const {error}=await c.auth.signOut();if(error)throw Error(errorText(error));}
 };
 if(hasCallback)ready();
})();
