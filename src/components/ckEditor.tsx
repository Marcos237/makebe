import React, { useRef, useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import Quill from 'quill';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { EditorTextoItem } from '../Interfaces/shared/editorTextoItem';
import '../assets/styles/shared/editorTexto.css';
import 'react-quill/dist/quill.snow.css';


const Font = Quill.import('formats/font') as any;
Font.whitelist = [
    'sans-serif', 
    'serif', 
    'monospace', 
];


Quill.register(Font, true);

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const EditorTexto: React.FC<{ editorItem: EditorTextoItem }> = ({ editorItem }) => {
    const [resizeCount, setResizeCount] = useState(0);
    const editorRef = useRef(null);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            if (resizeCount < 1) {
                setResizeCount(prevCount => prevCount + 1);
            }
        });

        const editorElement = editorRef.current;

        if (editorElement) {
            resizeObserver.observe(editorElement);
        }

        return () => {
            if (editorElement) {
                resizeObserver.unobserve(editorElement);
            }
        };
    }, [resizeCount]);

    return (
        <ThemeProvider theme={darkTheme}>
            <label className='editor-text'>{editorItem.nome}</label>
            <div ref={editorRef} className='editor'>
                <ReactQuill
                    value={editorItem.value ?? ''}
                    onChange={(value) => editorItem.onChange(value)}
                    modules={{
                        toolbar: [
                            [{ 'header': '1' }, { 'header': '2' }, { 'font': Font.whitelist }],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            ['bold', 'italic', 'underline'],
                            ['link'],
                            [{ 'align': [] }],
                            ['blockquote'],
                            [{ 'direction': 'rtl' }],
                            ['clean'],
                        ],
                    }}
                    placeholder={editorItem.placeholder ?? ''}
                />
            </div>
        </ThemeProvider>
    );    
};

export default EditorTexto;
