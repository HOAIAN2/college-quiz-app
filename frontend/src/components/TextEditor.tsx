import styles from './styles/TextEditor.module.css';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { FaBold, FaItalic, FaRedo, FaUndo } from 'react-icons/fa';
import css from '~utils/css';

type TextEditorProps = {
    name?: string;
    defaultContent?: string;
    disabled?: boolean;
    onChange?: (htmlString: string) => void;
};

export default function TextEditor({
    name,
    defaultContent,
    disabled,
    onChange
}: TextEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: defaultContent || null,
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getHTML());
            }
        },
        editable: Boolean(!disabled),
        shouldRerenderOnTransaction: Boolean(!disabled),
    });
    if (!editor) {
        return null;
    }
    return (
        <div className={styles.editorContainer}>
            <div className={styles.editorToolbar}>
                {
                    name ?
                        <textarea
                            readOnly
                            hidden
                            name={name}
                            value={editor.getText() ? editor.getHTML() : ''}>
                        </textarea>
                        : null
                }
                <div
                    className={
                        css(
                            styles.toolbarButton,
                            editor.isActive('bold') ? styles.active : ''
                        )
                    }
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <FaBold />
                </div>
                <div
                    className={
                        css(
                            styles.toolbarButton,
                            editor.isActive('italic') ? styles.active : ''
                        )
                    }
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <FaItalic />
                </div>
                <div
                    className={styles.toolbarButton}
                    onClick={() => editor.chain().focus().undo().run()}
                >
                    <FaUndo />
                </div>
                <div
                    className={styles.toolbarButton}
                    onClick={() => editor.chain().focus().redo().run()}
                >
                    <FaRedo />
                </div>
            </div>
            <EditorContent editor={editor} className={styles.editorContent} />
        </div>
    );
};
