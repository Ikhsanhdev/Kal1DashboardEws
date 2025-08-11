$(document).ready(function () {
    const options = {
        'dashboard-data': {
            sebaran: ['POS Curah Hujan', 'POS Duga Air', 'POS Duga Air Pasang Surut', 'POS Iklim', 'POS WQMS'],
            waktu: ['1 Jam Terakhir', '3 Jam Terakhir', '6 Jam Terakhir'],
            view: ['Table + Maps', 'Table Only', 'Maps Only']
        },
        'dashboard-cctv': {
            kategori: ['Kategori A', 'Kategori B', 'Kategori C'],
            wilayah: ['Wilayah I', 'Wilayah II', 'Wilayah III'],
            view: ['CCTV Only', 'CCTV + Data']
        },
        'ews': {
            ewstype: ['Forecast', 'Nearcast', 'Tanggap Darurat', 'Evacuation Point & Route']
        }
    };

    // Fungsi isi dropdown
    function showSelect(selector, items) {
        const element = $(selector)[0];
        if (!element || !element.selectize) return;

        let selectize = element.selectize;
        selectize.clearOptions();
        items.forEach(item => {
            selectize.addOption({ value: item.trim().toLowerCase().replace(/\s+/g, '-'), text: item });
        });
        selectize.refreshOptions(false);
        if (items.length > 0) {
            selectize.setValue(items[0].trim().toLowerCase().replace(/\s+/g, '-'));
        }
    }

    // Inisialisasi select kecuali dashboard-type
    $('select').not('#dashboard-type').selectize({
        create: false,
        sortField: 'text'
    });

    // Inisialisasi dashboard-type
    let dashboardTypeSelect = $('#dashboard-type').selectize({
        create: false,
        sortField: 'text',
        placeholder: 'Pilih Dashboard',
        onChange: function (value) {
            $('.filter-group').hide();
            if (!value || !options[value]) return;

            switch (value) {
                case 'dashboard-data':
                    showSelect('#filter-sebaran', options[value].sebaran);
                    showSelect('#filter-waktu', options[value].waktu);
                    showSelect('#filter-view', options[value].view);
                    $('#group-sebaran, #group-waktu, #group-view').show();
                    break;
                case 'dashboard-cctv':
                    showSelect('#filter-kategori-cctv', options[value].kategori);
                    showSelect('#filter-wilayah', options[value].wilayah);
                    showSelect('#filter-view-cctv', options[value].view);
                    $('#group-kategori-cctv, #group-wilayah, #group-view-cctv').show();
                    break;
                case 'ews':
                    showSelect('#filter-ews-type', options[value].ewstype);
                    $('#group-ews-type').show();
                    break;
            }
        }
    })[0].selectize;

    // ==== Set default Dashboard Type saat load ====
    dashboardTypeSelect.setValue('dashboard-data'); // ini akan otomatis trigger onChange

});
