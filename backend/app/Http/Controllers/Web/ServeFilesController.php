<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServeFilesController extends Controller
{
    public function uploads(string $file_name)
    {
        try {
            return Storage::response(
                $file_name,
                null,
                [
                    'Cache-Control' => 'public, max-age=86400', // Cache for 1 day
                    'Expires' => now()->addDay()->toRfc1123String(),
                ]
            );
        } catch (\Exception $error) {
            $this->handleException($error);
            abort(500);
        }
    }
}
