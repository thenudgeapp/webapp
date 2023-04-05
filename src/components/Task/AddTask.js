import {Box, Button, Grid, IconButton, Modal, TextField, Typography} from "@mui/material";
import MDBox from "../Shared/MDBox";
import MDInput from "../Shared/MDInput";
import MDButton from "../Shared/MDButton";
import {useState} from "react";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {Close, MoreVert} from "@mui/icons-material";
import {useAtom} from "jotai";
import {TaskAtom} from "../../store";
import dayjs from "dayjs";
import React from "react";
import {Alert, Col} from "reactstrap";
import {HttpStatusCode} from "axios";
import Editor from "../Shared/Editor";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const AddTask = ({...props}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [tasks, addTask] = useAtom(TaskAtom.addTask)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState()
    const [bt, getBacklogTasks] = useAtom(TaskAtom.getBacklogTasks)
    const [tt, getTodoTasks] = useAtom(TaskAtom.getTodoTasks)
    const [ipt, getInProgressTasks] = useAtom(TaskAtom.getInProgressTasks)
    const [dt, getDoneTasks] = useAtom(TaskAtom.getDoneTasks)
    const [showToolbar, setShowToolbar] = useState(false)
    const [valIntermediate, setValIntermediate] = useState()
    const [showGoalToolbar, setShowGoalToolbar] = useState(false)
    const [goalValIntermediate, setGoalValIntermediate] = useState()

    const addTaskHandler = () => {
        setDescription(valIntermediate)
        let message = ''
        if (!title || title.trim().length === 0) {
            message += '\n・Task title is required'
        }
        if (!valIntermediate) {
            message += '<br/>・Task description is required'
        }
        if (!startDate) {
            message += '<br/>・Task start date is required'
        }
        if (!endDate) {
            message += '<br/>・Task end date is required'
        }

        if (startDate - endDate > 0) {
            message += '<br/>・Task start date must be before the end date'
        }

        if (message && message.trim().length > 0) {
            setErrorMessage(message)
            return
        }

        setLoading(true)
        setErrorMessage(null)
      addTask({
          data: {
              title,
              description: valIntermediate,
              goal: goalValIntermediate,
              startDate: dayjs(startDate).unix(),
              endDate: dayjs(endDate).unix(),
              status: props.status
          }
      }).then(async (response, error) => {
          if (response.status !== HttpStatusCode.Created) {
              setErrorMessage(response.response.data.message)
              setLoading(false)
              return
          }

          await reloadTasks(props.status)
          setLoading(false)
          props.setOpen(false)
      }).catch(error => {
          console.error(error)
          setLoading(false)
          setErrorMessage(error.response.data.message)
      })
    }

    const reloadTasks = async (status) => {
        switch (status) {
            case 'BACKLOG':
                await getBacklogTasks({});
                break
            case 'TODO':
                await getTodoTasks({})
                break
            case 'IN PROGRESS':
                await getInProgressTasks({})
                break
            case 'DONE':
                await getDoneTasks({})
                break
        }
    }

    return (
      <Modal open={props.open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
          <MDBox sx={{
              display: 'grid',
          }}>
              <MDBox sx={{
                  gridArea: '1 / 1 / 2 / 2'
              }}>
              <MDBox className={'bg-light'} sx={style}
                     width={{xs: "90%", lg: "50%"}}
                     display="flex"
                     flexDirection={{ xs: "column", lg: "row" }}
                     justifyContent="space-between"
                     alignItems="center"
                     px={1.5}>
                  <Grid spacing={1} container>
                      <Grid item lg={12} xs={12} className={'bg-primary position-absolute w-100 top-0 left-0 p-3'} sx={{left: 0}}>
                          <MDBox display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                              <Typography id="modal-modal-title" className={'text-white'} variant="h5" component="h2">
                                  Add Task
                              </Typography>
                              <IconButton color={'white'} aria-label="close" onClick={() => props.setOpen(false)}>
                                  <Close />
                              </IconButton>
                          </MDBox>

                      </Grid>
                      <Grid item lg={12} xs={12}
                            sx={{
                                marginTop: '64px',
                                paddingRight: '10px',
                                maxHeight: 'calc(100vh - 120px)',
                                overflow: 'auto',
                            }}>
                          <MDBox sx={{
                              xs: {
                                  maxHeight: 'calc(50vh - 120px)',
                                  overflow: 'auto',
                              },
                              md: {
                                  maxHeight: 'calc(50vh - 120px)',
                                  overflow: 'auto',
                              }
                          }}>
                              <MDBox mb={4}>
                                  <MDInput type="text" label="Title" variant="standard"
                                           fullWidth value={title}
                                           onChange={(newValue) => setTitle(newValue.target.value)} />
                              </MDBox>
                              <MDBox mb={4}>
                                  <MDBox display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
                                      <Button size={'small'}
                                              onClick={() => setShowToolbar((prev) => !prev)}>
                                          { showToolbar ?
                                              'Hide Toolbar' : 'Show Toolbar'
                                          }
                                      </Button>
                                  </MDBox>
                                  <Typography variant={'body2'}>
                                      Description
                                  </Typography>
                                  <Editor placeholderText={'Details about this task'} enable={showToolbar} onChange={setValIntermediate}/>
                              </MDBox>
                              <MDBox mb={4}>
                                  <MDBox display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
                                      <Button size={'small'}
                                              onClick={() => setShowGoalToolbar((prev) => !prev)}>
                                          { showGoalToolbar ?
                                              'Hide Toolbar' : 'Show Toolbar'
                                          }
                                      </Button>
                                  </MDBox>
                                  <Typography variant={'body2'}>
                                      Goal
                                  </Typography>
                                  <Editor placeholderText={'Tell us more about the goal you want to achieve'}
                                          enable={showGoalToolbar} onChange={setGoalValIntermediate}/>
                              </MDBox>
                              <MDBox mb={4} display={{md: 'flex', lg: 'flex', sm: 'block'}} justifyContent={'space-evenly'}>
                                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                                      <DatePicker
                                          label="Start Date"
                                          value={startDate}
                                          onChange={(newValue) => {
                                              setStartDate(newValue);
                                          }}
                                          renderInput={(params) => <TextField {...params} sx={{marginBottom: "20px", paddingRight: "10px"}} />}
                                      />
                                      <DatePicker
                                          label="End Date"
                                          value={endDate}
                                          minDate={startDate}
                                          onChange={(newValue) => {
                                              setEndDate(newValue);
                                          }}
                                          renderInput={(params) => <TextField {...params} />}
                                      />
                                  </LocalizationProvider>
                              </MDBox>
                              {errorMessage && <MDBox lg={12} className="mb-0">
                                  <div className="d-grid">
                                      <Alert className="bg-soft-danger fw-medium">
                                          <i className="uil uil-exclamation-octagon fs-5 align-middle me-1"></i> Error
                                          <div dangerouslySetInnerHTML={{__html: errorMessage}}/>
                                      </Alert>
                                  </div>
                              </MDBox>}
                              <MDBox display={'flex'} justifyContent={'flex-end'}>
                                  <MDBox mt={6} mb={1} display={{xs: 'flex'}} justifyContent={'space-between'} md={12}>
                                      <Button variant={'contained'} color={'secondary'} onClick={() => props.setOpen(false)}>
                                          Cancel
                                      </Button>
                                      <Button variant="contained" style={{marginLeft: '0.4em'}} md={12} onClick={addTaskHandler}>
                                          {loading &&
                                              <i className="mdi mdi-loading icon-spinner mdi-24px me-2"></i>
                                          }
                                          Submit
                                      </Button>
                                  </MDBox>
                              </MDBox>
                              <Typography variant={'caption'}>
                                  * Note: newly added tasks will be displayed last in its status column
                              </Typography>
                          </MDBox>
                      </Grid>
                  </Grid>
              </MDBox>
              </MDBox>
          </MDBox>
      </Modal>
  )
}

export default AddTask
