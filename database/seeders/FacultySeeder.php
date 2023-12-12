<?php

namespace Database\Seeders;

use App\Models\Faculty;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FacultySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Faculty::insert([
            [
                'id' => 'CB01',
                'name' => 'Khoa học cơ bản',
                'phone_number' => '0573826545',
            ],
            [
                'id' => 'CD01',
                'name' => 'Cầu đường',
                'phone_number' => '0573826641'
            ],
            [
                'id' => 'DN02',
                'name' => 'Điện tử công nghiệp',
                'phone_number' => '0573823487',
            ],
            [
                'id' => 'DT01',
                'name' => 'Điện viễn thông',
                'phone_number' => '0573826789',
            ],
            [
                'id' => 'HT03',
                'name' => 'Hạ tầng đô thị',
                'phone_number' => '0573830978',
            ],
            [
                'id' => 'KT01',
                'name' => 'Kiến trúc',
                'phone_number' => '0573879078'
            ],
            [
                'id' => 'KT02',
                'name' => 'Kinh tế',
                'phone_number' => '0573871209'
            ],
            [
                'id' => 'KX01',
                'name' => 'Kinh tế xây dựng',
                'phone_number' => '0573829067',
            ],
            [
                'id' => 'ML02',
                'name' => 'Lý luận chính trị',
                'phone_number' => '0573872634',
            ],
            [
                'id' => 'MT04',
                'name' => 'Tài nguyên môi trường',
                'phone_number' => '0573809878',
            ],
            [
                'id' => 'PL01',
                'name' => 'Khoa luật',
                'phone_number' => '0573859067'
            ],
            [
                'id' => 'TT01',
                'name' => 'Công nghệ thông tin',
                'phone_number' => '0573829011',
            ],
            [
                'id' => 'XD01',
                'name' => 'Xây dựng',
                'phone_number' => '0573801897'
            ]
        ]);
    }
}
