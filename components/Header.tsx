"use client";

import React from 'react'
import Link from 'next/link';
import { GiElectric } from "react-icons/gi";
import { usePathname } from 'next/navigation';

const Header = () => {

    const pathname = usePathname();

    const links = [
        { name: "tasker", href: "/", logo: <GiElectric className='size-5' /> },
        { name: "Dashboard", href: "/", logo: "" },
        { name: "Tasks", href: "/tasks", logo: "" },
        { name: "People", href: "/people", logo: "" },
    ]

    return (
        <header className='bg-white border-b border-gray-200 font-[var(--font-inter-sans)]'>
            <nav className='px-12 py-4'>
                <ul className='flex items-center gap-6'>
                    {links.map((link) => (
                        link.logo ? (
                            <li key={link.name}><Link href={link.href} className='text-blue-600 mr-6 flex items-center gap-1 font-semibold text-2xl'>{link.logo}{link.name}</Link></li>
                        ) : (
                            <li key={link.name}><Link href={link.href} className={`${link.href === pathname ? "text-black" : "text-gray-500"} font-medium text-base`}>{link.name}</Link></li>
                        )
                    ))}
                </ul>
            </nav>
        </header>
    )
}

export default Header