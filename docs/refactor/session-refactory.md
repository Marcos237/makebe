# 🎯 Padronização visual global das telas seguindo perfil-refactory.md

## 📌 Objetivo

Padronizar visualmente TODAS as telas do sistema seguindo obrigatoriamente:

* perfil-refactory.md
* LoginForm.tsx
* Login.module.css

⚠️ Todas as telas devem manter exatamente o mesmo padrão visual do Perfil/Login.

---

# 📚 REGRA PRINCIPAL

⚠️ TODAS as alterações devem seguir as regras definidas no arquivo:

```txt
perfil-refactory.md
```

Usar esse arquivo como FONTE PRINCIPAL DE VERDADE visual.

---

# ❌ NÃO PODE

* alterar regra de negócio
* alterar lógica
* alterar hooks
* alterar useEffect
* alterar chamadas API
* alterar services
* alterar validações
* alterar onChange
* alterar fluxo
* remover campos
* adicionar campos
* trocar componentes
* alterar comportamento funcional
* alterar regras da tabela
* alterar paginação
* alterar filtros

---

# ✅ PODE

* ajustar CSS
* ajustar layout
* ajustar alinhamento
* ajustar largura
* ajustar altura
* ajustar responsividade
* ajustar grid
* ajustar tipografia
* ajustar cores
* ajustar botões
* ajustar espaçamento
* aplicar padrão visual do perfil-refactory.md

---

# 🎨 PADRÃO VISUAL OBRIGATÓRIO

Todas as telas devem seguir:

✅ padrão do Login
✅ padrão do Perfil
✅ padrão glassmorphism
✅ mesmas bordas
✅ mesmos espaçamentos
✅ mesmas alturas de campos
✅ mesmos paddings
✅ mesma responsividade

---

# 🌈 PADRÃO DE CORES DOS BOTÕES

## 🔵 Primary / Filtros / Busca / Paginação

Usar azul padrão do sistema.

Aplicar em:

* filtros
* pesquisar
* buscar
* paginação
* navegação
* ações secundárias

---

## 🟠 Visualizar / Editar / Abrir formulário

Usar:

```css
background: #F54927;
```

Aplicar em:

* visualizar
* editar
* abrir detalhes
* acessar formulário

---

## 🟢 Salvar / Confirmar

⚠️ Usar EXATAMENTE o mesmo verde água do Login.

Aplicar em:

* salvar
* cadastrar
* atualizar
* confirmar
* persistir

---

## 🟣 Limpar / Resetar

Usar magenta padrão do sistema.

Aplicar em:

* limpar filtros
* limpar formulário
* resetar busca

---

## 🔴 Deletar / Excluir

Usar magenta/vermelho forte.

Aplicar em:

* deletar
* remover
* excluir

---

# 🧱 PADRÃO DE FORMULÁRIOS

## Inputs

Usar EXATAMENTE:

```css
height: 48px;
border-radius: 10px;
```

⚠️ NÃO aumentar inputs.

---

## Espaçamento

```css
gap: 16px;
```

---

## Cards

Seguir padrão do perfil-refactory.md:

```css
background: var(--glass-bg);
border: 1px solid var(--glass-border);
backdrop-filter: blur(12px);
border-radius: var(--radius-large);
```

---

# 📱 RESPONSIVIDADE

⚠️ Obrigatório manter:

✅ layout limpo
✅ sem overflow horizontal
✅ botões alinhados
✅ inputs proporcionais
✅ tabelas utilizáveis
✅ mesma hierarquia visual desktop/mobile

---

# 🎯 TABELAS

As tabelas devem:

✅ manter visual dark
✅ manter alinhamento
✅ manter espaçamento consistente
✅ manter ações alinhadas à direita
✅ manter responsividade
✅ manter botões proporcionais

---

# 🎯 BOTÕES

Todos os botões devem:

✅ manter altura consistente
✅ manter alinhamento vertical
✅ manter border-radius consistente
✅ manter padding consistente
✅ manter ícones centralizados

---

# 🚨 REGRA MAIS IMPORTANTE

⚠️ ESTILIZAR APENAS.

NÃO alterar:

* lógica
* regras
* hooks
* comportamento
* fluxo
* services

Se alterar comportamento funcional → ERRADO.

---

# 💎 Resultado esperado

✅ Sistema inteiro consistente visualmente
✅ Mesmo padrão do Login/Perfil
✅ Seguindo perfil-refactory.md
✅ Botões padronizados
✅ Responsividade correta
✅ Layout moderno
✅ Visual limpo
✅ Sem alterar regra de negócio
✅ Sem quebrar funcionalidades
