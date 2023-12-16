<?php

return [
    'required' => 'Trường :attribute là bắt buộc.',
    'string' => 'Trường :attribute phải là một chuỗi ký tự.',
    'in' => 'Giá trị đã chọn cho trường :attribute không hợp lệ.',
    'unique' => 'Trường :attribute đã tồn tại.',
    'email' => 'Trường :attribute phải là địa chỉ email hợp lệ.',
    'max' => [
        'string' => 'Trường :attribute không được vượt quá :max ký tự.',
    ],
    'date' => 'Trường :attribute phải là ngày hợp lệ.',
    'before' => 'Trường :attribute phải là ngày trước ngày hôm nay.',
    'custom' => [
        'role' => [
            'in' => 'Vai trò được chọn không hợp lệ. Vui lòng chọn từ học sinh, giáo viên hoặc quản trị viên.',
        ],
        'shortcode' => [
            'unique' => 'Mã ngắn đã được sử dụng. Vui lòng chọn một mã khác.',
        ],
        'email' => [
            'unique' => 'Địa chỉ email đã được sử dụng. Vui lòng chọn một địa chỉ khác.',
        ],
        'phone_number' => [
            'unique' => 'Số điện thoại đã được sử dụng. Vui lòng chọn một số khác.',
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
            'min' => 'Mật khẩu phải chứa ít nhất :min ký tự.',
        ],
    ],
];
