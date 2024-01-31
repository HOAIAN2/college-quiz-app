<?php

namespace Database\Seeders;

use App\Models\Chapter;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ChapterSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		$chapters = [
			['subject_id' => 1, 'chapter_number' => 1, 'name' => 'Giới thiệu về pháp luật'],
			['subject_id' => 1, 'chapter_number' => 2, 'name' => 'Hệ thống pháp luật'],
			['subject_id' => 1, 'chapter_number' => 3, 'name' => 'Các nguyên tắc cơ bản của pháp luật'],
			['subject_id' => 1, 'chapter_number' => 4, 'name' => 'Quy trình lập pháp và thực hiện pháp luật'],

			// Toán cao cấp
			['subject_id' => 2, 'chapter_number' => 1, 'name' => 'Giới thiệu về toán cao cấp'],
			['subject_id' => 2, 'chapter_number' => 2, 'name' => 'Giải tích'],
			['subject_id' => 2, 'chapter_number' => 3, 'name' => 'Đại số tuyến tính'],
			['subject_id' => 2, 'chapter_number' => 4, 'name' => 'Xác suất và thống kê'],

			// Tin học cơ sở
			['subject_id' => 3, 'chapter_number' => 1, 'name' => 'Cơ bản về tin học'],
			['subject_id' => 3, 'chapter_number' => 2, 'name' => 'Hệ điều hành'],
			['subject_id' => 3, 'chapter_number' => 3, 'name' => 'Mạng máy tính'],
			['subject_id' => 3, 'chapter_number' => 4, 'name' => 'An toàn thông tin'],

			// Lập trình cơ bản
			['subject_id' => 4, 'chapter_number' => 1, 'name' => 'Cú pháp cơ bản của ngôn ngữ lập trình'],
			['subject_id' => 4, 'chapter_number' => 2, 'name' => 'Cấu trúc điều khiển'],
			['subject_id' => 4, 'chapter_number' => 3, 'name' => 'Hàm và thư viện'],
			['subject_id' => 4, 'chapter_number' => 4, 'name' => 'Lập trình hướng đối tượng'],

			// Kỹ năng GT và LVN
			['subject_id' => 5, 'chapter_number' => 1, 'name' => 'Kỹ năng giao tiếp cơ bản'],
			['subject_id' => 5, 'chapter_number' => 2, 'name' => 'Kỹ năng làm việc nhóm'],
			['subject_id' => 5, 'chapter_number' => 3, 'name' => 'Làm quen với kỹ năng quản lý thời gian'],
			['subject_id' => 5, 'chapter_number' => 4, 'name' => 'Phát triển kỹ năng lãnh đạo'],

			// Cấu trúc máy tính
			['subject_id' => 6, 'chapter_number' => 1, 'name' => 'Kiến trúc máy tính'],
			['subject_id' => 6, 'chapter_number' => 2, 'name' => 'Bộ nhớ và bộ xử lý'],
			['subject_id' => 6, 'chapter_number' => 3, 'name' => 'Tổ chức và quản lý dữ liệu'],
			['subject_id' => 6, 'chapter_number' => 4, 'name' => 'Giao inter-process'],

			// Toán rời rạc và lý thuyết đồ thị
			['subject_id' => 7, 'chapter_number' => 1, 'name' => 'Toán rời rạc'],
			['subject_id' => 7, 'chapter_number' => 2, 'name' => 'Lý thuyết đồ thị cơ bản'],
			['subject_id' => 7, 'chapter_number' => 3, 'name' => 'Thuật toán trên đồ thị'],
			['subject_id' => 7, 'chapter_number' => 4, 'name' => 'Ứng dụng của lý thuyết đồ thị'],

			// Điện tử cơ bản
			['subject_id' => 8, 'chapter_number' => 1, 'name' => 'Nguyên tắc cơ bản của điện tử'],
			['subject_id' => 8, 'chapter_number' => 2, 'name' => 'Mạch điện và điện trở'],
			['subject_id' => 8, 'chapter_number' => 3, 'name' => 'Bộ khuếch đại và transistor'],
			['subject_id' => 8, 'chapter_number' => 4, 'name' => 'Kỹ thuật số và logic'],

			// Nguyên lý hệ điều hành
			['subject_id' => 9, 'chapter_number' => 1, 'name' => 'Cơ bản về hệ điều hành'],
			['subject_id' => 9, 'chapter_number' => 2, 'name' => 'Quản lý bộ nhớ và tài nguyên'],
			['subject_id' => 9, 'chapter_number' => 3, 'name' => 'Hệ thống tập tin'],
			['subject_id' => 9, 'chapter_number' => 4, 'name' => 'Bảo mật hệ thống'],

			// Cấu trúc dữ liệu và thuật toán
			['subject_id' => 10, 'chapter_number' => 1, 'name' => 'Cấu trúc dữ liệu cơ bản'],
			['subject_id' => 10, 'chapter_number' => 2, 'name' => 'Thuật toán sắp xếp và tìm kiếm'],
			['subject_id' => 10, 'chapter_number' => 3, 'name' => 'Cây và đồ thị'],
			['subject_id' => 10, 'chapter_number' => 4, 'name' => 'Ứng dụng của cấu trúc dữ liệu và thuật toán'],
			// Đồ họa máy tính
			['subject_id' => 11, 'chapter_number' => 1, 'name' => 'Khái niệm và ứng dụng của đồ họa máy tính'],
			['subject_id' => 11, 'chapter_number' => 2, 'name' => 'Đồ họa 2D và 3D'],
			['subject_id' => 11, 'chapter_number' => 3, 'name' => 'Xử lý ảnh và video'],
			['subject_id' => 11, 'chapter_number' => 4, 'name' => 'Đồ họa và trò chơi điện tử'],

			// Mạng máy tính
			['subject_id' => 12, 'chapter_number' => 1, 'name' => 'Cơ bản về mạng máy tính'],
			['subject_id' => 12, 'chapter_number' => 2, 'name' => 'Giao thức và dịch vụ mạng'],
			['subject_id' => 12, 'chapter_number' => 3, 'name' => 'Quản trị mạng'],
			['subject_id' => 12, 'chapter_number' => 4, 'name' => 'Bảo mật mạng'],

			// Anh văn 1
			['subject_id' => 13, 'chapter_number' => 1, 'name' => 'Ngữ pháp và từ vựng cơ bản'],
			['subject_id' => 13, 'chapter_number' => 2, 'name' => 'Kỹ năng đọc và hiểu bản tin'],
			['subject_id' => 13, 'chapter_number' => 3, 'name' => 'Kỹ năng nghe và nói'],
			['subject_id' => 13, 'chapter_number' => 4, 'name' => 'Viết và thảo luận tiếng Anh'],

			// Giáo dục QP-AN 1
			['subject_id' => 14, 'chapter_number' => 1, 'name' => 'Giáo dục quốc phòng'],
			['subject_id' => 14, 'chapter_number' => 2, 'name' => 'Giáo dục an ninh'],
			['subject_id' => 14, 'chapter_number' => 3, 'name' => 'Lịch sử và văn hóa quân đội'],
			['subject_id' => 14, 'chapter_number' => 4, 'name' => 'Bảo vệ môi trường và an toàn giao thông'],

			// Giáo dục QP-AN 2
			['subject_id' => 15, 'chapter_number' => 1, 'name' => 'Chính trị - Quản lý nhà nước'],
			['subject_id' => 15, 'chapter_number' => 2, 'name' => 'Pháp luật và đạo đức nghề nghiệp'],
			['subject_id' => 15, 'chapter_number' => 3, 'name' => 'Quản lý sự cố và khẩn cấp'],
			['subject_id' => 15, 'chapter_number' => 4, 'name' => 'Kỹ năng lãnh đạo và quản lý'],

			// Giáo dục QP-AN 3
			['subject_id' => 16, 'chapter_number' => 1, 'name' => 'Chủ nghĩa xã hội và con người'],
			['subject_id' => 16, 'chapter_number' => 2, 'name' => 'Đạo đức cộng đồng và quốc gia'],
			['subject_id' => 16, 'chapter_number' => 3, 'name' => 'Phong cách sống và sức khỏe'],
			['subject_id' => 16, 'chapter_number' => 4, 'name' => 'Văn hóa và nghệ thuật'],

			// Giáo dục QP-AN 4
			['subject_id' => 17, 'chapter_number' => 1, 'name' => 'Phát triển bản thân và sự nghiệp'],
			['subject_id' => 17, 'chapter_number' => 2, 'name' => 'Quản lý dự án và tiến trình làm việc'],
			['subject_id' => 17, 'chapter_number' => 3, 'name' => 'Nghệ thuật đàm phán và giao tiếp'],
			['subject_id' => 17, 'chapter_number' => 4, 'name' => 'Phát triển kỹ năng cá nhân và chuyên môn'],

			// Triết học Mác - Lênin
			['subject_id' => 18, 'chapter_number' => 1, 'name' => 'Triết học Mác'],
			['subject_id' => 18, 'chapter_number' => 2, 'name' => 'Triết học Lênin'],
			['subject_id' => 18, 'chapter_number' => 3, 'name' => 'Triết học chủ nghĩa xã hội'],
			['subject_id' => 18, 'chapter_number' => 4, 'name' => 'Triết học của các nhóm tư tưởng khác'],

			// Lập trình hướng đối tượng
			['subject_id' => 19, 'chapter_number' => 1, 'name' => 'Kiến thức cơ bản về lập trình hướng đối tượng'],
			['subject_id' => 19, 'chapter_number' => 2, 'name' => 'Xây dựng lớp và đối tượng'],
			['subject_id' => 19, 'chapter_number' => 3, 'name' => 'Kế thừa và đa hình'],
			['subject_id' => 19, 'chapter_number' => 4, 'name' => 'Xử lý ngoại lệ và giao tiếp đối tượng'],

			// Quản trị mạng
			['subject_id' => 20, 'chapter_number' => 1, 'name' => 'Quản lý và kiến trúc mạng'],
			['subject_id' => 20, 'chapter_number' => 2, 'name' => 'Bảo mật mạng'],
			['subject_id' => 20, 'chapter_number' => 3, 'name' => 'Quản lý tài nguyên mạng'],
			['subject_id' => 20, 'chapter_number' => 4, 'name' => 'Thực hành quản trị mạng'],
			// Cơ sở dữ liệu
			['subject_id' => 21, 'chapter_number' => 1, 'name' => 'Giới thiệu về cơ sở dữ liệu'],
			['subject_id' => 21, 'chapter_number' => 2, 'name' => 'Mô hình dữ liệu quan hệ'],
			['subject_id' => 21, 'chapter_number' => 3, 'name' => 'Ngôn ngữ truy vấn SQL'],
			['subject_id' => 21, 'chapter_number' => 4, 'name' => 'Quản lý giao dịch và bảo mật dữ liệu'],

			// Phương pháp tính
			['subject_id' => 22, 'chapter_number' => 1, 'name' => 'Giới thiệu về phương pháp tính'],
			['subject_id' => 22, 'chapter_number' => 2, 'name' => 'Phương pháp giải tích'],
			['subject_id' => 22, 'chapter_number' => 3, 'name' => 'Phương pháp đại số'],
			['subject_id' => 22, 'chapter_number' => 4, 'name' => 'Ứng dụng của phương pháp tính'],

			// Đồ án mạng 1
			['subject_id' => 23, 'chapter_number' => 1, 'name' => 'Phân tích yêu cầu đồ án mạng'],
			['subject_id' => 23, 'chapter_number' => 2, 'name' => 'Thiết kế và triển khai mạng'],
			['subject_id' => 23, 'chapter_number' => 3, 'name' => 'Kiểm thử và đảm bảo chất lượng'],
			['subject_id' => 23, 'chapter_number' => 4, 'name' => 'Bảo trì và nâng cấp hệ thống'],

			// Anh văn 2
			['subject_id' => 24, 'chapter_number' => 1, 'name' => 'Kỹ năng viết và thảo luận tiếng Anh'],
			['subject_id' => 24, 'chapter_number' => 2, 'name' => 'Giao tiếp kinh doanh và chuyên ngành'],
			['subject_id' => 24, 'chapter_number' => 3, 'name' => 'Nghe và phản xạ văn hóa'],
			['subject_id' => 24, 'chapter_number' => 4, 'name' => 'Đọc hiểu và dịch thuật'],

			// Kinh tế chính trị Mác - Lênin
			['subject_id' => 25, 'chapter_number' => 1, 'name' => 'Lịch sử hình thành và phát triển của KTCML'],
			['subject_id' => 25, 'chapter_number' => 2, 'name' => 'Nguyên tắc cơ bản của chủ nghĩa Mác - Lênin'],
			['subject_id' => 25, 'chapter_number' => 3, 'name' => 'Kinh tế học chính trị Mác - Lênin'],
			['subject_id' => 25, 'chapter_number' => 4, 'name' => 'Chủ nghĩa xã hội khoa học và thực tiễn'],

			// Chủ nghĩa xã hội khoa học
			['subject_id' => 26, 'chapter_number' => 1, 'name' => 'Những quan điểm cơ bản về chủ nghĩa xã hội khoa học'],
			['subject_id' => 26, 'chapter_number' => 2, 'name' => 'Xã hội và con người'],
			['subject_id' => 26, 'chapter_number' => 3, 'name' => 'Phát triển bền vững và xã hội khoa học'],
			['subject_id' => 26, 'chapter_number' => 4, 'name' => 'Ứng dụng của chủ nghĩa xã hội khoa học'],

			// Phân tích và thiết kế hệ thống
			['subject_id' => 27, 'chapter_number' => 1, 'name' => 'Quy trình phân tích và thiết kế hệ thống'],
			['subject_id' => 27, 'chapter_number' => 2, 'name' => 'Mô hình hóa hệ thống'],
			['subject_id' => 27, 'chapter_number' => 3, 'name' => 'Quản lý yêu cầu và kiểm thử hệ thống'],
			['subject_id' => 27, 'chapter_number' => 4, 'name' => 'Triển khai và bảo trì hệ thống'],

			// Quản trị doanh nghiệp
			['subject_id' => 28, 'chapter_number' => 1, 'name' => 'Quản trị doanh nghiệp và chiến lược kinh doanh'],
			['subject_id' => 28, 'chapter_number' => 2, 'name' => 'Quản trị nguồn nhân lực và quản lý chất lượng'],
			['subject_id' => 28, 'chapter_number' => 3, 'name' => 'Marketing và quảng cáo'],
			['subject_id' => 28, 'chapter_number' => 4, 'name' => 'Quản trị tài chính và kế toán'],

			// Hệ quản trị cơ sở dữ liệu
			['subject_id' => 29, 'chapter_number' => 1, 'name' => 'Kiến thức cơ bản về hệ quản trị cơ sở dữ liệu'],
			['subject_id' => 29, 'chapter_number' => 2, 'name' => 'Quản lý dữ liệu và bảo mật cơ sở dữ liệu'],
			['subject_id' => 29, 'chapter_number' => 3, 'name' => 'Tối ưu hóa và sao lưu dữ liệu'],
			['subject_id' => 29, 'chapter_number' => 4, 'name' => 'Ứng dụng của hệ quản trị cơ sở dữ liệu'],

			// Anh văn chuyên ngành (CNTT)
			['subject_id' => 30, 'chapter_number' => 1, 'name' => 'Ngữ pháp và từ vựng chuyên ngành'],
			['subject_id' => 30, 'chapter_number' => 2, 'name' => 'Kỹ năng đọc và hiểu bản tin chuyên ngành'],
			['subject_id' => 30, 'chapter_number' => 3, 'name' => 'Kỹ năng nghe và nói chuyên ngành'],
			['subject_id' => 30, 'chapter_number' => 4, 'name' => 'Viết và thảo luận chuyên ngành'],

			// Đồ án mạng 2
			['subject_id' => 31, 'chapter_number' => 1, 'name' => 'Phân tích và thiết kế hệ thống mạng'],
			['subject_id' => 31, 'chapter_number' => 2, 'name' => 'Triển khai và quản lý mạng'],
			['subject_id' => 31, 'chapter_number' => 3, 'name' => 'Bảo mật mạng và xử lý sự cố'],
			['subject_id' => 31, 'chapter_number' => 4, 'name' => 'Đánh giá hiệu suất và nâng cấp mạng'],

			// Tư tưởng Hồ Chí Minh
			['subject_id' => 32, 'chapter_number' => 1, 'name' => 'Cuộc đời và sự nghiệp của Bác Hồ'],
			['subject_id' => 32, 'chapter_number' => 2, 'name' => 'Tư tưởng Hồ Chí Minh về chủ nghĩa xã hội'],
			['subject_id' => 32, 'chapter_number' => 3, 'name' => 'Tư tưởng Hồ Chí Minh về độc lập tự do và hạnh phúc của nhân dân'],
			['subject_id' => 32, 'chapter_number' => 4, 'name' => 'Áp dụng tư tưởng Hồ Chí Minh vào thực tế'],

			// Xác xuất thống kê
			['subject_id' => 33, 'chapter_number' => 1, 'name' => 'Xác suất'],
			['subject_id' => 33, 'chapter_number' => 2, 'name' => 'Thống kê'],
			['subject_id' => 33, 'chapter_number' => 3, 'name' => 'Phân tích dữ liệu'],
			['subject_id' => 33, 'chapter_number' => 4, 'name' => 'Ứng dụng của xác xuất thống kê'],

			// Lập trình web
			['subject_id' => 34, 'chapter_number' => 1, 'name' => 'HTML, CSS và JavaScript cơ bản'],
			['subject_id' => 34, 'chapter_number' => 2, 'name' => 'Frameworks và thư viện phổ biến'],
			['subject_id' => 34, 'chapter_number' => 3, 'name' => 'Phát triển ứng dụng web đa nền tảng'],
			['subject_id' => 34, 'chapter_number' => 4, 'name' => 'Bảo mật và quản lý dự án web'],

			// Lập trình ứng dụng
			['subject_id' => 35, 'chapter_number' => 1, 'name' => 'Kiến thức cơ bản về lập trình ứng dụng'],
			['subject_id' => 35, 'chapter_number' => 2, 'name' => 'Xây dựng ứng dụng di động'],
			['subject_id' => 35, 'chapter_number' => 3, 'name' => 'Phát triển ứng dụng đa nền tảng'],
			['subject_id' => 35, 'chapter_number' => 4, 'name' => 'Kiểm thử và triển khai ứng dụng'],

			// Hệ thống thông tin địa lý (GIS)
			['subject_id' => 36, 'chapter_number' => 1, 'name' => 'Giới thiệu về hệ thống thông tin địa lý'],
			['subject_id' => 36, 'chapter_number' => 2, 'name' => 'Xử lý và phân tích dữ liệu địa lý'],
			['subject_id' => 36, 'chapter_number' => 3, 'name' => 'Phát triển ứng dụng GIS'],
			['subject_id' => 36, 'chapter_number' => 4, 'name' => 'Ứng dụng của GIS trong thực tế'],

			// Thương mại điện tử
			['subject_id' => 37, 'chapter_number' => 1, 'name' => 'Giới thiệu về thương mại điện tử'],
			['subject_id' => 37, 'chapter_number' => 2, 'name' => 'Phương thức thanh toán và bảo mật trong thương mại điện tử'],
			['subject_id' => 37, 'chapter_number' => 3, 'name' => 'Quảng cáo và tiếp thị trực tuyến'],
			['subject_id' => 37, 'chapter_number' => 4, 'name' => 'Quản lý doanh nghiệp trên nền tảng điện tử'],

			// Đồ án phần mềm 1
			['subject_id' => 38, 'chapter_number' => 1, 'name' => 'Phân tích yêu cầu và thiết kế hệ thống'],
			['subject_id' => 38, 'chapter_number' => 2, 'name' => 'Phát triển và kiểm thử phần mềm'],
			['subject_id' => 38, 'chapter_number' => 3, 'name' => 'Triển khai và bảo trì phần mềm'],
			['subject_id' => 38, 'chapter_number' => 4, 'name' => 'Quản lý dự án phần mềm'],

			// Lịch sử Đảng Cộng sản Việt Nam
			['subject_id' => 39, 'chapter_number' => 1, 'name' => 'Hình thành và phát triển của Đảng Cộng sản Việt Nam'],
			['subject_id' => 39, 'chapter_number' => 2, 'name' => 'Những thăng trầm trong lịch sử của Đảng'],
			['subject_id' => 39, 'chapter_number' => 3, 'name' => 'Chính sách và chiến lược của Đảng'],
			['subject_id' => 39, 'chapter_number' => 4, 'name' => 'Vai trò của Đảng trong sự nghiệp xây dựng và bảo vệ Tổ quốc'],

			// Lập trình Java cơ bản
			['subject_id' => 40, 'chapter_number' => 1, 'name' => 'Cơ bản về ngôn ngữ lập trình Java'],
			['subject_id' => 40, 'chapter_number' => 2, 'name' => 'Lập trình hướng đối tượng trong Java'],
			['subject_id' => 40, 'chapter_number' => 3, 'name' => 'Xử lý ngoại lệ và luồng trong Java'],
			['subject_id' => 40, 'chapter_number' => 4, 'name' => 'Ứng dụng thực tế của lập trình Java'],
			// Đồ án phần mềm 2
			['subject_id' => 41, 'chapter_number' => 1, 'name' => 'Thu thập và phân tích yêu cầu'],
			['subject_id' => 41, 'chapter_number' => 2, 'name' => 'Thiết kế và triển khai phần mềm'],
			['subject_id' => 41, 'chapter_number' => 3, 'name' => 'Kiểm thử và đảm bảo chất lượng phần mềm'],
			['subject_id' => 41, 'chapter_number' => 4, 'name' => 'Bảo trì và nâng cấp phần mềm'],

			// Công nghệ phần mềm
			['subject_id' => 42, 'chapter_number' => 1, 'name' => 'Quy trình phát triển phần mềm'],
			['subject_id' => 42, 'chapter_number' => 2, 'name' => 'Quản lý dự án phần mềm'],
			['subject_id' => 42, 'chapter_number' => 3, 'name' => 'Phân tích và thiết kế hệ thống'],
			['subject_id' => 42, 'chapter_number' => 4, 'name' => 'Kiểm thử và đảm bảo chất lượng phần mềm'],

			// Lý thuyết nhận dạng
			['subject_id' => 43, 'chapter_number' => 1, 'name' => 'Giới thiệu về lý thuyết nhận dạng'],
			['subject_id' => 43, 'chapter_number' => 2, 'name' => 'Phương pháp nhận dạng biometric'],
			['subject_id' => 43, 'chapter_number' => 3, 'name' => 'Nhận dạng giọng nói và văn bản'],
			['subject_id' => 43, 'chapter_number' => 4, 'name' => 'Ứng dụng của lý thuyết nhận dạng'],

			// Chuyên đề khởi nghiệp
			['subject_id' => 44, 'chapter_number' => 1, 'name' => 'Quy trình khởi nghiệp và phát triển sản phẩm'],
			['subject_id' => 44, 'chapter_number' => 2, 'name' => 'Quản lý rủi ro và tài chính khởi nghiệp'],
			['subject_id' => 44, 'chapter_number' => 3, 'name' => 'Marketing và xây dựng thương hiệu'],
			['subject_id' => 44, 'chapter_number' => 4, 'name' => 'Kinh doanh và pháp lý'],

			// Lập trình Java nâng cao
			['subject_id' => 45, 'chapter_number' => 1, 'name' => 'Xử lý file và đọc ghi dữ liệu'],
			['subject_id' => 45, 'chapter_number' => 2, 'name' => 'Kết nối cơ sở dữ liệu trong Java'],
			['subject_id' => 45, 'chapter_number' => 3, 'name' => 'Java và các thư viện phổ biến'],
			['subject_id' => 45, 'chapter_number' => 4, 'name' => 'Phát triển ứng dụng Java đa nền tảng'],

			// Quản lý dự án công nghệ thông tin
			['subject_id' => 46, 'chapter_number' => 1, 'name' => 'Quy trình và quản lý dự án IT'],
			['subject_id' => 46, 'chapter_number' => 2, 'name' => 'Phân tích yêu cầu và thiết kế hệ thống'],
			['subject_id' => 46, 'chapter_number' => 3, 'name' => 'Quản lý nguồn nhân lực và tiến độ'],
			['subject_id' => 46, 'chapter_number' => 4, 'name' => 'Kiểm thử và triển khai dự án'],

			// Công nghệ mạng không dây
			['subject_id' => 47, 'chapter_number' => 1, 'name' => 'Cơ sở lý thuyết của mạng không dây'],
			['subject_id' => 47, 'chapter_number' => 2, 'name' => 'Các tiêu chuẩn và giao thức mạng không dây'],
			['subject_id' => 47, 'chapter_number' => 3, 'name' => 'Quản lý và bảo mật mạng không dây'],
			['subject_id' => 47, 'chapter_number' => 4, 'name' => 'Phát triển ứng dụng và dịch vụ mạng không dây'],

			// Quản trị mạng nâng cao
			['subject_id' => 48, 'chapter_number' => 1, 'name' => 'Kiến thức cơ bản về quản trị mạng'],
			['subject_id' => 48, 'chapter_number' => 2, 'name' => 'Quản lý tài nguyên mạng và bảo mật'],
			['subject_id' => 48, 'chapter_number' => 3, 'name' => 'Thiết lập và duy trì mạng'],
			['subject_id' => 48, 'chapter_number' => 4, 'name' => 'Tối ưu hóa và giải quyết sự cố mạng'],

			// An toàn và bảo mật hệ thống mạng
			['subject_id' => 49, 'chapter_number' => 1, 'name' => 'Kiến thức cơ bản về an toàn và bảo mật'],
			['subject_id' => 49, 'chapter_number' => 2, 'name' => 'Phương pháp bảo mật hệ thống mạng'],
			['subject_id' => 49, 'chapter_number' => 3, 'name' => 'Kiểm thử và đánh giá rủi ro bảo mật'],
			['subject_id' => 49, 'chapter_number' => 4, 'name' => 'Quản lý sự cố bảo mật'],

			// Lập trình mạng
			['subject_id' => 50, 'chapter_number' => 1, 'name' => 'Kiến thức cơ bản về lập trình mạng'],
			['subject_id' => 50, 'chapter_number' => 2, 'name' => 'Giao thức truyền thông và socket programming'],
			['subject_id' => 50, 'chapter_number' => 3, 'name' => 'Phát triển ứng dụng mạng đa nền tảng'],
			['subject_id' => 50, 'chapter_number' => 4, 'name' => 'Quản lý mạng và tối ưu hóa hiệu suất'],
		];
		foreach ($chapters as $chapter) {
			Chapter::create($chapter);
		}
	}
}
