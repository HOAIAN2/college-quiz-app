<?php

namespace App\Helper;

class Reply
{

	public static function success($status = 200)
	{
		return response()->json([
			'status' => 'success',
		], $status);
	}

	public static function successWithMessage($message, $transData = [], $status = 200)
	{
		return response()->json([
			'status' => 'success',
			'message' => trans($message, $transData)
		], $status);
	}

	public static function successWithData($data = [], $message = 'app.successes.success', $transData = [], $status = 200)
	{
		$response = [
			'status' => 'success',
			'data' => $data,
		];
		if (trim($message) != '') $response['message'] = trans($message, $transData);
		return response()->json($response, $status);
	}

	public static function error($message, $transData = [], $status = 400)
	{
		return response()->json([
			'status' => 'fail',
			'message' => trans($message, $transData)
		], $status);
	}
}
