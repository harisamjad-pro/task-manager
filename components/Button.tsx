import React from 'react'

const Button = ({icon, title}) => {
    return (
        <button className='flex items-center gap-1'>
            {icon}{title}
        </button>
    )
}

export default Button