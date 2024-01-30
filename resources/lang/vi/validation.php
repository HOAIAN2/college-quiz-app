<?php

return [
    'required' => 'Vui lòng nhập đầy đủ :attribute.',
    'string' => 'Trường :attribute phải là một chuỗi ký tự.',
    'in' => 'Giá trị đã chọn cho trường :attribute không hợp lệ.',
    'unique' => 'Trường :attribute đã tồn tại trong hệ thống.',
    'email' => 'Trường :attribute phải là địa chỉ email hợp lệ.',
    'alpha_dash' => 'Trường :attribute chỉ được chứa chữ cái, số, dấu gạch ngang, và dấu gạch dưới.',
    'max' => [
        'string' => 'Trường :attribute không được vượt quá :max ký tự.',
    ],
    'size' => [
        'string' => 'Trường :attribute phải luôn có 10 ký tự',
    ],
    'regex' => 'Trường :attribute có định dạng không hợp lệ',
    'date' => 'Trường :attribute phải là ngày hợp lệ.',
    'before' => 'Trường :attribute phải là ngày trước ngày hôm nay.',
    'required_if' => 'Trường :attribute là bắt buộc khi :other là :value.',
    'attributes' => [
        'name' => 'Tên',
        'first_name' => 'tên',
        'last_name' => 'họ',
        'shortcode' => 'mã số',
        'role' => 'vai trò',
        'email' => 'email',
        'address' => 'địa chỉ',
        'phone_number' => 'số điện thoại',
        'birth_date' => 'ngày sinh',
        'school_class' => 'lớp học',
        'faculty' => 'khoa',
        'password' => 'mật khẩu',
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
        'school_class' => [
            'required_if' => 'Trường lớp học là bắt buộc khi vai trò là học sinh.',
        ],
        'faculty' => [
            'required_if' => 'Trường khoa là bắt buộc khi vai trò là giáo viên.',
        ],
        'password' => [
            'confirmed' => 'Xác nhận mật khẩu không khớp.',
            'min' => 'Mật khẩu phải chứa ít nhất :min ký tự.',
        ],
    ],
];
