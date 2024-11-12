"use client";

import React from 'react';
import Link from 'next/link';
import { GiElectric } from "react-icons/gi";
import { usePathname } from 'next/navigation';
// import Image from 'next/image';
import { RiMenu3Fill } from "react-icons/ri";


interface LinkItem {
    name: string;
    href: string;
    logo: React.ReactNode;
}

const Header = () => {
    const pathname = usePathname();

    const links: LinkItem[] = [
        { name: "tasker", href: "/", logo: <GiElectric className="size-5" /> },
        { name: "Dashboard", href: "/", logo: "" },
        { name: "Tasks", href: "/tasks", logo: "" },
        { name: "People", href: "/people", logo: "" },
    ];

    return (
        <header className="bg-white border-b border-gray-300 fixed w-full top-0 z-10">
            <nav className="px-16 py-4 flex items-center justify-between max-lg:px-12 max-md:px-8 max-sm:px-4">
                <ul className="flex items-center gap-6">
                    {links.map((link) => (
                        link.logo ? (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className="text-blue-600 mr-6 flex items-center gap-1 font-semibold text-2xl"
                                >
                                    {link.logo}
                                    {link.name}
                                </Link>
                            </li>
                        ) : (
                            <li className='block max-sm:hidden' key={link.name}>
                                <Link
                                    href={link.href}
                                    className={`${link.href === pathname ? "text-black" : "text-gray-500"} hover:text-black font-medium text-base`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        )
                    ))}
                </ul>
                <ul className='hidden max-sm:flex'>
                    <li>
                        {/* <Image
                            src="/champ1.jpg"
                            width={32}
                            height={32}
                            alt="Haris"
                            className="rounded-full object-cover border border-blue-600"
                        /> */}
                        <RiMenu3Fill className='size-6' />
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
