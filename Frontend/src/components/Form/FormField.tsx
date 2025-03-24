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
        autoComplete,
        options = []
    } = field;

    const renderInput = () => {
        switch (type) {
            case 'select':
                return (
                    <select
                        id={name}
                        name={name}
                        value={value || ''}
                        onChange={onChange}
                        disabled={disabled}
                        required={required}
                        className={`form-control ${error ? 'is-invalid' : ''}`}
                        {...props}
                    >
                        {options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );
            case 'number':
                return (
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
                        min={0}
                        className={`form-control ${error ? 'is-invalid' : ''}`}
                        {...props}
                    />
                );
            default:
                return (
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
                );
        }
    };

    return (
        <InputContainer className={`form-field ${className}`}>
            <Label
                htmlFor={name}
                className={`form-label ${required ? 'required' : ''}`}
            >
                {label}
            </Label>
            {renderInput()}
            {error && <div className='invalid-feedback'>{error}</div>}
        </InputContainer>
    )
};