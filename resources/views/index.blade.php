@extends('layouts.app')
@section('title', 'Dashboard')

@push('styles')
    {{-- ==========================================================
         Vendor & Library CSS
    ========================================================== --}}
    <link href="{{ asset('assets/libs/mohithg-switchery/switchery.min.css') }}" rel="stylesheet" />
    <link href="{{ asset('assets/libs/multiselect/css/multi-select.css') }}" rel="stylesheet" />
    <link href="{{ asset('assets/libs/select2/css/select2.min.css') }}" rel="stylesheet" />
    <link href="{{ asset('assets/libs/selectize/css/selectize.bootstrap3.css') }}" rel="stylesheet" />
    <link href="{{ asset('assets/libs/bootstrap-touchspin/jquery.bootstrap-touchspin.min.css') }}" rel="stylesheet" />
    <link href="https://cdn.datatables.net/1.13.5/css/jquery.dataTables.min.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet" />

    {{-- ==========================================================
         Custom Styles (via Vite)
    ========================================================== --}}
    @vite('resources/css/app.css')
@endpush

@section('content')
<div class="d-flex h-100">
    {{-- ==========================================================
         Sidebar: Filter Panel
    ========================================================== --}}
    <div class="right-panel">

        {{-- === Pilihan Dashboard === --}}
        <div class="filter-group">
            <label for="dashboard-type">Dashboard Type</label>
            <select id="dashboard-type">
                <option value="">-- Pilih Dashboard --</option>
                <option value="dashboard-data">Dashboard Data</option>
                <option value="dashboard-cctv">Dashboard CCTV</option>
                <option value="dashboard-ews">EWS</option>
            </select>
        </div>

        {{-- === Filter Umum === --}}
        <div id="group-sebaran" class="filter-group">
            <label for="filter-sebaran">Filter Sebaran</label>
            <select id="filter-sebaran"></select>
        </div>
        <div id="group-waktu" class="filter-group">
            <label for="filter-waktu">Filter Waktu</label>
            <select id="filter-waktu"></select>
        </div>
        <div id="group-view" class="filter-group">
            <label for="filter-view">View</label>
            <select id="filter-view"></select>
        </div>

        {{-- === Filter CCTV === --}}
        <div id="group-kategori-cctv" class="filter-group">
            <label for="filter-kategori-cctv">Kategori CCTV</label>
            <select id="filter-kategori-cctv"></select>
        </div>
        <div id="group-wilayah" class="filter-group">
            <label for="filter-wilayah">Filter Wilayah</label>
            <select id="filter-wilayah"></select>
        </div>
        <div id="group-view-cctv" class="filter-group">
            <label for="filter-view-cctv">View CCTV</label>
            <select id="filter-view-cctv"></select>
        </div>

        {{-- === Filter EWS === --}}
        <div id="group-ews-type" class="filter-group">
            <label for="filter-ews-type">EWS Type</label>
            <select id="filter-ews-type"></select>
        </div>
    </div>

    {{-- ==========================================================
         Main Content Area
    ========================================================== --}}
    <div class="main-area">

        {{-- === Dashboard: Data === --}}
        <div id="dashboard-data-container" class="dashboard-container">
            <div id="table-container" class="dashboard-card">
                <table id="dashboard-table" class="table table-sm table-bordered table-striped mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>No</th>
                            <th>Segment</th>
                            <th>CH</th>
                            <th>Existing</th>
                            <th>Forecast</th>
                            <th>Capacity</th>
                            <th>% Existing</th>
                            <th>% Forecast</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>

            <div id="map-container" class="dashboard-card flex-grow-1">
                <div id="map"></div>
            </div>
        </div>

        {{-- === Dashboard: CCTV === --}}
        <div id="dashboard-cctv-container" class="dashboard-container">
    <div class="dashboard-card mb-3 p-2">
        <div id="cctv-slider" class="d-flex align-items-center justify-content-between"></div>
    </div>

    <div class="dashboard-card p-2" style="height: 600px;">
        <div id="cctv-map" class="w-100 h-100"></div>
    </div>
</div>


        {{-- === Dashboard: EWS === --}}
        <div id="dashboard-ews-container" class="dashboard-container">
            <div class="dashboard-card flex-grow-1">
                <div id="ews-map"></div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
    {{-- ==========================================================
         Library JS
    ========================================================== --}}
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="{{ asset('assets/libs/selectize/js/standalone/selectize.min.js') }}"></script>
    <script src="https://cdn.datatables.net/1.13.5/js/jquery.dataTables.min.js"></script>

    {{-- ==========================================================
         Main JS (via Vite)
    ========================================================== --}}
    @vite('resources/js/index.js')

    {{-- ==========================================================
         Google Maps API
    ========================================================== --}}
    <script 
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD4jqcen5Xqrgck4V73aL6VepyKp2_wK1U&callback=initMap"
        async defer>
    </script>
@endpush