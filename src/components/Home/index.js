import {useEffect} from "react";
import { useHistory } from 'react-router-dom'
import MDBox from "../Shared/MDBox";
import {
    Grid,
} from "@mui/material";
import TaskGroup from "../Task/TaskGroup";
import {TaskAtom} from "../../store";

const {useAtom} = require("jotai");
const {AuthAtoms} = require("../../store");
const Home = ({...props}) => {
    const history = useHistory()
    const [user, _] = useAtom(AuthAtoms.user)
    const [tasks, __] = useAtom(TaskAtom.tasks)
    const [backlogTasks, sbt] = useAtom(TaskAtom.backlogTasks)
    const [todoTasks, stt] = useAtom(TaskAtom.todoTasks)
    const [inProgressTasks, sipt] = useAtom(TaskAtom.inProgressTasks)
    const [doneTasks, sdt] = useAtom(TaskAtom.doneTasks)
    const [___, getTasks] = useAtom(TaskAtom.getAllTasks)
    const [bt, getBacklogTasks] = useAtom(TaskAtom.getBacklogTasks)
    const [tt, getTodoTasks] = useAtom(TaskAtom.getTodoTasks)
    const [ipt, getInProgressTasks] = useAtom(TaskAtom.getInProgressTasks)
    const [dt, getDoneTasks] = useAtom(TaskAtom.getDoneTasks)

    useEffect(() => {
        if (!user) {
            return history.push('/')
        }

    }, [user])

    useEffect(() => {
        if (user) {
            getTasks({})
            getBacklogTasks({})
            getTodoTasks({})
            getInProgressTasks({})
            getDoneTasks({}).then(r => console.log(dt))
        }
    }, [])
  return (
      <MDBox py={3}>
          <MDBox mt={3}>
              <Grid container spacing={3}>
                  <TaskGroup tasks={bt.results} title={'Backlog'} id={'backlog_group'}/>
                  <TaskGroup tasks={tt.results} title={'ToDo'} id={'todo_group'}/>
                  <TaskGroup tasks={ipt.results} title={'In Progress'} id={'in-progress_group'}/>
                  <TaskGroup tasks={dt.results} title={'Done'} id={'done_group'}/>
              </Grid>
          </MDBox>
  </MDBox>)
}

export default Home
