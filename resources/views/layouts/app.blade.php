<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'My App')</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="icon" href="{{ asset('assets/images/logo-pu.png') }}" type="image/png">

    <!-- ====== CSS Utama ====== -->
    <link href="{{ asset('assets/css/style.min.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/icons.min.css') }}" rel="stylesheet" type="text/css" />

    <!-- ====== Leaflet CSS ====== -->
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""
    />
    @stack('styles')
</head>
<body>
    <div class="layout-wrapper">
        <div class="page-content">

            <!-- ==================== Navbar ==================== -->
            @unless (request()->routeIs('login'))
                <div class="navbar-custom">
                    <div class="topbar d-flex align-items-center justify-content-between px-3 py-2">

                        <!-- Logo dan Identitas -->
                        <a href="/" class="d-flex align-items-center text-decoration-none">
                            <img
                                src="{{ asset('assets/images/logo-pu.png') }}"
                                alt="logo"
                                height="45"
                                class="me-2"
                            >
                            <div>
                                <div class="fw-bold text-uppercase" style="font-size:13px; color:#0c4a6e;">
                                    BALAI WILAYAH SUNGAI KALIMANTAN I
                                </div>
                                <div style="font-size:11px; color:#1d77ac;">
                                    Direktorat Jenderal Sumber Daya Air<br>
                                    Kementerian Pekerjaan Umum dan Perumahan Rakyat
                                </div>
                            </div>
                        </a>

                        <!-- Menu kanan -->
                        <ul class="topbar-menu d-flex align-items-center gap-3 mb-0 list-unstyled">
                            <li>
                                <a class="nav-link d-flex align-items-center" href="/LandingPage/Tabulasi">
                                    <i class="mdi mdi-monitor font-size-20 me-1"></i>
                                    Dashboard Monitoring
                                </a>
                            </li>

                            @guest
                                <li>
                                    <a class="nav-link" href="{{ route('login') }}">
                                        Login
                                    </a>
                                </li>
                            @endguest

                            @auth
                                <li class="d-flex align-items-center">
                                    <span class="me-2">
                                        {{ auth()->user()->name ?? 'User' }}
                                    </span>
                                    <form action="{{ route('logout') }}" method="POST" class="mb-0">
                                        @csrf
                                        <button type="submit" class="btn btn-sm btn-outline-danger">
                                            Logout
                                        </button>
                                    </form>
                                </li>
                            @endauth

                            <li>
                                <a
                                    class="nav-link"
                                    href="#"
                                    data-bs-toggle="fullscreen"
                                    title="Fullscreen"
                                >
                                    <i class="mdi mdi-fullscreen font-size-22"></i>
                                </a>
                            </li>
                            <li>
                                <a
                                    class="nav-link"
                                    id="theme-mode"
                                    title="Mode Gelap / Terang"
                                >
                                    <i class="bx bx-moon font-size-22"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            @endunless

            <!-- ==================== End Navbar ==================== -->

            <!-- Konten Halaman -->
            @yield('content')
        </div>
    </div>

    <!-- ========== Script Utama Laravel ========== -->
    <script src="{{ asset('assets/js/config.js') }}"></script>
    <script src="{{ asset('assets/js/vendor.min.js') }}"></script>
    <script src="{{ asset('assets/js/app.js') }}"></script>

    <!-- ========== Leaflet JS ========== -->
    <script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossorigin=""
    ></script>

    @stack('scripts')
</body>
</html>