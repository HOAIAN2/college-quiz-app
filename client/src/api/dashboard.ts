/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api'
import { DashboarData } from '../models/dashboard'
import { ApiResponseWithData } from '../models/response'

export async function apiGetDashboard() {
	try {
		const res = await request.get('/dashboard')
		const { data } = res.data as ApiResponseWithData<DashboarData>
		return data
	} catch (error: any) {
		if (!error.response) throw new Error(error.message)
		const message = error.response.data.message
		throw new Error(message)
	}
}
