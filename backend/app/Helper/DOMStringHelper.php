<?php

namespace App\Helper;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class DOMStringHelper
{
    const MAX_WIDTH = 1440;
    const MAX_HEIGHT = 2160;
    /**
     * Save all base64 images, replace base64 url with image path
     */
    public static function processImagesFromDOM(string $html_string)
    {
        libxml_use_internal_errors(true);
        $html_string = mb_convert_encoding($html_string, 'UTF-8', 'auto');
        $dom = new \DOMDocument();
        @$dom->loadHTML(mb_convert_encoding($html_string, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();
        $images = $dom->getElementsByTagName('img');

        foreach ($images as $img) {
            $src = $img->attributes['src']->textContent;

            if (preg_match('/^data:image\/(\w+);base64,/', $src, $matches)) {
                $image_data = substr($src, strpos($src, ',') + 1);
                $decoded_image = base64_decode($image_data);

                $image = imagecreatefromstring($decoded_image);

                $width = imagesx($image);
                $height = imagesy($image);
                $new_width = $width;
                $new_height = $height;

                if ($width >= $height && $width > self::MAX_WIDTH) {
                    $resized_image = imagescale($image, self::MAX_WIDTH, -1);
                } elseif ($height > $width && $height > self::MAX_HEIGHT) {
                    $resized_image = imagescale($image, -1, self::MAX_HEIGHT);
                } else {
                    $resized_image = $image;
                }

                if ($width > self::MAX_WIDTH || $height > self::MAX_HEIGHT) {
                    if ($width >= $height) {
                        $new_width = self::MAX_WIDTH;
                        $new_height = intval(($height / $width) * self::MAX_WIDTH);
                    } else {
                        $new_height = self::MAX_HEIGHT;
                        $new_width = intval(($width / $height) * self::MAX_HEIGHT);
                    }
                    $resized_image = imagecreatetruecolor($new_width, $new_height);
                    imagecopyresampled($resized_image, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
                    imagedestroy($image);
                    $image = $resized_image;
                }
                $image_name = (string) Str::uuid() . '-' . time() . '.' . $matches[1] . '.webp';
                $image_path = '' . $image_name;

                // imagewebp function not return value, use ob_start to capture the image
                ob_start();
                imagewebp($resized_image, null);
                $webp_image = ob_get_clean();
                Storage::put($image_path, $webp_image);

                imagedestroy($image);
                unset($decoded_image, $resized_image, $webp_image);

                $img->attributes['src']->textContent = "/uploads/$image_name";
            }
        }
        return $dom->saveHTML();
    }
}
