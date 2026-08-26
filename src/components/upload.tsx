import React, { useEffect, useId, useRef, useState } from 'react';
import { UploadItens } from '../Interfaces/TextBox/UploadItens';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import '../assets/styles/shared/upload.css';
import Icone from './icone';
import { FaTrash } from 'react-icons/fa';

const Upload: React.FC<UploadItens> = ({ uploadProps, onUpload }) => {

    const [nomeImagem, setNomeImagem] = useState<string>('');
    const [urlImagem, setUrlImagem] = useState<string>('');
    const [tituloImagem, setTituloImagem] = useState<string>('');
    const [id, setId] = useState<string>('');
    const [tituloSessao, setTituloSessao] = useState<string>('');
    const [name, setName] = useState<string>('');

    const inputRef = useRef<HTMLInputElement | null>(null);

    const generatedId = useId();

    const inputId = id || `upload-${generatedId}`;

    useEffect(() => {

        if (uploadProps) {

            setNomeImagem(uploadProps?.nomeImagem ?? '');

            setUrlImagem(uploadProps?.urlImagem ?? '');

            setTituloImagem(uploadProps?.tituloImagem ?? '');

            setId(uploadProps?.id ?? '');

            setTituloSessao(uploadProps?.tituloSessao ?? '');

            setName(uploadProps?.name ?? '');
        }

    }, [uploadProps]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (uploadProps?.readonly) {
            return;
        }

        const file = e.target.files?.[0];

        if (file) {

            const reader = new FileReader();

            reader.onloadend = () => {

                const base64String = reader.result as string;

                if (onUpload) {

                    onUpload(
                        base64String ?? '',
                        file.name ?? '',
                        tituloImagem,
                        inputId,
                        tituloSessao ?? '',
                        name ?? ''
                    );
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const handleIconClick = () => {
        if (uploadProps?.readonly) {
            return;
        }

        setNomeImagem('');

        setUrlImagem('');

        if (inputRef.current) {

            inputRef.current.value = '';
        }

        if (onUpload) {

            onUpload(
                "",
                "",
                tituloImagem,
                inputId,
                tituloSessao,
                name ?? ''
            );
        }
    };

    return (
        <>
            <div className={`erroSession_${inputId}`}></div>

            <div className='upload-container'>

                <Stack
                    direction="column"
                    spacing={1}
                    className='stack'
                >

                    <label htmlFor={inputId}>
                        <Avatar
                            alt={nomeImagem ?? undefined}
                            src={urlImagem ?? undefined}
                            className='avatar'
                            sx={{ cursor: uploadProps?.readonly ? 'default' : 'pointer' }}
                        />
                    </label>

                    <div className='upload-info'>

                        <div
                            className='icone-remove'
                            onClick={handleIconClick}
                            role="button"
                            tabIndex={uploadProps?.readonly ? -1 : 0}
                            onKeyDown={(e) => {
                                if (uploadProps?.readonly) {
                                    return;
                                }

                                if (e.key === 'Enter' || e.key === ' ') {

                                    e.preventDefault();

                                    handleIconClick();
                                }
                            }}
                        >
                            <Icone
                                iconeProps={{
                                    icone: <FaTrash />,
                                    dialogo: "Remover"
                                }}
                            />
                        </div>

                        <span className='tituloUpload'>
                            {tituloImagem}
                        </span>

                    </div>

                </Stack>

                <input
                    id={inputId}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    name={name}
                    ref={inputRef}
                    disabled={uploadProps?.readonly}
                />

            </div>
        </>
    );
};

export default Upload;
