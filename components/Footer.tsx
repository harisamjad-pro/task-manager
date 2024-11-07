import React from 'react'

const Footer = () => {
    return (
        <footer className='bg-gray-100 border border-t-gray-300'>
            <nav className='flex justify-center px-2 py-6'>
                <ul>
                    <li>
                        <p className='text-gray-600'>Copyright &copy; {new Date().getFullYear()}. All rights reserved.</p>
                    </li>
                </ul>
            </nav>
        </footer>
    )
}

export default Footer