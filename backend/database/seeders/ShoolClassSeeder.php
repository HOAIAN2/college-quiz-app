<?php

namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\SchoolClass;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ShoolClassSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		$schoolClasses = [
			[
				'shortcode' => 'D18K1',
				'name' => 'D18K1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D19CD1',
				'name' => 'D19CD1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D19K1',
				'name' => 'D19K1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D19KT1',
				'name' => 'D19KT1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D19KX1',
				'name' => 'D19KX1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D19KX3',
				'name' => 'D19KX3',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D19QX1',
				'name' => 'D19QX1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D19X1',
				'name' => 'D19X1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D19X2',
				'name' => 'D19X2',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D19X3',
				'name' => 'D19X3',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D19X4',
				'name' => 'D19X4',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D20CDK1',
				'name' => 'D20CDK1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D20CNK1',
				'name' => 'D20CNK1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D20KDC1',
				'name' => 'D20KDC1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D20KDC5',
				'name' => 'D20KDC5',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D20KTR1',
				'name' => 'D20KTR1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D20KXC1',
				'name' => 'D20KXC1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D20XCK1',
				'name' => 'D20XCK1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D20XDK1',
				'name' => 'D20XDK1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D20XDK3',
				'name' => 'D20XDK3',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D20XDK4',
				'name' => 'D20XDK4',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D20XDK5',
				'name' => 'D20XDK5',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D21CDK1',
				'name' => 'D21CDK1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D21CNK1',
				'name' => 'D21CNK1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D21KDC1',
				'name' => 'D21KDC1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D21KNT1',
				'name' => 'D21KNT1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D21KTR1',
				'name' => 'D21KTR1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D21KXC1',
				'name' => 'D21KXC1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D21QHC1',
				'name' => 'D21QHC1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D21QLC1',
				'name' => 'D21QLC1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D21QXC1',
				'name' => 'D21QXC1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D21XCK1',
				'name' => 'D21XCK1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D21XDK1',
				'name' => 'D21XDK1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D21XDK2',
				'name' => 'D21XDK2',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D21XDK3',
				'name' => 'D21XDK3',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D21XDK4',
				'name' => 'D21XDK4',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D21XDK5',
				'name' => 'D21XDK5',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()

			],
			[
				'shortcode' => 'D22CTC1',
				'name' => 'D22CTC1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D22KDC1',
				'name' => 'D22KDC1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D22KNT1',
				'name' => 'D22KNT1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D22KTR1',
				'name' => 'D22KTR1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D22KXC1',
				'name' => 'D22KXC1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D22QHC1',
				'name' => 'D22QHC1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D22QSC1',
				'name' => 'D22QSC1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D22QXC1',
				'name' => 'D22QXC1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D22XDK1',
				'name' => 'D22XDK1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D22XDK2',
				'name' => 'D22XDK2',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D22XDK3',
				'name' => 'D22XDK3',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D22XDK4',
				'name' => 'D22XDK4',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
			[
				'shortcode' => 'D21CTC1',
				'name' => 'D21CTC1',
				'faculty_id' => Faculty::inRandomOrder()->pluck('id')->first()
			],
		];
		foreach ($schoolClasses as $schoolClass) {
			SchoolClass::create($schoolClass);
		}
	}
}
