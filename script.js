// Sample order data (stands in for a real database in this class project)
const ORDERS = {
  SEL1025:{customer:"Riya Patel",status:"In Transit",step:3,location:"Near Genda Circle, Vadodara",eta:"Today, 4:30 pm",partner:"Imran Shaikh",phone:"+91 98250 11001"},
  SEL1031:{customer:"Harsh Mehta",status:"Delivered",step:5,location:"Delivered at Gotri",eta:"Delivered today, 11:10 am",partner:"Kiran Solanki",phone:"+91 98250 11002"},
  SEL1042:{customer:"Neha Shah",status:"Delayed",step:3,location:"Makarpura hub (traffic hold-up)",eta:"Today, 6:15 pm (revised)",partner:"Vijay Rathod",phone:"+91 98250 11003"},
  SEL1017:{customer:"Amit Desai",status:"Picked Up",step:2,location:"Leaving Alkapuri pickup point",eta:"Today, 5:00 pm",partner:"Mehul Parmar",phone:"+91 98250 11004"}
};
const STEPS = ["Order placed","Picked up","At hub","Out for delivery","Delivered"];
const $ = s => document.querySelector(s);
const esc = t => String(t).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

// Menu
const menu = $("#menu"), mbtn = $("#menuBtn");
mbtn.addEventListener("click", () => { const o = menu.classList.toggle("open"); mbtn.setAttribute("aria-expanded", o); });
menu.addEventListener("click", e => { if (e.target.tagName === "A") { menu.classList.remove("open"); mbtn.setAttribute("aria-expanded", false); } });

// Highlight current section in nav
const links = [...menu.querySelectorAll("a")];
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
}), {rootMargin:"-45% 0px -50% 0px"});
document.querySelectorAll("main section").forEach(s => io.observe(s));

// Dashboard weekly chart
const WEEK = [["Mon",168,9],["Tue",175,7],["Wed",160,10],["Thu",182,6],["Fri",190,8],["Sat",205,10],["Sun",0,0]];
WEEK.pop(); WEEK.push(["Sun",0,0]);
const max = 215;
$("#bars").innerHTML = WEEK.map(([d,a,b]) => `<div class="bar"><span>${a||""}</span><div class="stack"><div class="dly" style="height:${b/max*100}%" title="${b} delayed"></div><div class="del" style="height:${a/max*100}%" title="${a} delivered"></div></div><span>${d}</span></div>`).join("");

// Track order (the business feature)
function track(id){
  const out = $("#result"), key = id.trim().toUpperCase(), o = ORDERS[key];
  if (!key) { out.innerHTML = `<div class="card err">Enter an Order ID to track your parcel.</div>`; return; }
  if (!o) { out.innerHTML = `<div class="card err">No order found for "${esc(key)}". Check the ID and try again, for example SEL1025.</div>`; return; }
  const cls = o.status === "Delivered" ? "ok" : o.status === "Delayed" ? "late" : "";
  out.innerHTML = `<div class="card"><div class="status-line"><h3 style="margin:0">Order ${key}</h3><span class="pill ${cls}">${o.status}</span></div>
  <ol class="steps">${STEPS.map((s,i)=>`<li class="${i<o.step?"done":""}">${s}</li>`).join("")}</ol>
  <div class="facts"><div><span>Customer</span>${esc(o.customer)}</div><div><span>Current location</span>${esc(o.location)}</div><div><span>Expected delivery</span>${esc(o.eta)}</div>
  <div><span>Delivery partner</span>${esc(o.partner)}</div><div><span>Contact partner</span><a href="tel:${o.phone.replace(/\s/g,"")}">${o.phone}</a></div></div></div>`;
}
$("#trackForm").addEventListener("submit", e => { e.preventDefault(); track($("#orderId").value); });
document.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => { $("#orderId").value = c.dataset.id; track(c.dataset.id); }));

// "Book this" links preselect the service in the enquiry form
document.querySelectorAll("[data-service]").forEach(a => a.addEventListener("click", () => { $("#serviceSelect").value = a.dataset.service; }));

// Enquiry form
$("#enquiryForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target, msg = $("#formMsg");
  if (!f.name.value.trim() || !f.contact.value.trim()) { msg.className = "form-msg bad"; msg.textContent = "Please enter your name and a phone number or email."; return; }
  msg.className = "form-msg ok";
  msg.textContent = `Thank you, ${f.name.value.trim()}. We have received your ${f.service.value} enquiry and will contact you within 2 hours.`;
  f.reset();
});
