<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServeFilesController extends Controller
{
    public function uploads(string $filename)
    {
        if (Storage::exists($filename)) {
            $mimeType =  Storage::mimeType($filename);

            // Retrieve the file contents
            $file = Storage::disk('upload')->get($filename);
            return response()->make($file, 200, [
                // 'Content-Type' => $mimeType,
                'Cache-Control' => 'public, max-age=86400', // Cache for 1 day (86400 seconds)
                'Expires' => now()->addDay()->toRfc1123String(),
            ]);
        }

        return abort(404);
    }
}
