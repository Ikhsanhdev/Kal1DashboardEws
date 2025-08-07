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
    </style>
@endpush

@section('content')
    <div class="d-flex h-100">
        <div class="right-panel bg-light p-3" style="width: 800px;">
            <div class="card card-left">
                <div class="card-body">
                    <div class="mb-3">
                        <label class="form-label">Dashboard Type</label><br/>
                        <select id="dashboard-type" class="">
                            <option value="data" data-display="Select">Dashboard Data</option>
                            <option value="ews">Dashboard EWS</option>
                            <option value="cctv">Dashboard CCTV</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Filter Sebaran</label><br/>
                        <select id="filter-sebaran" class="">
                            <option value="data" data-display="Select">Pos Curah Hujan</option>
                            <option value="ews">Pos Duga Air</option>
                            <option value="cctv">Pos Duga Air Pasang Surut</option>
                            <option value="cctv">Pos Iklim</option>
                            <option value="cctv">Pos WQMS</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div id="map" class="flex-grow-1"></div>
    </div>
@endsection

@push('scripts')
    <script src="{{ asset('assets/libs/selectize/js/standalone/selectize.min.js') }} "></script>
    <script src="{{ asset('assets/libs/mohithg-switchery/switchery.min.js') }}"></script>
    <script src="{{ asset('assets/libs/multiselect/js/jquery.multi-select.js') }}"></script>
    <!-- <script src="{{ asset('assets/libs/jquery.quicksearch/jquery.quicksearch.min.js') }}"></script> -->
    <script src="{{ asset('assets/libs/select2/js/select2.min.js') }}"></script>
    <script src="{{ asset('assets/libs/bootstrap-touchspin/jquery.bootstrap-touchspin.min.js') }}"></script>
    <script src="{{ asset('assets/libs/bootstrap-maxlength/bootstrap-maxlength.min.js') }}"></script>
    @vite(['resources/js/index.js'])
@endpush