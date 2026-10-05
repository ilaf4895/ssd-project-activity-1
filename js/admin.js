document.addEventListener("DOMContentLoaded",()=>{
  if(!requireAdmin())return;
  renderAdmin();
  document.getElementById("routeForm").addEventListener("submit",createRoute);
  document.getElementById("busForm").addEventListener("submit",createBus);
  document.getElementById("assignForm").addEventListener("submit",assignRoute);
  document.getElementById("adminLogout").addEventListener("click",()=>{clearSession();location.href="index.html"});
});
function renderAdmin(){
  const d=getData();
  document.getElementById("routeCount").textContent=d.routes.length;
  document.getElementById("busCount").textContent=d.buses.length;
  document.getElementById("assignmentCount").textContent=d.buses.filter(b=>b.routeId).length;
  document.getElementById("assignBus").innerHTML=d.buses.map(b=>`<option value="${b.id}">${esc(b.name)}</option>`).join("")||"<option>No buses</option>";
  document.getElementById("assignRoute").innerHTML=d.routes.map(r=>`<option value="${r.id}">${esc(r.name)}</option>`).join("")||"<option>No routes</option>";
  document.getElementById("routesList").innerHTML=d.routes.map(r=>`<div class="record"><strong>${esc(r.name)} <span class="role-badge">${esc(r.code)}</span></strong><small>${r.stops.map(esc).join(" · ")}</small></div>`).join("")||'<div class="empty">No routes created.</div>';
  document.getElementById("busesList").innerHTML=d.buses.map(b=>`<div class="record"><strong>${esc(b.name)}</strong><small>Capacity: ${b.capacity} · Route: ${esc(routeName(d,b.routeId))}</small></div>`).join("")||'<div class="empty">No buses created.</div>';
}
function routeName(d,id){const r=d.routes.find(x=>x.id===id);return r?r.name:"Unassigned"}
function createRoute(e){
  e.preventDefault();const d=getData(),name=document.getElementById("routeName").value.trim(),code=document.getElementById("routeCode").value.trim(),stops=document.getElementById("routeStops").value.split(",").map(x=>x.trim()).filter(Boolean);
  if(!stops.length)return;
  d.routes.push({id:uid("route"),name,code,stops});saveData(d);e.target.reset();renderAdmin();adminToast("Route created.");
}
function createBus(e){
  e.preventDefault();const d=getData(),name=document.getElementById("busName").value.trim(),capacity=Number(document.getElementById("busCapacity").value);
  d.buses.push({id:uid("bus"),name,capacity,routeId:null});saveData(d);e.target.reset();document.getElementById("busCapacity").value=40;renderAdmin();adminToast("Bus created.");
}
function assignRoute(e){
  e.preventDefault();const d=getData(),bus=d.buses.find(b=>b.id===document.getElementById("assignBus").value),route=document.getElementById("assignRoute").value;
  if(!bus)return;bus.routeId=route;saveData(d);renderAdmin();adminToast("Route assigned to "+bus.name+".");
}
function adminToast(msg){let t=document.getElementById("toast");if(!t){t=document.createElement("div");t.id="toast";Object.assign(t.style,{position:"fixed",right:"20px",bottom:"20px",background:"#0b1324",color:"#fff",padding:"12px 16px",borderRadius:"9px",zIndex:99,fontSize:"13px"});document.body.appendChild(t)}t.textContent=msg;t.style.display="block";clearTimeout(window._adminToast);window._adminToast=setTimeout(()=>t.style.display="none",2400)}
