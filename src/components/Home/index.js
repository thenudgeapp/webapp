import {useEffect, useState} from "react";
import { useHistory } from 'react-router-dom'
import MDBox from "../Shared/MDBox";
import {
    Grid,
} from "@mui/material";
import TaskGroup from "../Task/TaskGroup";
import {TaskAtom} from "../../store";
import Onboarding from "../Profile/Onboarding";
import {ONBOARD_DISPLAY} from "../../config/constants";

const {useAtom} = require("jotai");
const {AuthAtoms} = require("../../store");

const Home = () => {
    const history = useHistory()
    const [user, _] = useAtom(AuthAtoms.user)
    const [bt, getBacklogTasks] = useAtom(TaskAtom.getBacklogTasks)
    const [tt, getTodoTasks] = useAtom(TaskAtom.getTodoTasks)
    const [ipt, getInProgressTasks] = useAtom(TaskAtom.getInProgressTasks)
    const [dt, getDoneTasks] = useAtom(TaskAtom.getDoneTasks)
    const [open, setOpen] = useState(!!localStorage.getItem(ONBOARD_DISPLAY))

    useEffect(() => {
        if (!user) {
            return history.push('/')
        }

    }, [user])

    useEffect(() => {
        if (user) {
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
                  <TaskGroup tasks={tt.results} title={'ToDo'} id={'todo_group'}/>
                  <TaskGroup tasks={ipt.results} title={'In Progress'} id={'in-progress_group'}/>
                  <TaskGroup tasks={dt.results} title={'Done'} id={'done_group'}/>
              </Grid>
              <Onboarding open={open} setOpen={setOpen}/>
          </MDBox>
  </MDBox>)
}

export default Home
