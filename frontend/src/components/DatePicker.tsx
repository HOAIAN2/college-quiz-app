import 'react-datetime/css/react-datetime.css';

import moment from 'moment';
import React from 'react';
import Datetime, { DatetimepickerProps } from 'react-datetime';
import useAppContext from '~hooks/useAppContext';

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
