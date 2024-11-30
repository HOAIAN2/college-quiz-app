<?php

namespace App\Models;

use App\Observers\PersonalAccessTokenObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

#[ObservedBy(PersonalAccessTokenObserver::class)]
class PersonalAccessToken extends SanctumPersonalAccessToken
{
    protected $fillable = [
        'name',
        'ip',
        'user_agent',
        'token',
        'abilities',
        'expires_at',
    ];

    protected $hidden = [
        'token',
        'tokenable_type',
    ];
}
