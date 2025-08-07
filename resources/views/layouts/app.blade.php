<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'My App')</title>
    <link rel="icon" href="{{ asset('assets/images/logo-pu.png') }}" type="image/png">
    <link rel="shortcut icon" href="{{ asset('assets/images/logo-pu.png') }}">

    <link href="{{ asset('assets/libs/morris.js/morris.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/style.min.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/icons.min.css') }}" rel="stylesheet" type="text/css" />

    <!-- <link rel="stylesheet" href="{{ asset('css/app.css') }}"> -->
    @stack('styles')
</head>
<body>
    <div class="layout-wrapper">
        <div class="page-content">
            <div class="navbar-custom">
                <div class="topbar">
                    <div class="topbar-menu d-flex align-items-center gap-lg-2 gap-1">
                        <!-- Brand Logo -->
                        <div class="logo-box">
                            <!-- Brand Logo Light -->
                            <a href="/" class="logo-light">
                                <img src="{{ asset('assets/images/logo-pu.png') }}" alt="logo" class="logo-lg" height="22">
                                <img src="{{ asset('assets/images/logo-pu.png') }}" alt="small logo" class="logo-sm" height="22">
                            </a>

                            <!-- Brand Logo Dark -->
                            <a href="/" class="logo-dark">
                                <img src="{{ asset('assets/images/logo-pu.png') }}" alt="dark logo" class="logo-lg" height="22">
                                <img src="{{ asset('assets/images/logo-pu.png') }}" alt="small logo" class="logo-sm" height="22">
                            </a>
                        </div>

                        <a href="index.html" class="logo-light d-flex align-items-center" style="border-radius: 5px;">
                            <img src="{{ asset('assets/images/logo-pu.png') }}" alt="logo" class="logo-lg" height="45" style="margin-right: 10px;">

                            <div class="text-start logo-lg">
                                <div class="mb-0 fw-bold text-uppercase" style="font-size: 13px; color: #0c4a6e;">BALAI WILAYAH SUNGAI KALIMANTAN I</div>
                                <div style="font-size: 11px; color: #1d77ac;">
                                    Direktorat Jenderal Sumber Daya Air<br />
                                    Kementrian Pekerjaan Umum dan Perumahan Rakyat
                                </div>
                            </div>
                        </a>
                    </div>

                    <ul class="topbar-menu d-flex align-items-center gap-4">
                        <li class="dropdown">
                            <a class="nav-link " href="/LandingPage/Tabulasi">
                                <i class="mdi mdi-monitor font-size-20" style="padding-right: 5px;"></i>
                                Dashboard Monitoring
                            </a>
                        </li>
                        <li class="d-none d-md-inline-block">
                            <a class="nav-link" href="" data-bs-toggle="fullscreen">
                                <i class="mdi mdi-fullscreen font-size-24"></i>
                            </a>
                        </li>

                        <li class="dropdown d-none d-md-inline-block">
                            <a class="nav-link dropdown-toggle waves-effect waves-light arrow-none"
                                data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false"
                                aria-expanded="false">
                                <img src="{{ asset('assets/images/flags/id.png') }}" alt="user-image" class="me-0 me-sm-1" height="18">
                            </a>
                            <div class="dropdown-menu dropdown-menu-end dropdown-menu-animated">
                                <!-- item-->
                                <a href="javascript:void(0);" class="dropdown-item">
                                    <img src="{{ asset('assets/images/flags/us.jpg') }}" alt="user-image" class="me-1"
                                        height="12"> <span class="align-middle">US</span>
                                </a>
                            </div>
                        </li>

                        <li class="nav-link" id="theme-mode">
                            <i class="bx bx-moon font-size-24"></i>
                        </li>
                    </ul>
                </div>
            </div>

            @yield('content')
        </div>
    </div>

    <script src="{{ asset('assets/js/config.js') }}"></script>
    <script src="{{ asset('assets/js/vendor.min.js') }}"></script>
    <script src="{{ asset('assets/js/app.js') }}"></script>

    <script src="{{ asset('assets/libs/jquery-knob/jquery.knob.min.js') }}"></script>

    <!-- Sparkline Js-->
    <script src="{{ asset('assets/libs/jquery-sparkline/jquery.sparkline.min.js') }}"></script>
    <script src="{{ asset('assets/libs/morris.js/morris.min.js') }}"></script>
    <script src="{{ asset('assets/libs/raphael/raphael.min.js') }}"></script>

    @stack('scripts')
    <!-- Dashboard init-->
    <!-- <script src="{{ asset('assets/js/config.js') }}"></script>
    <script src="~/hkasumatera7/assets/js/pages/dashboard.js"></script> -->
</body>
</html>