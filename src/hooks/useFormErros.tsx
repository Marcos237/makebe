import { ErroItem } from "../Interfaces/shared/erroItem";
import { useEffect } from 'react';

export function useFormErros(erros: ErroItem[], trigger: number) {
    useEffect(() => {
        if (!erros || erros.length === 0) return;

        document.querySelectorAll('.input-error').forEach(el =>
            el.classList.remove('input-error', 'fade-out')
        );

        document.querySelectorAll('.label-error').forEach(el =>
            el.classList.remove('label-error', 'fade-out')
        );

        document.querySelectorAll('.error-message').forEach(el => el.remove());

        const inputs = document.querySelectorAll<HTMLElement>(
            'input, textarea, select, button, span, [role="button"], [role="combobox"], [name], [data-name]'
        );

        const marcarCampoComErro = (input: HTMLElement) => {
            const fieldRoot = input.closest(
                '.MuiOutlinedInput-root, .MuiInputBase-root, .MuiFormControl-root, .switch-container, .switch'
            );

            if (fieldRoot) {
                fieldRoot.classList.add('input-error');
            }

            const inputId = input.getAttribute('id');
            if (inputId) {
                const label = document.querySelector(`label[for="${inputId}"]`);
                if (label) {
                    label.classList.add('label-error');
                }
            }

            const parentLabel = input.closest('label');
            if (parentLabel) {
                parentLabel.classList.add('label-error');
            }

            const combo = fieldRoot?.querySelector('[role="combobox"]');
            if (combo) {
                combo.classList.add('label-error');
            }
        };

        erros.forEach((erro) => {
            const erroKeyNormalizado = (erro.Key ?? '').trim().toLowerCase();

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
                const nome = input.getAttribute('name') || input.dataset.name || '';
                if (nome.trim().toLowerCase() === erroKeyNormalizado) {
                    marcarCampoComErro(input);

                    const erroSession = `.erroSession_${nome}`;
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
                    const isCampoImagem = input instanceof HTMLInputElement && input.type === 'file';

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
            document.querySelectorAll('.input-error').forEach(el =>
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
