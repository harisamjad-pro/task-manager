import React from 'react'

const Button = ({icon, title}) => {
    return (
        <button className="max-sm:w-full max-sm:order-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex gap-1 items-center justify-center">
            {icon}{title}
        </button>
    )
}

export default Button