<?php

namespace App\Enums;

use App\Traits\EnumResolver;

enum PermissionType: string
{
    use EnumResolver;

    case COURSE_CREATE = 'course_create';
    case COURSE_DELETE = 'course_delete';
    case COURSE_UPDATE = 'course_update';
    case COURSE_VIEW = 'course_view';
    case EXAM_CREATE = 'exam_create';
    case EXAM_DELETE = 'exam_delete';
    case EXAM_RESULT_CANCEL = 'exam_result_cancel';
    case EXAM_RESULT_REMARK = 'exam_result_remark';
    case EXAM_SUBMIT = 'exam_submit';
    case EXAM_UPDATE = 'exam_update';
    case EXAM_VIEW = 'exam_view';
    case FACULTY_CREATE = 'faculty_create';
    case FACULTY_DELETE = 'faculty_delete';
    case FACULTY_UPDATE = 'faculty_update';
    case FACULTY_VIEW = 'faculty_view';
    case QUESTION_CREATE = 'question_create';
    case QUESTION_DELETE = 'question_delete';
    case QUESTION_UPDATE = 'question_update';
    case QUESTION_VIEW = 'question_view';
    case ROLE_PERMISSION_GRANT = 'role_permission_grant';
    case ROLE_PERMISSION_VIEW = 'role_permission_view';
    case SCHOOL_CLASS_CREATE = 'school_class_create';
    case SCHOOL_CLASS_DELETE = 'school_class_delete';
    case SCHOOL_CLASS_UPDATE = 'school_class_update';
    case SCHOOL_CLASS_VIEW = 'school_class_view';
    case SEMESTER_CREATE = 'semester_create';
    case SEMESTER_DELETE = 'semester_delete';
    case SEMESTER_UPDATE = 'semester_update';
    case SEMESTER_VIEW = 'semester_view';
    case SUBJECT_CREATE = 'subject_create';
    case SUBJECT_DELETE = 'subject_delete';
    case SUBJECT_UPDATE = 'subject_update';
    case SUBJECT_VIEW = 'subject_view';
    case USER_CREATE = 'user_create';
    case USER_DELETE = 'user_delete';
    case USER_UPDATE = 'user_update';
    case USER_VIEW = 'user_view';
}
