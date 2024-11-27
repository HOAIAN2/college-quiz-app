<?php

namespace App\Helper;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class DOMStringHelper
{
    public static function saveImagesFromDOM($htmlString)
    {
        libxml_use_internal_errors(true);
        $htmlString = mb_convert_encoding($htmlString, 'UTF-8', 'auto');
        $dom = new \DOMDocument();
        @$dom->loadHTML(mb_convert_encoding($htmlString, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();
        $images = $dom->getElementsByTagName('img');

        $result = [];

        foreach ($images as $img) {
            $src = $img->attributes['src']->textContent;

            if (preg_match('/^data:image\/(\w+);base64,/', $src, $matches)) {
                $imageData = substr($src, strpos($src, ',') + 1);
                $decodedImage = base64_decode($imageData);

                $imageName = (string) Str::uuid() . '-' . time() . '.' . $matches[1];
                $imagePath = '' . $imageName;

                Storage::put($imagePath, $decodedImage);

                $result[] = $imagePath;
            }
        }
        return $result;
    }

    /**
     * Only save first one
     */
    public static function saveImageFromDOM($htmlString)
    {
        libxml_use_internal_errors(true);
        $htmlString = mb_convert_encoding($htmlString, 'UTF-8', 'auto');
        $dom = new \DOMDocument();
        @$dom->loadHTML(mb_convert_encoding($htmlString, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();
        $images = $dom->getElementsByTagName('img');

        foreach ($images as $img) {
            $src = $img->attributes['src']->textContent;

            if (preg_match('/^data:image\/(\w+);base64,/', $src, $matches)) {
                $imageData = substr($src, strpos($src, ',') + 1);
                $decodedImage = base64_decode($imageData);

                $imageName = (string) Str::uuid() . '-' . time() . '.' . $matches[1];
                $imagePath = '' . $imageName;

                Storage::put($imagePath, $decodedImage);

                return $imagePath;
            }
        }
    }

    public static function processImagesFromDOM($htmlString)
    {
        libxml_use_internal_errors(true);
        $htmlString = mb_convert_encoding($htmlString, 'UTF-8', 'auto');
        $dom = new \DOMDocument();
        @$dom->loadHTML(mb_convert_encoding($htmlString, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();
        $images = $dom->getElementsByTagName('img');

        foreach ($images as $img) {
            $src = $img->attributes['src']->textContent;

            if (preg_match('/^data:image\/(\w+);base64,/', $src, $matches)) {
                $imageData = substr($src, strpos($src, ',') + 1);
                $decodedImage = base64_decode($imageData);

                $imageName = (string) Str::uuid() . '-' . time() . '.' . $matches[1];
                $imagePath = '' . $imageName;

                Storage::put($imagePath, $decodedImage);

                // $img->setAttribute('src', "/uploads/$imageName");

                $img->attributes['src']->textContent = "/uploads/$imageName";
            }
        }
        return $dom->saveHTML();
    }

    public static function removeMediaNodes($htmlString)
    {
        $dom = new \DOMDocument();
        libxml_use_internal_errors(true);
        $dom->loadHTML($htmlString, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();

        $tagsToRemove = ['img', 'video', 'audio'];

        foreach ($tagsToRemove as $tag) {
            $elements = $dom->getElementsByTagName($tag);

            while ($elements->length > 0) {
                $element = $elements->item(0);
                $element->parentNode->removeChild($element);
            }
        }

        return $dom->saveHTML();
    }
}
