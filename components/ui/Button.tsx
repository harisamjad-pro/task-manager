import React from 'react'
import Link from 'next/link';

interface ButtonProps {
    href: string,
    icon: string,
    title: string
}

const Button = ({ href, icon, title }) => {
    return (
        <>
            {href ? (
                <Link href={href} className='w-full grid'>
                    <button className="max-sm:w-full max-sm:order-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex gap-1 items-center justify-center">
                        {icon}{title}
                    </button>
                </Link>
            ) : (
                <button className="max-sm:w-full max-sm:order-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex gap-1 items-center justify-center">
                    {icon}{title}
                </button>
            )}
        </>
    )
}

export default Button