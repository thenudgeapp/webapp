import React, {useEffect, useRef, useState} from "react";
import {Box, Button, Checkbox, CircularProgress, Grid, IconButton, ListItem, Modal, Typography} from "@mui/material";
import MDBox from "../Shared/MDBox";
import {Close, DeleteOutline, KeyboardArrowDown, Notes, TaskOutlined} from "@mui/icons-material";
import dayjs from "dayjs";
import {HttpStatusCode} from "axios";
import {useAtom} from "jotai";
import {TaskAtom} from "../../store";
import {Alert} from "reactstrap";
import List from "@mui/material/List";
import AddSubTask from "./AddSubTask";
import {DateRangePicker} from "mui-daterange-picker";
import Editor from "../Shared/Editor";
import {$getRoot, createEditor} from "lexical";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const TaskDetail = ({...props}) => {
    const editor = createEditor({})
    const editorStateRef = useRef();
    const [displayEditor, setDisplayEditor] = useState(false)
    const [val, setVal] = useState(props.task.description)
    const [startDate, setStartDate] = useState(props.task.startDate || new Date());
    const [endDate, setEndDate] = useState(props.task.endDate || new Date());
    const [open, setOpen] = useState(false)
    const [dateRange, setDateRange] = useState({})
    const [valIntermediate, setValIntermediate] = useState(props.task.description)
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [_, updateTask] = useAtom(TaskAtom.updateTask);
    const [bt, getBacklogTasks] = useAtom(TaskAtom.getBacklogTasks)
    const [tt, getTodoTasks] = useAtom(TaskAtom.getTodoTasks)
    const [ipt, getInProgressTasks] = useAtom(TaskAtom.getInProgressTasks)
    const [dt, getDoneTasks] = useAtom(TaskAtom.getDoneTasks)
    const [subTasks, getSubTasks] = useAtom(TaskAtom.getSubTasks)
    const [, deleteTask] = useAtom(TaskAtom.deleteTask)
    const [showAddSubTask, setShowAddSubTask] = useState(false)
    const [selectedSubTask, setSelectedSubTask] = useState({})
    const [checkedStates, setCheckedStates] = useState({})
    const [showToolbar, setShowToolbar] = useState(false)
    const [deletingStates, setDeletingStates] = useState({})
    const [taskToDelete, setTaskToDelete] = useState()

    const toggle = () => setOpen((prevState => !prevState))



    useEffect(() => {
        getSubTasks({parentId: props.task.id})
    }, [])

    useEffect(() => {
        const states = {}
        subTasks.results.map(task => states[task.id] = task.status)
        setCheckedStates(states)
    }, [subTasks])

    useEffect(() => {
        if(dateRange && dateRange.startDate) {
            setStartDate(dateRange.startDate.getTime() / 1000)
            setEndDate(dateRange.endDate.getTime() / 1000)

            saveTask();
        }
    }, [dateRange])

    const toPlainText = (raw) => {
        try {
            const descriptionState = editor.parseEditorState(raw)
            return descriptionState.read((data, me) => {
                return $getRoot().getTextContent()
            })
        } catch (e) {
            return raw
        }
    }

    const renderSubTasks = () => subTasks.results.map((task, index) => (
        <ListItem key={task.id} alignItems="center">
            <MDBox display={'flex'} justifyContent={'space-between'} alignItems="center" width={'100%'}>
                <MDBox justifyContent={'flex-start'} display={'flex'} alignItems="center" width={'80%'}>
                    <Checkbox size={'small'} checked={checkedStates[task.id] === 'DONE'} onClick={(event => {
                        const status = !checkedStates[task.id] || checkedStates[task.id] === 'TODO' ? 'DONE' : 'TODO'
                        saveTask(true, task.id, status)
                        setCheckedStates((prev) => {
                            return {...prev, [task.id]: status}
                        })
                    })}
                    />
                    <Typography display={{
                        xs: 'none',
                        lg: 'block'
                    }} variant={'body2'} color="text.secondary" marginLeft={'.4em'}
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    'WebkitLineClamp': '1',
                                    'WebkitBoxOrient': 'vertical'
                                }} onClick={() => {
                        setSelectedSubTask(task)
                        setShowAddSubTask(true)
                    }}>
                        {task.description}
                    </Typography>
                </MDBox>
                <MDBox justifyContent={'flex-end'}>
                    <MDBox justifyContent={'space-evenly'} width={'100%'} display={'flex'} alignItems="center">
                        <Typography display={{
                            xs: 'none',
                            lg: 'block'
                        }} variant={'body2'} color="text.secondary" marginLeft={'.4em'}>
                            {`${dayjs.unix(task.endDate).format('DD/MM/YYYY')}`}
                        </Typography>
                        <Button onClick={() => {
                            setTaskToDelete(task)
                        }}>
                            {deletingStates[task.id] ?
                                <CircularProgress size={20} /> :
                                !taskToDelete && <DeleteOutline/>
                            }
                        </Button>
                    </MDBox>
                </MDBox>
            </MDBox>
            {taskToDelete && task.id === taskToDelete?.id && showDeleteConfirm()}
        </ListItem>
        )
    )

    const deleteTaskHandler = (id) => {
        setTaskToDelete(null)
        setDeletingStates((prevState => {
            return {...prevState, [id]: true}
        }))
      deleteTask({id}).then(async (res) => {
          await getSubTasks({parentId: props.task.id})
          setDeletingStates(prevState => {
              const newState = {...prevState}
              delete newState[id]
              return newState
          })

      })
    }

    const showDeleteConfirm = () =>
      <MDBox display={'flex'} alignItems={'center'} fullWidth>
          <Typography variant={'caption'}>
              Delete?
          </Typography>
          <Button variant={'contained'} size={'small'} onClick={() => setTaskToDelete(null)}
                  color={'secondary'} style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px', marginLeft: '4px'}}>No</Button>
          <Button variant={'contained'} size={'small'} style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px', marginLeft: '4px'}}
                  onClick={() => deleteTaskHandler(taskToDelete?.id)}>Yes</Button>
      </MDBox>

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

    const saveTask = (isSubTask = false, id = '', status = 'TODO') => {
        if (!isSubTask) {
            setLoading(true)
            setErrorMessage(null)
            setVal(valIntermediate)
        }
        updateTask(isSubTask ? {
            data: {
                status
            },
            id
        } : {
            data: {
                description: valIntermediate,
                startDate,
                endDate,
            },
            id: props.task.id
        }).then(async (response, error) => {
            if (isSubTask) {
                await getSubTasks({parentId: props.task.id})
                return
            }
            if (response.status !== HttpStatusCode.Ok) {
                setErrorMessage(response.response.data.message)
                setLoading(false)
                return
            }

            props.task.description = val
            await reloadTasks(props.task.status)
            setLoading(false)
            setDisplayEditor(false)
        }).catch(error => {
            setLoading(false)
            setErrorMessage(error.response.data.message)
        })
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
                    <MDBox  sx={style} className={'bg-light'}
                            width={{xs: "90%", lg: "50%"}}
                            display="flex"
                            flexDirection={{xs: "column", lg: "row"}}
                            justifyContent="space-between"
                            alignItems="center"
                            px={1.5}>
                        <Grid spacing={1} container>
                            <Grid item lg={12} xs={12} className={'bg-primary position-absolute w-100 top-0 left-0 p-3'}
                                  sx={{left: 0}}>
                                <MDBox display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                    <Typography id="modal-modal-title" className={'text-white'} variant="h6" component="h2">
                                        {props.task.title}
                                    </Typography>
                                    <IconButton color={'white'} aria-label="close" onClick={() => {
                                        props.setOpen(false)
                                    }}>
                                        <Close/>
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
                                    <MDBox display={'flex'} alignItems={'center'}>
                                        <Notes spacing={10}/>
                                        <Typography variant={'h6'} color="text.secondary" marginLeft={'8px'}>
                                            Description
                                        </Typography>
                                    </MDBox>
                                    <MDBox>
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
                                                    <Editor enable={showToolbar} editorState={val} onChange={setValIntermediate}/>
                                                </MDBox>


                                            </MDBox> :
                                            <Typography variant={'body2'} color="text.secondary" marginLeft={'1.7em'}
                                                        onClick={() => setDisplayEditor(true)}>
                                                {toPlainText(val)}
                                            </Typography>}
                                    </MDBox>
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
                                                        }}>Cancel</Button>
                                                <Button size={'small'} variant={'contained'}
                                                        onClick={() => {
                                                            saveTask()
                                                        }}>
                                                    {loading &&
                                                        <i className="mdi mdi-loading icon-spinner mdi-24px me-2"></i>
                                                    }
                                                    Save
                                                </Button>
                                            </Box>
                                        </MDBox>
                                    }
                                    <MDBox bgColor={'light'} marginLeft={'1.4em'} marginTop={'0.4em'} display={'inline-block'}>
                                        <Button variant={'secondary'} size={'small'} padding={'1em'} onClick={toggle}>
                                                {`${dayjs.unix(startDate).format('MMMM D')} - ${dayjs.unix(endDate).format('MMMM D, YYYY')}`}
                                            <KeyboardArrowDown/>
                                        </Button>
                                        <DateRangePicker minDate={startDate}
                                            definedRanges={[]}
                                            open={open}
                                            toggle={toggle}
                                            onChange={(range) => {
                                                setDateRange(range)
                                            }}
                                        />
                                    </MDBox>
                                    <MDBox display={'flex'} alignItems={'center'} marginTop={'1em'}>
                                        <TaskOutlined type={'outlined'} spacing={10}/>
                                        <Typography variant={'h6'} color="text.secondary" marginLeft={'8px'}>
                                            Sub Tasks
                                        </Typography>
                                    </MDBox>
                                    <MDBox marginLeft={'-.4em'}>
                                        <List>
                                            {renderSubTasks()}
                                        </List>

                                    </MDBox>
                                    <MDBox marginLeft={'1.5em'}>
                                        <Button size={'small'} variant={'contained'} color={'fadedButton'}
                                                disableElevation onClick={() => {
                                                    setSelectedSubTask({})
                                            setShowAddSubTask(true)
                                        }}>
                                            Add a task
                                        </Button>
                                        {showAddSubTask ? <AddSubTask key={selectedSubTask.id} open={showAddSubTask}
                                                                       setOpen={setShowAddSubTask}
                                                                       {...selectedSubTask} parent={props.task.id}
                                                                       autoFocus/> : <></>}
                                    </MDBox>
                                </MDBox>

                            </Grid>
                        </Grid>
                    </MDBox>
                </MDBox>
            </MDBox>

        </Modal>
    )
}

export default TaskDetail
