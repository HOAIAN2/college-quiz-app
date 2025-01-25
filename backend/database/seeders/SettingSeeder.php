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
                'group' => 'exam',
            ],
            [
                'key' => 'exam_allow_late_submit_seconds',
                'value' => '60',
                'group' => 'exam',
            ],
            [
                'key' => 'exam_auto_cancel_after_seconds',
                'value' => '300',
                'group' => 'exam',
            ],
            [
                'key' => 'exam_can_remark_within_days',
                'value' => '60',
                'group' => 'exam',
            ],
        ];
        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }
}
