// Variabel global
let map;
let highlightCircle = null;

// Fungsi untuk membuat circle highlight
function createHighlightCircle(highlightData) {
    // Hapus circle sebelumnya jika ada
    if (highlightCircle) {
        highlightCircle.setMap(null);
    }

    // Buat circle baru
    highlightCircle = new google.maps.Circle({
        strokeColor: highlightData.color,
        strokeOpacity: 0.8,
        strokeWeight: highlightData.strokeWeight,
        fillColor: highlightData.fillColor,
        fillOpacity: highlightData.fillOpacity,
        map: map,
        center: {
            lat: highlightData.center_lat,
            lng: highlightData.center_lng,
        },
        radius: highlightData.radius,
    });

    // Tambahkan info window
    const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong>${highlightData.name}</strong><br>Radius: ${
            highlightData.radius / 1000
        }km</div>`,
    });

    // Event listener untuk click
    highlightCircle.addListener("click", function (event) {
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
    });

    console.log(
        "Highlight circle created at:",
        highlightData.center_lat,
        highlightData.center_lng
    );
}

// Fungsi untuk load map data
function loadMapData(dashboardType = "dashboard-data") {
    const url = dashboardType
        ? `/api/filtered-map-data?dashboard_type=${dashboardType}`
        : "/api/map-data";

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            console.log("Received data:", data);

            // Render highlight area
            if (data.highlight_area) {
                createHighlightCircle(data.highlight_area);
                console.log("Creating highlight circle...");
            } else {
                console.log("No highlight_area found in response");
            }

            // Render markers jika ada
            if (data.locations && data.locations.length > 0) {
                renderMarkers(data.locations);
            }
        })
        .catch((error) => {
            console.error("Error loading map data:", error);
        });
}

// Fungsi untuk render markers
function renderMarkers(locations) {
    locations.forEach((location) => {
        const marker = new google.maps.Marker({
            position: { lat: location.latitude, lng: location.longitude },
            map: map,
            title: location.name,
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `<div><strong>${location.name}</strong><br>${location.description}</div>`,
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
    });
}

// Fungsi untuk inisialisasi map (Google Maps)
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: { lat: -6.914744, lng: 107.60981 }, // Center on Bandung
        mapTypeId: "terrain",
    });

    console.log("Map initialized");

    // Load data setelah map ready
    loadMapData("dashboard-data");
}

// jQuery ready function
$(document).ready(function () {
    console.log("Document ready");

    const options = {
        "dashboard-data": {
            sebaran: [
                "POS Curah Hujan",
                "POS Duga Air",
                "POS Duga Air Pasang Surut",
                "POS Iklim",
                "POS WQMS",
            ],
            waktu: ["1 Jam Terakhir", "3 Jam Terakhir", "6 Jam Terakhir"],
            view: ["Table + Maps", "Table Only", "Maps Only"],
        },
        "dashboard-cctv": {
            kategori: ["Kategori A", "Kategori B", "Kategori C"],
            wilayah: ["Wilayah I", "Wilayah II", "Wilayah III"],
            view: ["CCTV Only", "CCTV + Data"],
        },
        ews: {
            ewstype: [
                "Forecast",
                "Nearcast",
                "Tanggap Darurat",
                "Evacuation Point & Route",
            ],
        },
    };

    // Fungsi isi dropdown
    function showSelect(selector, items) {
        const element = $(selector)[0];
        if (!element || !element.selectize) return;
        let selectize = element.selectize;
        selectize.clearOptions();
        items.forEach((item) => {
            selectize.addOption({
                value: item.trim().toLowerCase().replace(/\s+/g, "-"),
                text: item,
            });
        });
        selectize.refreshOptions(false);
        if (items.length > 0) {
            selectize.setValue(
                items[0].trim().toLowerCase().replace(/\s+/g, "-")
            );
        }
    }

    // Inisialisasi select
    $("select").not("#dashboard-type").selectize({
        create: false,
        sortField: "text",
    });

    // Dashboard type select dengan event
    let dashboardTypeSelect = $("#dashboard-type").selectize({
        create: false,
        sortField: "text",
        placeholder: "Pilih Dashboard",
        onChange: function (value) {
            console.log("Dashboard type changed to:", value);

            $(".filter-group").hide();

            // Load map data untuk dashboard type yang dipilih
            if (map) {
                loadMapData(value);
            }

            if (!value || !options[value]) return;

            switch (value) {
                case "dashboard-data":
                    showSelect("#filter-sebaran", options[value].sebaran);
                    showSelect("#filter-waktu", options[value].waktu);
                    showSelect("#filter-view", options[value].view);
                    $("#group-sebaran, #group-waktu, #group-view").show();
                    break;
                case "dashboard-cctv":
                    showSelect(
                        "#filter-kategori-cctv",
                        options[value].kategori
                    );
                    showSelect("#filter-wilayah", options[value].wilayah);
                    showSelect("#filter-view-cctv", options[value].view);
                    $(
                        "#group-kategori-cctv, #group-wilayah, #group-view-cctv"
                    ).show();
                    break;
                case "ews":
                    showSelect("#filter-ews-type", options[value].ewstype);
                    $("#group-ews-type").show();
                    break;
            }
        },
    })[0].selectize;

    // Set default
    dashboardTypeSelect.setValue("dashboard-data");
});

// Pastikan initMap tersedia secara global
window.initMap = initMap;
