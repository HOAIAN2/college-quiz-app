<?php

namespace App\Helper;

class Reply
{
    public static function success($status = 200)
    {
        return response()->json([
            'status' => 'success',
            'data' => null
        ], $status);
    }

    public static function successWithMessage($message, $status = 200)
    {
        return response()->json([
            'status' => 'success',
            'message' => $message
        ], $status);
    }

    public static function successWithData($data = [], $message, $status = 200)
    {
        $response = [
            'status' => 'success',
            'data' => $data,
        ];
        if (trim($message) != '') $response['message'] = $message;
        return response()->json($response, $status);
    }

    public static function error($message, $status = 400)
    {
        return response()->json([
            'status' => 'fail',
            'message' => $message
        ], $status);
    }
}
