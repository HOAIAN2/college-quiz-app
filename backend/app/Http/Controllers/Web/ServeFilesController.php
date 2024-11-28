<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServeFilesController extends Controller
{
    public function uploads(string $file_name)
    {
        $allowed_mime_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'];

        if (Storage::exists($file_name)) {
            $mime_type =  Storage::mimeType($file_name);
            if (in_array($mime_type, $allowed_mime_types)) {
                $file = Storage::get($file_name);
                return response()->make($file, 200, [
                    'Content-Type' => $mime_type,
                    'Cache-Control' => 'public, max-age=86400', // Cache for 1 day (86400 seconds)
                    'Expires' => now()->addDay()->toRfc1123String(),
                ]);
            } else abort(404);
        }

        return abort(404);
    }
}
