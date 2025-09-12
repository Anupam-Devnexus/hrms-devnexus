import React, { useEffect } from 'react'
import { useUserStore } from "../../Zustand/GetAllData"

const Team = () => {

    const { allData, fetchAllData, loading, error } = useUserStore();

    useEffect(() => {
        fetchAllData();
    },[]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // console.log("All User Data in Team Page:", allData.data);

    return (
        <div>Team</div>
    )
}

export default Team