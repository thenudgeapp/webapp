import React, {useEffect, useRef, useState} from "react";
import {Box, Button, Checkbox, CircularProgress, Grid, IconButton, ListItem, Modal, Typography} from "@mui/material";
import MDBox from "../Shared/MDBox";
import {
    Cancel, CenterFocusWeak,
    Close, DateRange,
    DeleteOutline,
    EditOutlined,
    KeyboardArrowDown,
    Notes,
    Save,
    TaskOutlined
} from "@mui/icons-material";
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
import {$generateHtmlFromNodes} from "@lexical/html";
import * as DOMPurify from 'dompurify';
import {EditorDefaultConfig} from "../../config/constants";
import MDInput from "../Shared/MDInput";
import {UilFocusTarget} from "@iconscout/react-unicons";
import {subTasks} from "../../store/task";

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

const TaskDetail = ({...props}) => {
    const editor = createEditor(EditorDefaultConfig)
    const editorStateRef = useRef();
    const [displayEditor, setDisplayEditor] = useState(false)
    const [displayGoalEditor, setDisplayGoalEditor] = useState(false)
    const [val, setVal] = useState(props.task.description)
    const [goalVal, setGoalVal] = useState(props.task.goal)
    const [title, setTitle] = useState(props.task.title)
    const [titleInter, setTitleInter] = useState(props.task.title)
    const [editTitle, setEditTitle] = useState(false)
    const [startDate, setStartDate] = useState(props.task.startDate);
    const [endDate, setEndDate] = useState(props.task.endDate);
    const [open, setOpen] = useState(false)
    const [dateRange, setDateRange] = useState({})
    const [valIntermediate, setValIntermediate] = useState(props.task.description)
    const [valGoalIntermediate, setGoalValIntermediate] = useState(props.task.goal)
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [_, updateTask] = useAtom(TaskAtom.updateTask);
    const [bt, getBacklogTasks] = useAtom(TaskAtom.getBacklogTasks)
    const [tt, getTodoTasks] = useAtom(TaskAtom.getTodoTasks)
    const [ipt, getInProgressTasks] = useAtom(TaskAtom.getInProgressTasks)
    const [dt, getDoneTasks] = useAtom(TaskAtom.getDoneTasks)
    const [, deleteTask] = useAtom(TaskAtom.deleteTask)
    const [showAddSubTask, setShowAddSubTask] = useState(false)
    const [selectedSubTask, setSelectedSubTask] = useState({})
    const [checkedStates, setCheckedStates] = useState({})
    const [showToolbar, setShowToolbar] = useState(false)
    const [showGoalToolbar, setShowGoalToolbar] = useState(false)
    const [deletingStates, setDeletingStates] = useState({})
    const [taskToDelete, setTaskToDelete] = useState()
    const [confirmDelete, setConfirmDelete] = useState(null)

    const toggle = () => setOpen((prevState => !prevState))

    useEffect(() => {
        const states = {}
        props.task.subTasks.map(task => states[task._id] = task.status)
        setCheckedStates(states)
    }, [])

    useEffect(() => {
        if (dateRange && dateRange.startDate) {
            setStartDate(dateRange.startDate.getTime() / 1000)
            setEndDate(dateRange.endDate.getTime() / 1000)

            setTimeout(() => {
                saveTask(false, false, false, false, true);
            }, 200)
        }
    }, [dateRange])

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

    const getTimeSpan = () => {
        return startDate && endDate ?
            `${dayjs.unix(startDate).format('MMMM D')} - ${dayjs.unix(endDate).format('MMMM D, YYYY')}`
            :
            startDate ?
                `${startDate && dayjs.unix(startDate).format('MMMM D, YYYY')}` :
                endDate ?
                    ` - ${dayjs.unix(endDate).format('MMMM D, YYYY')}`
                    : ''
    }

    const renderSubTasks = () => {
        return props.task.subTasks.map((task, index) => (
                <ListItem key={task._id} alignItems="center">
                    <MDBox display={'flex'} justifyContent={'space-between'} alignItems="center" width={'100%'}>
                        <MDBox justifyContent={'flex-start'} display={'flex'} alignItems="center" width={'80%'}>
                            <Checkbox size={'small'} checked={checkedStates[task._id] === 'DONE'} onClick={(event => {
                                const status = !checkedStates[task._id] || checkedStates[task._id] === 'TODO' ? 'DONE' : 'TODO'
                                saveTask(true, false, false, false, false, task._id, status)
                                setCheckedStates((prev) => {
                                    return {...prev, [task._id]: status}
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
                                <IconButton onClick={() => {
                                    setTaskToDelete(task)
                                }}>
                                    {deletingStates[task._id] ?
                                        <CircularProgress size={20}/> :
                                        !taskToDelete && <DeleteOutline fontSize={'small'}/>
                                    }
                                </IconButton>
                            </MDBox>
                        </MDBox>
                    </MDBox>
                    {taskToDelete && task._id === taskToDelete?._id && showDeleteConfirm()}
                </ListItem>
            )
        )
    }

    const confirmDeleteDialog = () => (
        <Modal
            open={confirmDelete}
            onClose={() => setConfirmDelete(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Delete the task "{props.task.title}" ?
                </Typography>
                <MDBox display={'flex'} justifyContent={'flex-end'}>
                    <MDBox mt={6} mb={1} display={{xs: 'flex'}} justifyContent={'space-between'} md={12}>
                        <Button variant={'contained'} color={'secondary'} onClick={() => setConfirmDelete(false)}>
                            No
                        </Button>
                        <Button variant="contained" style={{marginLeft: '0.4em'}} md={12}
                                onClick={() => deleteTaskHandler(props.task.id, true)}>
                            {loading &&
                                <i className="mdi mdi-loading icon-spinner mdi-24px me-2"></i>
                            }
                            Yes
                        </Button>
                    </MDBox>
                </MDBox>
            </Box>
        </Modal>
    )

    const deleteTaskHandler = (id, isMain = false) => {
        if (!isMain) {
            setTaskToDelete(null)
            setDeletingStates((prevState => {
                return {...prevState, [id]: true}
            }))
            deleteTask({id}).then(async (res) => {
                await reloadTasks(props.task.status)
                setDeletingStates(prevState => {
                    const newState = {...prevState}
                    delete newState[id]
                    return newState
                })

            })

            return
        }

        deleteTask({id}).then(async (res) => {
            await reloadTasks(props.task.status)
            setLoading(false)
            props.setOpen(false)

        })
    }

    const showDeleteConfirm = () =>
        <MDBox display={'flex'} alignItems={'center'} fullWidth>
            <Typography variant={'caption'}>
                Delete?
            </Typography>
            <Button variant={'contained'} size={'small'} onClick={() => setTaskToDelete(null)}
                    color={'secondary'} style={{
                maxWidth: '30px',
                maxHeight: '30px',
                minWidth: '30px',
                minHeight: '30px',
                marginLeft: '4px'
            }}>No</Button>
            <Button variant={'contained'} size={'small'} style={{
                maxWidth: '30px',
                maxHeight: '30px',
                minWidth: '30px',
                minHeight: '30px',
                marginLeft: '4px'
            }}
                    onClick={() => deleteTaskHandler(taskToDelete?._id)}>Yes</Button>
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

    const saveTask = (isSubTask = false, isDescription = false, isGoal = false, isTitle = false, isDate = false, id = '', status = 'TODO') => {
        if (!isSubTask) {
            setLoading(true)
            setErrorMessage(null)
            setVal(valIntermediate)
            setGoalVal(valGoalIntermediate)
        }

        const data = isSubTask ? {
            status
        } : {}

        if (isDescription) {
            data.description = valIntermediate
        }
        if (isGoal) {
            data.goal = valGoalIntermediate
        }
        if (isTitle) {
            data.title = titleInter
        }
        if (isDate) {
            data.startDate = dateRange.startDate.getTime() / 1000
            data.endDate = dateRange.endDate.getTime() / 1000
        }

        updateTask({
            data,
            id: isSubTask ? id : props.task.id
        }).then(async (response, error) => {
            if (response.status !== HttpStatusCode.Ok) {
                setErrorMessage(response.response.data.message)
                setLoading(false)
                return
            }

            if (!subTasks)
                props.task.description = val
            await reloadTasks(props.task.status)
            setLoading(false)

            if (isDescription) {
                return setDisplayEditor(false)
            }
            if (isGoal) {
                setDisplayGoalEditor(false)
            }
            if (isTitle) {
                setEditTitle(false)
            }
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
                backgroundColor: '#F4F5F7',
            }}>
                <MDBox sx={{
                    gridArea: '1 / 1 / 2 / 2'
                }}>
                    <MDBox sx={style} className={'bg-light-gray'}
                           width={{xs: "90%", lg: "50%"}}
                           display="flex"
                           flexDirection={{xs: "column", lg: "row"}}
                           justifyContent="space-between"
                           alignItems="center"
                           px={1.5}>
                        <Grid spacing={1} container>
                            <Grid item lg={12} xs={12} className={'position-absolute w-100 top-0 left-0 p-3'}
                                  sx={{left: 0}}>
                                <MDBox display={'flex'} flexDirection="row" justifyContent={'space-between'}
                                       marginLeft='0.7em'>
                                    <MDBox display={'flex'} flexDirection={'row'} alignItems={'center'} width={'100%'}>
                                        {
                                            editTitle ?
                                                <MDBox mb={4} sx={{width: '100%'}} display={'flex'}
                                                       justifyContent={'stretch'}>
                                                    <MDInput type="text" label="Title" variant="standard" fullWidth
                                                             defaultValue={title} id={'task-title-bigger'}
                                                             onChange={(newValue) => setTitleInter(newValue.target.value)}/>
                                                    <MDBox display={'inline-flex'} alignItems={'center'}>
                                                        {!loading &&
                                                            <>
                                                                <IconButton variant={'contained'} size={'small'}
                                                                            onClick={() => {
                                                                                setTitle(titleInter);
                                                                                saveTask(false, false, false, true, false);
                                                                            }}>
                                                                    <Save/>
                                                                </IconButton>
                                                                <IconButton variant={'contained'} size={'small'}
                                                                            onClick={() => {
                                                                                setEditTitle(false);
                                                                                setTitleInter(props.task.title)
                                                                            }}>
                                                                    <Cancel/>
                                                                </IconButton>

                                                            </>
                                                        }
                                                        {loading &&
                                                            <i className="mdi mdi-loading icon-spinner mdi-24px me-2"></i>
                                                        }
                                                    </MDBox>
                                                </MDBox>
                                                :
                                                <>
                                                    <MDBox display={'flex'} alignItems={'center'}>
                                                        <div className={'h6 mb-0 one-line text-black editor-text-bold'}
                                                             onClick={() => setEditTitle(true)}>
                                                            <Typography variant={'h6'}>
                                                                {title}
                                                            </Typography>

                                                        </div>
                                                    </MDBox>
                                                    <MDBox display={'flex'} flexDirection={'row'} alignItems={'center'}>
                                                        <IconButton onClick={() => setEditTitle(true)}>
                                                            <EditOutlined fontSize={'small'}/>
                                                        </IconButton>
                                                    </MDBox>
                                                </>
                                        }

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
                                    <MDBox display={'flex'} alignItems={'center'}>
                                        <Notes spacing={10}/>
                                        <Typography variant={'h6'} color="text.secondary" marginLeft={'8px'}>
                                            Description
                                        </Typography>
                                        <IconButton onClick={() => setDisplayEditor(true)}>
                                            <EditOutlined fontSize={'small'}/>
                                        </IconButton>
                                    </MDBox>
                                    <MDBox>
                                        {displayEditor ?
                                            <MDBox>
                                                <MDBox display={'flex'} alignItems={'center'}
                                                       justifyContent={'flex-end'}>
                                                    <Button
                                                        onClick={() => setShowToolbar((prev) => !prev)}>
                                                        {showToolbar ?
                                                            'Hide Toolbar' : 'Show Toolbar'
                                                        }
                                                    </Button>
                                                </MDBox>
                                                <MDBox sx={{padding: '0 1.4em'}}>
                                                    {/*<MUIRichTextEditor label={'Typing...'} defaultValue={val}
                                                                       onChange={(st) => {
                                                                           setValIntermediate(JSON.stringify(convertToRaw(st.getCurrentContent())))
                                                                       }} toolbar={showToolbar}/>*/}
                                                    <Editor placeholderText={'Details about this task'}
                                                            enable={showToolbar} editorState={val}
                                                            onChange={setValIntermediate}/>
                                                </MDBox>


                                            </MDBox> :
                                            <MDBox marginLeft={'1.4em'}
                                                   onClick={() => setDisplayEditor(true)}>
                                                <div color="text.secondary" className="h6"
                                                     dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(toHtml(val))}}/>
                                            </MDBox>}
                                    </MDBox>
                                    {displayEditor &&
                                        <MDBox display={'flex'} justifyContent={'flex-end'}
                                               alignItems={'space-between'}>
                                            {errorMessage && <MDBox lg={12} className="mb-0">
                                                <div className="d-grid">
                                                    <Alert className="bg-soft-danger fw-medium">
                                                        <i className="uil uil-exclamation-octagon fs-5 align-middle me-1"></i>
                                                        {{errorMessage}}
                                                    </Alert>
                                                </div>
                                            </MDBox>}
                                            <Box sx={{'& button': {m: 1}}}>
                                                <Button color={'secondary'} size={'small'} style={{padding: '4px'}}
                                                        variant={'contained'}
                                                        onClick={() => {
                                                            setDisplayEditor(false)
                                                            setVal(props.task.description)
                                                        }}>Cancel</Button>
                                                <Button size={'small'} variant={'contained'}
                                                        onClick={() => {
                                                            saveTask(false, true, false, false, false)
                                                        }}>
                                                    {loading &&
                                                        <i className="mdi mdi-loading icon-spinner mdi-24px me-2"></i>
                                                    }
                                                    Save
                                                </Button>
                                            </Box>
                                        </MDBox>
                                    }

                                    <MDBox display={'flex'} alignItems={'center'}>
                                        <CenterFocusWeak spacing={10}/>
                                        <Typography variant={'h6'} color="text.secondary" marginLeft={'8px'}>
                                            Goal
                                        </Typography>
                                        <IconButton onClick={() => setDisplayGoalEditor(true)}>
                                            <EditOutlined fontSize={'small'}/>
                                        </IconButton>
                                    </MDBox>
                                    <MDBox>
                                        {displayGoalEditor ?
                                            <MDBox>
                                                <MDBox display={'flex'} alignItems={'center'}
                                                       justifyContent={'flex-end'}>
                                                    <Button
                                                        onClick={() => setShowGoalToolbar((prev) => !prev)}>
                                                        {showGoalToolbar ?
                                                            'Hide Toolbar' : 'Show Toolbar'
                                                        }
                                                    </Button>
                                                </MDBox>
                                                <MDBox sx={{padding: '0 1.4em'}}>
                                                    {/*<MUIRichTextEditor label={'Typing...'} defaultValue={val}
                                                                       onChange={(st) => {
                                                                           setValIntermediate(JSON.stringify(convertToRaw(st.getCurrentContent())))
                                                                       }} toolbar={showToolbar}/>*/}
                                                    <Editor placeholderText={'Details about this task'}
                                                            enable={showGoalToolbar} editorState={goalVal}
                                                            onChange={setGoalValIntermediate}/>
                                                </MDBox>


                                            </MDBox> :
                                            <MDBox marginLeft={'1.4em'}
                                                   onClick={() => setDisplayGoalEditor(true)}>
                                                <div color="text.secondary" className="h6"
                                                     dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(toHtml(goalVal))}}/>
                                            </MDBox>}
                                    </MDBox>
                                    {displayGoalEditor &&
                                        <MDBox display={'flex'} justifyContent={'flex-end'}
                                               alignItems={'space-between'}>
                                            {errorMessage && <MDBox lg={12} className="mb-0">
                                                <div className="d-grid">
                                                    <Alert className="bg-soft-danger fw-medium">
                                                        <i className="uil uil-exclamation-octagon fs-5 align-middle me-1"></i>
                                                        {{errorMessage}}
                                                    </Alert>
                                                </div>
                                            </MDBox>}
                                            <Box sx={{'& button': {m: 1}}}>
                                                <Button color={'secondary'} size={'small'} style={{padding: '4px'}}
                                                        variant={'contained'}
                                                        onClick={() => {
                                                            setDisplayGoalEditor(false)
                                                            setGoalVal(props.task.goal)
                                                        }}>Cancel</Button>
                                                <Button size={'small'} variant={'contained'}
                                                        onClick={() => {
                                                            saveTask(false, false, true, false, false)
                                                        }}>
                                                    {loading &&
                                                        <i className="mdi mdi-loading icon-spinner mdi-24px me-2"></i>
                                                    }
                                                    Save
                                                </Button>
                                            </Box>
                                        </MDBox>
                                    }
                                    <MDBox display={'flex'} alignItems={'center'}>
                                        <DateRange spacing={10}/>
                                        <Typography variant={'h6'} color="text.secondary" marginLeft={'8px'}>
                                            Duration
                                        </Typography>
                                    </MDBox>
                                    <MDBox bgColor={'lightGray'} marginLeft={'1.4em'} marginTop={'0.4em'}
                                           display={'inline-block'}>
                                        <Button variant={'secondary'} size={'small'} padding={'1em'} onClick={toggle}>
                                            {getTimeSpan()}
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
                                    <MDBox marginLeft={'1.5em'} color={'lightGray'}>
                                        <Button size={'small'} variant={'contained'} color={'fadedButton2'}
                                                disableElevation onClick={() => {
                                            setSelectedSubTask({})
                                            setShowAddSubTask(true)
                                        }}>
                                            Add a task
                                        </Button>
                                        {showAddSubTask ? <AddSubTask key={selectedSubTask.id} open={showAddSubTask}
                                                                      setOpen={setShowAddSubTask}
                                                                      parentStartDate={props.task.startDate}
                                                                      parentEndDate={props.task.endDate}
                                                                      parentStatus={props.task.status}
                                                                      {...selectedSubTask} parent={props.task.id}
                                                                      autoFocus/> : <></>}
                                    </MDBox>
                                </MDBox>
                            </Grid>
                        </Grid>
                        <MDBox display={'flex'} justifyContent={'flex-end'} alignItems={'flex-end'}>
                            {confirmDelete && confirmDeleteDialog()}
                            <MDBox display={'flex'} justifyContent={'flex-end'} alignItems={'flex-end'} width={'100%'}
                                   sx={{
                                       marginRight: '-0.84em'
                                   }}>
                                <IconButton onClick={() => setConfirmDelete(true)}>
                                    <DeleteOutline/>
                                </IconButton>
                            </MDBox>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </MDBox>

        </Modal>
    )
}

export default TaskDetail
