let currentUser = null;

async function init() {
  const { data } = await supabase.auth.getUser();
  currentUser = data.user;

  if(currentUser){
    document.getElementById("status").innerText = "Logged in";
    document.getElementById("postBox").style.display = "block";
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", currentUser.id).single();
    document.getElementById("welcome").innerText = `Welcome, ${profile.username}`;
  }

  loadFeed();
}

async function loadFeed() {
  let { data: posts } = await supabase
    .from("posts")
    .select("content, created_at, profiles(username)")
    .order("created_at", { ascending: false })
    .limit(50);

  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  posts.forEach(p => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <div class="post-user"><a href="profile.html?u=${p.profiles.username}">${p.profiles.username}</a></div>
      <div>${p.content}</div>
      <div class="post-time">${new Date(p.created_at).toLocaleString()}</div>
    `;
    feed.appendChild(div);
  });
}

async function createPost() {
  const text = document.getElementById("postText").value;
  if(!text) return;

  await supabase.from("posts").insert({
    author: currentUser.id,
    content: text
  });

  document.getElementById("postText").value = "";
  loadFeed();
}

init();
