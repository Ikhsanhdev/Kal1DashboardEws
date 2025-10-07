@extends('layouts.app')
@section('title', 'Dashboard')

@push('styles')
    {{-- Vendor CSS --}}
    <link href="{{ asset('assets/libs/mohithg-switchery/switchery.min.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/libs/multiselect/css/multi-select.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/libs/select2/css/select2.min.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/libs/selectize/css/selectize.bootstrap3.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/libs/bootstrap-touchspin/jquery.bootstrap-touchspin.min.css') }}" rel="stylesheet" type="text/css" />
    <link href="https://cdn.datatables.net/1.13.5/css/jquery.dataTables.min.css" rel="stylesheet" />

    <style>
        .right-panel {
            min-width: 400px;
            max-width: 400px;
            overflow-y: auto;
            border-left: 1px solid #ddd;
        }
        .card-left {
            border-radius: 15px;
        }
        .filter-group {
            display: none;
        }

        /* --- Map & Table Styling --- */
        #table-container, #map-container {
            transition: all 0.3s ease-in-out;
            width: 100%;
        }

        /* Table full screen */
        .table-fullscreen {
            height: 100%;
        }

        /* Map full screen */
        .map-fullscreen {
            height: 100%;
        }

        /* Default: table tinggi 250px */
        #table-container {
            height: 250px;
            overflow-x: auto;
        }
        #map-container {
            height: calc(100% - 250px);
        }
        #map {
            height: 100%;
            width: 100%;
        }
    </style>
@endpush

@section('content')
<div class="d-flex h-100">

    {{-- Left Panel --}}
    <div class="right-panel bg-light p-3">
        <div class="card card-left">
            <div class="card-body">
                {{-- Dashboard Type --}}
                <div class="mb-3">
                    <label class="form-label">Dashboard Type</label><br/>
                    <select id="dashboard-type">
                        <option value="">-- Pilih Dashboard --</option>
                        <option value="dashboard-data" selected>Dashboard Data</option>
                        <option value="dashboard-cctv">Dashboard CCTV</option>
                        <option value="ews">EWS</option>
                    </select>
                </div>

                {{-- Dashboard Data --}}
                <div id="group-sebaran" class="filter-group mb-3">
                    <label class="form-label">Filter Sebaran</label><br/>
                    <select id="filter-sebaran"></select>
                </div>
                <div id="group-waktu" class="filter-group mb-3">
                    <label class="form-label">Filter Waktu</label><br/>
                    <select id="filter-waktu"></select>
                </div>
                <div id="group-view" class="filter-group mb-3">
                    <label class="form-label">View</label><br/>
                    <select id="filter-view"></select>
                </div>

                {{-- Dashboard CCTV --}}
                <div id="group-kategori-cctv" class="filter-group mb-3">
                    <label class="form-label">Kategori CCTV</label><br/>
                    <select id="filter-kategori-cctv"></select>
                </div>
                <div id="group-wilayah" class="filter-group mb-3">
                    <label class="form-label">Filter Wilayah</label><br/>
                    <select id="filter-wilayah"></select>
                </div>
                <div id="group-view-cctv" class="filter-group mb-3">
                    <label class="form-label">View</label><br/>
                    <select id="filter-view-cctv"></select>
                </div>

                {{-- EWS --}}
                <div id="group-ews-type" class="filter-group mb-3">
                    <label class="form-label">EWS Type</label><br/>
                    <select id="filter-ews-type"></select>
                </div>

                {{-- Blue Box (Wilayah dari Map) --}}
                <div class="mt-4">
                    <h6></h6>
                    <ul id="region-list" class="list-group"></ul>
                </div>
            </div>
        </div>
    </div>

    {{-- Main Area (Table + Map) --}}
    <div class="flex-grow-1 position-relative d-flex flex-column">

        {{-- Table Dashboard --}}
        <div id="table-container" class="bg-white">
            <table id="dashboard-table" class="table table-bordered table-striped w-100">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Segment</th>
                        <th>CH</th>
                        <th>Existing</th>
                        <th>Forecast</th>
                        <th>Capacity</th>
                        <th>% Existing to Capacity</th>
                        <th>% Forecast to Capacity</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {{-- Data akan diisi lewat JS/DataTables --}}
                </tbody>
            </table>
        </div>

        {{-- Map --}}
        <div id="map-container">
            <div id="map"></div>
        </div>

    </div>
</div>
@endsection

@push('scripts')
    {{-- jQuery dulu, baru plugin --}}
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="{{ asset('assets/libs/selectize/js/standalone/selectize.min.js') }}"></script>
    <script src="https://cdn.datatables.net/1.13.5/js/jquery.dataTables.min.js"></script>

    {{-- Google Maps API --}}
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD4jqcen5Xqrgck4V73aL6VepyKp2_wK1U&callback=initMap" async defer></script>

    {{-- Vite entry point --}}
    @vite('resources/js/index.js')
@endpush
