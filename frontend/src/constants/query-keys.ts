const keys = [
    'USER_EXPORTABLE_FIELDS',
    'PAGE_DASHBOARD',
    'PAGE_PROFILE',
    'PAGE_USERS',
    'PAGE_FACULTIES',
    'PAGE_PERMISSIONS',
    'PAGE_ROLE_PERMISSIONS',
    'PAGE_SCHOOL_CLASSES',
    'USER_DETAIL',
    'SCHOOL_CLASS_DETAIL',
    'FACULTY_DETAIL',
    'AUTO_COMPLETE_USER',
    'AUTO_COMPLETE_FACULTY',
    'AUTO_COMPLETE_SCHOOL_CLASS',
    'PAGE_SUBJECTS',
    'PAGE_SUBJECT',
    'PAGE_QUESTIONS',
    'QUESTION_DETAIL',
    'PAGE_SEMESTERS',
    'PAGE_SEMESTER',
    'PAGE_COURSES',
    'PAGE_COURSE',
    'AUTO_COMPLETE_SEMESTER',
    'AUTO_COMPLETE_SUBJECT',
    'ALL_STUDENT',
    'ALL_TEACHER',
    'CHAPTERS_DETAILS',
    'PAGE_EXAMS',
    'EXAM',
    'EXAM_QUESTIONS',
    'LOGIN_SESSIONS',
    'CALLABLE_COMMANDS',
    'ALL_SETTINGS',
    'EXAM_RESULTS',
] as const;

type QueryKey = (typeof keys)[number];

const QUERY_KEYS: Record<QueryKey, QueryKey> = Object.freeze(
    keys.reduce((acc, key) => {
        acc[key] = key;
        return acc;
    }, {} as Record<QueryKey, QueryKey>)
);

export default QUERY_KEYS;
