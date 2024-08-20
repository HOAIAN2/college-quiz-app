<?php

return [
	'required' => 'Vui lòng nhập đầy đủ :attribute.',
	'string' => 'Trường :attribute phải là một chuỗi ký tự.',
	'integer' => 'Trường :attribute phải là số nguyên',
	'in' => 'Giá trị đã chọn cho trường :attribute không hợp lệ.',
	'unique' => 'Trường :attribute đã tồn tại trong hệ thống.',
	'email' => 'Trường :attribute phải là địa chỉ email hợp lệ.',
	'alpha_dash' => 'Trường :attribute chỉ được chứa chữ cái, số, dấu gạch ngang, và dấu gạch dưới.',
	'max' => [
		'string' => 'Trường :attribute không được vượt quá :max ký tự.',
	],
	'min' => [
		'array' => 'Trường :attribute phải có ít nhất :min mục.'
	],
	'size' => [
		'string' => 'Trường :attribute phải luôn có :size ký tự',
	],
	'regex' => 'Trường :attribute có định dạng không hợp lệ',
	'date' => 'Trường :attribute phải là ngày hợp lệ.',
	'before' => 'Trường :attribute phải là ngày trước ngày :date.',
	'after' => 'Trường :attribute phải là ngày sau ngày :date.',
	'required_if' => 'Trường :attribute là bắt buộc khi :other là :value.',
	'attributes' => [
		'name' => 'tên',
		'first_name' => 'tên',
		'last_name' => 'họ',
		'shortcode' => 'mã số',
		'role' => 'vai trò',
		'email' => 'email',
		'address' => 'địa chỉ',
		'phone_number' => 'số điện thoại',
		'birth_date' => 'ngày sinh',
		'school_class_id' => 'lớp học',
		'faculty_id' => 'khoa',
		'password' => 'mật khẩu',
		'chapter_number' => 'số chương',
		'content' => 'nội dung',
		'start_date' => 'ngày bắt đầu',
		'end_date' => 'ngày kết thúc',
		'teacher_id' => 'giáo viên',
		'exam_date' => 'ngày thi',
		'exam_time' => 'thời gian thi',
	],
	'custom' => [
		'role' => [
			'in' => 'Vai trò được chọn không hợp lệ. Vui lòng chọn từ học sinh, giáo viên hoặc quản trị viên.',
		],
		'shortcode' => [
			'unique' => 'Mã số đã được sử dụng. Vui lòng chọn một mã khác.',
		],
		'email' => [
			'unique' => 'Địa chỉ email đã được sử dụng. Vui lòng chọn một địa chỉ khác.',
		],
		'phone_number' => [
			'unique' => 'Số điện thoại đã được sử dụng. Vui lòng chọn một số khác.',
			'regex' => 'Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số'
		],
		'birth_date' => [
			'before' => 'Ngày sinh phải là một ngày trước ngày hôm nay.',
		],
		'school_class_id' => [
			'required_if' => 'Trường lớp học là bắt buộc khi vai trò là học sinh.',
		],
		'faculty_id' => [
			'required_if' => 'Trường khoa là bắt buộc khi vai trò là giáo viên.',
		],
		'password' => [
			'confirmed' => 'Xác nhận mật khẩu không khớp.',
			'min' => 'Mật khẩu phải chứa ít nhất :min ký tự.',
		],
		'chapter_number' => [
			'unique' => 'Môn học đã tồn tại chương này'
		],
		'options.*' => [
			'required' => 'Vui lòng nhập nội dung đáp án',
			'distinct' => 'Nội dung câu trả lời không được trùng nhau'
		],
		'true_option' => [
			'*' => 'Vui lòng chọn đáp án đúng cho câu hỏi này'
		],
		'options' => [
			'min' => [
				'array' => 'Vui lòng nhập ít nhất 2 câu trả lời'
			]
		],
		'supervisor_ids' => [
			'required' => 'Vui lòng chọn ít nhất 1 giám thị'
		]
	],
];
