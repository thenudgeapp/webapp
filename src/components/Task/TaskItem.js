import {Card, CardActions, CardContent, CardHeader, IconButton, Typography} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {Draggable} from "@hello-pangea/dnd";
import dayjs from "dayjs";
import MDBox from "../Shared/MDBox";

const TaskItem = (props) => {

    const days = (end) => {
        const date1 = dayjs.unix(end );
        const date2 = dayjs();

        let hours = date1.diff(date2, 'hours');
        let days = Math.floor(hours / 24);

        const overdue = days < 0 ? 'Overdue by ' : 'Due in '

        days = Math.abs(days)

        return `${overdue} ${days === 1 ? `${days} day` : `${days} days`}`
    }

    return (
        <Draggable key={props.task.id} draggableId={`drag-${props.task.id}`} index={props.index + 2}>
            {(provided, snapshot) => (
                <Card sx={{marginBottom: '0.5rem'}} elevation={0} ref={provided.innerRef} {...provided.draggableProps}
                      {...provided.dragHandleProps}>
                    <CardHeader
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                        }
                        title={<Typography marginBottom={'0'} variant="h6" gutterBottom>{props.task.title}</Typography>}
                    />
                    <CardContent sx={{padding: '16px'}}>
                        <Typography variant="body2" color="text.secondary">
                            {props.task.description}
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
