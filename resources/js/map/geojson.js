// ==========================================================
// FILE: resources/js/map/geojson.js
// Deskripsi: Daftar file GeoJSON & fungsi pemuatannya
// ==========================================================

export const geojsonFiles = [
    {
        id: 1,
        name: "Wilayah Biru",
        path: "/geojson/map biru5.geojson",
        color: "#007bff",
    },
    {
        id: 2,
        name: "Wilayah Coklat",
        path: "/geojson/map coklat1.geojson",
        color: "#8B4513",
    },
    {
        id: 3,
        name: "Wilayah Ijo Muda",
        path: "/geojson/map ijomuda4.geojson",
        color: "#28a745",
    },
    {
        id: 4,
        name: "Wilayah Ijo tua",
        path: "/geojson/map ijotua2.geojson",
        color: "#17a2b8",
    },
    {
        id: 5,
        name: "Wilayah Ungu",
        path: "/geojson/map ungu3.geojson",
        color: "#6f42c1",
    },
];

// Opsional — helper untuk memuat layer jika mau pakai terpisah
export function loadGeoJSONLayers(map) {
    geojsonFiles.forEach(({ path, color }) => {
        fetch(path)
            .then((res) => res.json())
            .then((data) => {
                const layer = new google.maps.Data({ map });
                layer.addGeoJson(data);
                layer.setStyle({
                    fillColor: color,
                    fillOpacity: 0.35,
                    strokeColor: color,
                    strokeWeight: 1.2,
                });

                layer.addListener("mouseover", (event) => {
                    layer.overrideStyle(event.feature, {
                        fillColor: "#ffaa00",
                        fillOpacity: 0.55,
                    });
                });

                layer.addListener("mouseout", (event) => {
                    layer.revertStyle(event.feature);
                });
            })
            .catch((err) => console.error(`Failed to load GeoJSON ${path}:`, err));
    });
}