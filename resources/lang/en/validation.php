<?php

return [
    'required' => 'Please enter the :attribute.',
    'string' => 'The :attribute field must be a string.',
    'in' => 'The selected value for :attribute is invalid.',
    'unique' => 'The :attribute field already exists in the system.',
    'email' => 'The :attribute field must be a valid email address.',
    'max' => [
        'string' => 'The :attribute field must not exceed :max characters.',
    ],
    'date' => 'The :attribute field must be a valid date.',
    'before' => 'The :attribute field must be a date before today.',
    'required_if' => 'The :attribute field is required when :other is :value.',
    'attributes' => [
        'first_name' => 'first name',
        'last_name' => 'last name',
        'shortcode' => 'shortcode',
        'role' => 'role',
        'email' => 'email',
        'address' => 'address',
        'phone_number' => 'phone number',
        'birth_date' => 'birth date',
        'school_class_id' => 'school class',
        'faculty_id' => 'faculty',
        'password' => 'password',
    ],
    'custom' => [
        'role' => [
            'in' => 'The selected role is invalid. Please choose from student, teacher, or administrator.',
        ],
        'shortcode' => [
            'unique' => 'The shortcode has already been used. Please choose a different one.',
        ],
        'email' => [
            'unique' => 'The email address has already been used. Please choose a different one.',
        ],
        'phone_number' => [
            'unique' => 'The phone number has already been used. Please choose a different one.',
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
            'confirmed' => 'The password confirmation does not match.',
            'min' => 'The password must contain at least :min characters.',
        ],
    ],
];
