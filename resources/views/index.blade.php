@extends('layouts.app')
@section('title', 'Dashboard')

@push('styles')
    <link href="{{ asset('assets/libs/mohithg-switchery/switchery.min.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/libs/multiselect/css/multi-select.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/libs/select2/css/select2.min.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/libs/selectize/css/selectize.bootstrap3.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/libs/bootstrap-touchspin/jquery.bootstrap-touchspin.min.css') }}" rel="stylesheet" type="text/css" />
    <style>
        .right-panel {
            min-width: 250px;
            max-width: 650px;
            overflow-y: auto;
            border-left: 1px solid #ddd;
        }
        .card-left {
            border-radius: 15px;
        }
        .filter-group {
            display: none; /* Sembunyikan default, tapi nanti Dashboard Data default akan show via JS */
        }
    </style>
@endpush

@section('content')
<div class="d-flex h-100">
    <div class="right-panel bg-light p-3" style="width: 400px;">
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

                {{-- === Dashboard Data Filters === --}}
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

                {{-- === Dashboard CCTV Filters === --}}
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

                {{-- === EWS Filters === --}}
                <div id="group-ews-type" class="filter-group mb-3">
                    <label class="form-label">EWS Type</label><br/>
                    <select id="filter-ews-type"></select>
                </div>

            </div>
        </div>
    </div>

    <div id="map" class="flex-grow-1"></div>
</div>
@endsection

@push('scripts')
    <script src="{{ asset('assets/libs/selectize/js/standalone/selectize.min.js') }}"></script>
    <script src="{{ asset('assets/libs/mohithg-switchery/switchery.min.js') }}"></script>
    <script src="{{ asset('assets/libs/multiselect/js/jquery.multi-select.js') }}"></script>
    <script src="{{ asset('assets/libs/select2/js/select2.min.js') }}"></script>
    <script src="{{ asset('assets/libs/bootstrap-touchspin/jquery.bootstrap-touchspin.min.js') }}"></script>
    <script src="{{ asset('assets/libs/bootstrap-maxlength/bootstrap-maxlength.min.js') }}"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            // Saat load pertama, langsung tampilkan filter Dashboard Data
            document.getElementById('group-sebaran').style.display = 'block';
            document.getElementById('group-waktu').style.display = 'block';
            document.getElementById('group-view').style.display = 'block';
        });
    </script>
    @vite(['resources/js/index.js'])
@endpush
