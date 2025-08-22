<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MapController;

Route::get('/', function () {
    return view('index');
});

// Your existing web routes...

// API Routes untuk Map Data
Route::prefix('api')->group(function () {
    Route::get('/map-data', [MapController::class, 'getMapData']);
    
    // Tambahkan API routes lainnya sesuai kebutuhan
    Route::get('/dashboard-data', [MapController::class, 'getDashboardData']);
    Route::get('/cctv-data', [MapController::class, 'getCCTVData']);
    Route::get('/ews-data', [MapController::class, 'getEWSData']);
});