import MDBox from "../Shared/MDBox";
import {Grid, IconButton, Paper, Typography} from "@mui/material";
import {Droppable} from "@hello-pangea/dnd";
import TaskItem from "./TaskItem";
import { MoreVert, Add} from "@mui/icons-material";
import AddTask from "./AddTask";
import {useState} from "react";
import DoublyLinkedList from "../../types/DoublyLinkedList";
import TaskDetail from "./TaskDetail";

const convertToLinkedList = (tasks) => {
    let results = null
    if(tasks && Object.keys(tasks).length > 0) {
        for (const task of tasks) {
            if (!results) {
                results = new DoublyLinkedList(task)
                continue
            }

            results.append(task)
        }
    }

    return results || {}
}

const renderTasks = (tasks, status, setOpenTaskDetail, setSelectedTask) => {
    const tLL = convertToLinkedList(tasks)
    let task = tLL.head
    const result = []
    let index = 0
    while (task) {
        if (task.value) {
            result.push(task && <TaskItem task={task.value} key={task.value.id} index={index++}
                                          setOpenTaskDetail={setOpenTaskDetail} setSelectedTask={setSelectedTask}/>)
        }
        task = task.next
    }


    return <>{result}</>
}

const TaskGroup = (props) => {

    const [addTask, setAddTask] = useState(false)
    const [openTaskDetail, setOpenTaskDetail] = useState(false)
    const [selectedTask, setSelectedTask] = useState()


    const getStatus = (id) =>
        ( id === 'todo_group' ? 'TODO'
            : id === 'backlog_group' ? 'BACKLOG'
                : id === 'in-progress_group' ? 'IN PROGRESS' : 'DONE')


    return (
        <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={3}>
                <Paper elevation={0} sx={{ height: "100%", background: "#dee2e6" }}>
                    <MDBox shadow={'none'} display={'flex'} padding="1rem">
                        <Grid spacing={1} container>
                            <Grid item lg={12} xs={12}>
                                <Grid container justifyContent={'space-between'} alignItems={'center'}>
                                    <Typography marginBottom={'0'} variant="h6" gutterBottom>{props.title}</Typography>
                                    <Grid justifyContent={'flex-end'} alignItems={'center'}>
                                        <IconButton style={{padding: '2px'}} onClick={() => setAddTask(true)}>
                                            <Add />
                                        </IconButton>
                                        <IconButton style={{padding: '2px'}} aria-label="settings">
                                            <MoreVert />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item lg={12} xs={12}>
                                <Droppable droppableId={props.id}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef}>
                                            {renderTasks(props.tasks, getStatus(props.id), setOpenTaskDetail, setSelectedTask)}
                                            {provided.placeholder}
                                        </div>
                                    )}

                                </Droppable>
                            </Grid>
                            <Grid item lg={12} xs={12}>
                                <Grid container justifyContent={'flex-start'} alignItems={'center'}>
                                    <IconButton className="text-muted"  onClick={() => setAddTask(true)}>
                                        <Add />
                                        <Typography marginBottom={'0'} variant="h6" gutterBottom>
                                            <small className="text-muted">Add Card</small>
                                        </Typography>
                                    </IconButton>
                                    <AddTask open={addTask} setOpen={setAddTask} status={getStatus(props.id)} />
                                    {selectedTask &&
                                        <TaskDetail open={openTaskDetail} setOpen={setOpenTaskDetail}
                                                 task={selectedTask}/>}
                                </Grid>
                            </Grid>
                        </Grid>
                    </MDBox>
                </Paper>
            </MDBox>
        </Grid>
    )
}

export default TaskGroup
