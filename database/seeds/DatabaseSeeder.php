<?php

use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'name' => 'Wida Andry',
            'username' => 'aldmic',
            'role' => 0,
            'email' => 'aldmic@aldmic.com',
            'password' => bcrypt('123abc123'),
        ]);
    }
}
