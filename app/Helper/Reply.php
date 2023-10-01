<?php

namespace App\Helper;

class Reply
{

    /** Return success response
     * @param int $message
     */

    public static function success()
    {
        return response()->json([]);
    }

    /** Return success response with Message
     * @param string $message
     */

    public static function successWithMessage($message, $status = 200)
    {
        return response()->json([
            'status' => 'success',
            'message' => trans($message)
        ], $status);
    }
    /**
     * @param string $message
     * @param null $error_name
     * @param array $errorData
     */
    public static function error($message, $status = 400)
    {
        return response()->json([
            'status' => 'fail',
            'message' => trans($message)
        ], $status);
    }
}
