<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServeFilesController extends Controller
{
    protected array $allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        'image/svg+xml'
    ];

    public function uploads(string $file_name)
    {
        try {
            $mime_type = Storage::mimeType($file_name);
            if (!in_array($mime_type, $this->allowedMimeTypes)) {
                abort(403);
            }

            // Stream file directly to avoid loading it into memory
            return response()->stream(function () use ($file_name) {
                $stream = Storage::readStream($file_name);
                if ($stream) {
                    fpassthru($stream);
                    fclose($stream);
                }
            }, 200, [
                'Content-Type' => $mime_type,
                'Cache-Control' => 'public, max-age=86400', // Cache for 1 day
                'Expires' => now()->addDay()->toRfc1123String(),
            ]);
        } catch (\Exception $error) {
            $this->handleException($error);
            abort(500);
        }
    }
}
