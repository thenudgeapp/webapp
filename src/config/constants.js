import {HeadingNode, QuoteNode} from "@lexical/rich-text";
import {ListItemNode, ListNode} from "@lexical/list";
import {CodeHighlightNode, CodeNode} from "@lexical/code";
import {TableCellNode, TableNode, TableRowNode} from "@lexical/table";
import {AutoLinkNode, LinkNode} from "@lexical/link";
import {ParagraphNode} from "lexical";

export const USER_DATA = 'USER_DATA'
export const TOKEN_DATA = 'TOKEN_DATA'
export const TASKS_DATA = 'TASK_DATA'
export const TASKS_DATA_BACKLOG = 'TASKS_DATA_BACKLOG'
export const TASKS_DATA_TODO = 'TASKS_DATA_TODO'
export const TASKS_DATA_IN_PROGRESS = 'TASKS_DATA_IN_PROGRESS'
export const TASKS_DATA_DONE = 'TASKS_DATA_DONE'
export const EditorDefaultConfig = {
    nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        LinkNode,
        ParagraphNode,
    ],
}
