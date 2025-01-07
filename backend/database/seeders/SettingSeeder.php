<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'exam_base_score_scale',
                'value' => '10',
            ],
            [
                'key' => 'exam_allow_late_submit_seconds',
                'value' => '60',
            ],
            [
                'key' => 'exam_max_late_seconds',
                'value' => '300',
            ],
            [
                'key' => 'exam_can_remark_within_days',
                'value' => '600',
            ],
        ];
        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }
}
