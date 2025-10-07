import $ from "jquery";
import "selectize";

// =============================
// Inisialisasi Filters
// =============================
export function initFilters() {
    console.log("✅ Filters initialized");

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
            view: ["Table + Maps", "Table Only", "Map Only"],
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

    // =============================
    // Helper untuk isi selectize
    // =============================
    function showSelect(selector, items) {
        const element = $(selector)[0];
        if (!element || !element.selectize) return;

        const selectize = element.selectize;
        selectize.clearOptions();

        items.forEach((item) =>
            selectize.addOption({
                value: item.trim().toLowerCase().replace(/\s+/g, "-"),
                text: item,
            })
        );

        selectize.refreshOptions(false);
        if (items.length > 0)
            selectize.setValue(
                items[0].trim().toLowerCase().replace(/\s+/g, "-")
            );
    }

    // =============================
    // Kontrol tampilan View (Table/Map)
    // =============================
    function applyView(selected) {
        const tableContainer = document.getElementById("table-container");
        const mapContainer = document.getElementById("map-container");

        if (!tableContainer || !mapContainer) return;

        // Reset dulu
        tableContainer.style.display = "none";
        mapContainer.style.display = "none";
        tableContainer.style.height = "250px";
        mapContainer.style.height = "calc(100% - 250px)";

        if (selected === "table-only") {
            tableContainer.style.display = "block";
            tableContainer.style.height = "100%";   // Table full
        } else if (selected === "map-only") {
            mapContainer.style.display = "block";
            mapContainer.style.height = "100%";     // Map full
        } else {
            // Table + Maps
            tableContainer.style.display = "block";
            mapContainer.style.display = "block";
        }
    }

    // =============================
    // Switch antar dashboard layout
    // =============================
    function switchDashboardLayout(type) {
        $(".dashboard-container").hide();

        if (type === "dashboard-data") {
            $("#dashboard-data-container").show();
        } else if (type === "dashboard-cctv") {
            $("#dashboard-cctv-container").show();
        } else if (type === "ews") {
            $("#dashboard-ews-container").show();
        }
    }

    // =============================
    // Inisialisasi Selectize
    // =============================
    $("select").not("#dashboard-type").selectize({
        create: false,
        sortField: "text",
    });

    const dashboardTypeSelect = $("#dashboard-type")
        .selectize({
            create: false,
            sortField: "text",
            placeholder: "Pilih Dashboard",
            onChange: function (value) {
                $(".filter-group").hide();
                switchDashboardLayout(value); // 🔹 Ganti layout

                // 🔹 Load data map (jika ada)
                if (typeof window.loadMapData === "function") {
                    window.loadMapData(value);
                }

                if (!value || !options[value]) return;

                switch (value) {
                    case "dashboard-data":
                        showSelect("#filter-sebaran", options[value].sebaran);
                        showSelect("#filter-waktu", options[value].waktu);
                        showSelect("#filter-view", options[value].view);
                        $("#group-sebaran, #group-waktu, #group-view").show();

                        // Listener untuk filter View
                        const viewSelect = $("#filter-view")[0].selectize;
                        viewSelect.off("change"); // reset listener lama
                        viewSelect.on("change", function (val) {
                            applyView(val);
                        });

                        // Set awal → Table + Maps
                        applyView("table-+-maps");
                        break;

                    case "dashboard-cctv":
                        showSelect("#filter-kategori-cctv", options[value].kategori);
                        showSelect("#filter-wilayah", options[value].wilayah);
                        showSelect("#filter-view-cctv", options[value].view);
                        $("#group-kategori-cctv, #group-wilayah, #group-view-cctv").show();
                        break;

                    case "ews":
                        showSelect("#filter-ews-type", options[value].ewstype);
                        $("#group-ews-type").show();
                        break;
                }
            },
        })[0]
        .selectize;

    // =============================
    // Set default dashboard
    // =============================
    dashboardTypeSelect.setValue("dashboard-data");
    dashboardTypeSelect.onChange("dashboard-data");
}
