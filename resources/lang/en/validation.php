<?php

return [
	'required' => 'Please enter the :attribute.',
	'string' => 'The :attribute field must be a string.',
	'integer' => 'The :attribute number field must be an integer.',
	'in' => 'The selected value for :attribute is invalid.',
	'unique' => 'The :attribute field already exists in the system.',
	'email' => 'The :attribute field must be a valid email address.',
	'alpha_dash' => 'The :attribute field must only contain letters, numbers, dashes, and underscores.',
	'max' => [
		'string' => 'The :attribute field must not exceed :max characters.',
	],
	'min' => [
		'array' => 'The :attribute field must have at least :min items.'
	],
	'size' => [
		'string' => 'The :attribute field must be :size characters.'
	],
	'regex' => 'The :attribute field format is invalid.',
	'date' => 'The :attribute field must be a valid date.',
	'before' => 'The :attribute field must be a date before :date.',
	'after' => 'The :attribute field must be a date after :date.',
	'required_if' => 'The :attribute field is required when :other is :value.',
	'attributes' => [
		'name' => 'name',
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
		'chapter_number' => 'chapter number',
		'content' => 'content',
		'start_date' => 'start date',
		'end_date' => 'end date',
		'teacher_id' => 'teacher',
		'exam_date' => 'exam date',
		'exam_time' => 'exam time',
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
			'regex' => 'The phone number must start with 0 and have 10 digits.'
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
		'chapter_number' => [
			'unique' => 'This chapter already exists for the subject.',
		],
		'options.*' => [
			'required' => 'Please enter the answer content',
			'distinct' => 'The answer content must be unique'
		],
		'true_option' => [
			'*' => 'Please select the correct answer for this question.'
		],
		'options' => [
			'min' => [
				'array' => 'Please enter atleast 2 answers'
			]
		],
		'supervisor_ids' => [
			'required' => 'Please select at least one supervisor'
		]
	],
];
