
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`
            bg-slate-800/30 backdrop-blur-md 
            border border-cyan-400/20 
            rounded-lg shadow-lg 
            transition-all duration-300 
            hover:border-cyan-400/60 hover:shadow-cyan-400/10
            p-4 sm:p-6 
            ${className}
        `}>
            {children}
        </div>
    );
};

export default Card;