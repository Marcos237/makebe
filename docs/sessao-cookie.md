# Sessão de Consentimento de Cookies

## Objetivo

Implementar um banner de consentimento de cookies exibido no rodapé da aplicação React.

O banner deve informar ao usuário que o site utiliza cookies para melhorar a experiência de navegação, coletar métricas de acesso e personalizar conteúdos.

## Requisitos

### Exibição

* O banner deve aparecer fixado na parte inferior da tela.
* Deve ocupar toda a largura da página.
* Deve permanecer visível até que o usuário aceite os cookies.
* Deve possuir um botão "Aceitar".

### Persistência

Não será utilizado banco de dados.

O aceite deverá ser armazenado no navegador utilizando LocalStorage.

Chave:

```text
cookieConsent
```

Valor:

```json
{
  "accepted": true,
  "acceptedAt": "2026-06-29T15:00:00Z"
}
```

### Comportamento

Ao carregar a aplicação:

1. Verificar se existe a chave `cookieConsent`.
2. Caso não exista, exibir o banner.
3. Caso exista, não exibir o banner.

Ao clicar em "Aceitar":

1. Salvar o consentimento no LocalStorage.
2. Fechar o banner.
3. Permitir o carregamento de ferramentas de analytics.

### Interface

Texto sugerido:

"Utilizamos cookies para melhorar sua experiência de navegação, analisar o tráfego do site e personalizar conteúdos. Ao continuar navegando você concorda com nossa Política de Privacidade."

Botões:

* Aceitar

### Tecnologias

* React
* TypeScript
* Material UI (MUI)

### Estrutura sugerida

```text
src/
 ├── components/
 │   └── CookieConsent/
 │       ├── CookieConsent.tsx
 │       └── CookieConsent.styles.ts
```

### Critérios de aceite

* Banner aparece apenas na primeira visita.
* Banner fica fixado no rodapé.
* Aceite permanece após atualizar a página.
* Não utiliza banco de dados.
* Compatível com desktop e mobile.
* Código em React + TypeScript + MUI.

```
```
