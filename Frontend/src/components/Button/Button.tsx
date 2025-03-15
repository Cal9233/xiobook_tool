import React, { ReactNode, MouseEvent } from 'react';

interface ButtonProps {
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    children?: ReactNode;
    [key: string]: any;
}

const Button: React.FC<ButtonProps> = ({
    type,
    className = '',
    onClick,
    disabled = false,
    children,
    ...props
}) => {
    return (
        <button
            className={`btn ${className ? className : ''}`}
            disabled={disabled}
            type={type}
            onClick={onClick}
            {...props}
        >{children}</button>
    )
}

export default Button