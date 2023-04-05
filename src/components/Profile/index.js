/**
 =========================================================
 * Material Dashboard 2 React - v2.1.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-react
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components

// Material Dashboard 2 React example components
import ProfileInfoCard from "../Shared/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "../Shared/ProfilesList";


// Data
import profilesListData from "./data/profilesListData";

import MDBox from "../Shared/MDBox";
import Header from "./Header";
import PlatformSettings from "./PlatformSettings";
import {useAtom} from "jotai";
import {AuthAtoms} from "../../store";
import {useEffect} from "react";
const Profile = () => {
    const [user, getUser] = useAtom(AuthAtoms.getUser)

    useEffect(() => {
        getUser({id: user.id}).then()
    }, [])
    return (
        <MDBox>
            <MDBox mb={2} />
            <Header>
                <MDBox mt={5} mb={3}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
                            <ProfileInfoCard
                                title="profile information"
                                social={[]}
                                action={{ route: "", tooltip: "Edit Profile" }}
                                shadow={false}
                            />
                            <Divider orientation="vertical" sx={{ mx: 0 }} />
                        </Grid>
                        <Grid item xs={12} md={6} xl={4}>
                            <PlatformSettings title={"platform settings"} />
                        </Grid>
                        <Grid item xs={12} xl={4} sx={{ display: "flex" }}>
                            <Divider orientation="vertical" sx={{ mx: 0 }} />
                            <PlatformSettings title={"task settings"} />
                        </Grid>
                    </Grid>
                </MDBox>
            </Header>
        </MDBox>
    );
}

export default Profile;
