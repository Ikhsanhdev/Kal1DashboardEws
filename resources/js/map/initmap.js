// ==========================================================
// File: resources/js/map/initmap.js
// Deskripsi: Modul inisialisasi Google Map untuk dashboard
// ==========================================================

import { geojsonFiles } from "./geojson.js";
import { addRegionToList } from "./markers.js";
import * as turf from "@turf/turf";

/**
 * ==========================================================
 * Inisialisasi Google Map
 * ==========================================================
 * - Bisa diberi targetId spesifik ("map", "cctv-map", "ews-map")
 * - Jika tidak diberikan, otomatis deteksi elemen map aktif
 * - Memuat layer GeoJSON
 * - Menangani interaksi hover dan klik
 * - Menampilkan label wilayah
 * - Menyimpan instance map ke window.dashboardMap
 * ==========================================================
 */
export function initMap(targetId) {
    // Temukan elemen peta yang aktif / sesuai target
    const mapElement =
        (targetId && document.getElementById(targetId)) ||
        document.getElementById("map") ||
        document.getElementById("cctv-map") ||
        document.getElementById("ews-map");

    if (!mapElement) {
        console.error("No map element found on the page");
        return null;
    }

    // Inisialisasi Google Maps
    const map = new google.maps.Map(mapElement, {
        center: { lat: -0.7893, lng: 110.9213 }, // Tengah Indonesia
        zoom: 6.8,
        mapTypeId: "roadmap",
        // Scroll halaman, zoom map hanya saat Ctrl + scroll
        gestureHandling: "cooperative",
        streetViewControl: false,
        mapTypeControl: true,
        fullscreenControl: true,
    });

    // Tema Peta (Dark/Light Mode)
    const theme = sessionStorage.getItem("theme") || "light";
    if (theme === "dark" && typeof window.darkThemeStyle !== "undefined") {
        map.setOptions({ styles: window.darkThemeStyle });
    }

    const mapCard = mapElement.closest(".dashboard-map-card");
    const detailBox = mapCard ? mapCard.querySelector(".map-detail-box") : null;

    // ======================================================
    // Muat Layer GeoJSON dari geojson.js
    // ======================================================
    if (Array.isArray(geojsonFiles) && geojsonFiles.length > 0) {
        geojsonFiles.forEach(({ id, name, path, color }) => {
            fetch(path)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`HTTP ${res.status}`);
                    }
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

                    // Hover efek (highlight) + popup info
                    regionLayer.addListener("mouseover", (event) => {
                        regionLayer.overrideStyle(event.feature, {
                            fillColor: "#ffaa00",
                            fillOpacity: 0.55,
                        });

                        if (!detailBox) {
                            return;
                        }

                        try {
                            const props = {};
                            event.feature.forEachProperty((value, key) => {
                                props[key] = value;
                            });

                            const namaWs =
                                props.NAMA_WS ||
                                props.NAMAWS ||
                                props.nama_ws ||
                                props.NAMA ||
                                props.nama ||
                                name;

                            let shapeLeng =
                                props.SHAPE_Leng ||
                                props.SHAPE_LENG ||
                                props.shape_leng ||
                                props.SHAPE_Length ||
                                props.shape_length;

                            let shapeArea =
                                props.SHAPE_Area ||
                                props.SHAPE_AREA ||
                                props.shape_area;

                            const formatNumber = (value) => {
                                if (value === null || value === undefined) return null;

                                const num =
                                    typeof value === "number" ? value : parseFloat(value);

                                if (Number.isNaN(num)) {
                                    return value;
                                }

                                // FEWS-style: banyak desimal
                                return num.toFixed(8);
                            };

                            const updateBox = () => {
                                const shapeLengText = formatNumber(shapeLeng);
                                const shapeAreaText = formatNumber(shapeArea);

                                let html = "";
                                if (namaWs) {
                                    html += `<div style="margin-bottom:4px;"><strong>NAMA WS:</strong> ${namaWs}</div>`;
                                }
                                if (shapeLengText != null) {
                                    html += `<div><strong>SHAPE Leng:</strong> ${shapeLengText}</div>`;
                                }
                                if (shapeAreaText != null) {
                                    html += `<div><strong>SHAPE AREA:</strong> ${shapeAreaText}</div>`;
                                }

                                detailBox.innerHTML = html;
                                detailBox.style.display = html ? "block" : "none";
                            };

                            // Jika salah satu belum ada di properties, hitung otomatis dengan Turf.js
                            if (shapeLeng == null || shapeArea == null) {
                                event.feature.toGeoJson((featureGeoJson) => {
                                    try {
                                        const geom = featureGeoJson.geometry;

                                        // Hitung panjang (km)
                                        if (shapeLeng == null) {
                                            let lengthKm = 0;

                                            if (
                                                geom.type === "Polygon" ||
                                                geom.type === "MultiPolygon"
                                            ) {
                                                const line = turf.polygonToLine(featureGeoJson);
                                                lengthKm = turf.length(line, {
                                                    units: "kilometers",
                                                });
                                            } else if (
                                                geom.type === "LineString" ||
                                                geom.type === "MultiLineString"
                                            ) {
                                                lengthKm = turf.length(featureGeoJson, {
                                                    units: "kilometers",
                                                });
                                            }

                                            shapeLeng = lengthKm;
                                        }

                                        // Hitung luas (km2)
                                        if (shapeArea == null) {
                                            const areaM2 = turf.area(featureGeoJson);
                                            shapeArea = areaM2 / 1_000_000; // konversi m2 -> km2
                                        }
                                    } catch (err) {
                                        console.warn(
                                            "Failed to calculate length/area with Turf.js:",
                                            err,
                                        );
                                    }

                                    updateBox();
                                });
                            } else {
                                updateBox();
                            }
                        } catch (e) {
                            console.warn("Failed to show detail on hover:", e);
                        }
                    });

                    regionLayer.addListener("mouseout", (event) => {
                        regionLayer.revertStyle(event.feature);
                        if (detailBox) {
                            detailBox.innerHTML = "";
                            detailBox.style.display = "none";
                        }
                    });

                    // Klik area → kirim ke daftar / logika tambahan
                    regionLayer.addListener("click", () => {
                        if (typeof addRegionToList === "function") {
                            addRegionToList(id, name);
                        } else {
                            console.warn("addRegionToList function is not available.");
                        }
                    });

                    // Tambahkan label nama wilayah
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
                            console.warn(`Failed to create label for ${name}:`, error);
                        }
                    });
                })
                .catch((err) => {
                    console.error(`Failed to load GeoJSON ${path}:`, err);
                });
        });
    } else {
        console.warn("No GeoJSON configuration found in geojson.js.");
    }

    // Simpan peta ke global window
    window.dashboardMap = map;
    console.log(`Google Map (${mapElement.id}) initialized`);

    return map;
}

// ==========================================================
// Callback global (dibutuhkan oleh Google Maps API Loader)
// ==========================================================
window.initMap = initMap;