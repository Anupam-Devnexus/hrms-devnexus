import React, {useEffect} from 'react';
import data from "../DataStore/DashCard.json";
import SearchBarComp from '../Component/SearchBarComp';
import DashCard from '../Component/Card/DashCard';
import RoleData from "../DataStore/complete.json"
import {useUserStore} from "../Zustand/GetAllData"
import {
  FaUsers,
  FaDollarSign,
  FaCheckCircle,
  // FaFileText,
  // FaBarChart,
  FaCalendar,
  FaCheckSquare,
  FaSun,
  FaClipboardList,
  FaBell
} from "react-icons/fa";

// Map string icon names to react-icons components
const iconMap = {
  users: FaUsers,
  "dollar-sign": FaDollarSign,
  "check-circle": FaCheckCircle,
  // "file-text": FaFileText,
  // "bar-chart": FaBarChart,
  calendar: FaCalendar,
  "check-square": FaCheckSquare,
  sun: FaSun,
  "clipboard-list": FaClipboardList,
  bell: FaBell
};

// Map color names to Tailwind classes
const colorMap = {
  blue: "border-blue-400",
  green: "border-green-400",
  yellow: "border-yellow-400",
  red: "border-red-400"
};

export default function Dashboard() {
  // Get role from localStorage safely
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const role = authUser?.role || "employee";

  console.log(role)

  const {allData, fetchAllData} = useUserStore();

  useEffect(() => {
    fetchAllData();
  }, []);
  console.log("All User Data:", allData.data);


// console.log("Data:", RoleData);


  // Get cards for current role
  const roleCards = data[role] || [];

  if (roleCards.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold">No dashboard cards available for your role.</h2>
      </div>
    );
  }

  return (
    <div className='flex  flex-col gap-2'>
      <SearchBarComp />
      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {roleCards.map((card, index) => (
          <DashCard
            key={index}
            title={card.label}
            value={card.value}
            description={card.description}
            icon={iconMap[card.icon]}
            borderColor={colorMap[card.color]}
          />
        ))}
      </div>
    </div>
  );
}
