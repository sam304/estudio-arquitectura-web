"use strict";
const toggle=document.querySelector(".menu-toggle");
const navigation=document.querySelector("#navigation");
if(toggle && navigation){
document.documentElement.classList.add("js");
toggle.hidden=false;
const close=()=>{toggle.setAttribute("aria-expanded","false");navigation.classList.remove("open");};
toggle.addEventListener("click",()=>{const open=toggle.getAttribute("aria-expanded")!=="true";toggle.setAttribute("aria-expanded",String(open));navigation.classList.toggle("open",open);});
document.addEventListener("keydown",event=>{if(event.key==="Escape" && toggle.getAttribute("aria-expanded")==="true"){close();toggle.focus();}});
navigation.addEventListener("click",event=>{if(event.target.closest("a"))close();});
}
// Legacy preview forms remain inactive until their separate integration is ready.
document.querySelectorAll("form:not([data-inquiry])").forEach(form=>form.addEventListener("submit",event=>event.preventDefault()));

// Activation requires a real, same-origin endpoint and the deployment steps in
// INTEGRATION.md. Empty endpoints deliberately leave the preview disabled.
document.querySelectorAll("form[data-inquiry]").forEach(form=>{
 const en=document.documentElement.lang==="en";
 const fieldset=form.querySelector("fieldset");
 const status=form.querySelector('[role="status"]');
 const button=form.querySelector('button[type="submit"]');
 const download=form.querySelector(".resource-download");
 const resource=form.dataset.inquiry==="resource";
 const endpoint=form.dataset.endpoint.trim();
 let target=null;
 if(endpoint && (!resource || form.dataset.available==="true")){
  try{const url=new URL(endpoint,document.baseURI);if(url.origin===location.origin && /^https?:$/.test(url.protocol))target=url;}catch{}
 }
 if(target){
  fieldset.disabled=false;
  status.textContent=resource?(en?"Complete your details to access this document.":"Complete sus datos para acceder a este documento."):(en?"Tell us briefly how we can help.":"Cuéntenos brevemente cómo podemos ayudarle.");
 }
 let pending=false;
 form.addEventListener("submit",async event=>{
  event.preventDefault();
  if(!target || pending || !form.reportValidity())return;
  pending=true;
  const payload=Object.fromEntries(new FormData(form));
  payload.kind=form.dataset.inquiry;
  payload.language=document.documentElement.lang;
  if(resource)payload.resource=form.dataset.resource;
  else payload.service=form.dataset.service;
  button.disabled=true;
  form.setAttribute("aria-busy","true");
  if(download){download.hidden=true;download.removeAttribute("href");}
  status.textContent=en?"Sending…":"Enviando…";
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),15000);
  try{
   const response=await fetch(target.href,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},credentials:"same-origin",body:JSON.stringify(payload),signal:controller.signal});
   if(!response.ok)throw new Error("Delivery failed");
   const result=await response.json();
   if(result.ok!==true)throw new Error("Delivery unconfirmed");
   if(resource){
    if(typeof result.downloadUrl!=="string" || !result.downloadUrl)throw new Error("Missing document");
    const url=new URL(result.downloadUrl,document.baseURI);
    if(url.origin!==location.origin || !/^https?:$/.test(url.protocol))throw new Error("Invalid document URL");
    download.href=url.href;
    download.hidden=false;
    status.textContent=en?"Your document is ready. Use the download link below.":"Su documento está listo. Utilice el enlace de descarga que aparece debajo.";
   }else{
    status.textContent=en?"Your enquiry has been received.":"Su consulta ha sido recibida.";
    fieldset.disabled=true;
   }
  }catch{
   status.textContent=en?"Delivery could not be confirmed. Your details remain in this form so you can try again.":"No se pudo confirmar el envío. Sus datos permanecen en este formulario para que pueda reintentarlo.";
  }finally{
   clearTimeout(timer);
   pending=false;
   button.disabled=false;
   form.removeAttribute("aria-busy");
  }
 });
});
