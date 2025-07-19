<?php


return [
    'openrouter' => [
        'api_url' => env('OPENROUTER_API_KEY'),
        'api_key' => env('OPENROUTER_API_URL'),
        'models' => [
            'deepseek' => 'deepseek-r1',
        ],
    ],
    'groq' => [
        'api_url' => env('GROQ_API_URL'),
        'api_key' => env('GROQ_API_KEY'),
        'models' => [
            'kimi-k2' => 'moonshotai/kimi-k2-instruct' // chose this because of high rpm and supports structured outputs
        ]
    ]
];
