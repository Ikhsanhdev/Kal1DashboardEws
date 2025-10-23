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
        console.log("✅ jQuery Knob initialized");
    }
});

// ==========================================================
// Fungsi: Inisialisasi Dashboard sesuai dropdown
// ==========================================================
function initDashboard(type) {
    console.log(`⚙️ Ganti dashboard ke: ${type}`);

    $(".dashboard-container").removeClass("active");
    destroyCctvDashboard?.();
    $(`#${type}-container`).addClass("active");

    switch (type) {
        case "dashboard-data":
            console.log("📊 Inisialisasi Dashboard Data...");
            if (document.getElementById("map") && typeof initMap === "function") initMap();
            break;

        case "dashboard-cctv":
            console.log("🎥 Inisialisasi Dashboard CCTV...");
            try {
                initCctvDashboard();
                console.log("✅ CCTV Dashboard otomatis aktif");
            } catch (e) {
                console.error("❌ Gagal inisialisasi CCTV Dashboard:", e);
            }
            break;

        case "dashboard-ews":
            console.log("🚨 Inisialisasi Dashboard EWS...");
            if (typeof initMap === "function") initMap();
            break;

        default:
            console.warn("⚠️ Tipe dashboard tidak dikenal:", type);
    }
}

// ==========================================================
// DOM Ready
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM Ready");

    // ---- 1️⃣ Inisialisasi Filter ----
    try {
        initFilters();
        console.log("✅ Filters initialized dari index.js");
    } catch (e) {
        console.error("❌ Gagal init Filters:", e);
    }

    // ---- 2️⃣ Inisialisasi Map jika elemen tersedia ----
    try {
        const mapElement = document.getElementById("map");
        if (mapElement && window.google && google.maps) {
            console.log("🌍 Inisialisasi Google Maps dari index.js...");
            initMap();
        } else {
            console.warn("⚠️ Google Maps API belum siap atau #map tidak ditemukan.");
        }
    } catch (e) {
        console.error("❌ Gagal init Google Maps:", e);
    }

    // ---- 3️⃣ Dropdown Ganti Dashboard ----
    const dashboardSelect = document.getElementById("dashboard-type");
    if (dashboardSelect) {
        dashboardSelect.addEventListener("change", (e) => initDashboard(e.target.value));
    }

    // ---- 4️⃣ Jalankan Dashboard Default ----
    const defaultDashboard = dashboardSelect?.value || "dashboard-data";
    initDashboard(defaultDashboard);
});

// ==========================================================
// Callback untuk Google Maps API
// ==========================================================
window.initMap = () => {
    try {
        console.log("✅ Google Maps callback initMap dipanggil");
        initMap();
    } catch (e) {
        console.error("❌ Error saat initMap callback:", e);
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
    if (wrapper) wrapper.style.height = `calc(100vh - ${headerHeight}px)`;

    const rightPanel = document.querySelector(".right-panel");
    if (rightPanel) rightPanel.style.height = `calc(100vh - ${headerHeight}px)`;

    // Trigger resize map
    setTimeout(() => {
        if (window.dashboardMap && window.google && google.maps) {
            try {
                google.maps.event.trigger(window.dashboardMap, "resize");
                if (window.dashboardMapCenter) window.dashboardMap.setCenter(window.dashboardMapCenter);
            } catch (e) {
                console.warn("⚠️ Gagal trigger map resize:", e);
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
