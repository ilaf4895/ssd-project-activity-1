document.addEventListener("DOMContentLoaded",()=>{
  getData();
  document.querySelectorAll(".eye").forEach(btn=>btn.addEventListener("click",()=>{
    const input=document.getElementById(btn.dataset.target);
    input.type=input.type==="password"?"text":"password"; btn.textContent=input.type==="password"?"Show":"Hide";
  }));

  const loginForm=document.getElementById("loginForm");
  if(loginForm) loginForm.addEventListener("submit",e=>{
    e.preventDefault(); const d=getData();
    const id=document.getElementById("identifier").value.trim().toLowerCase();
    const pw=document.getElementById("password").value;
    const user=d.users.find(u=>(u.email.toLowerCase()===id||u.studentId.toLowerCase()===id)&&u.password===pw);
    if(!user){showMsg("message","Invalid student credentials. Please sign up first or check your details.","error");return}
    setSession(user.id,user.role); location.href="student-dashboard.html";
  });

  const signup=document.getElementById("signupForm");
  if(signup) signup.addEventListener("submit",e=>{
    e.preventDefault(); const d=getData();
    const name=document.getElementById("name").value.trim(), studentId=document.getElementById("studentId").value.trim();
    const email=document.getElementById("email").value.trim().toLowerCase(), role=document.getElementById("role").value;
    const password=document.getElementById("password").value, confirm=document.getElementById("confirmPassword").value;
    if(password!==confirm){showMsg("message","Passwords do not match.","error");return}
    if(d.users.some(u=>u.email.toLowerCase()===email||u.studentId.toLowerCase()===studentId)){showMsg("message","A student with this email or ID already exists.","error");return}
    const user={id:uid("user"),name,studentId,email,role,password,journey:{busId:null,stop:""},createdAt:new Date().toISOString()};
    d.users.push(user); d.sessions={userId:user.id,role:user.role}; saveData(d);
    location.href="student-dashboard.html";
  });

  const admin=document.getElementById("adminLoginForm");
  if(admin) admin.addEventListener("submit",e=>{
    e.preventDefault();
    const email=document.getElementById("identifier").value.trim().toLowerCase(), pw=document.getElementById("password").value;
    if(email==="admin@transport.local"&&pw==="admin123"){setSession("admin-local","admin");location.href="admin-dashboard.html"}
    else showMsg("message","Invalid admin credentials.","error");
  });
});
function showMsg(id,text,type){const el=document.getElementById(id);el.textContent=text;el.className="message "+type}
