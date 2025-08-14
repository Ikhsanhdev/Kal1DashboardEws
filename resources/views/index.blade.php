@extends('layouts.app')
@section('title', 'Dashboard')

@push('styles')
    <link href="{{ asset('assets/libs/mohithg-switchery/switchery.min.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/libs/multiselect/css/multi-select.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/libs/select2/css/select2.min.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/libs/selectize/css/selectize.bootstrap3.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/libs/bootstrap-touchspin/jquery.bootstrap-touchspin.min.css') }}" rel="stylesheet" type="text/css" />
    
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css" />
    
    <style>
        .right-panel {
            min-width: 250px;
            max-width: 700px;
            overflow-y: auto;
            border-left: 1px solid #ddd;
        }
        .card-left {
            border-radius: 15px;
        }
        .filter-group {
            display: none; /* Sembunyikan default, tapi nanti Dashboard Data default akan show via JS */
        }
        
        /* Map legend styles */
        .map-legend {
            position: absolute;
            top: 10px;
            right: 10px;
            background: white;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 1000;
            max-width: 200px;
        }
        
        .legend-toggle {
            background: white;
            border: 1px solid #ccc;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .legend-content {
            display: block;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .legend-color {
            width: 20px;
            height: 20px;
            margin-right: 10px;
            border: 1px solid #ccc;
        }
        
        .legend-marker {
            width: 20px;
            height: 20px;
            margin-right: 10px;
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

    <div class="flex-grow-1 position-relative">
        <div id="map" style="height: 100%; width: 100%;"></div>
        
        <!-- Map Legend -->
        <div class="map-legend">
            <div class="legend-toggle" onclick="toggleMapLegend()">
                <span><strong>Legends</strong></span>
                <i class="fas fa-chevron-up" id="legend-icon"></i>
            </div>
            {{-- <div id="legend-content" class="legend-content">
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #90EE90;"></div>
                    <span>Area Hijau</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #DDA0DD;"></div>
                    <span>Area Ungu</span>
                </div>
                <div class="legend-item">
                    <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png" 
                         class="legend-marker" alt="Blue marker">
                    <span>Lokasi Utama</span>
                </div> --}}
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
    <script src="{{ asset('assets/libs/selectize/js/standalone/selectize.min.js') }}"></script>
    <script src="{{ asset('assets/libs/mohithg-switchery/switchery.min.js') }}"></script>
    <script src="{{ asset('assets/libs/multiselect/js/jquery.multi-select.js') }}"></script>
    <script src="{{ asset('assets/libs/select2/js/select2.min.js') }}"></script>
    <script src="{{ asset('assets/libs/bootstrap-touchspin/jquery.bootstrap-touchspin.min.js') }}"></script>
    <script src="{{ asset('assets/libs/bootstrap-maxlength/bootstrap-maxlength.min.js') }}"></script>
    
    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js"></script>
    
    <script>
        let map;
        let markers;
        let greenArea, purpleArea;
        
        document.addEventListener("DOMContentLoaded", function () {
            // Saat load pertama, langsung tampilkan filter Dashboard Data
            document.getElementById('group-sebaran').style.display = 'block';
            document.getElementById('group-waktu').style.display = 'block';
            document.getElementById('group-view').style.display = 'block';
            
            // Initialize map
            initializeMap();
        });

        function initializeMap() {
            // Initialize map
            map = L.map('map').setView([-0.5, 117], 7); // Koordinat  zoom default 5

            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                // attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(map);

            // Custom icons
            var blueIcon = new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            // Area polygons dengan warna seperti di gambar
            // greenArea = L.polygon([
            //     [[-2, 110], [-2, 115], [2, 115], [2, 110]]
            // ], {
            //     color: '#228B22',
            //     fillColor: '#90EE90',
            //     fillOpacity: 0.5,
            //     weight: 2
            // }).addTo(map);

            // purpleArea = L.polygon([
            //     [[0, 115], [0, 120], [3, 120], [3, 115]]
            // ], {
            //     color: '#800080',
            //     fillColor: '#DDA0DD',
            //     fillOpacity: 0.5,
            //     weight: 2
            // }).addTo(map);

            // Add markers
            markers = L.markerClusterGroup();

            // Sample markers data
            var markersData = [
                {lat: -1, lng: 112, title: "Lokasi 1", description: "Deskripsi lokasi 1"},
                {lat: 0.5, lng: 114, title: "Lokasi 2", description: "Deskripsi lokasi 2"},
                {lat: 1, lng: 116, title: "Lokasi 3", description: "Deskripsi lokasi 3"},
                // Tambahkan data marker lainnya
            ];

            // Add markers to cluster group
            markersData.forEach(function(markerData) {
                var marker = L.marker([markerData.lat, markerData.lng], {icon: blueIcon})
                    .bindPopup(`<b>${markerData.title}</b><br>${markerData.description}`);
                markers.addLayer(marker);
            });

            map.addLayer(markers);
            
            // Load data from Laravel backend
            loadMapData();
        }

        // Legend toggle function
        function toggleMapLegend() {
            const content = document.getElementById('legend-content');
            const icon = document.getElementById('legend-icon');
            
            if (content.style.display === 'none') {
                content.style.display = 'block';
                icon.className = 'fas fa-chevron-up';
            } else {
                content.style.display = 'none';
                icon.className = 'fas fa-chevron-down';
            }
        }

        // Load data from Laravel backend
        function loadMapData() {
            fetch('/api/map-data')
                .then(response => response.json())
                .then(data => {
                    // Clear existing markers
                    markers.clearLayers();
                    
                    // Custom icon for dynamic data
                    var blueIcon = new L.Icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
                    
                    // Add new markers
                    data.locations.forEach(function(location) {
                        var marker = L.marker([location.latitude, location.longitude], {icon: blueIcon})
                            .bindPopup(`<b>${location.name}</b><br>${location.description}`);
                        markers.addLayer(marker);
                    });
                })
                .catch(error => console.error('Error:', error));
        }

        // Function to update map based on dashboard type and filters
        function updateMapData() {
            const dashboardType = document.getElementById('dashboard-type').value;
            
            // You can add logic here to update map data based on selected filters
            // For example:
            // - Different markers for different dashboard types
            // - Filter markers based on selected criteria
            // - Update polygon areas based on filters
            
            loadMapData(); // Reload data for now
        }

        // Add event listeners for filter changes
        document.getElementById('dashboard-type').addEventListener('change', function() {
            updateMapData();
        });
    </script>
    
    @vite(['resources/js/index.js'])
@endpush