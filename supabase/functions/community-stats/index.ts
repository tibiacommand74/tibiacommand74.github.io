// Anonymous callers get only aggregate totals. Presence writes validate the user JWT.
const allowed=new Set(['https://tibiacommand74.com','https://www.tibiacommand74.com','https://tibiacommand74.github.io','https://tibia-command-74.calmstronglife.chatgpt.site']);
Deno.serve(async request=>{
 const origin=request.headers.get('origin');
 const headers={'content-type':'application/json','cache-control':'no-store','vary':'Origin',...(origin&&allowed.has(origin)?{'access-control-allow-origin':origin,'access-control-allow-methods':'GET, POST, OPTIONS','access-control-allow-headers':'authorization, content-type, apikey'}:{})};
 const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
 if(origin&&!allowed.has(origin))return reply({error:'Origem inválida.'},403);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(!['GET','POST'].includes(request.method))return reply({error:'Método inválido.'},405);
 const url=Deno.env.get('SUPABASE_URL'),key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
 try{
  if(!url||!key)throw Error('Configuration');
  if(request.method==='POST'){
   const authorization=request.headers.get('authorization');
   if(!authorization||!/^Bearer [A-Za-z0-9._-]+$/.test(authorization)||authorization.length>12000)return reply({error:'Entre na sua conta.'},401);
   const userResponse=await fetch(url+'/auth/v1/user',{headers:{apikey:key,authorization},signal:AbortSignal.timeout(10000)});
   if(!userResponse.ok)return reply({error:'Entre novamente na sua conta.'},401);
   const user=await userResponse.json();
   if(!user.id||!user.email_confirmed_at||user.is_anonymous)return reply({error:'Confirme sua conta.'},401);
   const pulse=await fetch(url+'/rest/v1/rpc/community_presence_touch',{method:'POST',headers:{apikey:key,authorization,'content-type':'application/json'},body:'{}',signal:AbortSignal.timeout(10000)});
   if(!pulse.ok)throw Error('Presence');
   return reply({ok:true});
  }
  const response=await fetch(url+'/rest/v1/rpc/community_member_totals',{method:'POST',headers:{apikey:key,authorization:'Bearer '+key,'content-type':'application/json'},body:'{}',signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw Error('Totals');
  const data=await response.json();
  if(!Number.isSafeInteger(data.registered)||!Number.isSafeInteger(data.online))throw Error('Invalid totals');
  return reply({registered:data.registered,online:data.online});
 }catch{return reply({error:'Contador temporariamente indisponível.'},503);}
});
