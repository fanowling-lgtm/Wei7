const params = new URLSearchParams(location.search);
const username = params.get("u");
let viewedProfile = null;
let currentUser = null;

async function initProfile(){
  currentUser = (await supabase.auth.getUser()).data.user;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  viewedProfile = data;

  document.getElementById("username").innerText = data.username;
  document.getElementById("bio").innerText = data.bio || "";
  document.getElementById("customCSS").innerText = sanitizeCSS(data.profile_css);

  if(currentUser && currentUser.id === data.id){
    document.getElementById("cssEditor").style.display = "block";
    document.getElementById("cssText").value = data.profile_css || "";
  }

  loadPosts();
  updateFollowButton();
}

function sanitizeCSS(css){
  if(!css) return "";
  return css.replace(/@import/g,"").replace(/position\s*:\s*fixed/g,"");
}

async function saveCSS(){
  const css = document.getElementById("cssText").value;
  await supabase.from("profiles").update({ profile_css: css }).eq("id", currentUser.id);
  location.reload();
}

async function loadPosts(){
  const { data } = await supabase
    .from("posts")
    .select("content, created_at")
    .eq("author", viewedProfile.id)
    .order("created_at",{ascending:false});

  const el = document.getElementById("posts");
  el.innerHTML = "";

  data.forEach(p => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `<div>${p.content}</div>`;
    el.appendChild(div);
  });
}

initProfile();
