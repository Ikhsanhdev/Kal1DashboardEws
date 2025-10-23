// ==========================================================
// resources/js/map/geojson.js
// ==========================================================

// 🔹 Memuat GeoJSON dari folder public/geojson/
export async function loadRegionsGeoJson() {
  try {
    const res = await fetch("/geojson/data.json"); // Path ke public/geojson/
    const data = await res.json();

    // Bungkus dalam array agar mudah di-loop di initmap.js
    return [{ id: 1, name: "Wilayah Utama", geojson: data }];
  } catch (err) {
    console.error("❌ Gagal memuat GeoJSON:", err);
    return [];
  }
}

// 🔹 Variabel global yang akan diimpor di initmap.js
export let regionsGeoJson = [];

// 🔹 Muat otomatis saat diimport
loadRegionsGeoJson().then(data => (regionsGeoJson = data));
