// Firebase initialization (paste your config in HTML)
// import { initializeApp } from "firebase/app";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
// import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// ===== CREATOR LOGIN/REGISTER =====
async function registerCreator(){
  const email=document.getElementById("email").value;
  const password=document.getElementById("password").value;
  await createUserWithEmailAndPassword(auth,email,password);
  alert("Registered! Login now");
}
async function loginCreator(){
  const email=document.getElementById("email").value;
  const password=document.getElementById("password").value;
  await signInWithEmailAndPassword(auth,email,password);
  window.location="creator-dashboard.html";
}

// ===== BRAND LOGIN/REGISTER =====
async function registerBrand(){
  const email=document.getElementById("email").value;
  const password=document.getElementById("password").value;
  await createUserWithEmailAndPassword(auth,email,password);
  alert("Registered! Login now");
}
async function loginBrand(){
  const email=document.getElementById("email").value;
  const password=document.getElementById("password").value;
  await signInWithEmailAndPassword(auth,email,password);
  window.location="brand-dashboard.html";
}

// ===== CREATOR DASHBOARD =====
async function uploadMedia(){
  const file=document.getElementById("mediaFile").files[0];
  if(!file) return alert("Select a file!");
  const user=auth.currentUser;
  if(!user) return alert("Login first!");

  const storageRef=ref(storage,`creator_media/${user.uid}/${file.name}`);
  await uploadBytes(storageRef,file);
  const url=await getDownloadURL(storageRef);

  await addDoc(collection(db,"creator_media"),{
    userId:user.uid,
    url:url,
    name:file.name,
    type:file.type,
    niche:document.getElementById("niche").value||"General",
    campaignId:null,
    timestamp:new Date()
  });

  alert("Uploaded!");
  document.getElementById("mediaFile").value="";
  loadCreatorMedia();
}

async function loadCreatorMedia(filterNiche=""){
  const user=auth.currentUser;
  if(!user) return;
  const gallery=document.getElementById("creatorMediaGallery");
  gallery.innerHTML="";

  const q=query(collection(db,"creator_media"),where("userId","==",user.uid));
  const snapshot=await getDocs(q);
  snapshot.forEach(docSnap=>{
    const data=docSnap.data();
    if(filterNiche && data.niche!=filterNiche) return;
    const div=document.createElement("div");
    div.className="card";
    if(data.type.startsWith("image")) div.innerHTML=`<a href="${data.url}" class="glightbox"><img src="${data.url}"></a>`;
    else if(data.type.startsWith("video")) div.innerHTML=`<a href="${data.url}" class="glightbox"><video src="${data.url}" controls></video></a>`;
    gallery.appendChild(div);
  });
  GLightbox({ selector: '.glightbox' });
}

async function filterGallery(){
  const niche=document.getElementById("filterNiche").value;
  await loadCreatorMedia(niche);
}

// ===== BRAND DASHBOARD =====
async function loadBrandMedia(campaignId=null){
  const gallery=document.getElementById("brandMediaGallery");
  gallery.innerHTML="";
  const snapshot=await getDocs(collection(db,"creator_media"));
  snapshot.forEach(docSnap=>{
    const data=docSnap.data();
    if(campaignId && data.campaignId!=campaignId) return;
    const div=document.createElement("div");
    div.className="card";
    if(data.type.startsWith("image")) div.innerHTML=`<a href="${data.url}" class="glightbox"><img src="${data.url}"></a>`;
    else if(data.type.startsWith("video")) div.innerHTML=`<a href="${data.url}" class="glightbox"><video src="${data.url}" controls></video></a>`;
    gallery.appendChild(div);
  });
  GLightbox({ selector: '.glightbox' });
}
