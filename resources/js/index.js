// resources/js/index.js

// Import modul filter, map, dan table
import { initFilters } from "./filters/filters.js";
import { initmap } from "./map/initmap.js";
import "./tables/dashboard-table.js"; // cuma import, auto-run di dalamnya

// Library tambahan
import $ from "jquery";
import "jquery-knob";

// =============================
// jQuery knob (untuk grafik lingkaran jika ada)
// =============================
$(function () {
    if ($(".knob").length) {
        $(".knob").knob();
        console.log("✅ jQuery Knob initialized");
    }
});

// =============================
// DOM Ready
// =============================
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM Ready");

    try {
        // Inisialisasi filter dropdown
        initFilters();
        console.log("✅ Filters initialized dari index.js");
    } catch (e) {
        console.error("❌ Gagal init Filters:", e);
    }

    try {
        // Inisialisasi Google Maps (jika API sudah siap)
        if (typeof google !== "undefined" && google.maps) {
            initmap();
            console.log("✅ Google Maps initialized dari index.js");
        } else {
            console.warn("⚠️ Google Maps API belum siap. Tunggu callback window.initMap");
        }
    } catch (e) {
        console.error("❌ Gagal init Google Maps:", e);
    }
});

// =============================
// Callback untuk Google Maps API
// (dipanggil otomatis oleh <script> di blade)
// =============================
window.initMap = () => {
    try {
        initmap();
        console.log("✅ Google Maps initialized dari window.initMap");
    } catch (e) {
        console.error("❌ Error saat initMap callback:", e);
    }
};
