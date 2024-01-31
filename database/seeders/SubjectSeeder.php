<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		$subjects = [
			[
				'name' => 'Pháp luật đại cương',
				'shortcode' => 'PLDC01'
			],
			[
				'name' => 'Toán cao cấp',
				'shortcode' => 'TOCC02'
			],
			[
				'name' => 'Tin học cơ sở',
				'shortcode' => 'THC03'
			],
			[
				'name' => 'Lập trình cơ bản',
				'shortcode' => 'LTCB04'
			],
			[
				'name' => 'Kỹ năng GT và LVN',
				'shortcode' => 'KNGTLV05'
			],
			[
				'name' => 'Cấu trúc máy tính',
				'shortcode' => 'CTMT06'
			],
			[
				'name' => 'Toán rời rạc và lý thuyết đồ thị',
				'shortcode' => 'TRRLTD08'
			],
			[
				'name' => 'Điện tử cơ bản',
				'shortcode' => 'DTCB09'
			],
			[
				'name' => 'Nguyên lý hệ điều hành',
				'shortcode' => 'NPLHDH10'
			],
			[
				'name' => 'Cấu trúc dữ liệu và thuật toán',
				'shortcode' => 'CTDLTT11'
			],
			[
				'name' => 'Đồ họa máy tính',
				'shortcode' => 'DHMT12'
			],
			[
				'name' => 'Mạng máy tính',
				'shortcode' => 'MMT13'
			],
			[
				'name' => 'Anh văn 1',
				'shortcode' => 'AV114'
			],
			[
				'name' => 'Giáo dục QP-AN 1',
				'shortcode' => 'GDQPA116'
			],
			[
				'name' => 'Giáo dục QP-AN 2',
				'shortcode' => 'GDQPA217'
			],
			[
				'name' => 'Giáo dục QP-AN 3',
				'shortcode' => 'GDQPA318'
			],
			[
				'name' => 'Giáo dục QP-AN 4',
				'shortcode' => 'GDQPA419'
			],
			[
				'name' => 'Triết học Mác - Lênin',
				'shortcode' => 'THML20'
			],
			[
				'name' => 'Lập trình hướng đối tượng',
				'shortcode' => 'LTHDO21'
			],
			[
				'name' => 'Quản trị mạng',
				'shortcode' => 'QTM22'
			],
			[
				'name' => 'Cơ sở dữ liệu',
				'shortcode' => 'CSDL23'
			],
			[
				'name' => 'Phương pháp tính',
				'shortcode' => 'PPT24'
			],
			[
				'name' => 'Đồ án mạng 1',
				'shortcode' => 'DAN125'
			],
			[
				'name' => 'Anh văn 2',
				'shortcode' => 'AV226'
			],
			[
				'name' => 'Kinh tế chính trị Mác - Lênin',
				'shortcode' => 'KTCML28'
			],
			[
				'name' => 'Chủ nghĩa xã hội khoa học',
				'shortcode' => 'CNXHKH29'
			],
			[
				'name' => 'Phân tích và thiết kế hệ thống',
				'shortcode' => 'PTTKHT30'
			],
			[
				'name' => 'Quản trị doanh nghiệp',
				'shortcode' => 'QTDN31'
			],
			[
				'name' => 'Hệ quản trị cơ sở dữ liệu',
				'shortcode' => 'HQTCSDL32'
			],
			[
				'name' => 'Anh văn chuyên ngành (CNTT)',
				'shortcode' => 'AVCCN33'
			],
			[
				'name' => 'Đồ án mạng 2',
				'shortcode' => 'DAN235'
			],
			[
				'name' => 'Tư tưởng Hồ Chí Minh',
				'shortcode' => 'TTHCM36'
			],
			[
				'name' => 'Xác xuất thống kê',
				'shortcode' => 'XXTK37'
			],
			[
				'name' => 'Lập trình web',
				'shortcode' => 'LTWEB38'
			],
			[
				'name' => 'Lập trình ứng dụng',
				'shortcode' => 'LTUD39'
			],
			[
				'name' => 'Hệ thống thông tin địa lý (GIS)',
				'shortcode' => 'HTTIDG40'
			],
			[
				'name' => 'Thương mại điện tử',
				'shortcode' => 'TMDET41'
			],
			[
				'name' => 'Đồ án phần mềm 1',
				'shortcode' => 'DAPM142'
			],
			[
				'name' => 'Lịch sử Đảng Cộng sản Việt Nam',
				'shortcode' => 'LSDCCSV43'
			],
			[
				'name' => 'Lập trình Java cơ bản',
				'shortcode' => 'LTJCB44'
			],
			[
				'name' => 'Đồ án phần mềm 2',
				'shortcode' => 'DAPM245'
			],
			[
				'name' => 'Công nghệ phần mềm',
				'shortcode' => 'CNPM46'
			],
			[
				'name' => 'Lý thuyết nhận dạng',
				'shortcode' => 'LTND47'
			],
			[
				'name' => 'Chuyên đề khởi nghiệp',
				'shortcode' => 'CDKN48'
			],
			[
				'name' => 'Lập trình Java nâng cao',
				'shortcode' => 'LTJNC49'
			],
			[
				'name' => 'Quản lý dự án công nghệ thông tin',
				'shortcode' => 'QLDA51'
			],
			[
				'name' => 'Công nghệ mạng không dây',
				'shortcode' => 'CNMKD51'
			],
			[
				'name' => 'Quản trị mạng nâng cao',
				'shortcode' => 'QTMNC52'
			],
			[
				'name' => 'An toàn và bảo mật hệ thống mạng',
				'shortcode' => 'ABSHTM53'
			],
			[
				'name' => 'Lập trình mạng',
				'shortcode' => 'LTMN54'
			],
		];
		foreach ($subjects as $subject) {
			Subject::create($subject);
		}
	}
}
