document.addEventListener("DOMContentLoaded",()=>{
  const user=requireStudent(); if(!user)return;
  renderStudent(user);
  document.getElementById("busSelect").addEventListener("change",()=>populateStops(user));
  document.getElementById("saveJourney").addEventListener("click",saveJourney);
  document.getElementById("refreshData").addEventListener("click",()=>{renderStudent(requireStudent());toast("Transport data refreshed.")});
  document.getElementById("bookingBtn").addEventListener("click",reserveSeat);
  document.getElementById("cancelBookingBtn").addEventListener("click",cancelBooking);
  document.getElementById("attendanceBtn").addEventListener("click",markAttendance);
  document.getElementById("logoutBtn").addEventListener("click",()=>{clearSession();location.href="index.html"});
});

function renderStudent(user){
  const d=getData();
  document.getElementById("welcomeName").textContent="Welcome, "+user.name;
  const role=user.role==="day-scholar"?"Day Scholar":"Hostelite";
  document.getElementById("roleText").textContent=role+" student view · "+user.studentId;
  document.getElementById("roleBadge").textContent=role.toUpperCase();
  const select=document.getElementById("busSelect"); select.innerHTML="";
  const buses=d.buses.filter(b=>b.routeId);
  if(!buses.length){document.getElementById("noBuses").classList.remove("hidden");return}
  document.getElementById("noBuses").classList.add("hidden");
  buses.forEach(b=>{const o=document.createElement("option");o.value=b.id;o.textContent=b.name+" · "+routeName(d,b.routeId);select.appendChild(o)});
  if(user.journey?.busId && buses.some(b=>b.id===user.journey.busId))select.value=user.journey.busId;
  populateStops(user);
  const bus=d.buses.find(b=>b.id===user.journey?.busId), route=bus&&d.routes.find(r=>r.id===bus.routeId);
  document.getElementById("busStat").textContent=bus?bus.name:"—";
  document.getElementById("busMeta").textContent=route?route.name:"Select a bus below";
  document.getElementById("stopStat").textContent=user.journey?.stop||"—";
  const booking=d.bookings.find(x=>x.userId===user.id&&!x.cancelled&&x.date===today());
  document.getElementById("seatStat").textContent=booking?"Reserved":"Available";
  document.getElementById("bookingStatus").textContent=booking?"Seat reserved for "+booking.busName:"Seat available";
  document.getElementById("bookingBtn").classList.toggle("hidden",!!booking);
  document.getElementById("cancelBookingBtn").classList.toggle("hidden",!booking);
  const att=d.attendance.some(x=>x.userId===user.id&&x.date===today());
  document.getElementById("attendanceStat").textContent=att?"Marked":"Not Marked";
  document.getElementById("attendanceLabel").textContent=att?"Attendance marked for today":"Not marked for today";
  document.getElementById("attendanceBtn").disabled=att;
  document.getElementById("announcements").innerHTML=d.announcements.map(a=>`<div class="announcement">${esc(a.text)}</div>`).join("");
  updatePreview();
}
function routeName(d,id){const r=d.routes.find(x=>x.id===id);return r?r.name:"Unassigned"}
function populateStops(user){
  const d=getData(), bus=d.buses.find(b=>b.id===document.getElementById("busSelect").value), stop=document.getElementById("stopSelect");
  stop.innerHTML="";
  const route=bus&&d.routes.find(r=>r.id===bus.routeId);
  if(!route){stop.innerHTML="<option>No route assigned</option>";updatePreview();return}
  route.stops.forEach(s=>{const o=document.createElement("option");o.value=s;o.textContent=s;stop.appendChild(o)});
  if(user.journey?.busId===bus.id && route.stops.includes(user.journey.stop))stop.value=user.journey.stop;
  updatePreview();
}
function updatePreview(){
  const d=getData(), bus=d.buses.find(b=>b.id===document.getElementById("busSelect").value);
  const stop=document.getElementById("stopSelect").value;
  document.getElementById("selectionPreview").textContent=bus?`Selected journey: ${bus.name} → ${routeName(d,bus.routeId)} → ${stop||"Choose a stop"}`:"Choose an assigned bus.";
}
function saveJourney(){
  const user=requireStudent(), d=getData(); if(!user)return;
  const bus=d.buses.find(b=>b.id===document.getElementById("busSelect").value), stop=document.getElementById("stopSelect").value;
  if(!bus||!stop){toast("Please select a bus and stop.");return}
  const u=d.users.find(x=>x.id===user.id);u.journey={busId:bus.id,stop};saveData(d);renderStudent(u);toast("Bus and route stop saved.");
}
function reserveSeat(){
  const user=requireStudent(),d=getData();if(!user)return;
  const u=d.users.find(x=>x.id===user.id), bus=d.buses.find(b=>b.id===u.journey?.busId);
  if(!bus||!u.journey?.stop){toast("Select and save your bus and stop first.");return}
  const active=d.bookings.filter(x=>x.busId===bus.id&&!x.cancelled&&x.date===today()).length;
  if(active>=Number(bus.capacity)){toast("This bus is full.");return}
  d.bookings.push({id:uid("booking"),userId:user.id,busId:bus.id,busName:bus.name,stop:u.journey.stop,date:today(),cancelled:false});
  saveData(d);renderStudent(d.users.find(x=>x.id===user.id));toast("Seat reserved successfully.");
}
function cancelBooking(){
  const user=requireStudent(),d=getData();const b=d.bookings.find(x=>x.userId===user.id&&!x.cancelled&&x.date===today());
  if(b){b.cancelled=true;saveData(d);renderStudent(d.users.find(x=>x.id===user.id));toast("Reservation cancelled.")}
}
function markAttendance(){
  const user=requireStudent(),d=getData(),u=d.users.find(x=>x.id===user.id);
  if(!u.journey?.busId||!u.journey?.stop){toast("Select your bus and stop first.");return}
  if(!d.attendance.some(x=>x.userId===user.id&&x.date===today()))d.attendance.push({id:uid("att"),userId:user.id,busId:u.journey.busId,stop:u.journey.stop,date:today()});
  saveData(d);renderStudent(u);toast("Attendance marked.");
}
function toast(msg){let t=document.getElementById("toast");if(!t){t=document.createElement("div");t.id="toast";Object.assign(t.style,{position:"fixed",right:"20px",bottom:"20px",background:"#0b1324",color:"#fff",padding:"12px 16px",borderRadius:"9px",zIndex:99,fontSize:"13px",boxShadow:"0 8px 25px rgba(0,0,0,.2)"});document.body.appendChild(t)}t.textContent=msg;t.style.display="block";clearTimeout(window._toast);window._toast=setTimeout(()=>t.style.display="none",2400)}
