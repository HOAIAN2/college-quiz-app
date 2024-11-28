import styles from './styles/TextEditor.module.css';

import Image from '@tiptap/extension-image';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useRef } from 'react';
import { FaBold, FaImage, FaItalic, FaRedo, FaUndo } from 'react-icons/fa';
import { toast } from 'sonner';
import useLanguage from '~hooks/useLanguage';
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
    const imageInputRef = useRef<HTMLInputElement>(null);
    const language = useLanguage('component.text_editor');
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                allowBase64: true,
                inline: true,
                // HTMLAttributes: { class: styles.image }
            })
        ],
        content: defaultContent || null,
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getHTML());
            }
        },
        editable: Boolean(!disabled),
        shouldRerenderOnTransaction: Boolean(!disabled),
    });
    const loadImage = (e: React.FormEvent<HTMLInputElement>) => {
        const maxFileSize = String(__TEXT_EDITOR_MAX_FILE_SIZE__ / (1024 * 1024));
        const input = e.currentTarget;
        if (!input.files) return;
        const image = input.files[0];
        if (image.size > __TEXT_EDITOR_MAX_FILE_SIZE__) {
            toast.error(language?.maxFileSizeError.replace('@size', maxFileSize));
            return;
        }
        const fileReader = new FileReader();
        fileReader.addEventListener('load', (e) => {
            if (e.target?.result) {
                if (editor) {
                    editor.chain().focus().setImage({ src: e.target?.result as string }).run();
                }
            }
        });
        fileReader.readAsDataURL(image);
    };
    if (!editor) {
        return null;
    }
    return (
        <div className={styles.editorContainer}>
            <input onChange={loadImage} ref={imageInputRef} hidden type="file" accept="image/png, image/jpeg" />
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
                <div
                    className={styles.toolbarButton}
                    onClick={() => { imageInputRef.current?.click(); }}
                >
                    <FaImage />
                </div>
            </div>
            <EditorContent editor={editor} className={styles.editorContent} />
        </div>
    );
};
