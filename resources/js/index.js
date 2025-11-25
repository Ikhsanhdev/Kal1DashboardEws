// ==========================================================
// Import Modul Utama
// ==========================================================
import { initFilters } from "./filters/filters.js";
import { initMap } from "./map/initmap.js";
import "./tables/dashboard-table.js";
import { initCctvDashboard, destroyCctvDashboard } from "./dashboards/cctv.js";

// ==========================================================
// Import Library Tambahan
// ==========================================================
import $ from "jquery";
import "jquery-knob";

// ==========================================================
// jQuery Knob (untuk elemen .knob di halaman)
// ==========================================================
$(function () {
    if ($(".knob").length) {
        $(".knob").knob();
        console.log("jQuery Knob initialized");
    }
});

// ==========================================================
// Fungsi: Inisialisasi Dashboard sesuai dropdown
// ==========================================================
function initDashboard(type) {
    console.log(`Switch dashboard to: ${type}`);

    // Sembunyikan semua container, reset CCTV
    $(".dashboard-container").removeClass("active");
    destroyCctvDashboard?.();

    // Tampilkan container sesuai tipe
    $(`#${type}-container`).addClass("active");

    switch (type) {
        case "dashboard-data":
            console.log("Initialize Dashboard Data...");
            if (document.getElementById("map") && typeof initMap === "function") {
                initMap("map");
            }
            break;

        case "dashboard-cctv":
            console.log("Initialize Dashboard CCTV...");
            try {
                initCctvDashboard();
                console.log("CCTV Dashboard initialized");
            } catch (e) {
                console.error("Error initializing CCTV Dashboard:", e);
            }
            break;

        case "dashboard-ews":
            console.log("Initialize Dashboard EWS...");
            if (document.getElementById("ews-map") && typeof initMap === "function") {
                initMap("ews-map");
            }
            break;

        default:
            console.warn("Unknown dashboard type:", type);
    }
}

// ==========================================================
// DOM Ready
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Ready");

    // 1️⃣ Inisialisasi Filter
    try {
        initFilters();
        console.log("Filters initialized from index.js");
    } catch (e) {
        console.error("Failed to initialize Filters:", e);
    }

    // 2️⃣ Inisialisasi Map jika elemen dan API tersedia
    try {
        const mapElement = document.getElementById("map");
        if (mapElement && window.google && google.maps) {
            console.log("Initializing Google Maps from index.js...");
            initMap("map");
        } else {
            console.warn("Google Maps API not ready or #map not found.");
        }
    } catch (e) {
        console.error("Failed to initialize Google Maps:", e);
    }

    // 3️⃣ Dropdown Ganti Dashboard (fallback jika tidak pakai selectize)
    const dashboardSelect = document.getElementById("dashboard-type");
    if (dashboardSelect) {
        dashboardSelect.addEventListener("change", (e) => initDashboard(e.target.value));
    }

    // 4️⃣ Jalankan Dashboard Default
    const defaultDashboard = dashboardSelect?.value || "dashboard-data";
    initDashboard(defaultDashboard);
});

// ==========================================================
// Ekspor initDashboard ke window agar bisa dipanggil modul lain
// ==========================================================
window.initDashboard = initDashboard;

// ==========================================================
// Callback untuk Google Maps API
// (dipanggil oleh script tag &callback=initMap)
// ==========================================================
window.initMap = () => {
    try {
        console.log("Google Maps callback initMap triggered");
        initMap();
    } catch (e) {
        console.error("Error in initMap callback:", e);
    }
};

// ==========================================================
// Fungsi: Menyesuaikan tinggi layout agar map tidak kepotong
// ==========================================================
function adjustDashboardHeight() {
    const headerEl =
        document.querySelector("header") ||
        document.querySelector(".navbar") ||
        document.querySelector(".topbar") ||
        document.querySelector(".main-header");

    const headerHeight = headerEl ? Math.ceil(headerEl.getBoundingClientRect().height) : 0;

    const wrapper = document.querySelector(".d-flex.h-100");
    if (wrapper) {
        // Hanya set minimum height agar layout tidak kepotong oleh header,
        // tetapi tetap mengizinkan halaman lebih tinggi dan bisa di-scroll.
        wrapper.style.minHeight = `calc(100vh - ${headerHeight}px)`;
        wrapper.style.height = "auto";
    }

    const rightPanel = document.querySelector(".right-panel");
    if (rightPanel) {
        rightPanel.style.height = "auto";
        rightPanel.style.maxHeight = `calc(100vh - ${headerHeight}px)`;
    }

    // Trigger resize map
    setTimeout(() => {
        if (window.dashboardMap && window.google && google.maps) {
            try {
                google.maps.event.trigger(window.dashboardMap, "resize");
                if (window.dashboardMapCenter) {
                    window.dashboardMap.setCenter(window.dashboardMapCenter);
                }
            } catch (e) {
                console.warn("Failed to trigger map resize:", e);
            }
        }
    }, 250);
}

// ==========================================================
// Event: Jalankan penyesuaian layout saat load & resize
// ==========================================================
window.addEventListener("load", adjustDashboardHeight);
window.addEventListener("resize", adjustDashboardHeight);
document.addEventListener("DOMContentLoaded", adjustDashboardHeight);