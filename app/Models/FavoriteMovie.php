<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FavoriteMovie extends Model
{
    protected $fillable = [
        'user_id',
        'imdbID',
        'title',
        'type',
        'year',
        'image_url',
    ];
}