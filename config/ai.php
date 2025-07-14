<?php


return [
    'openrouter' => [
        'api_url' => env('OPENROUTER_API_KEY'),
        'api_key' => env('OPENROUTER_API_URL'),
        'models' => [
            'gemma3n' => 'google/gemma-3n-e2b-it:free',
        ],
    ],
];
