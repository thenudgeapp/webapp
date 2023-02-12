import React from 'react'
import {Redirect} from "react-router-dom"


//Main Index
import Main from "../pages/TaskManagement/index"


const routes = [
  //Index Main
  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/index" />,
  },
  { path: "/index", component: Main, isTopbarDark: false },
]

export default routes
