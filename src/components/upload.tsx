import React, { useEffect, useState } from 'react';
import { UploadItens } from '../Interfaces/TextBox/UploadItens';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import '../assets/styles/shared/upload.css'
import Icone from './icone';
import { FaTrash } from 'react-icons/fa';

const Upload: React.FC<UploadItens> = ({ uploadProps, onUpload }) => {
    const [nomeImagem, setNomeImagem] = useState<string>('');
    const [urlImagem, setUrlImagem] = useState<string>('');
    const [tituloImagem, setTituloImagem] = useState<string>('');
    const [id , setId] = useState<string>('');
    const [tituloSessao , setTituloSessao] = useState<string>('');


    
    useEffect(() => {
        if (uploadProps) {

            setNomeImagem(uploadProps?.nomeImagem ?? '');
            setUrlImagem(uploadProps?.urlImagem ?? '');
            setTituloImagem(uploadProps.tituloImagem ?? '')
            setId(uploadProps.id ?? '')
            setTituloSessao(uploadProps?.tituloSessao ?? '');   
        }
    }, [uploadProps]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                if (onUpload) {
                    onUpload(base64String ?? '', file.name ?? '', tituloImagem, id ?? '', tituloSessao ?? '');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleIconClick = () => {
        setNomeImagem('');
        setUrlImagem('');
        if (onUpload) {
            onUpload("", "", tituloImagem, id, tituloSessao);
        }
    };

    return <>
        <Stack direction="row" spacing={2} className='stack'>
            <label htmlFor={id}>
                <Avatar alt={nomeImagem ?? undefined} src={urlImagem ?? undefined} className='avatar' />
            </label>
            <div className='icone-remove' onClick={handleIconClick}>
                <Icone iconeProps={{ icone: <FaTrash />, dialogo: "Remover" }} />
            </div>
            <input
                id={id}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
            />
        </Stack>
        <span className='tituloUpload'>{tituloImagem}</span>
    </>
}

export default Upload