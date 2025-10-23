// ==========================================================
// DASHBOARD CCTV DENGAN POPUP IMAGE & NAVIGASI (VERSI PROFESIONAL)
// ==========================================================

const cctvData = [
  { id: 1, name: "ARR & AWLR MENDALAM", image: "/assets/images/cctv/mendalam.jpg", lat: -0.716, lng: 112.910 },
  { id: 2, name: "ARR & AWLR SAYUT", image: "/assets/images/cctv/sayut.jpg", lat: -0.683, lng: 112.935 },
  { id: 3, name: "ARR & AWLR SIBAU", image: "/assets/images/cctv/sibau.jpg", lat: -0.705, lng: 112.875 },
  { id: 4, name: "AWLR DARIT", image: "/assets/images/cctv/darit.jpg", lat: -0.563, lng: 112.837 },
  { id: 5, name: "CCTV PONTIANAK", image: "/assets/images/cctv/pontianak.jpg", lat: -0.026, lng: 109.342 },
];

let cctvMap;
let cctvMarkers = [];
let activeInfoWindow = null;
let currentIndex = 0;

// ==========================================================
// INISIALISASI DASHBOARD
// ==========================================================
export function initCctvDashboard() {
  console.log("🎥 Inisialisasi Dashboard CCTV...");

  const mapElement = document.getElementById("cctv-map");
  const gridContainer = document.getElementById("cctv-slider");

  if (!mapElement || !gridContainer) {
    console.error("❌ Elemen peta atau grid CCTV tidak ditemukan.");
    return;
  }

  mapElement.innerHTML = "";
  gridContainer.innerHTML = "";

  // ====== INISIALISASI MAP ======
  cctvMap = new google.maps.Map(mapElement, {
    center: { lat: -0.7, lng: 112.9 },
    zoom: 7,
    mapTypeId: "roadmap",
    streetViewControl: false,
    fullscreenControl: true,
  });

  // ====== TAMBAH MARKER ======
  cctvMarkers = cctvData.map((cam) => {
    const marker = new google.maps.Marker({
      position: { lat: cam.lat, lng: cam.lng },
      map: cctvMap,
      title: cam.name,
      icon: {
  url:
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="45" height="70" viewBox="0 0 45 70">
        <!-- Tiang -->
        <rect x="21" y="35" width="3" height="30" fill="#FFFFFF" />
        <!-- Lingkaran dasar -->
        <circle cx="22.5" cy="25" r="20" fill="#2196F3" stroke="white" stroke-width="2" />
        <!-- Ikon CCTV -->
        <image href="/public/assets/images/icons/cctv.png" x="8" y="10" width="28" height="28"/>
      </svg>
    `),
  scaledSize: new google.maps.Size(45, 70),
  anchor: new google.maps.Point(22, 70) // agar tiangnya pas di bawah
}

    });

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="max-width:240px;">
          <img src="${cam.image}" alt="${cam.name}" style="width:100%; border-radius:6px; margin-bottom:5px;">
          <strong>${cam.name}</strong>
        </div>
      `,
    });

    marker.addListener("click", () => {
      if (activeInfoWindow) activeInfoWindow.close();
      infoWindow.open(cctvMap, marker);
      activeInfoWindow = infoWindow;
    });

    return marker;
  });

  // ====== RENDER GRID ======
  renderCctvGrid(gridContainer);
}

// ==========================================================
// RENDER GRID CCTV
// ==========================================================
function renderCctvGrid(container) {
  container.style.display = "grid";
  container.style.gridTemplateColumns = "repeat(auto-fill, minmax(320px, 1fr))";
  container.style.gap = "10px";
  container.style.padding = "10px";

  cctvData.forEach((cam, index) => {
    const card = document.createElement("div");
    card.classList.add("cctv-card");
    Object.assign(card.style, {
      position: "relative",
      cursor: "pointer",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
      transition: "transform 0.2s ease-in-out",
    });

    card.innerHTML = `
      <img src="${cam.image}" alt="${cam.name}" style="width:100%; height:180px; object-fit:cover;">
      <div style="
        position:absolute; bottom:0; left:0; right:0;
        background:rgba(0,0,0,0.6);
        color:white; font-weight:600;
        font-size:14px; text-align:center;
        padding:6px;">${cam.name}</div>
    `;

    card.addEventListener("click", () => openCctvModal(index));
    container.appendChild(card);
  });
}

// ==========================================================
// MODAL CCTV DENGAN NAVIGASI + ANIMASI MASUK/KELUAR
// ==========================================================
function openCctvModal(index) {
  currentIndex = index;
  let modal = document.getElementById("cctvModal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "cctvModal";
    modal.style = `
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      backdrop-filter: blur(3px);
      opacity: 0;
      animation: fadeIn 0.35s forwards ease;
    `;

    modal.innerHTML = `
      <div id="modal-content" style="
        position: relative;
        background: #000;
        border-radius: 10px;
        max-width: 90%;
        max-height: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        transform: scale(0.95);
        transition: transform 0.3s ease;">
        
        <img id="modal-image" src="" alt="" style="max-width:100%; max-height:80vh; border-radius:8px; transition: opacity 0.3s ease;">
        <div id="modal-title" style="color:white; padding:8px; font-size:16px; font-weight:600;"></div>

        <!-- Tombol Close -->
        <button id="closeModal" style="
          position:absolute; top:10px; right:10px;
          background:rgba(0,0,0,0.5); color:white;
          border:none; border-radius:50%;
          width:40px; height:40px; font-size:22px;
          cursor:pointer; transition:0.2s;">&times;</button>

        <!-- Panah Kiri -->
        <button id="prevModal" style="
          position:absolute; left:25px; top:50%;
          transform:translateY(-50%);
          background:rgba(0,0,0,0.4);
          color:white; border:none; border-radius:50%;
          width:55px; height:55px; font-size:28px;
          cursor:pointer; transition:background 0.2s;">&#10094;</button>

        <!-- Panah Kanan -->
        <button id="nextModal" style="
          position:absolute; right:25px; top:50%;
          transform:translateY(-50%);
          background:rgba(0,0,0,0.4);
          color:white; border:none; border-radius:50%;
          width:55px; height:55px; font-size:28px;
          cursor:pointer; transition:background 0.2s;">&#10095;</button>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector("#closeModal").addEventListener("click", closeCctvModal);
    modal.querySelector("#prevModal").addEventListener("click", () => navigateCctv(-1));
    modal.querySelector("#nextModal").addEventListener("click", () => navigateCctv(1));

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeCctvModal();
    });
  }

  updateCctvModal();
  modal.style.display = "flex";
}

function updateCctvModal() {
  const cam = cctvData[currentIndex];
  const img = document.getElementById("modal-image");
  const title = document.getElementById("modal-title");

  img.style.opacity = "0";
  setTimeout(() => {
    img.src = cam.image;
    title.textContent = cam.name;
    img.onload = () => (img.style.opacity = "1");
  }, 150);
}

function navigateCctv(direction) {
  currentIndex = (currentIndex + direction + cctvData.length) % cctvData.length;
  updateCctvModal();
}

// === Animasi keluar (fadeOut) baru ===
function closeCctvModal() {
  const modal = document.getElementById("cctvModal");
  if (modal) {
    modal.style.animation = "fadeOut 0.35s forwards ease";
    const content = modal.querySelector("#modal-content");
    if (content) content.style.transform = "scale(0.9)";
    setTimeout(() => modal.remove(), 350);
  }
}

// ==========================================================
// GANTI VIEW
// ==========================================================
export function applyCctvView(selected) {
  const mapCctv = document.getElementById("cctv-map");
  const cctvSlider = document.getElementById("cctv-slider");
  const container = document.getElementById("dashboard-cctv-container");

  if (!mapCctv || !cctvSlider || !container) return;

  Object.assign(container.style, {
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 80px)",
    gap: "8px",
  });

  mapCctv.style.display = "none";
  cctvSlider.style.display = "none";

  document.querySelectorAll(".cctv-nav").forEach((el) => el.remove());

  switch (selected) {
    case "maps-only":
      Object.assign(mapCctv.style, {
        display: "block",
        height: "calc(100vh - 100px)",
      });
      break;

    case "cctv-only":
      Object.assign(cctvSlider.style, {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
        padding: "20px",
        height: "calc(100vh - 100px)",
        overflowY: "auto",
        background: "#f8f9fa",
      });
      break;

    default:
      Object.assign(cctvSlider.style, {
        display: "flex",
        overflowX: "auto",
        scrollBehavior: "smooth",
        gap: "10px",
        padding: "10px",
        height: "220px",
        background: "#f8f9fa",
        position: "relative",
        alignItems: "center",
      });

      Object.assign(mapCctv.style, {
        display: "block",
        flex: "1",
        height: "calc(100vh - 300px)",
        borderRadius: "8px",
      });

      const prevBtn = document.createElement("button");
      const nextBtn = document.createElement("button");

      [prevBtn, nextBtn].forEach((btn) => {
        btn.className = "cctv-nav";
        Object.assign(btn.style, {
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          border: "none",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          cursor: "pointer",
          zIndex: "10",
          fontSize: "20px",
        });
      });

      prevBtn.innerHTML = "&#10094;";
      nextBtn.innerHTML = "&#10095;";
      prevBtn.style.left = "10px";
      nextBtn.style.right = "10px";

      prevBtn.onclick = () => cctvSlider.scrollBy({ left: -300, behavior: "smooth" });
      nextBtn.onclick = () => cctvSlider.scrollBy({ left: 300, behavior: "smooth" });

      cctvSlider.appendChild(prevBtn);
      cctvSlider.appendChild(nextBtn);
      break;
  }
}

// ==========================================================
// BERSIHKAN DASHBOARD
// ==========================================================
export function destroyCctvDashboard() {
  if (cctvMarkers.length) {
    cctvMarkers.forEach((m) => m.setMap(null));
    cctvMarkers = [];
  }

  if (activeInfoWindow) {
    activeInfoWindow.close();
    activeInfoWindow = null;
  }

  const mapElement = document.getElementById("cctv-map");
  if (mapElement) mapElement.innerHTML = "";

  const gridContainer = document.getElementById("cctv-slider");
  if (gridContainer) gridContainer.innerHTML = "";
}

// ==========================================================
// AUTO INIT
// ==========================================================
window.addEventListener("load", () => {
  if (typeof google !== "undefined" && google.maps) initCctvDashboard();

  const viewSelect = document.getElementById("viewCctv");
  if (viewSelect) {
    viewSelect.addEventListener("change", (e) => applyCctvView(e.target.value));
  }
});

window.initCctvDashboard = initCctvDashboard;
window.destroyCctvDashboard = destroyCctvDashboard;
window.applyCctvView = applyCctvView;

// ==========================================================
// ANIMASI TAMBAHAN (MASUK & KELUAR)
// ==========================================================
const style = document.createElement("style");
style.innerHTML = `
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
  button:hover { background: rgba(255,255,255,0.2) !important; }
`;
document.head.appendChild(style);
