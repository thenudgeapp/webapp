import {forwardRef} from "react";
import MDInput from "../MDInput/MDInputRoot";
import PropTypes from "prop-types";
import MDBox from "../MDBox";
import {CircularProgress} from "@mui/material";

const MDInputWithLoader = forwardRef(({ show, ...rest }, ref) => (
    <MDBox display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <MDInput {...rest} ref={ref} ownerState={{ show }} />
        {
            show && <CircularProgress size={20} style={{marginLeft: '0.4em'}}/>
        }
    </MDBox>
));

// Setting default values for the props of MDInput
MDInputWithLoader.defaultProps = {
    show: false,
};

// Typechecking props for the MDInput
MDInputWithLoader.propTypes = {
    show: PropTypes.bool,
};

export default MDInputWithLoader;
