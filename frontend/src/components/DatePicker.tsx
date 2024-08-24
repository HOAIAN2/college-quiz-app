import 'react-datetime/css/react-datetime.css';

import useAppContext from '@hooks/useAppContext';
import moment from 'moment';
import React from 'react';
import Datetime, { DatetimepickerProps } from 'react-datetime';

const DatePicker: React.FC<DatetimepickerProps> = ({ ...restProps }) => {
	const { appLanguage } = useAppContext();
	return (
		<Datetime
			{...restProps}
			locale={appLanguage.language}
			renderMonth={renderMonth}
		/>
	);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
function renderMonth(props: any, month: number, _year: number, _selectedDate: any) {
	return (
		<td {...props} key={props['key']}>
			{moment.localeData().monthsShort()[month]}
		</td>
	);
}

export default DatePicker;
