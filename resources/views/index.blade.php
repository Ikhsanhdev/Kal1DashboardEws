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
                    <option value="dashboard-ews">Early Warning System (EWS)</option>
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

            <div id="group-ews" class="filter-group">
                <label for="filter-wilayah">Filter Wilayah</label>
                <select id="filter-wilayah"></select>
            </div>
        </div>

        {{-- ==========================================================
             Main Content Area
        ========================================================== --}}
        <div class="main-area">

            {{-- === Dashboard: Data === --}}
            <div id="dashboard-data-container" class="dashboard-container">
                <div class="dashboard-header mb-2">
                    <h4 class="dashboard-title mb-0">
                        Dashboard Data &gt; POS Curah Hujan
                    </h4>
                </div>

                {{-- Gunakan elemen #map sebagai card langsung agar tidak mudah tertimpa --}}
                <div class="dashboard-card dashboard-map-card flex-grow-1">
                    <div id="map"></div>
                    <div class="map-detail-box"></div>

                    <div class="map-info-box">
                        <div>
                            <span class="region-color" style="background:#22c55e;"></span>
                            <span class="region-name">DAS</span>
                        </div>
                        <div>
                            <span class="region-color" style="background:#0891b2;"></span>
                            <span class="region-name">WS Kapuas</span>
                        </div>
                        <div>
                            <span class="region-color" style="background:#6366f1;"></span>
                            <span class="region-name">Kabupaten/Kota</span>
                        </div>
                        <div>
                            <span class="region-color" style="background:#f97316;"></span>
                            <span class="region-name">Kecamatan</span>
                        </div>
                        <div>
                            <span class="region-color" style="background:#10b981;"></span>
                            <span class="region-name">Desa/Kelurahan</span>
                        </div>
                        <div>
                            <span class="region-color" style="background:#ec4899;"></span>
                            <span class="region-name">POS Curah Hujan</span>
                        </div>
                    </div>
                </div>

                <div id="table-container" class="dashboard-card mt-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="mb-0">Daftar Pos Curah Hujan</h5>
                        <div class="table-search-wrapper position-relative">
                            <i class="bi bi-search table-search-icon"></i>
                            <input
                                type="text"
                                id="dashboard-search"
                                class="form-control form-control-sm table-search-input"
                                placeholder="Cari Pos Curah Hujan..."
                                autocomplete="off"
                            >
                        </div>
                    </div>
                    <table
                        id="dashboard-table"
                        class="table table-sm table-bordered table-striped mb-0"
                    >
                        <thead class="table-light">
                            <tr>
                                <th>No</th>
                                <th>Nama Pos</th>
                                <th>Wilayah Sungai</th>
                                <th>DAS</th>
                                <th>Tanggal</th>
                                <th>CH (mm)</th>
                                <th>Intensitas</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>

            {{-- === Dashboard: CCTV === --}}
            <div id="dashboard-cctv-container" class="dashboard-container">
                <div class="dashboard-header mb-2">
                    <h4 class="dashboard-title mb-0">
                        Dashboard CCTV &gt; CCTV + Maps
                    </h4>
                </div>

                <div class="dashboard-card mb-3 p-2">
                    <div id="cctv-slider"></div>
                </div>

                <div class="dashboard-card p-2">
                    <div id="cctv-map" class="w-100"></div>
                </div>
            </div>

            {{-- === Dashboard: EWS === --}}
            <div id="dashboard-ews-container" class="dashboard-container">
                <div class="dashboard-header mb-2">
                    <h4 class="dashboard-title mb-0">
                        Early Warning System (EWS) &gt; Forecast
                    </h4>
                </div>

                <div class="dashboard-card dashboard-map-card flex-grow-1">
                    <div id="ews-map"></div>
                    <div class="map-detail-box"></div>

                    <div class="map-info-box">
                        <div>
                            <span class="region-color" style="background:#22c55e;"></span>
                            <span class="region-name">DAS</span>
                        </div>
                        <div>
                            <span class="region-color" style="background:#0891b2;"></span>
                            <span class="region-name">WS Kapuas</span>
                        </div>
                        <div>
                            <span class="region-color" style="background:#6366f1;"></span>
                            <span class="region-name">Kabupaten/Kota</span>
                        </div>
                        <div>
                            <span class="region-color" style="background:#f97316;"></span>
                            <span class="region-name">Kecamatan</span>
                        </div>
                        <div>
                            <span class="region-color" style="background:#10b981;"></span>
                            <span class="region-name">Desa/Kelurahan</span>
                        </div>
                        <div>
                            <span class="region-color" style="background:#ec4899;"></span>
                            <span class="region-name">POS Curah Hujan</span>
                        </div>
                    </div>
                </div>

                <div id="ews-table-container" class="dashboard-card mt-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                    </div>
                    <table
                        id="ews-table"
                        class="table table-sm table-bordered table-striped mb-0"
                    >
                        <thead class="table-light">
                            <tr>
                                <th>No</th>
                                <th>Segment</th>
                                <th>TMA</th>
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
                            <tr>
                                <td>1</td>
                                <td>AWLR KETUNGAU</td>
                                <td><strong>9.40 m</strong></td>
                                <td><strong>0.00 mm</strong></td>
                                <td>1,250 m³/s</td>
                                <td>1,480 m³/s</td>
                                <td>2,000 m³/s</td>
                                <td>62.5%</td>
                                <td>74.0%</td>
                                <td>Normal</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>AWLR MANGGU (LANDAK)</td>
                                <td><strong>17.09 m</strong></td>
                                <td><strong>0.00 mm</strong></td>
                                <td>890 m³/s</td>
                                <td>1,120 m³/s</td>
                                <td>1,500 m³/s</td>
                                <td>59.3%</td>
                                <td>74.7%</td>
                                <td>Waspada</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>AWLR NANGAMAU</td>
                                <td><strong>6.40 m</strong></td>
                                <td><strong>0.00 mm</strong></td>
                                <td>2,100 m³/s</td>
                                <td>2,350 m³/s</td>
                                <td>2,500 m³/s</td>
                                <td>84.0%</td>
                                <td>94.0%</td>
                                <td>Siaga</td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>AWLR SEMITAU</td>
                                <td><strong>9.40 m</strong></td>
                                <td><strong>0.00 mm</strong></td>
                                <td>1,680 m³/s</td>
                                <td>1,890 m³/s</td>
                                <td>2,200 m³/s</td>
                                <td>76.4%</td>
                                <td>85.9%</td>
                                <td>Waspada</td>
                            </tr>
                            <tr>
                                <td>5</td>
                                <td>AWLR SINTANG (KRANJI)</td>
                                <td><strong>9.40 m</strong></td>
                                <td><strong>0.00 mm</strong></td>
                                <td>750 m³/s</td>
                                <td>920 m³/s</td>
                                <td>1,800 m³/s</td>
                                <td>41.7%</td>
                                <td>51.1%</td>
                                <td>Normal</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div> {{-- .main-area --}}
    </div> {{-- .d-flex --}}
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
        async
        defer
    ></script>
@endpush