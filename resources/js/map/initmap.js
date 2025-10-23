// ==========================================================
// resources/js/map/initmap.js
// ==========================================================

import { regionsGeoJson } from "./geojson.js";
import { addRegionToList } from "./markers.js";

export function initMap() {
    // ====== Cari elemen peta yang aktif di dashboard ======
    const mapElement =
        document.getElementById("map") ||
        document.getElementById("cctv-map") ||
        document.getElementById("ews-map");

    if (!mapElement) {
        console.error("❌ Tidak ditemukan elemen map di halaman manapun");
        return;
    }

    // ====== Inisialisasi Google Maps ======
    const map = new google.maps.Map(mapElement, {
        center: { lat: -6.914744, lng: 107.60981 }, // Bandung
        zoom: 10,
        mapTypeId: "roadmap",
        gestureHandling: "greedy",
        streetViewControl: false,
        mapTypeControl: true,
        fullscreenControl: true,
    });

    // ====== Tema Peta (Dark/Light) ======
    const theme = sessionStorage.getItem("theme") || "light";
    if (theme === "dark" && typeof window.darkThemeStyle !== "undefined") {
        map.setOptions({ styles: window.darkThemeStyle });
    }

    // ====== Load GeoJSON ======
    if (regionsGeoJson && regionsGeoJson.length > 0) {
        regionsGeoJson.forEach((region) => {
            const regionLayer = new google.maps.Data({ map });
            regionLayer.addGeoJson(region.geojson);

            regionLayer.setStyle({
                fillColor: "#00aaff",
                fillOpacity: 0.35,
                strokeColor: "#006699",
                strokeWeight: 1,
            });

            // Hover effect
            regionLayer.addListener("mouseover", (event) => {
                regionLayer.overrideStyle(event.feature, {
                    fillColor: "#ffaa00",
                    fillOpacity: 0.55,
                });
            });

            regionLayer.addListener("mouseout", (event) => {
                regionLayer.revertStyle(event.feature);
            });

            // Klik area => kirim ke daftar
            regionLayer.addListener("click", (event) => {
                addRegionToList(region.id, region.name);
            });

            // Label nama di tengah area
            regionLayer.addListener("addfeature", (event) => {
                const bounds = new google.maps.LatLngBounds();
                event.feature.getGeometry().forEachLatLng((latlng) => {
                    bounds.extend(latlng);
                });

                const center = bounds.getCenter();
                new google.maps.InfoWindow({
                    content: `<div style="font-size:12px;font-weight:bold;color:#333">${region.name}</div>`,
                    position: center,
                }).open(map);
            });
        });
    } else {
        console.warn("⚠️ Tidak ada data GeoJSON yang dimuat.");
    }

    // ====== Simpan map ke global ======
    window.dashboardMap = map;
    console.log(`✅ Google Map (${mapElement.id}) berhasil diinisialisasi`);
}

// ====== Callback API Google Maps ======
window.initMap = initMap;
