async function updateFollowButton(){
  if(!currentUser || currentUser.id === viewedProfile.id) return;

  const { data } = await supabase
    .from("follows")
    .select("*")
    .eq("follower", currentUser.id)
    .eq("following", viewedProfile.id)
    .maybeSingle();

  const btn = document.getElementById("followBtn");

  if(data){
    btn.innerText = "Unfollow";
    btn.onclick = async ()=>{
      await supabase.from("follows")
        .delete()
        .eq("follower", currentUser.id)
        .eq("following", viewedProfile.id);
      location.reload();
    }
  } else {
    btn.innerText = "Follow";
    btn.onclick = async ()=>{
      await supabase.from("follows").insert({
        follower: currentUser.id,
        following: viewedProfile.id
      });
      location.reload();
    }
  }
}
