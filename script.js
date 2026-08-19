const loader=document.querySelector(".loader");
window.addEventListener("load",()=>setTimeout(()=>loader.classList.add("hide"),700));

const nav=document.getElementById("nav"), toggle=document.getElementById("menuToggle");
toggle.addEventListener("click",()=>nav.classList.toggle("open"));
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

const reveals=document.querySelectorAll(".reveal");
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}})
},{threshold:.12});
reveals.forEach(el=>observer.observe(el));

const dot=document.getElementById("cursorDot"), ring=document.getElementById("cursorRing");
if(dot&&ring && matchMedia("(pointer:fine)").matches){
  window.addEventListener("mousemove",e=>{
    dot.style.left=e.clientX+"px";dot.style.top=e.clientY+"px";
    ring.style.left=e.clientX+"px";ring.style.top=e.clientY+"px";
  });
  document.querySelectorAll("a,button,.service-card,.gallery-item").forEach(el=>{
    el.addEventListener("mouseenter",()=>ring.classList.add("active"));
    el.addEventListener("mouseleave",()=>ring.classList.remove("active"));
  });
}

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",e=>{
    const target=document.querySelector(a.getAttribute("href"));
    if(target){e.preventDefault();target.scrollIntoView({behavior:"smooth"})}
  });
});