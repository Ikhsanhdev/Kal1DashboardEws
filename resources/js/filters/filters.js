import $ from "jquery";
import "selectize";
import { applyCctvView } from "../dashboards/cctv.js";

// =====================================================
// Inisialisasi Filters
// =====================================================
export function initFilters() {
    console.log("Filters initialized");

    // =====================================================
    // Opsi Filter per Dashboard
    // =====================================================
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
            view: ["Maps + CCTV", "Maps Only", "CCTV Only"],
        },
        "dashboard-ews": {
            ewstype: [
                "Forecast",
                "Nearcast",
                "Tanggap Darurat",
                "Evacuation Point & Route",
            ],
        },
    };

    // =====================================================
    // Helper: Isi selectize dengan item dinamis
    // =====================================================
    const showSelect = (selector, items) => {
        const $select = $(selector);
        if (!$select.length || !$select[0].selectize) return;

        const selectize = $select[0].selectize;
        selectize.clearOptions();

        items.forEach((item) => {
            selectize.addOption({
                value: item.trim().toLowerCase().replace(/\s+/g, "-"),
                text: item,
            });
        });

        selectize.refreshOptions(false);

        if (items.length > 0) {
            const firstValue = items[0].trim().toLowerCase().replace(/\s+/g, "-");
            selectize.setValue(firstValue);
        }
    };

    // =====================================================
    // Kontrol tampilan View (khusus Dashboard Data)
    // =====================================================
    const applyView = (selected) => {
        const tableContainer = document.getElementById("table-container");
        const mapContainer = document.getElementById("map");

        if (!tableContainer || !mapContainer) return;

        // Reset display
        tableContainer.style.display = "none";
        mapContainer.style.display = "none";

        // Hanya atur visibilitas; tinggi diatur oleh CSS
        switch (selected) {
            case "table-only":
                tableContainer.style.display = "block";
                break;

            case "map-only":
                mapContainer.style.display = "block";
                break;

            default:
                // "table-+-maps" atau nilai lain -> tampilkan keduanya
                tableContainer.style.display = "block";
                mapContainer.style.display = "block";
                break;
        }
    };

    // =====================================================
    // Switch antar Dashboard Layout
    // =====================================================
    const switchDashboardLayout = (type) => {
        $(".dashboard-container").removeClass("active");
        $(`#${type}-container`).addClass("active");
    };

    // =====================================================
    // Inisialisasi semua Selectize (kecuali dashboard-type)
    // =====================================================
    $("select")
        .not("#dashboard-type")
        .selectize({
            create: false,
            sortField: "text",
        });

    // =====================================================
    // Inisialisasi Selectize utama (Dashboard Type)
    // =====================================================
    const dashboardTypeSelect = $("#dashboard-type")
        .selectize({
            create: false,
            sortField: "text",
            placeholder: "Pilih Dashboard",
            onChange(value) {
                // Sembunyikan semua group filter lain kecuali dashboard-type
                $(".filter-group").not(":has(#dashboard-type)").hide();

                // Tampilkan layout dashboard sesuai pilihan (CSS)
                switchDashboardLayout(value);

                // Panggil mekanisme utama di index.js
                if (typeof window !== "undefined" && typeof window.initDashboard === "function") {
                    window.initDashboard(value);
                }

                if (!value || !options[value]) return;

                switch (value) {
                    // ========================================
                    // DASHBOARD DATA
                    // ========================================
                    case "dashboard-data": {
                        showSelect("#filter-sebaran", options[value].sebaran);
                        showSelect("#filter-waktu", options[value].waktu);
                        showSelect("#filter-view", options[value].view);

                        $("#group-sebaran, #group-waktu, #group-view").show();

                        const viewSelect = $("#filter-view")[0].selectize;
                        if (viewSelect) {
                            viewSelect.off("change");
                            viewSelect.on("change", (val) => applyView(val));
                        }

                        applyView("table-+-maps");
                        break;
                    }

                    // ========================================
                    // DASHBOARD CCTV
                    // ========================================
                    case "dashboard-cctv": {
                        showSelect("#filter-kategori-cctv", options[value].kategori);
                        showSelect("#filter-wilayah", options[value].wilayah);
                        showSelect("#filter-view-cctv", options[value].view);

                        $("#group-kategori-cctv, #group-wilayah, #group-view-cctv").show();

                        const cctvViewSelect = $("#filter-view-cctv")[0].selectize;
                        if (cctvViewSelect) {
                            cctvViewSelect.off("change");
                            cctvViewSelect.on("change", (val) => applyCctvView(val));
                        }

                        applyCctvView("maps-+-cctv");
                        break;
                    }

                    // ========================================
                    // DASHBOARD EWS
                    // ========================================
                    case "dashboard-ews": {
                        showSelect("#filter-ews-type", options[value].ewstype);
                        $("#group-ews-type").show();
                        break;
                    }
                }
            },
        })[0].selectize;

    // =====================================================
    // Set Default Dashboard (Data)
    // =====================================================
    dashboardTypeSelect.setValue("dashboard-data");
    dashboardTypeSelect.onChange("dashboard-data");
}