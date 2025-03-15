import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { FormField } from './FormField';
import { BaseProps, FieldConfig, FormValues, FormSubmitHandler } from './types';
import Button from '../Button/Button';


interface FormProps<T extends FormValues> extends BaseProps {
    initialValue: T;
    fields: FieldConfig[];
    onSubmit?: FormSubmitHandler<T>;
    submitText?: string;
    loading?: boolean;
}

const Form: React.FC<FormProps> = ({
    className = '',
    type = 'text',
    placeholder,
    onChange,
    children,
    ...props
}) => {
    return (
        <form className={className ? className : ''} {...props}>
            <FieldConfig>
                {children}
            </FieldConfig>
        </form>
    )
}

export default Form