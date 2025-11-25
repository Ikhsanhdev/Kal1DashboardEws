let table;

const SAMPLE_ROWS = [
    {
        no: 1,
        nama_pos: "ARR KARANGAN",
        wilayah_sungai: "-",
        das: "-",
        tanggal: "10 November 2025",
        ch: 0,
        intensitas: "Tidak Ada Hujan",
    },
    {
        no: 2,
        nama_pos: "ARR NGABANG",
        wilayah_sungai: "Kapuas",
        das: "-",
        tanggal: "14 November 2025",
        ch: 0,
        intensitas: "Tidak Ada Hujan",
    },
    {
        no: 3,
        nama_pos: "ARR DABONG",
        wilayah_sungai: "Kapuas",
        das: "-",
        tanggal: "14 November 2025",
        ch: 0,
        intensitas: "Tidak Ada Hujan",
    },
    {
        no: 4,
        nama_pos: "ARR BATU AMPAR",
        wilayah_sungai: "Kapuas",
        das: "-",
        tanggal: "14 November 2025",
        ch: 0,
        intensitas: "Tidak Ada Hujan",
    },
    {
        no: 5,
        nama_pos: "ARR TEBANG KACANG",
        wilayah_sungai: "Kapuas",
        das: "-",
        tanggal: "06 November 2025",
        ch: 0,
        intensitas: "Tidak Ada Hujan",
    },
    {
        no: 6,
        nama_pos: "ARR PANCARBODA",
        wilayah_sungai: "Kapuas",
        das: "-",
        tanggal: "14 November 2025",
        ch: 0,
        intensitas: "Tidak Ada Hujan",
    },
    {
        no: 7,
        nama_pos: "ARR KUBU",
        wilayah_sungai: "Kapuas",
        das: "-",
        tanggal: "14 November 2025",
        ch: 0,
        intensitas: "Tidak Ada Hujan",
    },
    {
        no: 8,
        nama_pos: "ARR KANTOR BALAI",
        wilayah_sungai: "Kapuas",
        das: "-",
        tanggal: "14 November 2025",
        ch: 0,
        intensitas: "Tidak Ada Hujan",
    },
];

export function initDashboardTable() {
    // Pastikan DataTables sudah siap
    if (!window.$ || !$.fn || !$.fn.DataTable) {
        console.error("DataTables is not ready");
        return;
    }

    // Kalau sudah pernah di-init, cukup isi ulang datanya
    if ($.fn.dataTable.isDataTable("#dashboard-table")) {
        table = $("#dashboard-table").DataTable();
        table.clear();
        table.rows.add(SAMPLE_ROWS);
        table.draw();
        return;
    }

    // Inisialisasi pertama kali
    table = $("#dashboard-table").DataTable({
        paging: false,
        searching: true,
        info: false,
        ordering: false,
        data: SAMPLE_ROWS,
        columns: [
            { data: "no" },
            { data: "nama_pos" },
            { data: "wilayah_sungai" },
            { data: "das" },
            { data: "tanggal" },
            { data: "ch" },
            { data: "intensitas" },
        ],
        // Hanya tampilkan body table, search pakai input custom
        dom: "t",
    });

    const $searchInput = $("#dashboard-search");
    if ($searchInput.length) {
        $searchInput.on("keyup change", function () {
            table.search(this.value).draw();
        });
    }
}

// Fungsi lama tetap ada kalau nanti mau ambil data dari API
export function loadRegionData(regionId) {
    if (!table) return;

    $.get(`/dashboard/data/${regionId}`, (data) => {
        table.clear();
        table.rows.add(data);
        table.draw();
    });
}

// Auto-init saat DOM siap
if (document.readyState !== "loading") {
    initDashboardTable();
} else {
    document.addEventListener("DOMContentLoaded", initDashboardTable);
}