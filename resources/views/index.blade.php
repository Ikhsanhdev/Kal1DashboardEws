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
            max-width: 700px;
            overflow-y: auto;
            border-left: 1px solid #ddd;
        }
        .card-left {
            border-radius: 15px;
        }
        .filter-group {
            display: none;
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

        /* Search control styles for Google Maps */
        /* .search-control {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 1000;
        } */
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
        
        <!-- Search Control -->
        {{-- <div class="search-control">
            <input type="text" id="location-search" placeholder="Cari lokasi..." 
                   style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
        </div> --}}
        
        <!-- Map Legend -->
        <div class="map-legend">
            <div class="legend-toggle" onclick="toggleMapLegend()">
                <span><strong>Legenda</strong></span>
                <i class="fas fa-chevron-up" id="legend-icon"></i>
            </div>
            <div id="legend-content" class="legend-content">
                <!-- Legend items akan di-generate oleh JavaScript -->
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
    
    <!--  Google Maps -->
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD4jqcen5Xqrgck4V73aL6VepyKp2_wK1U&callback=initMap" async defer></script>
    
    <script>
        let map;
        let markers = [];
        let polygons = [];
        let markerClusterer;
        
        // Initialize Google Maps
        function initMap() {
            // Initialize map
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 7,
                center: { lat: -0.5, lng: 117 },
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            // Initialize marker clusterer (you'll need to include MarkerClusterer library)
            // markerClusterer = new MarkerClusterer(map, [], {
            //     imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
            // });

            // Load data from Laravel backend
            loadMapData();
        }

        document.addEventListener("DOMContentLoaded", function () {
            // Saat load pertama, langsung tampilkan filter Dashboard Data
            document.getElementById('group-sebaran').style.display = 'block';
            document.getElementById('group-waktu').style.display = 'block';
            document.getElementById('group-view').style.display = 'block';
        });

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
                    clearMarkers();
                    clearPolygons();
                    
                    // Add new markers
                    data.locations.forEach(function(location) {
                        var marker = new google.maps.Marker({
                            position: { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) },
                            map: map,
                            title: location.name,
                            icon: {
                                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                                scaledSize: new google.maps.Size(40, 40)
                            }
                        });

                        // Add info window
                        var infoWindow = new google.maps.InfoWindow({
                            content: `<div><strong>${location.name}</strong><br>${location.description}</div>`
                        });

                        marker.addListener('click', function() {
                            infoWindow.open(map, marker);
                        });

                        markers.push(marker);
                    });

                    // Add polygons/areas
                    if (data.areas) {
                        data.areas.forEach(function(area) {
                            var coordinates = area.coordinates.map(coord => ({
                                lat: parseFloat(coord[0]),
                                lng: parseFloat(coord[1])
                            }));

                            var polygon = new google.maps.Polygon({
                                paths: coordinates,
                                strokeColor: area.color,
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                fillColor: area.color,
                                fillOpacity: 0.35
                            });

                            polygon.setMap(map);
                            polygons.push(polygon);
                        });
                    }

                    // Update legend
                    updateLegend(data);
                })
                .catch(error => console.error('Error:', error));
        }

        // Clear all markers
        function clearMarkers() {
            markers.forEach(marker => marker.setMap(null));
            markers = [];
        }

        // Clear all polygons
        function clearPolygons() {
            polygons.forEach(polygon => polygon.setMap(null));
            polygons = [];
        }

        // Update legend based on data
        function updateLegend(data) {
            const legendContent = document.getElementById('legend-content');
            let legendHTML = '';

            // Add marker legend
            legendHTML += `
                <div class="legend-item">
                    <img src="https://maps.google.com/mapfiles/ms/icons/blue-dot.png" 
                         class="legend-marker" alt="Blue marker" style="width: 20px; height: 20px;">
                    <span>Lokasi Data</span>
                </div>
            `;

            // Add area legends
            if (data.areas) {
                data.areas.forEach(area => {
                    legendHTML += `
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: ${area.color};"></div>
                            <span>${area.name}</span>
                        </div>
                    `;
                });
            }

            legendContent.innerHTML = legendHTML;
        }

        // Search functionality
        document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.getElementById('location-search');
            if (searchInput) {
                searchInput.addEventListener('input', function(e) {
                    const searchTerm = e.target.value.toLowerCase();
                    // Implement search logic here
                    searchLocations(searchTerm);
                });
            }
        });

        function searchLocations(searchTerm) {
            // Filter markers based on search term
            markers.forEach(marker => {
                const title = marker.getTitle().toLowerCase();
                if (title.includes(searchTerm) || searchTerm === '') {
                    marker.setVisible(true);
                } else {
                    marker.setVisible(false);
                }
            });
        }

        // Function to update map based on dashboard type and filters
        function updateMapData() {
            const dashboardType = document.getElementById('dashboard-type').value;
            
            // Fetch filtered data
            const filters = {
                dashboard_type: dashboardType,
                sebaran: document.getElementById('filter-sebaran')?.value || '',
                waktu: document.getElementById('filter-waktu')?.value || '',
                view: document.getElementById('filter-view')?.value || '',
                kategori_cctv: document.getElementById('filter-kategori-cctv')?.value || '',
                wilayah: document.getElementById('filter-wilayah')?.value || '',
                ews_type: document.getElementById('filter-ews-type')?.value || ''
            };

            fetch('/api/filtered-map-data?' + new URLSearchParams(filters))
                .then(response => response.json())
                .then(data => {
                    // Clear existing data
                    clearMarkers();
                    clearPolygons();
                    
                    // Add filtered markers and areas
                    // Similar logic as loadMapData() but with filtered data
                    loadFilteredData(data);
                })
                .catch(error => console.error('Error:', error));
        }

        function loadFilteredData(data) {
            // Add markers
            data.locations.forEach(function(location) {
                var marker = new google.maps.Marker({
                    position: { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) },
                    map: map,
                    title: location.name,
                    icon: getMarkerIcon(location.type)
                });

                var infoWindow = new google.maps.InfoWindow({
                    content: `<div><strong>${location.name}</strong><br>${location.description}</div>`
                });

                marker.addListener('click', function() {
                    infoWindow.open(map, marker);
                });

                markers.push(marker);
            });

            // Add areas
            if (data.areas) {
                data.areas.forEach(function(area) {
                    var coordinates = area.coordinates.map(coord => ({
                        lat: parseFloat(coord[0]),
                        lng: parseFloat(coord[1])
                    }));

                    var polygon = new google.maps.Polygon({
                        paths: coordinates,
                        strokeColor: area.color,
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: area.color,
                        fillOpacity: 0.35
                    });

                    polygon.setMap(map);
                    polygons.push(polygon);
                });
            }

            updateLegend(data);
        }

        // Get marker icon based on type
        function getMarkerIcon(type) {
            const iconMap = {
                'forest': 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                'cctv': 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                'ews': 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                'default': 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            };

            return {
                url: iconMap[type] || iconMap['default'],
                scaledSize: new google.maps.Size(40, 40)
            };
        }

        // Add event listeners for filter changes
        document.addEventListener('DOMContentLoaded', function() {
            const dashboardTypeSelect = document.getElementById('dashboard-type');
            if (dashboardTypeSelect) {
                dashboardTypeSelect.addEventListener('change', updateMapData);
            }

            // Add event listeners for other filters
            const filterIds = [
                'filter-sebaran', 'filter-waktu', 'filter-view',
                'filter-kategori-cctv', 'filter-wilayah', 'filter-view-cctv',
                'filter-ews-type'
            ];

            filterIds.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('change', updateMapData);
                }
            });
        });
    </script>
    
    @vite(['resources/js/index.js'])
@endpush    