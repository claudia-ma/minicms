<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'body',
        'status',
        'cover_image',
        'published_at',
    ];
}