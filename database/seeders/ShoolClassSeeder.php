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
        SchoolClass::insert([
            [
                'id' => 'D18K1',
                'name' => 'D18K1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D19CD1',
                'name' => 'D19CD1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D19K1',
                'name' => 'D19K1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D19KT1',
                'name' => 'D19KT1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D19KX1',
                'name' => 'D19KX1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D19KX3',
                'name' => 'D19KX3',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D19QX1',
                'name' => 'D19QX1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D19X1',
                'name' => 'D19X1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D19X2',
                'name' => 'D19X2',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D19X3',
                'name' => 'D19X3',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D19X4',
                'name' => 'D19X4',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D20CDK1',
                'name' => 'D20CDK1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D20CNK1',
                'name' => 'D20CNK1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D20KDC1',
                'name' => 'D20KDC1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D20KDC5',
                'name' => 'D20KDC5',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D20KTR1',
                'name' => 'D20KTR1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D20KXC1',
                'name' => 'D20KXC1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D20XCK1',
                'name' => 'D20XCK1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D20XDK1',
                'name' => 'D20XDK1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D20XDK3',
                'name' => 'D20XDK3',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D20XDK4',
                'name' => 'D20XDK4',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D20XDK5',
                'name' => 'D20XDK5',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D21CDK1',
                'name' => 'D21CDK1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D21CNK1',
                'name' => 'D21CNK1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D21KDC1',
                'name' => 'D21KDC1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D21KNT1',
                'name' => 'D21KNT1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D21KTR1',
                'name' => 'D21KTR1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D21KXC1',
                'name' => 'D21KXC1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D21QHC1',
                'name' => 'D21QHC1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D21QLC1',
                'name' => 'D21QLC1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D21QXC1',
                'name' => 'D21QXC1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D21XCK1',
                'name' => 'D21XCK1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D21XDK1',
                'name' => 'D21XDK1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D21XDK2',
                'name' => 'D21XDK2',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D21XDK3',
                'name' => 'D21XDK3',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D21XDK4',
                'name' => 'D21XDK4',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D21XDK5',
                'name' => 'D21XDK5',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id

            ],
            [
                'id' => 'D22CTC1',
                'name' => 'D22CTC1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D22KDC1',
                'name' => 'D22KDC1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D22KNT1',
                'name' => 'D22KNT1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D22KTR1',
                'name' => 'D22KTR1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D22KXC1',
                'name' => 'D22KXC1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D22QHC1',
                'name' => 'D22QHC1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D22QSC1',
                'name' => 'D22QSC1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D22QXC1',
                'name' => 'D22QXC1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D22XDK1',
                'name' => 'D22XDK1',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D22XDK2',
                'name' => 'D22XDK2',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D22XDK3',
                'name' => 'D22XDK3',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
            [
                'id' => 'D22XDK4',
                'name' => 'D22XDK4',
                'faculty_id' => Faculty::inRandomOrder()->select('id')->first()->id
            ],
        ]);
    }
}
