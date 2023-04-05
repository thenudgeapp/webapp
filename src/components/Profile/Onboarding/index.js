import React, {useRef, useState} from "react";
import {Box, Button, FormControl, Grid, IconButton, InputLabel, Modal, Select, Typography} from "@mui/material";
import MDBox from "../../Shared/MDBox";
import {Close, Notes} from "@mui/icons-material";
import Editor from "../../Shared/Editor";
import {createEditor} from "lexical";
import {$generateHtmlFromNodes} from "@lexical/html";
import {EditorDefaultConfig, ONBOARD_DISPLAY} from "../../../config/constants";
import MDInput from "../../Shared/MDInput";
import MDButton from "../../Shared/MDButton";
import MenuItem from "@mui/material/MenuItem";
import {companyIndustries, companySizes, workLevels} from "../../../config/data";
import {useAtom} from "jotai";
import {AuthAtoms} from "../../../store";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    display: 'flex',
    alignItems: 'inherit',
    p: 4,
};

const Onboarding = ({...props}) => {
    const [user, updateUser] = useAtom(AuthAtoms.updateUser)
    const editorStateRef = useRef();
    const [val, setVal] = useState(user.bio || undefined)
    const [open, setOpen] = useState(false)
    const [valIntermediate, setValIntermediate] = useState()
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [checkedStates, setCheckedStates] = useState({})
    const [showToolbar, setShowToolbar] = useState(false)
    const [jobRole, setJobRole] = useState(user?.jobRole)
    const [workLevel, setWorkLevel] = useState(user?.workLevel)
    const [companyIndustry, setCompanyIndustry] = useState(user?.companyIndustry)
    const [companySize, setCompanySize] = useState(user?.companySize)

    const toggle = () => setOpen((prevState => !prevState))

    const updateProfile = () => {
        setLoading(true)
        const data = {
            jobRole,
            workLevel,
            companyIndustry,
            companySize,
            bio: valIntermediate,
        }
        updateUser({data, id: user.id}).then((response) => {
            setLoading(true)
            localStorage.removeItem(ONBOARD_DISPLAY)
            props.setOpen(false)
        }).catch(error => {
            console.error(error)
        })
    }


    return (
        <Modal open={props.open}
               aria-labelledby="modal-modal-title"
               aria-describedby="modal-modal-description"
        >
            <MDBox sx={{
                display: 'grid',
                backgroundColor: '#F4F5F7',
            }}>
                <MDBox sx={{
                    gridArea: '1 / 1 / 2 / 2'
                }}>
                    <MDBox  sx={style} className={'bg-light-gray'}
                            width={{xs: "90%", lg: "50%"}}
                            display="flex"
                            flexDirection={{xs: "column", lg: "row"}}
                            justifyContent="space-between"
                            alignItems="center"
                            px={1.5}>
                        <Grid spacing={1} container>
                            <Grid item lg={12} xs={12} className={'position-absolute w-100 top-0 left-0 p-3'}
                                  sx={{left: 0}}>
                                <MDBox display={'flex'} flexDirection="row" justifyContent={'space-between'} marginLeft='0.7em'>
                                    <MDBox display={'flex'} flexDirection={'row'} alignItems={'center'} width={'100%'}>
                                        <MDBox display={'flex'} alignItems={'center'}>
                                            <div className={'h6 mb-0 text-black editor-text-bold'}>
                                                <Typography variant={'h6'}>
                                                    To help us provide personalized nudges, we require the following:
                                                </Typography>
                                            </div>
                                        </MDBox>

                                    </MDBox>
                                    <IconButton sx={{
                                        alignItems: 'flex-start'
                                    }} color={'dark'} aria-label="close" onClick={() => {
                                        props.setOpen(false)
                                    }}>
                                        <Close/>
                                    </IconButton>
                                </MDBox>

                            </Grid>
                            <Grid item lg={12} xs={12}
                                  sx={{
                                      marginTop: '32px',
                                      paddingRight: '10px',
                                      maxHeight: 'calc(100vh - 120px)',
                                      overflow: 'auto',
                                  }}>
                                <MDBox  sx={{
                                    xs: {
                                        maxHeight: 'calc(50vh - 120px)',
                                        overflow: 'auto',
                                    },
                                    md: {
                                        maxHeight: 'calc(50vh - 120px)',
                                        overflow: 'auto',
                                    }
                                }}>
                                    <MDBox>
                                        <MDBox>
                                            <MDBox display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
                                                <Button
                                                    onClick={() => setShowToolbar((prev) => !prev)}>
                                                    { showToolbar ?
                                                        'Hide Toolbar' : 'Show Toolbar'
                                                    }
                                                </Button>
                                            </MDBox>
                                            <MDBox sx={{padding: '0 1.4em'}}>
                                                <Editor placeholderText={'Tell us a bit about your career profile and experience...'}
                                                        enable={showToolbar} editorState={val}
                                                        onChange={setValIntermediate}/>
                                            </MDBox>


                                        </MDBox>
                                    </MDBox>

                                    <MDBox display={'flex'} className={'mb-3'} alignItems={'center'} justifyContent={'space-between'}>
                                        <MDInput label={"Job Role"} sx={{marginRight: '0.4em'}} onChange={(e) => setJobRole(e.target.value)}
                                                 defaultValue={user?.jobRole || ''} fullWidth/>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Work Level</InputLabel>
                                            <Select sx={{padding: '12px'}}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                label="Work Level"
                                                    defaultValue={user?.workLevel || ''}
                                                onChange={(e) => setWorkLevel(e.target.value)} fullWidth
                                            >
                                                {workLevels.map(wl => <MenuItem key={wl} sx={{padding: '8px', marginBottom: '0.4em'}} value={wl}>{wl}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </MDBox>

                                    <MDBox display={'flex'} alignItems={'center'}>
                                        <FormControl sx={{marginRight: '0.4em'}} fullWidth>
                                            <InputLabel id="company-industry">Company Industry</InputLabel>
                                            <Select sx={{padding: '12px'}}
                                                    labelId="company-industry"
                                                    id="company-industry-select"
                                                    label="Company Industry"
                                                    defaultValue={user?.companyIndustry || ''}
                                                    onChange={(e) => setCompanyIndustry(e.target.value)} fullWidth
                                            >
                                                {companyIndustries.map(ci => <MenuItem key={ci} sx={{padding: '8px', marginBottom: '0.4em'}} value={ci}>{ci}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth>
                                            <InputLabel id="company-size">Company Size</InputLabel>
                                            <Select sx={{padding: '12px'}}
                                                    labelId="company-size"
                                                    id="company-size-select"
                                                    label="Company Size"
                                                    defaultValue={user?.companySize || ''}
                                                    onChange={(e) => setCompanySize(e.target.value)} fullWidth
                                            >
                                                {companySizes.map(cs => <MenuItem key={cs} sx={{padding: '8px', marginBottom: '0.4em'}} value={cs}>{cs}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </MDBox>

                                    <Box className={'mt-3 mb-3'} display={'flex'} justifyContent={'flex-end'} alignContent={'space-between'}>
                                        <Button color={'secondary'} size={'small'} style={{padding: '8px'}} variant={'contained'}
                                                onClick={() => {
                                                    localStorage.removeItem(ONBOARD_DISPLAY)
                                                    props.setOpen(false)
                                                }}>Complete Later</Button>
                                        <Button sx={{marginLeft: '0.4em'}} size={'small'} variant={'contained'}
                                                onClick={() => {
                                                    updateProfile()
                                                }}>
                                            {loading &&
                                                <i className="mdi mdi-loading icon-spinner mdi-24px me-2"></i>
                                            }
                                            Save
                                        </Button>
                                    </Box>
                                </MDBox>
                            </Grid>
                        </Grid>
                    </MDBox>
                </MDBox>
            </MDBox>

        </Modal>
    )
}

export default Onboarding
