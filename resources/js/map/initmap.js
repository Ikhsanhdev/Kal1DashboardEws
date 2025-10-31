// ==========================================================
// File: resources/js/map/initmap.js
// Deskripsi: Modul inisialisasi Google Map untuk dashboard
// ==========================================================

import { geojsonFiles } from "./geojson.js";
import { addRegionToList } from "./markers.js";

/**
 * Inisialisasi Google Map untuk dashboard (EWS, CCTV, dsb)
 * - Menentukan elemen map aktif secara otomatis
 * - Memuat layer GeoJSON dari geojsonFiles
 * - Menambahkan interaksi hover dan klik
 * - Menyimpan instance map ke window.dashboardMap
 */
export function initMap() {
    // ======================================================
    // 🔹 Temukan elemen peta yang aktif di halaman dashboard
    // ======================================================
    const mapElement =
        document.getElementById("map") ||
        document.getElementById("cctv-map") ||
        document.getElementById("ews-map");

    if (!mapElement) {
        console.error("❌ Tidak ditemukan elemen map di halaman manapun");
        return null;
    }

    // ======================================================
    // 🗺️ Inisialisasi Google Maps
    // ======================================================
    const map = new google.maps.Map(mapElement, {
        center: { lat: -0.7893, lng: 113.9213 }, // Tengah Indonesia
        zoom: 5.8,
        mapTypeId: "roadmap",
        gestureHandling: "greedy",
        streetViewControl: false,
        mapTypeControl: true,
        fullscreenControl: true,
    });

    // ======================================================
    // 🌙 Terapkan tema peta (Dark/Light)
    // ======================================================
    const theme = sessionStorage.getItem("theme") || "light";
    if (theme === "dark" && typeof window.darkThemeStyle !== "undefined") {
        map.setOptions({ styles: window.darkThemeStyle });
    }

    // ======================================================
    // 📁 Muat semua file GeoJSON dari geojson.js
    // ======================================================
    if (Array.isArray(geojsonFiles) && geojsonFiles.length > 0) {
        geojsonFiles.forEach(({ id, name, path, color }) => {
            fetch(path)
                .then((res) => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    return res.json();
                })
                .then((data) => {
                    const regionLayer = new google.maps.Data({ map });
                    regionLayer.addGeoJson(data);

                    // Style dasar wilayah
                    regionLayer.setStyle({
                        fillColor: color || "#3388ff",
                        fillOpacity: 0.35,
                        strokeColor: color || "#3388ff",
                        strokeWeight: 1.2,
                    });

                    // Hover efek
                    regionLayer.addListener("mouseover", (event) => {
                        regionLayer.overrideStyle(event.feature, {
                            fillColor: "#ffaa00",
                            fillOpacity: 0.55,
                        });
                    });

                    regionLayer.addListener("mouseout", (event) => {
                        regionLayer.revertStyle(event.feature);
                    });

                    // Klik area → kirim ke daftar/logika tambahan
                    regionLayer.addListener("click", () => {
                        if (typeof addRegionToList === "function") {
                            addRegionToList(id, name);
                        }
                    });

                    // Tambahkan label nama wilayah (sekali per layer)
                    regionLayer.addListener("addfeature", (event) => {
                        try {
                            const bounds = new google.maps.LatLngBounds();
                            event.feature.getGeometry().forEachLatLng((latlng) => {
                                bounds.extend(latlng);
                            });

                            const center = bounds.getCenter();
                            const label = new google.maps.InfoWindow({
                                content: `
                                    <div style="
                                        font-size:12px;
                                        font-weight:bold;
                                        color:#333;
                                        text-align:center;
                                    ">
                                        ${name}
                                    </div>`,
                                position: center,
                                disableAutoPan: true,
                            });

                            // Tampilkan label hanya pada zoom > 5
                            google.maps.event.addListenerOnce(map, "idle", () => {
                                if (map.getZoom() > 5) {
                                    label.open(map);
                                }
                            });
                        } catch (error) {
                            console.warn(`⚠️ Gagal membuat label untuk ${name}:`, error);
                        }
                    });
                })
                .catch((err) => {
                    console.error(`❌ Gagal memuat ${path}:`, err);
                });
        });
    } else {
        console.warn("⚠️ Tidak ada data GeoJSON yang dimuat dari geojson.js.");
    }

    // ======================================================
    // 💾 Simpan peta ke global untuk akses dari modul lain
    // ======================================================
    window.dashboardMap = map;
    console.log(`✅ Google Map (${mapElement.id}) berhasil diinisialisasi`);

    return map;
}

// ==========================================================
// 🔄 Callback global API Google Maps (dibutuhkan Google Maps API)
// ==========================================================
window.initMap = initMap;
