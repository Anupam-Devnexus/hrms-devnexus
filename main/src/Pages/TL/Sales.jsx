import React from 'react'
import { useNavigate } from 'react-router-dom'

const Sales = () => {
    const navigate = useNavigate()
    return (
        <div className='p-2'>
            <div className='flex items-center justify-between'>
                <span className='text-2xl text-white font-bold'>
                    Sales Portal
                </span>
                <button
                    onClick={() => navigate('/dashboard/sales-updates')}
                    className='px-3 py-1 text-white bg-blue-600 rounded-md'>
                    Add Sales
                </button>
            </div>
        </div>
    )
}

export default Sales