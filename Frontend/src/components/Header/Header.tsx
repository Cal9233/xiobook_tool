import React, { ReactNode } from 'react';

interface HeaderProps {
    className?: string;
    variant?: 'h1' | 'h2' | 'h3' | 'h4';
    children?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({className = '', variant = 'h4', children}) => {
    const HeadingTag = () => {
        switch (variant) {
            case 'h1':
                return <h1>{children}</h1>;
            case 'h2':
                return <h2>{children}</h2>;
            case 'h3':
                return <h3>{children}</h3>;
            case 'h4':
                return <h4>{children}</h4>;
            default:
                return <h1>{children}</h1>;
        }
    };
    return (
        <div className={`header ${className ? className : ''}`}>
            {HeadingTag()}
        </div>
    )
}

export default Header