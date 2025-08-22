<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MapController extends Controller
{
    public function getMapData()
    {
        // Ambil data 
        $locations = [
            [
                'id' => 1,
                'name' => 'Hutan Eucalyptus',
                'latitude' => -1.0,
                'longitude' => 112.0,
                'description' => 'Area hutan eucalyptus',
                'type' => 'forest'
            ],
            [
                'id' => 2,
                'name' => 'Area Konservasi',
                'latitude' => 0.5,
                'longitude' => 114.0,
                'description' => 'Area konservasi alam',
                'type' => 'conservation'
            ],

            [
                'id' => 3,
                'name' => 'Gedung sate',
                'latitude' => -6.9022137586925805, 
                'longitude' => 107.61914164363384,
                'description' => 'Bandung',
                'type' => 'conservation'
            ],
            
            // Tambahkan data lainnya dari database
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
                [
                    'name' => 'Area Ungu',
                    'type' => 'conservation',
                    'coordinates' => [
                        [0, 115], [0, 120], [3, 120], [3, 115]
                    ],
                    'color' => '#DDA0DD'
                ],
                [
                    'name' => 'Area blanding',
                    'type' => 'city',
                    'coordinates' => [
                        [-6.9, 107.6], [-6.9, 107.7], [-6.8, 107.7], [-6.8, 107.6]
                    ],
                    'color' => '#a0ddd6'
                ]
            ]
        ]);
    }
}