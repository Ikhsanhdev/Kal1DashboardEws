// ==========================================================
// DASHBOARD CCTV DENGAN POPUP IMAGE, MAP, & SLIDER RESPONSIF (FINAL)
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
let carouselIndex = 0;

const carouselState = {
  container: null,
  track: null,
  cards: [],
  cardWidth: 0,
  gap: 16,
  visibleCount: 4,
  maxIndex: 0,
};

// ==========================================================
// INISIALISASI DASHBOARD CCTV
// ==========================================================
export function initCctvDashboard() {
  console.log("Initializing CCTV Dashboard...");

  const mapElement = document.getElementById("cctv-map");
  const gridContainer = document.getElementById("cctv-slider");

  if (!mapElement || !gridContainer) {
    console.error("Elemen peta atau grid CCTV tidak ditemukan.");
    return;
  }

  mapElement.innerHTML = "";
  gridContainer.innerHTML = "";

  // === Google Map ===
  cctvMap = new google.maps.Map(mapElement, {
    center: { lat: -0.7, lng: 112.9 },
    zoom: 7,
    mapTypeId: "roadmap",
    streetViewControl: false,
    fullscreenControl: true,
  });

  // === Marker ===
  cctvMarkers = cctvData.map((cam) => {
    const marker = new google.maps.Marker({
      position: { lat: cam.lat, lng: cam.lng },
      map: cctvMap,
      title: cam.name,
      icon: {
        url: "/assets/images/icons/cctv.png",
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 40),
      },
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="max-width:240px;">
          <img src="${cam.image}" alt="${cam.name}" style="width:100%; border-radius:6px; margin-bottom:5px;">
          <strong>${cam.name}</strong>
        </div>
      `,
    });

    marker.addEventListener("click", () => {
      if (activeInfoWindow) {
        activeInfoWindow.close();
      }
      infoWindow.open(cctvMap, marker);
      activeInfoWindow = infoWindow;
    });

    return marker;
  });

  renderCctvGrid(gridContainer);
}

// ==========================================================
// RENDER SLIDER CCTV (untuk mode Maps + CCTV)
// ==========================================================
function renderCctvGrid(container) {
  carouselState.container = container;
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "cctv-slider-wrapper";

  const track = document.createElement("div");
  track.className = "cctv-track";

  cctvData.forEach((cam, index) => {
    const card = document.createElement("div");
    card.classList.add("cctv-card");
    card.innerHTML = `
      <img src="${cam.image}" alt="${cam.name}" draggable="false">
      <div class="caption">${cam.name}</div>
    `;
    card.addEventListener("click", () => openCctvModal(index));
    track.appendChild(card);
  });

  wrapper.appendChild(track);
  container.appendChild(wrapper);

  carouselState.track = track;
  carouselState.cards = Array.from(track.querySelectorAll(".cctv-card"));

  // Tombol navigasi (hanya untuk mode slider)
  const prevBtn = createSvgButton("prev");
  const nextBtn = createSvgButton("next");
  prevBtn.addEventListener("click", () => moveCarousel(-1));
  nextBtn.addEventListener("click", () => moveCarousel(1));
  wrapper.appendChild(prevBtn);
  wrapper.appendChild(nextBtn);

  setTimeout(() => {
    recalcCarouselSizes();
    updateNavButtonsState();
  }, 200);

  window.addEventListener("resize", recalcCarouselSizes);
}

// ==========================================================
// RENDER GRID CCTV ONLY (4 kolom, turun ke bawah)
// ==========================================================
function renderCctvGridOnly(container) {
  // Mode ini tidak menggunakan state slider
  carouselState.container = null;
  carouselIndex = 0;

  container.innerHTML = "";
  container.classList.add("cctv-grid-only");

  cctvData.forEach((cam, index) => {
    const card = document.createElement("div");
    card.classList.add("cctv-card");
    card.innerHTML = `
      <img src="${cam.image}" alt="${cam.name}" draggable="false">
      <div class="caption">${cam.name}</div>
    `;
    card.addEventListener("click", () => openCctvModal(index));
    container.appendChild(card);
  });
}

// ==========================================================
// LOGIKA SLIDER
// ==========================================================
function recalcCarouselSizes() {
  const { container, track, cards, gap } = carouselState;
  if (!container || !track || !cards.length) return;

  const containerWidth = container.clientWidth;

  if (containerWidth >= 1200) {
    carouselState.visibleCount = 4;
  } else if (containerWidth >= 992) {
    carouselState.visibleCount = 3;
  } else if (containerWidth >= 768) {
    carouselState.visibleCount = 2;
  } else {
    carouselState.visibleCount = 1;
  }

  const cardWidth =
    (containerWidth - (carouselState.visibleCount - 0.5) * gap) /
    carouselState.visibleCount;

  carouselState.cards.forEach((card) => {
    card.style.flex = `0 0 ${cardWidth}px`;
  });

  carouselState.cardWidth = cardWidth;
  carouselState.maxIndex = Math.max(0, cards.length - carouselState.visibleCount);
  updateCarouselTransform();
}

function moveCarousel(direction = 1) {
  carouselIndex = Math.min(
    Math.max(0, carouselIndex + direction),
    carouselState.maxIndex,
  );
  updateCarouselTransform();
  updateNavButtonsState();
}

function updateCarouselTransform() {
  const { track, cardWidth, gap } = carouselState;
  const offset = 15;
  const x = -(carouselIndex * (cardWidth + gap)) + offset;
  track.style.transform = `translateX(${x}px)`;
}

function createSvgButton(side = "prev") {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `cctv-scroll-btn ${side}`;
  btn.innerHTML = side === "prev" ? "&#10094;" : "&#10095;";
  return btn;
}

function updateNavButtonsState() {
  const prev = document.querySelector(".cctv-scroll-btn.prev");
  const next = document.querySelector(".cctv-scroll-btn.next");
  if (!prev || !next) return;

  prev.disabled = carouselIndex <= 0;
  next.disabled = carouselIndex >= carouselState.maxIndex;

  prev.style.opacity = prev.disabled ? "0.4" : "1";
  next.style.opacity = next.disabled ? "0.4" : "1";
}

// ==========================================================
// MODAL POPUP CCTV
// ==========================================================
function openCctvModal(index) {
  currentIndex = index;
  let modal = document.getElementById("cctvModal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "cctvModal";
    modal.innerHTML = `
      <div id="modal-content">
        <img id="modal-image" src="" alt="">
        <div id="modal-title"></div>
        <button id="closeModal" class="modal-btn close">&times;</button>
        <button id="prevModal" class="modal-btn prev">&#10094;</button>
        <button id="nextModal" class="modal-btn next">&#10095;</button>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector("#closeModal").addEventListener("click", closeCctvModal);
    modal.querySelector("#prevModal").addEventListener("click", () => navigateCctv(-1));
    modal.querySelector("#nextModal").addEventListener("click", () => navigateCctv(1));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeCctvModal();
      }
    });
  }

  document.body.style.overflow = "hidden";
  updateCctvModal();
}

function updateCctvModal() {
  const cam = cctvData[currentIndex];
  const img = document.getElementById("modal-image");
  const title = document.getElementById("modal-title");

  img.style.opacity = "0";

  setTimeout(() => {
    img.src = cam.image;
    title.textContent = cam.name;
    img.onload = () => {
      img.style.opacity = "1";
    };
  }, 150);
}

function navigateCctv(dir) {
  currentIndex = (currentIndex + dir + cctvData.length) % cctvData.length;
  updateCctvModal();
}

function closeCctvModal() {
  const modal = document.getElementById("cctvModal");
  if (modal) {
    modal.classList.add("fade-out");
    document.body.style.overflow = "";
    setTimeout(() => modal.remove(), 300);
  }
}

// ==========================================================
// SWITCH VIEW (DENGAN MAP FULLSCREEN)
// ==========================================================
export function applyCctvView(selected) {
  const mapCctv = document.getElementById("cctv-map");
  const cctvSlider = document.getElementById("cctv-slider");
  const sidebar = document.querySelector(".sidebar, .sidebar-container, #sidebar");
  const headerTitle = document.querySelector(
    "#dashboard-cctv-container .dashboard-title",
  );

  if (!mapCctv || !cctvSlider) return;

  mapCctv.classList.add("fade");
  cctvSlider.classList.add("fade");

  setTimeout(() => {
    mapCctv.style.display = "none";
    cctvSlider.style.display = "none";
    cctvSlider.innerHTML = "";
    mapCctv.classList.remove("fullscreen-map");
    if (sidebar) {
      sidebar.classList.remove("hide-sidebar");
    }

    switch (selected) {
      case "cctv-only":
        // Mode grid: hanya CCTV, tanpa map dan tanpa slider
        cctvSlider.style.display = "block";
        mapCctv.style.display = "none";
        renderCctvGridOnly(cctvSlider);
        break;

      case "maps-only":
        mapCctv.style.display = "block";
        mapCctv.classList.add("fullscreen-map"); // full layar
        if (sidebar) {
          sidebar.classList.add("hide-sidebar"); // sembunyikan sidebar
        }
        if (cctvMap) {
          google.maps.event.trigger(cctvMap, "resize");
        }
        break;

      default:
        // Mode Maps + CCTV: gunakan slider
        mapCctv.style.display = "block";
        cctvSlider.style.display = "block";
        renderCctvGrid(cctvSlider);
        break;
    }

    if (headerTitle) {
      let suffix;
      switch (selected) {
        case "cctv-only":
          suffix = "CCTV Only";
          break;
        case "maps-only":
          suffix = "Maps Only";
          break;
        default: // termasuk "maps-+-cctv"
          suffix = "CCTV + Maps";
          break;
      }
      headerTitle.textContent = `Dashboard CCTV > ${suffix}`;
    }

    mapCctv.classList.remove("fade");
    cctvSlider.classList.remove("fade");
  }, 300);
}

// ==========================================================
// CLEANUP
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

  document.querySelectorAll(".cctv-scroll-btn").forEach((el) => el.remove());
  window.removeEventListener("resize", recalcCarouselSizes);
}

// ==========================================================
// AUTO INIT
// ==========================================================
window.addEventListener("load", () => {
  if (typeof google !== "undefined" && google.maps) {
    initCctvDashboard();
  }
});

window.initCctvDashboard = initCctvDashboard;
window.destroyCctvDashboard = destroyCctvDashboard;
window.applyCctvView = applyCctvView;