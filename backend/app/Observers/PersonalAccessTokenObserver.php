<?php

namespace App\Observers;

use App\Models\PersonalAccessToken;

class PersonalAccessTokenObserver
{
    public function creating(PersonalAccessToken $personalAccessToken): void
    {
        $personalAccessToken->ip = request()->ip();
        $personalAccessToken->user_agent = request()->header('User-Agent');
    }
    /**
     * Handle the PersonalAccessToken "created" event.
     */
    public function created(PersonalAccessToken $personalAccessToken): void
    {
        //
    }

    /**
     * Handle the PersonalAccessToken "updated" event.
     */
    public function updated(PersonalAccessToken $personalAccessToken): void
    {
        //
    }

    /**
     * Handle the PersonalAccessToken "deleted" event.
     */
    public function deleted(PersonalAccessToken $personalAccessToken): void
    {
        //
    }

    /**
     * Handle the PersonalAccessToken "restored" event.
     */
    public function restored(PersonalAccessToken $personalAccessToken): void
    {
        //
    }

    /**
     * Handle the PersonalAccessToken "force deleted" event.
     */
    public function forceDeleted(PersonalAccessToken $personalAccessToken): void
    {
        //
    }
}
