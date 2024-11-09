import React from 'react';
import Link from 'next/link';

interface SolidProps {
    href?: string;
    icon: React.ReactNode;
    title: string;
    disabled?: boolean;
    maxMdWidth?: boolean;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
}

export const ButtonSolid = ({ href, icon, title, disabled = false, maxMdWidth = false, onClick, type = "button" }: SolidProps) => {
    const buttonClasses = `${disabled ? "bg-gray-300 hover:bg-gray-300" : "bg-blue-600 hover:bg-blue-500"}
                           ${maxMdWidth ? "max-md:order-1 max-md:w-full" : ""}
                           px-4 py-2 rounded-lg text-white flex gap-1 items-center justify-center`;

    return (
        <>
            {href ? (
                <Link href={href} className="w-full grid">
                    <button className={buttonClasses} disabled={disabled} type={type}>
                        {icon}{title}
                    </button>
                </Link>
            ) : (
                <button
                    className={buttonClasses}
                    disabled={disabled}
                    onClick={onClick}
                    type={type}
                >
                    {icon}{title}
                </button>
            )}
        </>
    );
};

interface IconicProps {
    href?: string;
    icon: React.ReactNode;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
}

export const ButtonIconic = ({ href, icon, disabled = false, onClick, type = "button" }: IconicProps) => {
    return (
        <>
            {href ? (
                <Link href={href}>
                    <button disabled={disabled} type={type} className="flex items-center justify-center">
                        {icon}
                    </button>
                </Link>
            ) : (
                <button
                    type={type}
                    disabled={disabled}
                    onClick={onClick}
                    className="flex items-center justify-center"
                >
                    {icon}
                </button>
            )}
        </>
    );
};
