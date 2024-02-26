"use client";

import { redirect } from "next/navigation";
import React from "react";

const Dashboard = () => {

  React.useEffect(()=>{
    localStorage.getItem("user") === null && redirect("/")
  },[])

  return (
    <>Dashboard</>
  )
}

export default Dashboard;