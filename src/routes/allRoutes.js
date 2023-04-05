import React, {Suspense} from 'react'
import {Redirect} from "react-router-dom"


//Main Index
import Main from "../pages/TaskManagement/index"
import Home from "../components/Home";
import Login from "../components/Auth/login";
import RecoverPassword from "../components/Auth/recover-password";
import Register from "../components/Auth/register";
import VerifyEmail from "../components/Auth/verify-email";
import {HomeSharp, ManageAccountsSharp, VerifiedUserSharp} from "@mui/icons-material";
import Profile from "../components/Profile";


const routes = [
  {
    path: "/home",
    exact: true,
    type: 'collapse',
    name: 'Home',
    title: 'Home',
    noCollapse: true,
    key: 'home',
    href: '/home',
    route: '/home',
    icon: 'home-sharp',
    component: () => <Suspense fallback={<span />}><Home/></Suspense>, isWithoutLayout: true,
  },
  {
    path: "/profile",
    exact: true,
    type: 'collapse',
    name: 'Profile',
    title: 'Profile',
    noCollapse: true,
    key: 'profile',
    href: '/profile',
    route: '/profile',
    icon: 'manage-accounts-sharp',
    component: () => <Suspense fallback={<span />}><Profile/></Suspense>, isWithoutLayout: true,
  },
  {
    path: ["/verify-email", "/verify-email/:token"],
    exact: true,
    component: () => <Suspense fallback={<span />}><VerifyEmail/></Suspense>,
    isWithoutLayout: true,
    noAuth: true,
  },
  {
    path: ["/forgot-password", "/forgot-password/:verificationToken", "/reset-password/:verificationToken"],
    exact: true,
    component: () => <Suspense fallback={<span />}><RecoverPassword/></Suspense>,
    isWithoutLayout: true,
    noAuth: true,
  },
  {
    path: "/register",
    exact: true,
    component: Register,
    isWithoutLayout: true,
    noAuth: true,
  },
  {
    path: "/login",
    exact: true,
    component: () => <Suspense fallback={<span />}><Login/></Suspense>,
    isWithoutLayout: true,
    noAuth: true,
  },
  //Index Main
  /*{
    path: "/",
    exact: true,
    component: () => <Redirect to="/index" />,
  },*/
  { path: "/", component: Main, isTopbarDark: false },
]

export default routes
