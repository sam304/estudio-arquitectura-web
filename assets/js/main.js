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
document.querySelectorAll("form").forEach(form=>form.addEventListener("submit",event=>event.preventDefault()));
