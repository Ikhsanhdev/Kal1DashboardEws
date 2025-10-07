// resources/js/map/initmap.js
import { regionsGeoJson } from "./geojson.js";
import { addRegionToList } from "./markers.js";

export function initmap() {
    const mapElement = document.getElementById("map");
    if (!mapElement) {
        console.error("❌ Elemen #map tidak ditemukan");
        return;
    }

    // Inisialisasi Google Maps
    const map = new google.maps.Map(mapElement, {
        center: { lat: -6.914744, lng: 107.60981 }, // Bandung default
        zoom: 10,
        mapTypeId: "roadmap",
    });

    // =========================
    // Theme: Dark / Light
    // =========================
    const theme = sessionStorage.getItem("theme") || "light";
    if (theme === "dark" && typeof window.darkThemeStyle !== "undefined") {
        map.setOptions({ styles: window.darkThemeStyle });
    }

    // =========================
    // Tambahkan GeoJSON Wilayah
    // =========================
    regionsGeoJson.forEach(region => {
        const regionLayer = new google.maps.Data({ map });

        regionLayer.addGeoJson(region.geojson);

        // Style default
        regionLayer.setStyle({
            fillColor: "#00aaff",
            fillOpacity: 0.4,
            strokeColor: "#004466",
            strokeWeight: 1,
        });

        // Hover efek
        regionLayer.addListener("mouseover", (event) => {
            regionLayer.overrideStyle(event.feature, {
                fillColor: "#ffaa00",
                fillOpacity: 0.6,
            });
        });

        regionLayer.addListener("mouseout", (event) => {
            regionLayer.revertStyle(event.feature);
        });

        // Klik polygon → tambahkan ke Blue Box
        regionLayer.addListener("click", () => {
            addRegionToList(region.id, region.name);
        });
    });

    // Simpan ke global supaya bisa diakses file lain
    window.dashboardMap = map;
    console.log("✅ Google Map initialized");
}

// Callback untuk Google Maps API
window.initMap = initmap;
