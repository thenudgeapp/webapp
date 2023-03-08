import {Box, Grid, IconButton, Modal, TextField, Typography} from "@mui/material";
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
import {Alert, Button, Col} from "reactstrap";
import {HttpStatusCode} from "axios";

const style = {
    position: 'absolute',
    top: '30%',
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
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [bt, getBacklogTasks] = useAtom(TaskAtom.getBacklogTasks)
    const [tt, getTodoTasks] = useAtom(TaskAtom.getTodoTasks)
    const [ipt, getInProgressTasks] = useAtom(TaskAtom.getInProgressTasks)
    const [dt, getDoneTasks] = useAtom(TaskAtom.getDoneTasks)

    const addTaskHandler = () => {
        let message = ''
        if (!title || title.trim().length === 0) {
            message += '\n・Task title is required'
        }
        if (!description) {
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
              description,
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
          <MDBox sx={style}
                 width={{xs: "90%", lg: "30%"}}
                 display="flex"
                 flexDirection={{ xs: "column", lg: "row" }}
                 justifyContent="space-between"
                 alignItems="center"
                 px={1.5}>
              <Grid spacing={1} container>
                  <Grid item lg={12} xs={12} className={'bg-primary position-absolute w-100 top-0 left-0 p-4'} sx={{left: 0}}>
                      <MDBox display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                          <Typography id="modal-modal-title" className={'text-white'} variant="h6" component="h2">
                              Add Task
                          </Typography>
                          <IconButton color={'white'} aria-label="close" onClick={() => props.setOpen(false)}>
                              <Close />
                          </IconButton>
                      </MDBox>

                  </Grid>
                  <Grid item lg={12} xs={12} sx={{marginTop: '64px'}}>
                      <MDBox component="form" role="form">
                          <MDBox mb={4}>
                              <MDInput type="text" label="Name" variant="standard"
                                       fullWidth value={title}
                                       onChange={(newValue) => setTitle(newValue.target.value)} />
                          </MDBox>
                          <MDBox mb={4}>
                              <TextField
                                  id="standard-textarea"
                                  label="Description"
                                  placeholder="Details about this task"
                                  multiline
                                  fullWidth
                                  variant="standard"
                                  value={description}
                                  onChange={(newValue) => setDescription(newValue.target.value)}
                              />
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
                          <MDBox mt={6} mb={1} display={{xs: 'flex'}} justifyContent={'space-around'} md={12}>
                              <MDButton variant="gradient" color="primary"  md={12} onClick={addTaskHandler}>
                                  {loading &&
                                      <i className="mdi mdi-loading icon-spinner mdi-24px me-2"></i>
                                  }
                                  Submit
                              </MDButton>
                              <MDButton variant="gradient" color="secondary" onClick={() => props.setOpen(false)}>
                                  Cancel
                              </MDButton>
                          </MDBox>
                      </MDBox>
                  </Grid>
              </Grid>
          </MDBox>
      </Modal>
  )
}

export default AddTask
