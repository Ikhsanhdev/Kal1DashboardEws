<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MapController extends Controller
{
    public function getMapData()
    {
        $locations = [
            [
                'id' => 1,
                'name' => 'HuEucalyptus',
                'latitude' => -1.0,
                'longitude' => 112.0,
                'description' => 'Area hutan eucalyptus',
                'type' => 'forest'
            ],
            
            
        ];

        return response()->json([
            'locations' => $locations,
            'areas' => [
                [
                    'name' => 'Area Hijau',
                    'type' => 'forest',
                    'coordinates' => [
                        [-2, 110], [-2, 115], [2, 115], [2, 110]
                    ],
                    'color' => '#90EE90'
                ],
                
            ]
        ]);
    }

    public function index()
    {
        return view('dashboard.index', [
            'google_maps_key' => config('AIzaSyD4jqcen5Xqrgck4V73aL6VepyKp2_wK1U&callback=initMap')
        ]);
    }

    public function getFilteredMapData(Request $request)
    {
        $dashboardType = $request->get('dashboard_type');
        $filters = $request->only(['sebaran', 'waktu', 'view', 'kategori_cctv', 'wilayah', 'ews_type']);
        
        $locations = collect([
            [
                'id' => 1,
                'name' => 'H',
                'latitude' => -1.0,
                'longitude' => 112.0,
                'description' => 'Area hutan eucalyptus',
                'type' => 'forest',
                'dashboard_type' => 'dashboard-data'
            ],
            
        ]);

        if ($dashboardType) {
            $locations = $locations->where('dashboard_type', $dashboardType);
        }

        if ($request->has('type')) {
            $locations = $locations->where('type', $request->get('type'));
        }

        return response()->json([
            'locations' => $locations->values()->all(),
            'areas' => $this->getAreasForDashboardType($dashboardType),
            'filters_applied' => $filters
        ]);
    }

    private function getAreasForDashboardType($dashboardType)
    {
        $allAreas = [
            'dashboard-data' => [
                [
                    'name' => 'Area Hijau',
                    'type' => 'forest',
                    'coordinates' => [
                        [-2, 110], [-2, 115], [2, 115], [2, 110]
                    ],
                    'color' => '#90EE90'
                ],
                
            ],
            'dashboard-cctv' => [
                [
                    'name' => 'Zona CCTV A',
                    'type' => 'surveillance',
                    'coordinates' => [
                        [-1, 113], [-1, 116], [1, 116], [1, 113]
                    ],
                    'color' => '#FF6B6B'
                ]
            ],
            'ews' => [
                [
                    'name' => 'Area Rawan Bencana',
                    'type' => 'hazard',
                    'coordinates' => [
                        [-7, 107], [-7, 108], [-6.5, 108], [-6.5, 107]
                    ],
                    'color' => '#FFD93D'
                ]
            ]
        ];

        return $allAreas[$dashboardType] ?? $allAreas['dashboard-data'];
    }
}
