import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Progress, Card, CardBody } from "reactstrap";

//Import Icons
import FeatherIcon from "feather-icons-react";

//Import Images
import imgbg from "../../assets/images/account/bg.png";
import profile from "../../assets/images/client/05.jpg";
import client1 from "../../assets/images/client/01.jpg";
import client2 from "../../assets/images/client/02.jpg";
import client3 from "../../assets/images/client/03.jpg";
import client4 from "../../assets/images/client/04.jpg";
import client5 from "../../assets/images/client/05.jpg";
import client6 from "../../assets/images/client/06.jpg";
import client7 from "../../assets/images/client/07.jpg";
import client8 from "../../assets/images/client/08.jpg";

import logo from "../../assets/img/logo.svg"
import avMale4 from "../../assets/img/avatar-male-4.jpg"

class Layout extends Component {
  state = {
    members: [
      {
        id: 1,
        img: client1,
      },
      {
        id: 2,
        img: client2,
      },
      {
        id: 3,
        img: client3,
      },
      {
        id: 4,
        img: client4,
      },
      {
        id: 5,
        img: client5,
      },
      {
        id: 6,
        img: client6,
      },
      {
        id: 7,
        img: client7,
      },
      {
        id: 8,
        img: client8,
      },
    ],
    widgets: [
      {
        id: 1,
        icon: "uil uil-dashboard",
        className: "navbar-item account-menu px-0",
        title: "Profile",
        link: "/page-profile",
      },
      {
        id: 2,
        icon: "uil uil-users-alt",
        className: "navbar-item account-menu px-0 mt-2 active",
        title: "Members",
        link: "/page-members",
      },
      {
        id: 3,
        icon: "uil uil-file",
        className: "navbar-item account-menu px-0 mt-2",
        title: "Portfolio",
        link: "/page-works",
      },
      {
        id: 4,
        icon: "uil uil-comment",
        className: "navbar-item account-menu px-0 mt-2",
        title: "Chat",
        link: "/page-chat",
      },
      {
        id: 5,
        icon: "uil uil-envelope-star",
        className: "navbar-item account-menu px-0 mt-2",
        title: "Messages",
        link: "/page-messages",
      },
      {
        id: 6,
        icon: "uil uil-transaction",
        className: "navbar-item account-menu px-0 mt-2",
        title: "Payments",
        link: "/page-payments",
      },
      {
        id: 7,
        icon: "uil uil-setting",
        className: "navbar-item account-menu px-0 mt-2",
        title: "Settings",
        link: "/page-profile-edit",
      },
      {
        id: 8,
        icon: "uil uil-dashboard",
        className: "navbar-item account-menu px-0 mt-2",
        title: "Logout",
        link: "/auth-login-three",
      },
    ],
  };

  componentDidMount() {
    document.body.classList = "";
    document.querySelectorAll("#buyButton").forEach((navLink) => {
      navLink.classList?.add("btn-light")
      navLink?.classList?.remove("btn-soft-primary");
      document.getElementById("top-menu")?.classList?.add("nav-light");
    })
    window.addEventListener("scroll", this.scrollNavigation, true);
  }
  // Make sure to remove the DOM listener when the component is unmounted.
  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollNavigation, true);
  }

  scrollNavigation = () => {
    var doc = document.documentElement;
    var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    var topnav = document.getElementById('topnav');
    if (top > 80 && topnav) {
      topnav.classList.add('nav-sticky');
    }
    else if (topnav) {
      topnav.classList.remove('nav-sticky');
    }
      if (top > 80) {
        document.querySelector(".shoppingbtn")?.classList?.remove("btn-light");
        document.querySelector(".settingbtn")?.classList?.remove("btn-light");
        document.querySelector(".shoppingbtn")?.classList?.add("btn-primary");
        document.querySelector(".settingbtn")?.classList?.add("btn-soft-primary");
        document.getElementById("topnav")?.classList?.add("nav-sticky");
      } else {
        document.querySelector(".shoppingbtn")?.classList?.remove("btn-primary");
        document.querySelector(".settingbtn")?.classList?.remove("btn-soft-primary");
        document.querySelector(".shoppingbtn")?.classList?.add("btn-light");
        document.querySelector(".settingbtn")?.classList?.add("btn-light");
        document.getElementById("topnav")?.classList?.remove("nav-sticky");
      }
  };

  render() {
    return (
      <React.Fragment>

      </React.Fragment>
    );
  }
}

export default Layout;
