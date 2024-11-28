<?php

namespace App\Helper;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class DOMStringHelper
{
    public static function saveImagesFromDOM(string $html_string)
    {
        libxml_use_internal_errors(true);
        $html_string = mb_convert_encoding($html_string, 'UTF-8', 'auto');
        $dom = new \DOMDocument();
        @$dom->loadHTML(mb_convert_encoding($html_string, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();
        $images = $dom->getElementsByTagName('img');

        $result = [];

        foreach ($images as $img) {
            $src = $img->attributes['src']->textContent;

            if (preg_match('/^data:image\/(\w+);base64,/', $src, $matches)) {
                $image_data = substr($src, strpos($src, ',') + 1);
                $decoded_image = base64_decode($image_data);

                $image_name = (string) Str::uuid() . '-' . time() . '.' . $matches[1];
                $image_path = '' . $image_name;

                Storage::put($image_path, $decoded_image);

                $result[] = $image_path;
            }
        }
        return $result;
    }

    /**
     * Only save first one
     */
    public static function saveImageFromDOM(string $html_string)
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

                $image_name = (string) Str::uuid() . '-' . time() . '.' . $matches[1];
                $image_path = '' . $image_name;

                Storage::put($image_path, $decoded_image);

                return $image_path;
            }
        }
    }

    /**
     * Save images, replace base64 url with image path
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

                $image_name = (string) Str::uuid() . '-' . time() . '.' . $matches[1];
                $image_path = '' . $image_name;

                Storage::put($image_path, $decoded_image);

                $img->attributes['src']->textContent = "/uploads/$image_name";
            }
        }
        return $dom->saveHTML();
    }

    public static function removeMediaNodes($html_string)
    {
        $dom = new \DOMDocument();
        libxml_use_internal_errors(true);
        $dom->loadHTML($html_string, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();

        $tags_to_remove = ['img', 'video', 'audio'];

        foreach ($tags_to_remove as $tag) {
            $elements = $dom->getElementsByTagName($tag);

            while ($elements->length > 0) {
                $element = $elements->item(0);
                $element->parentNode->removeChild($element);
            }
        }

        return $dom->saveHTML();
    }
}
