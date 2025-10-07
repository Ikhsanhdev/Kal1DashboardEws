// resources/js/map/markers.js
//import { loadRegionData } from "../tables/dashboard-table.js";

// Tambah wilayah ke Blue Box
export function addRegionToList(regionId, regionName) {
    if ($(`#region-list li[data-id="${regionId}"]`).length === 0) {
        $("#region-list").append(`
            <li class="list-group-item region-item" data-id="${regionId}">
                ${regionName}
            </li>
        `);
    }
}

// Klik item di Blue Box → load data ke tabel
$(document).on("click", ".region-item", function() {
    const regionId = $(this).data("id");
    loadRegionData(regionId);
});
