/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment';

export default function renderMonth(props: any, month: number, _year: number, _selectedDate: any) {
	// console.log(props)
	return <td {...props} key={props['key']}>{moment.localeData().monthsShort()[month]}</td>;
}
