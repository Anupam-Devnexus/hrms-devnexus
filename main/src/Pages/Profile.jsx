import React from 'react'

const Profile = () => {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    const role = authUser?.role || "employee";
   
  return (
    <div>{authUser.username}</div>
  )
}

export default Profile