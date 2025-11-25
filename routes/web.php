<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MapController;
use App\Http\Controllers\AuthController;

// Halaman login untuk user yang belum login
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');
});

// Halaman yang hanya bisa diakses setelah login
Route::middleware('auth')->group(function () {
    Route::get('/', function () {
        return view('index');
    })->name('dashboard');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

// API Routes untuk Map Data
Route::prefix('api')->group(function () {
    Route::get('/map-data', [MapController::class, 'getMapData']);
    
    // Tambahkan API routes lainnya sesuai kebutuhan
    Route::get('/dashboard-data', [MapController::class, 'getDashboardData']);
    Route::get('/cctv-data', [MapController::class, 'getCCTVData']);
    Route::get('/ews-data', [MapController::class, 'getEWSData']);
});