import React from 'react';
import { BaseProps, FieldConfig, InputChangeHandler } from '../../utils/types';
import { Input, Label, InputContainer } from '../Input/Input';

interface FormFieldProps extends BaseProps {
    field: FieldConfig;
    value: any;
    onChange: InputChangeHandler;
    error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
    field,
    className = '',
    value,
    onChange,
    error,
    ...props
}) => {
    const {
        name,
        label,
        type = 'text',
        placeholder = label,
        disabled = false,
        required = false,
        autoComplete
    } = field;
    return (
        <InputContainer className={`form-field ${className}`}>
            <Label
                htmlFor={name}
                className={`form-label ${required ? required : ''}`}
            >
                {label}
            </Label>
            <Input 
                id={name}
                name={name}
                type={type}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                autoComplete={autoComplete}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                {...props}
            />
            {error && <div className='invalid-feedback'>{error}</div>}
        </InputContainer>
    )
};