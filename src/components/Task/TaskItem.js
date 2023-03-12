import {
    Box, Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    IconButton,
    ListItemIcon, ListItemText,
    Menu, Modal,
    Popover,
    Typography
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {Draggable} from "@hello-pangea/dnd";
import dayjs from "dayjs";
import MDBox from "../Shared/MDBox";
import React, {useState} from "react";
import {$getRoot, createEditor} from "lexical";
import {Delete, Edit} from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import {useAtom} from "jotai";
import {TaskAtom} from "../../store";
import {HeadingNode, QuoteNode} from "@lexical/rich-text";
import {ListItemNode, ListNode} from "@lexical/list";
import {CodeHighlightNode, CodeNode} from "@lexical/code";
import {TableCellNode, TableNode, TableRowNode} from "@lexical/table";
import {AutoLinkNode, LinkNode} from "@lexical/link";
import {EditorDefaultConfig} from "../../config/constants";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const TaskItem = (props) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState()
    const [, deleteTask] = useAtom(TaskAtom.deleteTask)
    const [bt, getBacklogTasks] = useAtom(TaskAtom.getBacklogTasks)
    const [tt, getTodoTasks] = useAtom(TaskAtom.getTodoTasks)
    const [ipt, getInProgressTasks] = useAtom(TaskAtom.getInProgressTasks)
    const [dt, getDoneTasks] = useAtom(TaskAtom.getDoneTasks)
    const open = Boolean(anchorEl)

    const editor = createEditor(EditorDefaultConfig)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const days = (end) => {
        const date1 = dayjs.unix(end );
        const date2 = dayjs();

        let hours = date1.diff(date2, 'hours');
        let days = Math.floor(hours / 24);

        const overdue = days < 0 ? 'Overdue by ' : 'Due in '

        days = Math.abs(days)

        return `${overdue} ${days === 1 ? `${days} day` : `${days} days`}`
    }

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

    const edit = () => {
        props.setSelectedTask(props.task)
        props.setOpenTaskDetail(true)
        handleClose()
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
                        <Button variant="contained" style={{marginLeft: '0.4em'}} md={12} onClick={deleteTaskHandler}>
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

    const reloadTasks = async () => {
        switch (props.task.status) {
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

    const deleteTaskHandler = () => {
        setLoading(true)
        deleteTask({id: props.task.id}).then(async (res) => {
            await reloadTasks()
        })
    }

    return (
        <Draggable key={props.task.id} draggableId={`drag-${props.task.id}`} index={props.index + 2}>
            {(provided, snapshot) => (
                <Card sx={{marginBottom: '0.5rem'}} elevation={0} ref={provided.innerRef} {...provided.draggableProps}
                      {...provided.dragHandleProps}>
                    {confirmDelete && confirmDeleteDialog()}
                    <Menu
                        id={props.task.id}
                        anchorEl={anchorEl}
                        keepMounted
                        anchorOrigin={{
                            horizontal: 'left',
                            vertical: 'bottom',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={edit}>
                            <ListItemIcon>
                                <Edit fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primaryTypographyProps={{fontSize: '1.2em'}}>Edit</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => {
                            setConfirmDelete(true)
                            handleClose()
                        }}>
                            <ListItemIcon>
                                <Delete fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primaryTypographyProps={{fontSize: '1.2em'}}>Delete</ListItemText>
                        </MenuItem>
                    </Menu>
                    <CardHeader
                        action={
                            <IconButton aria-label="settings" onClick={handleClick}>
                                <MoreVertIcon />
                            </IconButton>
                        }
                        title={<Typography marginBottom={'0'} variant="h6" sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            'WebkitLineClamp': '1',
                            'WebkitBoxOrient': 'vertical'
                        }} onClick={edit} gutterBottom>{props.task.title}</Typography>}
                    />
                    <CardContent sx={{padding: '16px'}}>
                        <Typography variant="body2" color="text.secondary" sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            'WebkitLineClamp': '2',
                            'WebkitBoxOrient': 'vertical'
                        }}>
                            {toPlainText(props.task.description)}
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        <MDBox display={'flex'} justifyContent={'flex-end'} width={'100%'}>
                            <Typography variant={'caption'}>{days(props.task.endDate)}</Typography>
                        </MDBox>
                    </CardActions>
                    {provided.placeholder}
                </Card>
            )}
        </Draggable>
    )
}

export default TaskItem
