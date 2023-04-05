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

// react-routers components
import {Link} from "react-router-dom";

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "../../../MDBox";
import MDTypography from "../../../MDTypography";

// Material Dashboard 2 React base styles
import colors from "../../../../../theme/base/colors";
import typography from "../../../../../theme/base/typography";
import React, {useEffect, useState} from "react";
import MDInputWithLoader from "../../../MDInputWithLoader";
import {Box, Button, CircularProgress, FormControl, IconButton, InputLabel, Select} from "@mui/material";
import {Cancel, Save} from "@mui/icons-material";
import {AuthAtoms} from "../../../../../store";
import {useAtom} from "jotai";
import {companyIndustries, companySizes, workLevels} from "../../../../../config/data";
import MenuItem from "@mui/material/MenuItem";
import {$generateHtmlFromNodes} from "@lexical/html";
import {createEditor} from "lexical";
import {EditorDefaultConfig} from "../../../../../config/constants";
import * as DOMPurify from "dompurify";
import Editor from "../../../Editor";
import {Alert} from "reactstrap";

const ProfileInfoCard = ({title, social, action, shadow}) => {
    const editor = createEditor(EditorDefaultConfig)
    const [user, updateUser] = useAtom(AuthAtoms.updateUser)
    const [displayEditor, setDisplayEditor] = useState(false)
    const [showToolbar, setShowToolbar] = useState(false)
    const [val, setVal] = useState(user.bio || undefined)
    const [valIntermediate, setValIntermediate] = useState(user.bio || undefined)
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const {socialMediaColors} = colors;
    const {size} = typography;
    const notEditable = {email: true}

    const [info, setInfo] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        jobRole: user.jobRole,
        workLevel: user.workLevel,
        companyIndustry: user.companyIndustry,
        companySize: user.companySize
    })

    const toHtml = (raw) => {
        try {
            const descriptionState = editor.parseEditorState(raw)
            return descriptionState.read((data, me) => {
                return $generateHtmlFromNodes(editor, null)
            })
        } catch (e) {
            return raw
        }
    }

    // Convert this form `objectKey` of the object key in to this `object key`
    const loadLabels = () => {
        let labs = []

        Object.keys(info).forEach((el) => {
            if (el.match(/[A-Z\s]+/)) {
                const uppercaseLetter = Array.from(el).find((i) => i.match(/[A-Z]+/));
                const newElement = el.replace(uppercaseLetter, ` ${uppercaseLetter.toLowerCase()}`);
                labs.push({objKey: el, label: newElement, editable: !notEditable[el]});
            } else {
                labs.push({objKey: el, label: el, editable: !notEditable[el]});
            }
        });

        return labs
    }

    // Push the object values into the values array

    const [values, setValues] = useState(Object.values(info))
    const [labels, setLabels] = useState(loadLabels())

    useEffect(() => {
        setValues(Object.values(info))
    }, [])

    const [editStatus, setEditStatus] = useState({})

    const showOrHide = (key, a, b) => {
        if (editStatus[key])
            return a
        return b
    }

    const saveEdited = (currentEditState) => {
        const data = {}
        for (const key in currentEditState) {
            data[currentEditState[key].objKey] = currentEditState[key].value
        }

        updateUser({data, id: user.id}).then((response) => {
            setEditStatus((prev) => {
                const newState = {...prev}
                for (const key in currentEditState) {
                    newState[key] = {
                        ...currentEditState[key],
                        all: false,
                        show: false,
                        loading: false,
                        value: currentEditState[key].value
                    }
                    setValues((prevState => {
                        let newState = [...prevState]
                        newState[currentEditState[key].index] = currentEditState[key].value
                        return newState
                    }))
                }

                return newState
            })

            if(data.bio) {
                setVal(valIntermediate)
                setLoading(false)
                setDisplayEditor(false)
            }

        }).catch(error => {
            console.error(error)
        })
    }

    const getElement = (key, objKey, label, editable) => {
      switch (objKey) {
          case "workLevel":
              return <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Work Level</InputLabel>
                  <Select sx={{padding: '12px'}}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Work Level"
                          defaultValue={values[key] || ''}
                          onChange={(e) => setEditStatus(prevState => {
                              return {...prevState, [key]: {...prevState[key], value: e.target.value}}
                          })} fullWidth>
                      {workLevels.map(wl => <MenuItem sx={{padding: '8px', marginBottom: '0.4em'}} value={wl} key={wl}>{wl}</MenuItem>)}
                  </Select>
              </FormControl>
          case "companyIndustry":
              return <FormControl sx={{marginRight: '0.4em'}} fullWidth>
                  <InputLabel id="company-industry">Company Industry</InputLabel>
                  <Select sx={{padding: '12px'}}
                          labelId="company-industry"
                          id="company-industry-select"
                          label="Company Industry"
                          defaultValue={values[key] || ''}
                          onChange={(e) => setEditStatus(prevState => {
                              return {...prevState, [key]: {...prevState[key], value: e.target.value}}
                          })} fullWidth
                  >
                      {companyIndustries.map(ci => <MenuItem sx={{padding: '8px', marginBottom: '0.4em'}} value={ci} key={ci}>{ci}</MenuItem>)}
                  </Select>
              </FormControl>
          case "companySize":
              return <FormControl fullWidth>
                  <InputLabel id="company-size">Company Size</InputLabel>
                  <Select sx={{padding: '12px'}}
                          labelId="company-size"
                          id="company-size-select"
                          label="Company Size"
                          defaultValue={values[key] || ''}
                          onChange={(e) => setEditStatus(prevState => {
                              return {...prevState, [key]: {...prevState[key], value: e.target.value}}
                          })} fullWidth
                  >
                      {companySizes.map(cs => <MenuItem sx={{padding: '8px', marginBottom: '0.4em'}} value={cs} key={cs}>{cs}</MenuItem>)}
                  </Select>
              </FormControl>
          default:
              return <MDInputWithLoader show={editStatus[key].loading} defaultValue={values[key] || ''} disabled={!editable}
                                        key={label} label={label} onChange={(e) => setEditStatus(prevState => {
                  return {...prevState, [key]: {...prevState[key], value: e.target.value}}
              })} fullWidth/>
      }
    }

    // Render the card info items
    const renderItems = labels.map(({label, objKey, editable}, key) => (
        <MDBox key={label} display="flex" py={1} pr={2}>
            {(editStatus[key]?.show && editable) ?
                (<>
                    {getElement(key, objKey, label, editable)}
                    {!editStatus[key]?.loading && !editStatus[key]?.all &&
                        <MDBox>
                            <IconButton variant={'contained'} size={'small'}
                                        onClick={() => {
                                            saveEdited({[key]: {...editStatus[key], index: key}})
                                        }}>
                                <Save/>
                            </IconButton>
                            <IconButton variant={'contained'} size={'small'}
                                        onClick={() => {
                                            setEditStatus(prevState => {
                                                return {...prevState, [key]: {show: false, objKey, loading: false}}
                                            })
                                        }}>
                                <Cancel/>
                            </IconButton>
                        </MDBox>
                    }
                </>)
                :
                <MDBox onClick={() => {
                    setEditStatus(prevState => {
                        return {[key]: {...prevState[key], show: true, objKey, loading: false}}
                    })
                }}>
                    <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                        {label}: &nbsp;
                    </MDTypography>
                    <MDTypography variant="button"
                                  fontWeight={!values[key] || values[key]?.trim().length === 0 ?
                                      'italic' : "regular"} color="text">
                        &nbsp;{!values[key] || values[key]?.trim().length === 0 ? 'click to edit' : values[key]}
                    </MDTypography>
                </MDBox>
            }
        </MDBox>
    ));

    // Render the card social media icons
    const renderSocial = social.map(({link, icon, color}) => (
        <MDBox
            key={color}
            component="a"
            href={link}
            target="_blank"
            rel="noreferrer"
            fontSize={size.lg}
            color={socialMediaColors[color].main}
            pr={1}
            pl={0.5}
            lineHeight={1}
        >
            {icon}
        </MDBox>
    ));

    return (
        <Card sx={{height: "100%", boxShadow: !shadow && "none", width: '100%'}}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
                <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                    {title}
                </MDTypography>
                {editStatus[0]?.all ?
                    <MDBox>
                        {editStatus[-1]?.loading ?
                            <CircularProgress size={20} style={{marginLeft: '0.4em'}}/> :
                            <>
                                <IconButton variant={'contained'} size={'small'}
                                            onClick={() => {
                                                setEditStatus((prevState) => {
                                                    return {
                                                        ...prevState, [-1]: {
                                                            loading: true
                                                        }
                                                    }
                                                })
                                                saveEdited(editStatus)
                                            }}>
                                    <Save/>
                                </IconButton>
                                <IconButton variant={'contained'} size={'small'}
                                            onClick={() => {
                                                setEditStatus({})
                                            }}>
                                    <Cancel/>
                                </IconButton>
                            </>
                        }
                    </MDBox> :
                    <MDTypography onClick={() => {
                        setEditStatus(prevState => {
                            const newState = {}
                            for (const label in labels) {
                                newState[label] = {
                                    ...prevState[label],
                                    objKey: labels[label].objKey,
                                    show: true,
                                    value: values[label],
                                    index: label,
                                    loading: false,
                                    all: true
                                }
                            }
                            return newState
                        })
                    }} variant="body2" color="secondary">
                        <Tooltip title={action.tooltip} placement="top">
                            <Icon>edit</Icon>
                        </Tooltip>
                    </MDTypography>
                }
            </MDBox>
            <MDBox p={2}>
                <MDBox mb={2} lineHeight={1}>
                    {displayEditor ?
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
                                {/*<MUIRichTextEditor label={'Typing...'} defaultValue={val}
                                                                       onChange={(st) => {
                                                                           setValIntermediate(JSON.stringify(convertToRaw(st.getCurrentContent())))
                                                                       }} toolbar={showToolbar}/>*/}
                                <Editor placeholderText={'Tell us a bit about your career profile and experience...'}
                                        enable={showToolbar} editorState={val}
                                        onChange={setValIntermediate}/>
                            </MDBox>


                        </MDBox> :
                        <MDBox onClick={() => setDisplayEditor(true)}>
                            <div color="text.secondary" className="h6"
                                 dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(toHtml(val))}}/>
                        </MDBox>}
                    {displayEditor &&
                        <MDBox display={'flex'} justifyContent={'flex-end'} alignItems={'space-between'}>
                            {errorMessage && <MDBox lg={12} className="mb-0">
                                <div className="d-grid">
                                    <Alert className="bg-soft-danger fw-medium">
                                        <i className="uil uil-exclamation-octagon fs-5 align-middle me-1"></i>
                                        {{errorMessage}}
                                    </Alert>
                                </div>
                            </MDBox>}
                            <Box sx={{ '& button': { m: 1 } }}>
                                <Button color={'secondary'} size={'small'} style={{padding: '4px'}} variant={'contained'}
                                        onClick={() => {
                                            setDisplayEditor(false)
                                            setVal(user.bio)
                                        }}>Cancel</Button>
                                <Button size={'small'} variant={'contained'}
                                        onClick={() => {
                                            setLoading(true)
                                            saveEdited({
                                                0: {bio: valIntermediate, value: valIntermediate,
                                                    objKey: 'bio', loading: true}
                                            })
                                        }}>
                                    {loading &&
                                        <i className="mdi mdi-loading icon-spinner mdi-24px me-2"></i>
                                    }
                                    Save
                                </Button>
                            </Box>
                        </MDBox>
                    }
                </MDBox>
                <MDBox opacity={0.3}>
                    <Divider/>
                </MDBox>
                <MDBox>
                    {renderItems}
                    {social && social.length > 0 &&
                        <MDBox display="flex" py={1} pr={2}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                social: &nbsp;
                            </MDTypography>
                            {renderSocial}
                        </MDBox>
                    }
                </MDBox>
            </MDBox>
        </Card>
    );
}

// Setting default props for the ProfileInfoCard
ProfileInfoCard.defaultProps = {
    shadow: true,
};

// Typechecking props for the ProfileInfoCard
ProfileInfoCard.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    info: PropTypes.objectOf(PropTypes.string),
    social: PropTypes.arrayOf(PropTypes.object),
    action: PropTypes.shape({
        route: PropTypes.string.isRequired,
        tooltip: PropTypes.string.isRequired,
    }),
    shadow: PropTypes.bool,
};

export default ProfileInfoCard;
