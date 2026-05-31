<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        if (User::exists()) {
            $this->command->info('Users already exist, skipping seeding.');
            return;
        }

        User::factory()->firstOrCreate([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password'
        ]);
    }
}
