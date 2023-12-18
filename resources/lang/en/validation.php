<?php

return [
    'required' => 'The :attribute field is required.',
    'string' => 'The :attribute must be a string.',
    'in' => 'The selected :attribute is invalid.',
    'unique' => 'The :attribute has already been taken.',
    'email' => 'The :attribute must be a valid email address.',
    'max' => [
        'string' => 'The :attribute must not be greater than :max characters.',
    ],
    'date' => 'The :attribute must be a valid date.',
    'before' => 'The :attribute must be a date before today.',
    'attributes' => [
        'first_name' => 'first name',
        'last_name' => 'last name',
        'shortcode' => 'shortcode',
        'role' => 'role',
        'email' => 'email address',
        'address' => 'address',
        'phone_number' => 'phone number',
        'birth_date' => 'birth date',
        'school_class_id' => 'school class',
        'faculty_id' => 'faculty',
        'password' => 'password',
    ],
    'custom' => [
        'role' => [
            'in' => 'The selected role is invalid. Please choose from student, teacher, or admin.',
        ],
        'shortcode' => [
            'unique' => 'The shortcode has already been taken. Please choose a different one.',
        ],
        'email' => [
            'unique' => 'The email address has already been taken. Please choose a different one.',
        ],
        'phone_number' => [
            'unique' => 'The phone number has already been taken. Please choose a different one.',
        ],
        'birth_date' => [
            'before' => 'The birth date must be a date before today.',
        ],
        'school_class_id' => [
            'required_if' => 'The school class field is required when the role is student.',
        ],
        'faculty_id' => [
            'required_if' => 'The faculty field is required when the role is teacher.',
        ],
        'password' => [
            'min' => 'The password must be at least :min characters.',
        ],
    ],
];
