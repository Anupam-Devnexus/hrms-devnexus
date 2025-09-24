import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSalesStore } from "../../Zustand/GetSales"

const Sales = () => {
    const { salesList, error, loading, fetchSales } = useSalesStore()
    const navigate = useNavigate()

    useEffect(() => {
        fetchSales()
    }, [])
    // console.log(salesList)
    const authUser = JSON.parse(localStorage.getItem("authUser")).user;
    console.log(authUser.Role)
    return (
        <div className='p-2'>
            {authUser.Role}
            <div className='flex items-center justify-between'>
                <span className='text-2xl text-white font-bold'>
                    Sales Portal
                </span>
                {authUser.Role === "TL" && <button
                    onClick={() => navigate('/dashboard/sales-updates')}
                    className='px-3 py-1 text-white bg-blue-600 rounded-md'>
                    Add Sales
                </button>}
            </div>
            {salesList.message}
        </div>
    )
}

export default Sales