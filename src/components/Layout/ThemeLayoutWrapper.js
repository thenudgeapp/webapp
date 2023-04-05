import React, {useState, Suspense} from "react";
import theme from "../../theme";
import CssBaseline from "@mui/material/CssBaseline";
import Sidenav from "../Shared/Sidenav";
import routes from "../../routes/allRoutes";
import DashboardLayout from "./DashboardLayout";
import DashboardNavbar from "../Shared/DashboardNavbar";
import {ThemeProvider} from "@mui/material/styles";

import brandWhite from '../../assets/images/logo-white-bg.png'
import brandDark from '../../assets/images/logo-white-bg.png'
import {useAtom} from "jotai";
import {MaterialUiAtoms, TaskAtom} from "../../store";
import {withRouter} from "react-router-dom";
import {DragDropContext} from "@hello-pangea/dnd";

function ThemeLayoutWrapper(props) {
    const [miniSidenav, setMiniSidenav] = useAtom(MaterialUiAtoms.miniSidenav)
    const [transparentSidenav, setTransparentSidenav] = useAtom(MaterialUiAtoms.transparentSidenav)
    const [whiteSidenav, setWhiteSidenav] = useAtom(MaterialUiAtoms.whiteSidenav)
    const [sidenavColor, setSidenavColor] = useAtom(MaterialUiAtoms.sidenavColor)
    const [transparentNavbar, setTransparentNavbar] = useAtom(MaterialUiAtoms.transparentNavbar)
    const [fixedNavbar, setFixedNavbar] = useAtom(MaterialUiAtoms.fixedNavbar)
    const [openConfigurator, setOpenConfigurator] = useAtom(MaterialUiAtoms.openConfigurator)
    const [direction, setDirection] = useAtom(MaterialUiAtoms.direction)
    const [layout, setLayout] = useAtom(MaterialUiAtoms.layout)
    const [darkMode, setDarkMode] = useAtom(MaterialUiAtoms.darkMode)
    const [tasks, setTasks] = useAtom(TaskAtom.tasks);
    const [_, updateTask] = useAtom(TaskAtom.updateTask);
    const [backlogTasks, sbt] = useAtom(TaskAtom.backlogTasks)
    const [todoTasks, stt] = useAtom(TaskAtom.todoTasks)
    const [inProgressTasks, sipt] = useAtom(TaskAtom.inProgressTasks)
    const [doneTasks, sdt] = useAtom(TaskAtom.doneTasks)

    const [onMouseEnter, setOnMouseEnter] = useState(false);
    const [rtlCache, setRtlCache] = useState(null);

    // Open sidenav when mouse enter on mini sidenav
    const handleOnMouseEnter = () => {
        if (miniSidenav && !onMouseEnter) {
            setMiniSidenav(false);
            setOnMouseEnter(true);
        }
    };

    // Close sidenav when mouse leave mini sidenav
    const handleOnMouseLeave = () => {
        if (onMouseEnter) {
            setMiniSidenav(true);
            setOnMouseEnter(false);
        }
    };

    // Change the openConfigurator state
    const handleConfiguratorOpen = () => setOpenConfigurator((prev) => !prev);

    const Loader = () => {
        return (
            <div id="preloader">
                <div id="status">
                    <div className="spinner">
                        <div className="double-bounce1"></div>
                        <div className="double-bounce2"></div>
                    </div>
                </div>
            </div>
        )
    }

    const onBeforeCapture = () => {
        /*...*/
    };

    const onBeforeDragStart = () => {
        /*...*/
    };

    const onDragStart = () => {
        /*...*/
    };
    const onDragUpdate = () => {
        /*...*/
    };


    const updateVals = (task, status, taskId, from, to, callback, addToPrev = false) => {
        callback(prev => {
            if (addToPrev) {
                prev.results.push(task)
                from = prev.results.length - 1
            }
            task.status = status
            let first = 0
            let second = prev.results[0].position

            if (to > 0) {
                first = prev.results[to - 1].position
            }

            if (to > 0 && to < prev.results.length - 1) {
                second = prev.results[to].position
            }

            let newPosition = (first + second) / 2

            if (to === 0) {
                newPosition = -65536
            }

            if (to === prev.results.length - 1) {
                newPosition = prev.results[to].position / 2
            }

            task.position = newPosition
            task.status = status

            updateTask({
                data: {
                    position: newPosition,
                    status
                },
                id: taskId
            })

            const newTasks = reorder(prev.results, from, to)
            console.log(newTasks)
            return {...prev, results: newTasks}
        })
    }

    const findTask = (data, taskId) => {
        const destinationType = data.destination.droppableId.split('_')[0]
        const sourceType = data.source.droppableId.split('_')[0]
        let task = null

        switch (destinationType) {
            case 'backlog':
                task = backlogTasks.results.find((tsk, idx) => tsk.id === taskId)
                break
            case 'todo':
                task = todoTasks.results.find((tsk, idx) => tsk.id === taskId)
                break
            case 'in-progress':
                task = inProgressTasks.results.find((tsk, idx) => tsk.id === taskId)
                break
            case 'done':
                task = doneTasks.results.find((tsk, idx) => tsk.id === taskId)
                break
        }

        if (!task) {
            switch (sourceType) {
                case 'backlog':
                    task = backlogTasks.results.find((tsk, idx) => tsk.id === taskId)
                    break
                case 'todo':
                    task = todoTasks.results.find((tsk, idx) => tsk.id === taskId)
                    break
                case 'in-progress':
                    task = inProgressTasks.results.find((tsk, idx) => tsk.id === taskId)
                    break
                case 'done':
                    task = doneTasks.results.find((tsk, idx) => tsk.id === taskId)
                    break
            }
        }

        return task

    }

    const removeTaskFromGroup = (task, group) => {
        switch (group) {
            case 'backlog':
                sbt(prev => {
                    return {
                        ...prev,
                        results: prev.results.filter((tsk) => tsk.id !== task.id)
                    }
                })
                break
            case 'todo':
                stt(prev => {
                    return {
                        ...prev,
                        results: prev.results.filter((tsk) => tsk.id !== task.id)
                    }
                })
                break
            case 'in-progress':
                sipt(prev => {
                    return {
                        ...prev,
                        results: prev.results.filter((tsk) => tsk.id !== task.id)
                    }
                })
                break
            case 'done':
                sdt(prev => {
                    return {
                        ...prev,
                        results: prev.results.filter((tsk) => tsk.id !== task.id)
                    }
                })
                break
        }
    }

    const onDragEnd = (data, action) => {
        // the only one that is required

        if(!data || !data.destination)
            return

        const type = data.destination.droppableId.split('_')[0]
        const removeGroup = data.source.droppableId.split('_')[0]
        let status;

        const taskId = data.draggableId.split('-')[1]
        const from = data.source.index - 2
        const to = data.destination.index - 2

        let task = findTask(data, taskId)

        let movedToAnotherGroup = type !== removeGroup

        if (!movedToAnotherGroup && from === to) {
            return
        }


        switch (type) {
            case 'backlog':
                status = 'BACKLOG'
                updateVals(task, status, taskId, from, to, sbt, movedToAnotherGroup)

                if (movedToAnotherGroup) {
                    removeTaskFromGroup(task, removeGroup)
                }
                break
            case 'todo':
                status = 'TODO'
                updateVals(task, status, taskId, from, to, stt, movedToAnotherGroup)

                if (movedToAnotherGroup) {
                    removeTaskFromGroup(task, removeGroup)
                }
                break
            case 'in-progress':
                status = 'IN PROGRESS'
                updateVals(task, status, taskId, from, to, sipt, movedToAnotherGroup)

                if (movedToAnotherGroup) {
                    removeTaskFromGroup(task, removeGroup)
                }
                break
            case 'done':
                status = 'DONE'
                updateVals(task, status, taskId, from, to, sdt, movedToAnotherGroup)

                if (movedToAnotherGroup) {
                    removeTaskFromGroup(task, removeGroup)
                }
                break
        }

    };

    const reorder = (list, from, to) => {
        const result = Array.from(list)

        let element = result[from];
        result.splice(from, 1);
        result.splice(to, 0, element);

        return result
    }

    return (
        <React.Fragment>
            <Suspense fallback={Loader()}>
                <DragDropContext
                    onBeforeCapture={onBeforeCapture}
                    onBeforeDragStart={onBeforeDragStart}
                    onDragStart={onDragStart}
                    onDragUpdate={onDragUpdate}
                    onDragEnd={onDragEnd}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <Sidenav
                            color={sidenavColor}
                            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                            brandName=""
                            routes={routes}
                            onMouseEnter={handleOnMouseEnter}
                            onMouseLeave={handleOnMouseLeave}
                        />
                        <DashboardLayout>
                            <DashboardNavbar />
                            {props.view()}
                        </DashboardLayout>
                    </ThemeProvider>
                </DragDropContext>
            </Suspense>
        </React.Fragment>
    )
}

export default withRouter(ThemeLayoutWrapper)
