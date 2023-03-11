// Import Css
import "./assets/css/materialdesignicons.min.css"
import "./Apps.scss"
import {Fragment, Component} from "react";

class AppNoAuth extends Component {

    render() {
        return (
            <Fragment>
                {this.props.children}
            </Fragment>
        );
    }
}

export default AppNoAuth
