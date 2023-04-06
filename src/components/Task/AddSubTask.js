import MDBox from "../Shared/MDBox";
import {Box, Button, Input, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Alert} from "reactstrap";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {HttpStatusCode} from "axios";
import {useAtom} from "jotai";
import {TaskAtom} from "../../store";

const AddSubTask = ({...props}) => {
    const inputRef = React.useRef();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [title, setTitle] = useState(props.title || '');
    const [description, setDescription] = useState(props.description || '');
    const [startDate, setStartDate] = useState(props.startDate ? dayjs.unix(props.startDate) : new Date());
    const [endDate, setEndDate] = useState(props.endDate ? dayjs.unix(props.endDate ) : new Date());
    const [status, setStatus] = useState(props.status);
    const [, getBacklogTasks] = useAtom(TaskAtom.getBacklogTasks)
    const [, getTodoTasks] = useAtom(TaskAtom.getTodoTasks)
    const [, getInProgressTasks] = useAtom(TaskAtom.getInProgressTasks)
    const [, getDoneTasks] = useAtom(TaskAtom.getDoneTasks)
    const [tasks, addTask] = useAtom(TaskAtom.addTask)
    const [, setSubTasks] = useAtom(TaskAtom.subTasks)
    const [subTasks, getSubTasks] = useAtom(TaskAtom.getSubTasks)
    const [_, updateTask] = useAtom(TaskAtom.updateTask);

    useEffect(() => {
        if (props.open) {
            inputRef.current.focus()
        }
    }, [props.open])

    const reloadSubTasks = async (newSubTask) => {
        if (props.parentStatus === 'TODO')
            await getTodoTasks({})
        if (props.parentStatus === 'IN PROGRESS')
            await getInProgressTasks({})
        if (props.parentStatus === 'DONE')
            await getDoneTasks({})

    }

    const updateSubTask = () => {
        setLoading(true)
        setErrorMessage(null)
        updateTask({
            data: {
                description,
                startDate: startDate.unix(),
                endDate: endDate.unix(),
                status
            },
            id: props.id
        }).then(async (response, error) => {
            if (response.status !== HttpStatusCode.Ok) {
                setErrorMessage(response.response.data.message)
                setLoading(false)
                return
            }
            await reloadSubTasks(props.task)
            setLoading(false)
            props.setOpen(false)
        }).catch(error => {
            setLoading(false)
            setErrorMessage(error.response.data.message)
        })
    }

    const saveSubTask = () => {
        let message = ''
        if (!description) {
            message += '\n・Task description is required'
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

        setTitle(description)

        setLoading(true)
        setErrorMessage(null)
        addTask({
            data: {
                parentId: props.parent,
                title: description,
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

            await reloadSubTasks(response.data)
            setLoading(false)
            props.setOpen(false)
        }).catch(error => {
            console.error(error)
            setLoading(false)
            setErrorMessage(error.response.data.message)
        })
    }


    return (
        <MDBox marginTop={'1em'}>
            {errorMessage && <MDBox lg={12} className="mb-0">
                <div className="d-grid">
                    <Alert className="bg-soft-danger fw-medium">
                        <i className="uil uil-exclamation-octagon fs-5 align-middle me-1"></i>
                        {errorMessage}
                    </Alert>
                </div>
            </MDBox>}
            <TextField
                inputRef={inputRef}
                id="outlined-multiline-static"
                label="Add a sub task"
                multiline
                rows={4}
                defaultValue={description}
                size={'large'}
                name={'subtask'}
                placeholder={'Add a sub task'}
                onChange={(event => setDescription(event.target.value))}
                fullWidth
            />
            <MDBox mb={4} mt={4} display={{md: 'flex', lg: 'flex', sm: 'block'}} justifyContent={'space-evenly'}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => {
                            setStartDate(newValue);
                        }}
                        renderInput={(params) => <TextField fullWidth {...params} sx={{marginBottom: "20px", paddingRight: {lg: "10px"}}} />}
                    />
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        minDate={startDate}
                        onChange={(newValue) => {
                            setEndDate(newValue);
                        }}
                        renderInput={(params) => <TextField fullWidth {...params} />}
                    />
                </LocalizationProvider>
            </MDBox>
            <Box sx={{ '& button': { m: 1 } }} display={'flex'} justifyContent={'flex-end'}>
                <Button color={'secondary'} size={'small'} style={{padding: '4px'}} variant={'contained'}
                        onClick={() => {
                            props.setOpen(false)
                        }}>Cancel</Button>
                {
                    props.id ? <Button size={'small'} variant={'contained'}
                                       onClick={() => {
                                           updateSubTask()
                                       }}>
                        {loading &&
                            <i className="mdi mdi-loading icon-spinner mdi-24px me-2"></i>
                        }
                        Update
                    </Button> : <Button size={'small'} variant={'contained'}
                                        onClick={() => {
                                            saveSubTask()
                                        }}>
                        {loading &&
                            <i className="mdi mdi-loading icon-spinner mdi-24px me-2"></i>
                        }
                        Save
                    </Button>
                }
            </Box>
        </MDBox>
    )
}

export default AddSubTask
