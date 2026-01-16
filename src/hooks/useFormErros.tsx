import { ErroItem } from "../Interfaces/shared/erroItem";
import { useEffect } from 'react';

export function useFormErros(erros: ErroItem[], trigger: number) {
    useEffect(() => {
        if (!erros || erros.length === 0) return;

        document.querySelectorAll('.MuiOutlinedInput-root.input-error').forEach(el =>
            el.classList.remove('input-error', 'fade-out')
        );

        document.querySelectorAll('.label-error').forEach(el =>
            el.classList.remove('label-error', 'fade-out')
        );

        document.querySelectorAll('.error-message').forEach(el => el.remove());

        const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
            'input, textarea, select, span, [role="button"], [role="combobox"]'
        );

        erros.forEach((erro) => {
            if (erro.Key === 'session') {
                const erroSession = `.erroSession_${erro.Key}`
                const errorSessionDiv = document.querySelector(erroSession);

                if (errorSessionDiv && !errorSessionDiv.querySelector('.error-message')) {
                    const div = document.createElement('div');
                    div.className = 'error-message';
                    div.textContent = `* ${erro.Mensagem}`;
                    errorSessionDiv.appendChild(div);
                }
                return;
            }
            inputs.forEach(input => {
                let nome = input.name || input.dataset.name;
                if (nome === erro.Key) {
                    const parent = input.closest('.MuiOutlinedInput-root');
                    if (parent) parent.classList.add('input-error');

                    const label = document.querySelector(`label[for="${input.id}"]`);
                    if (label) label.classList.add('label-error');

                    const combo = parent?.querySelector('[role="combobox"]');

                    if (combo) {
                        combo.classList.add('label-error');
                        const label = parent?.previousElementSibling;
                        if (label?.tagName.toLowerCase() === 'label') {
                            label.classList.add('label-error');
                        }
                    }

                    const erroSession = `.erroSession_${erro.Key}`;
                    const errorSessionDiv = document.querySelector(erroSession);

                    if (errorSessionDiv) {

                        const div = document.createElement('div');
                        div.className = 'error-message';
                        div.textContent = `* ${erro.Mensagem}`;
                        const mensagens = Array.from(errorSessionDiv.querySelectorAll('.error-message')).map(m => m.textContent?.trim());
                        if (!mensagens.includes(div.textContent.trim())) {
                            errorSessionDiv.appendChild(div);
                        }
                    }
                }
                if (nome && nome.includes("Imagem") && erro.Key === nome) {
                    const isCampoImagem = input.type === 'file';

                    if (isCampoImagem) {
                        const label = document.querySelector(`label[for="${nome}"]`);
                        const avatar = label?.querySelector('.MuiAvatar-root');
                        const avatarImg = label?.querySelector('img') as HTMLImageElement;

                        const temImagemValida =
                            avatarImg &&
                            avatarImg.src &&
                            avatarImg.src.startsWith('data:image/') &&
                            !avatarImg.src.includes('svg+xml');

                        if (!temImagemValida && avatar) {
                            avatar.classList.add('input-error');
                        }
                    }
                }
            });

        });


        const timeout = setTimeout(() => {
            document.querySelectorAll('.MuiOutlinedInput-root.input-error').forEach(el =>
                el.classList.add('fade-out')
            );
            document.querySelectorAll('.label-error').forEach(el =>
                el.classList.add('fade-out')
            );
            document.querySelectorAll('.error-message').forEach(el =>
                el.classList.add('fade-out')
            );

            const removeTimeout = setTimeout(() => {

                document.querySelectorAll('.input-error').forEach(el =>

                    el.classList.remove('input-error', 'fade-out')
                );
                document.querySelectorAll('.label-error').forEach(el =>
                    el.classList.remove('label-error', 'fade-out')
                );
                document.querySelectorAll('.error-message').forEach(el => el.remove());
            }, 1000);

            return () => clearTimeout(removeTimeout);
        }, 2000);

        return () => clearTimeout(timeout);
    }, [erros, trigger]);
}
