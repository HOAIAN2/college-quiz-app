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
		$faculties = [
			[
				'shortcode' => 'CB01',
				'name' => 'Khoa học cơ bản',
				'phone_number' => '0573826545',
			],
			[
				'shortcode' => 'CD01',
				'name' => 'Cầu đường',
				'phone_number' => '0573826641'
			],
			[
				'shortcode' => 'DN02',
				'name' => 'Điện tử công nghiệp',
				'phone_number' => '0573823487',
			],
			[
				'shortcode' => 'DT01',
				'name' => 'Điện viễn thông',
				'phone_number' => '0573826789',
			],
			[
				'shortcode' => 'HT03',
				'name' => 'Hạ tầng đô thị',
				'phone_number' => '0573830978',
			],
			[
				'shortcode' => 'KT01',
				'name' => 'Kiến trúc',
				'phone_number' => '0573879078'
			],
			[
				'shortcode' => 'KT02',
				'name' => 'Kinh tế',
				'phone_number' => '0573871209'
			],
			[
				'shortcode' => 'KX01',
				'name' => 'Kinh tế xây dựng',
				'phone_number' => '0573829067',
			],
			[
				'shortcode' => 'ML02',
				'name' => 'Lý luận chính trị',
				'phone_number' => '0573872634',
			],
			[
				'shortcode' => 'MT04',
				'name' => 'Tài nguyên môi trường',
				'phone_number' => '0573809878',
			],
			[
				'shortcode' => 'PL01',
				'name' => 'Khoa luật',
				'phone_number' => '0573859067'
			],
			[
				'shortcode' => 'TT01',
				'name' => 'Công nghệ thông tin',
				'phone_number' => '0573829011',
			],
			[
				'shortcode' => 'XD01',
				'name' => 'Xây dựng',
				'phone_number' => '0573801897'
			]
		];
		foreach ($faculties as $faculty) {
			Faculty::create($faculty);
		}
	}
}
