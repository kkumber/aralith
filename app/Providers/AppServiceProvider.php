<?php

namespace App\Providers;

use App\Models\Lessons;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'csrf_token' => fn() => csrf_token(),

            'recentLessons' => function () {
                if (Auth::check()) {
                    return Cache::remember(
                        'recent_lessons_user_' . Auth::id(),
                        now()->addMinutes(5),
                        function () {
                            return Lessons::where('user_id', Auth::id())
                                ->select('id', 'title', 'created_at')
                                ->latest()
                                ->take(5)
                                ->get();
                        }
                    );
                }

                return [];
            },
        ]);
    }
}
