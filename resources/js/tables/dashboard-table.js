let table;

export function initDashboardTable() {
    table = $("#dashboard-table").DataTable();
}

// Load data wilayah ke tabel
export function loadRegionData(regionId) {
    $.get(`/dashboard/data/${regionId}`, function(data) {
        table.clear();
        table.rows.add(data);
        table.draw();
    });
}
