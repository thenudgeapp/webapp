import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import ToolbarPlugin from "../../../plugins/ToolbarPlugin";
import TreeViewPlugin from "../../../plugins/TreeViewPlugin";
import CodeHighlightPlugin from "../../../plugins/CodeHighlightPlugin";
import {AutoLinkPlugin} from "@lexical/react/LexicalAutoLinkPlugin";
import ListMaxIndentLevelPlugin from "../../../plugins/ListMaxIndentLevelPlugin";
import EditorTheme from "../../../theme/EditorTheme";
import './styles.css'
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin";


function Placeholder() {
  return <div className="editor-placeholder">Details about this task</div>;
}

const editorConfig = {
  // The editor theme
  theme: EditorTheme,
  // Handling of errors during update
  onError(error) {
    throw error;
  },
  // Any custom nodes go here
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
    LinkNode
  ]
};

export default function Editor(props) {
  return (
    <LexicalComposer initialConfig={{...editorConfig, editorState: props.editorState}}>
      <div className="editor-container">
        {props.enable && <ToolbarPlugin enable={props.enable}/>}
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <OnChangePlugin onChange={event => props.onChange(JSON.stringify(event.toJSON()))}/>
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
    </LexicalComposer>
  );
}
