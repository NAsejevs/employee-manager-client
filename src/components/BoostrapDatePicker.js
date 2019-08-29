import React from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import en from 'date-fns/locale/en-GB';

const BoostrapDatePicker = (props) => {
    return (
        <DatePicker
            {...props}
            className="text-center"
            customInput={<Form.Control/>}
            locale={en}
        />
    );
}

export default BoostrapDatePicker;
