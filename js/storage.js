const STORAGE_KEY = "sutms_activity1_v2";

const DEFAULT_DATA = {
  users: [],
  routes: [
    {id:"route-a", name:"Route A - Main Campus", code:"A", stops:["Main Gate","Library","Academic Block","Main Campus"]},
    {id:"route-b", name:"Route B - Hostel", code:"B", stops:["Hostel Gate","Cafeteria","Sports Complex","Academic Block"]}
  ],
  buses: [
    {id:"bus-01", name:"Bus 01", capacity:40, routeId:"route-a"},
    {id:"bus-02", name:"Bus 02", capacity:35, routeId:"route-b"}
  ],
  bookings: [],
  attendance: [],
  announcements: [
    {id:"ann-1", text:"Please arrive at your selected stop 5 minutes before the scheduled pickup."},
    {id:"ann-2", text:"Transport schedules are managed by the Transport Admin."}
  ],
  sessions: {userId:null, role:null}
};

function getData(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw){ localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA)); return structuredClone(DEFAULT_DATA); }
  try{return JSON.parse(raw)}catch(e){localStorage.setItem(STORAGE_KEY,JSON.stringify(DEFAULT_DATA));return structuredClone(DEFAULT_DATA)}
}
function saveData(data){localStorage.setItem(STORAGE_KEY,JSON.stringify(data))}
function resetDemoData(){localStorage.setItem(STORAGE_KEY,JSON.stringify(DEFAULT_DATA))}
function uid(prefix){return prefix+"-"+Date.now()+"-"+Math.random().toString(16).slice(2,7)}
function currentUser(){const d=getData();return d.users.find(u=>u.id===d.sessions.userId)}
function setSession(userId, role){const d=getData();d.sessions={userId,role};saveData(d)}
function clearSession(){const d=getData();d.sessions={userId:null,role:null};saveData(d)}
function requireStudent(){const d=getData();const u=d.users.find(x=>x.id===d.sessions.userId);if(!u || !["day-scholar","hostelite"].includes(u.role)){location.href="login.html";return null}return u}
function requireAdmin(){const d=getData();if(d.sessions.role!=="admin"){location.href="admin-login.html";return false}return true}
function esc(v){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function today(){return new Date().toISOString().slice(0,10)}
