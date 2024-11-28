<?php

namespace App\Console\Commands;

use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CleanupImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cleanup-images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $question_images = [];
        $contents = array_merge(Question::pluck('content')->toArray(), QuestionOption::pluck('content')->toArray());

        foreach ($contents as $content) {
            libxml_use_internal_errors(true);
            $htmlString = mb_convert_encoding($content, 'UTF-8', 'auto');
            $dom = new \DOMDocument();
            @$dom->loadHTML(mb_convert_encoding($htmlString, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
            libxml_clear_errors();
            $images = $dom->getElementsByTagName('img');

            foreach ($images as $img) {
                $src = $img->attributes['src']->textContent;
                if (Str::startsWith($src, '/uploads')) {
                    $question_images[] = Str::replace('/uploads/', '', $src);
                }
            }
        }

        $files = Storage::allFiles();
        $ignore_files = ['.gitignore'];

        $files = array_filter($files, function ($file) use ($question_images, $ignore_files) {
            if (in_array($file, $ignore_files)) return false;
            return !in_array($file, $question_images);
        });

        Storage::delete($files);
    }
}
