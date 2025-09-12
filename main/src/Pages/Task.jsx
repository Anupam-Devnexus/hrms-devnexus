import React , {useEffect} from 'react'
import {useTaskStore} from "../Zustand/GetTask"
const Task = () => {
const {fetchTasks , tasks , loading , error} = useTaskStore()
    useEffect(()=>{
        fetchTasks()
    },[])
    console.log(tasks)

  return (
    <div>Task</div>
  )
}

export default Task