@extends('layouts.app')

@section('title', 'Login')

@section('content')
    <div class="d-flex justify-content-center align-items-center" style="min-height: 80vh;">
        <div class="card login-card">
            <div class="card-body">
                <h4 class="card-title mb-3 text-center">
                    Login Dashboard
                </h4>

                @if ($errors->any())
                    <div class="alert alert-danger">
                        {{ $errors->first() }}
                    </div>
                @endif

                <form method="POST" action="{{ route('login.post') }}">
                    @csrf

                    <div class="mb-3">
                        <label for="username" class="form-label">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value="{{ old('username') }}"
                            class="form-control"
                            required
                            autofocus
                        >
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            class="form-control"
                            required
                        >
                    </div>

                    <div class="form-check mb-3">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            id="remember"
                            name="remember"
                        >
                        <label class="form-check-label" for="remember">
                            Remember me
                        </label>
                    </div>

                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary">
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div> 