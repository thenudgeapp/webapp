import AxiosClient from "./axios";
import {atomWithStorage} from "jotai/utils";
import {
    TASKS_DATA,
    TASKS_DATA_BACKLOG,
    TASKS_DATA_DONE,
    TASKS_DATA_IN_PROGRESS,
    TASKS_DATA_TODO
} from "../config/constants";
import {atom} from "jotai";
import {HttpStatusCode} from "axios";
import {AuthAtoms} from "./index";
import DoublyLinkedList from "../types/DoublyLinkedList";

const TASKS_URL = '/v1/tasks/'

const buildQueryString = (name, status, limit = -1, sortBy = 'position:asc', page = 0) => {
    let queryString = `limit=${limit}&sortBy=${sortBy}&page=${page}`;

    if (name) {
        queryString += `&name=${name}`
    }

    if (status) {
        queryString += `&status=${status}`
    }

    return queryString
}


export const tasks = atomWithStorage(TASKS_DATA, JSON.parse(localStorage.getItem(TASKS_DATA) || '{"results": [] }'));
export const backlogTasks = atomWithStorage(TASKS_DATA_BACKLOG, JSON.parse(localStorage.getItem(TASKS_DATA_BACKLOG) || '{"results": [] }'));
export const todoTasks = atomWithStorage(TASKS_DATA_TODO, JSON.parse(localStorage.getItem(TASKS_DATA_TODO) || '{"results": [] }'));
export const inProgressTasks = atomWithStorage(TASKS_DATA_IN_PROGRESS, JSON.parse(localStorage.getItem(TASKS_DATA_IN_PROGRESS) || '{"results": [] }'));
export const doneTasks = atomWithStorage(TASKS_DATA_DONE, JSON.parse(localStorage.getItem(TASKS_DATA_DONE) || '{"results": [] }'));

export const getAllTasks =
    atom((get) => get(tasks),
        async (_get, set, {name, status, limit, sortBy, page}) => {
            (await AxiosClient(true)).get(`${TASKS_URL}?${buildQueryString(name, status, limit, sortBy, page)}`).then((response) => {
                if (response.status === HttpStatusCode.Ok) {
                    set(tasks, response.data)
                }

                if (response.status === HttpStatusCode.Unauthorized) {
                    AuthAtoms.clearData(set)
                }

                return response
            }).catch(error => {
                if (error.response && error.response.status === HttpStatusCode.Unauthorized) {
                    AuthAtoms.clearData(set)
                }

                return error
            })

        }
    )
export const getBacklogTasks =
    atom((get) => get(backlogTasks),
        async (_get, set, {name, status, limit, sortBy, page}) => {
            (await AxiosClient(true)).get(`${TASKS_URL}?${buildQueryString(name, status='BACKLOG', limit, sortBy, page)}`).then((response) => {
                if (response.status === HttpStatusCode.Ok) {
                    let data = response.data
                    set(backlogTasks, data)
                }

                if (response.status === HttpStatusCode.Unauthorized) {
                    AuthAtoms.clearData(set)
                }

                return response
            }).catch(error => {
                if (error.response && error.response.status === HttpStatusCode.Unauthorized) {
                    AuthAtoms.clearData(set)
                }

                return error
            })

        }
    )
export const getTodoTasks =
    atom((get) => get(todoTasks),
        async (_get, set, {name, status, limit, sortBy, page}) => {
            (await AxiosClient(true)).get(`${TASKS_URL}?${buildQueryString(name, status='TODO', limit, sortBy, page)}`).then((response) => {
                if (response.status === HttpStatusCode.Ok) {
                    let data = response.data
                    set(todoTasks, data)
                }

                if (response.status === HttpStatusCode.Unauthorized) {
                    AuthAtoms.clearData(set)
                }

                return response
            }).catch(error => {
                if (error.response && error.response.status === HttpStatusCode.Unauthorized) {
                    AuthAtoms.clearData(set)
                }

                return error
            })

        }
    )
export const getInProgressTasks =
    atom((get) => get(inProgressTasks),
        async (_get, set, {name, status, limit, sortBy, page}) => {
            (await AxiosClient(true)).get(`${TASKS_URL}?${buildQueryString(name, status='IN PROGRESS', limit, sortBy, page)}`).then((response) => {
                if (response.status === HttpStatusCode.Ok) {
                    let data = response.data
                    set(inProgressTasks, data)
                }

                if (response.status === HttpStatusCode.Unauthorized) {
                    AuthAtoms.clearData(set)
                }

                return response
            }).catch(error => {
                if (error.response && error.response.status === HttpStatusCode.Unauthorized) {
                    AuthAtoms.clearData(set)
                }

                return error
            })

        }
    )
export const getDoneTasks =
    atom((get) => get(doneTasks),
        async (_get, set, {name, status, limit, sortBy, page}) => {
            (await AxiosClient(true)).get(`${TASKS_URL}?${buildQueryString(name, status='DONE', limit, sortBy, page)}`).then((response) => {
                if (response.status === HttpStatusCode.Ok) {
                    let data = response.data
                    set(doneTasks, data)
                }

                if (response.status === HttpStatusCode.Unauthorized) {
                    AuthAtoms.clearData(set)
                }

                return response
            }).catch(error => {
                if (error.response && error.response.status === HttpStatusCode.Unauthorized) {
                    AuthAtoms.clearData(set)
                }

                return error
            })

        }
    )



export const updateTask =
    atom((get) => get(tasks),
        async (_get, set, {data, id}) => {
            (await AxiosClient(true)).patch(`${TASKS_URL}${id}`, data).then((response) => {
                if (response.status === HttpStatusCode.Ok) {
                    _get(getAllTasks)
                }

                if (response.status === HttpStatusCode.Unauthorized) {
                    AuthAtoms.clearData(set)
                }

                return response
            }).catch(error => {
                if (error.response && error.response.status === HttpStatusCode.Unauthorized) {
                    AuthAtoms.clearData(set)
                }

                return error
            })

        }
    )

export const addTask =
    atom((get) => get(tasks),
        async (_get, set, {data}) => {
            const response = await (await AxiosClient(true)).post(TASKS_URL, data).then((response) => {
                if (response.status === HttpStatusCode.Ok) {
                    /*set(tasks, (prev) => {
                        const tasksNew = [...prev]
                        tasksNew.push(response.data)
                        return tasksNew
                    })*/
                    _get(getAllTasks)
                }

                if (response.status === HttpStatusCode.Unauthorized) {
                    AuthAtoms.clearData(set)
                }

                console.log(response)

                return response
            }).catch(error => {
                if (error.response && error.response.status === HttpStatusCode.Unauthorized) {
                    AuthAtoms.clearData(set)
                }

                console.log(error)
                return error
            })

            return response

        }
    )

const convertToLinkedList = (tasks) => {
    let results = null
    if(tasks.results && Object.keys(tasks.results).length > 0) {
        console.log(tasks.results)
        for (const task of tasks.results) {
            if (!results) {
                results = new DoublyLinkedList(task)
                continue
            }

            results.append(task)
        }
    }

    tasks.results = results || {}

    return tasks
}

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};
