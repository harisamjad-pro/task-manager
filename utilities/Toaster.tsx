import React from 'react'
import { IoCheckmarkCircle } from "react-icons/io5";


const Toaster = () => {
    return (
        <div className='bg-red-300 h-lvh w-full'>
            <div className='absolute top-0 right-12 w-fit flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-black shadow-lg'>
                Task Created Successfully
                <IoCheckmarkCircle className='size-6 text-green-600' />
            </div>
        </div>
    )
}

export default Toaster