import React, { Component, Suspense } from "react"
import Layout from "./components/Layout/"
import {
  Route,
  Switch,
  BrowserRouter as Router,
  withRouter,
} from "react-router-dom"

// import "./assets/css/colors/default.css"

// Include Routes
import routes from "./routes/allRoutes"

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React themes
import theme from "./theme";
import {CacheProvider} from "@emotion/react";
import Sidenav from "./components/Shared/Sidenav";
import DashboardLayout from "./components/Layout/DashboardLayout";
import DashboardNavbar from "./components/Shared/DashboardNavbar";
import AppNoAuth from "./AppNoAuth";
import ThemeLayoutWrapper from "./components/Layout/ThemeLayoutWrapper";

function withLayout(WrappedComponent, hasDarkTopBar) {
    // ...and returns another component...
    /* eslint-disable react/display-name */
    return class extends React.Component {
        render() {
            return (
                <AppNoAuth>
                    <Layout hasDarkTopBar={hasDarkTopBar}>
                        <WrappedComponent></WrappedComponent>
                    </Layout>
                </AppNoAuth>
            )
        }
    }
}

function withoutLayout(WrappedComponent) {
    // ...and returns another component...
    /* eslint-disable react/display-name */
    return class extends React.Component {
        render() {
            return (
                <WrappedComponent></WrappedComponent>
            )
        }
    }
}



class App extends Component {
  Loader = () => {
    return (
      <div id="preloader">
        <div id="status">
          <div className="spinner">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
          </div>
        </div>
      </div>
    )
  }
  render() {
    return (
      <React.Fragment>
        <Router>
          <Suspense fallback={this.Loader()}>
            <Switch>
              {routes.map((route, idx) =>
                route.isWithoutLayout ? route.noAuth ? (
                        <Route
                            path={route.path}
                            exact={route.exact}
                            component={route.component}
                            key={idx}
                        />) : (
                  <Route
                    path={route.path}
                    exact={route.exact}
                    component={() => <ThemeLayoutWrapper view={() => route.component()}/>}
                    key={idx}
                  />
                ) : (
                  <Route
                    path={route.path}
                    exact
                    component={withLayout(route.component, route.isTopbarDark)}
                    key={idx}
                  />
                )
              )}
            </Switch>
          </Suspense>
        </Router>
      </React.Fragment>
    )
  }
}

export default withRouter(App)
