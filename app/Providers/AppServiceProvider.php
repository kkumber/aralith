<?php

namespace App\Providers;

use App\Models\Lessons;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Routing\UrlGenerator;

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
    public function boot(UrlGenerator $url): void
    {
        if (env('APP_ENV') === 'production') {
            $url->forceScheme('https');
        }

        Inertia::share([
            'csrf_token' => fn() => csrf_token(),

            'recentLessons' => function () {
                if (Auth::check() && 'recently_deleted') {
                    return Cache::remember(
                        'recent_lessons_user_' . Auth::id(),
                        now()->addMinutes(1),
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
