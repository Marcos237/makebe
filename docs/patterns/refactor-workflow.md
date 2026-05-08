# 🔄 Refactor Workflow (Spec-Driven)

## 🎯 Objetivo
Padronizar a refatoração do projeto frontend de forma incremental, segura e consistente.

---

## 📦 Estratégia Geral

- Refatorar **um módulo por vez**
- Nunca refatorar o projeto inteiro de uma vez
- Sempre validar antes de avançar

---

## 🪜 Etapas obrigatórias (para cada módulo)

### 1. Identificação
Localizar todos os arquivos do módulo em:
- containers/
- components/
- services/
- utils (se aplicável)

---

### 2. Criação da estrutura

Criar:

features/nome-modulo/
  components/
  hooks/
  services/
  types.ts
  index.ts

---

### 3. Movimentação de arquivos

- Mover arquivos de UI → components/
- Mover lógica → hooks/
- Mover chamadas API → services/
- Criar types.ts se necessário

---

### 4. Padronização

- Renomear arquivos para PascalCase (componentes)
- Criar hooks com prefixo `use`
- Aplicar CSS Modules (.module.css)
- Remover CSS global relacionado

---

### 5. Ajustes técnicos

- Corrigir imports
- Remover caminhos antigos
- Atualizar referências quebradas

---

### 6. Validação

Executar:

npx tsc --noEmit

Corrigir todos os erros antes de continuar

---

### 7. Limpeza

- Remover pasta antiga (ex: containers/nome-modulo)
- Remover arquivos duplicados

---

## 🔁 Fluxo contínuo

Após finalizar um módulo:

1. Validar funcionamento
2. Commitar mudanças
3. Prosseguir para o próximo módulo

---

## ⚠️ Regras importantes

- Não alterar comportamento existente
- Não criar código desnecessário
- Não mover múltiplos módulos ao mesmo tempo
- Não ignorar erros de TypeScript
- Não duplicar lógica

---

## 🤖 Instruções para IA (Copilot / Codex)

Ao executar refatoração:

- Trabalhar **um módulo por vez**
- Seguir todas as etapas acima
- Mostrar mudanças antes de aplicar (quando possível)
- Não assumir contexto inexistente
- Priorizar clareza e simplicidade