import React, { ReactNode, ChangeEvent } from 'react';
import { BaseProps } from '../../utils/types';

interface LabelProps extends BaseProps {
    htmlFor?: string;
}

interface InputProps extends BaseProps {
    placeholder?: string; 
    value?: string | number;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void; 
    name?: string; 
    disabled?: boolean;
    required?: boolean;
    className?: string;
    type?: string;
    autoComplete?: string;
}

interface InputContainerProps extends BaseProps {}

export const Label: React.FC<LabelProps> = ({
    className = '',
    children,
    ...props
}) => {
    return <label
        className={`label ${className}`}
        {...props}
    >{children}</label>
};

export const Input: React.FC<InputProps> = ({
    value, 
    onChange,
    className = '',
    type = 'text',
    ...props
}) => {
    return <input
        value={value}
        onChange={onChange}
        type={type}
        className={`input ${className}`}
        {...props}
    />
};

export const InputContainer: React.FC<InputContainerProps> = ({className = '', children}) => {
    return (
        <div className={`input-container ${className}`}>
            {children}
        </div>
    );
};