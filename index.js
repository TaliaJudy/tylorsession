// index.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCyQTC9BMD90v8EOS5ZJOOzLArqifp85Qk",
  authDomain: "cytra-a9b1d.firebaseapp.com",
  projectId: "cytra-a9b1d",
  storageBucket: "cytra-a9b1d.appspot.com",
  messagingSenderId: "60383087529",
  appId: "1:60383087529:web:4c4c792eba06a10f4412b8",
  measurementId: "G-LGJ250744Y"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const galleryGrid = document.getElementById("galleryGrid");
const searchInput = document.getElementById("searchInput");

uploadBtn.addEventListener("click", async () => {
  const files = fileInput.files;
  for (let file of files) {
    const imageRef = storageRef(storage, `images/${file.name}`);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);
    await addDoc(collection(db, "images"), {
      name: file.name,
      url,
      created: new Date()
    });
  }
  loadImages();
});

async function loadImages() {
  galleryGrid.innerHTML = "";
  const q = query(collection(db, "images"), orderBy("created", "desc"));
  const snapshot = await getDocs(q);
  snapshot.forEach(doc => {
    const data = doc.data();
    const img = document.createElement("img");
    img.src = data.url;
    img.alt = data.name;
    img.className = "gallery-img";
    img.loading = "lazy";
    galleryGrid.appendChild(img);

    img.addEventListener("click", () => {
      document.getElementById("lightbox").style.display = "flex";
      document.getElementById("lightboxImg").src = img.src;
      document.getElementById("lightboxImg").alt = img.alt;
    });
  });
}

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  document.querySelectorAll(".gallery-img").forEach(img => {
    img.style.display = img.alt.toLowerCase().includes(term) ? "block" : "none";
  });
});

document.getElementById("closeBtn").addEventListener("click", () => {
  document.getElementById("lightbox").style.display = "none";
  document.getElementById("lightboxImg").src = "";
});

document.getElementById("lightbox").addEventListener("click", (e) => {
  if (e.target !== document.getElementById("lightboxImg")) {
    document.getElementById("lightbox").style.display = "none";
    document.getElementById("lightboxImg").src = "";
  }
});

loadImages();
