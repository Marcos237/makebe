# 🎨 UI Guidelines - Sistema de Agendamento

## 🎯 Objetivo

Padronizar o visual da aplicação utilizando exclusivamente as variáveis definidas em `variables.css`, garantindo consistência, identidade visual e escalabilidade.

---

## 🌑 Tema

* Dark mode obrigatório
* Interface moderna e minimalista
* Não utilizar fundo branco

---

## 🎨 Background

Sempre utilizar:

```css
background: var(--bg-gradient);
```

---

## 🎨 Sistema de Cores (OBRIGATÓRIO)

### ✔️ Usar

* `var(--primary)`
* `var(--primary-strong)`
* `var(--success)`
* `var(--warning)`
* `var(--danger)`
* `var(--danger-light)`
* `var(--text-primary)`
* `var(--text-secondary)`

### ❌ Proibido

* usar HEX diretamente (`#fff`, `#000`, etc)
* criar novas cores fora das variáveis

---

## 🧊 Glass Effect

```css
background: var(--glass-bg);
border: 1px solid var(--glass-border);
```

---

## 🌫️ Sombras

```css
box-shadow: var(--shadow-soft);
```

Destaque:

```css
box-shadow: var(--shadow-strong);
```

---

## 🔲 Bordas

* pequeno: `var(--radius-small)`
* padrão: `var(--radius-medium)`
* grande: `var(--radius-large)`

---

## 🔘 Botões

```css
background: var(--gradient-primary);
background: var(--gradient-success);
background: var(--gradient-danger);
```

Hover:

```css
background: var(--gradient-*-hover);
```

---

## 🧩 Componentes

### Containers

* glass effect
* borda leve
* sombra suave
* padding confortável

### Cards

* glass effect
* hover com elevação

```css
transform: translateY(-5px);
transition: 0.3s;
```

---

### Inputs

* tema escuro
* erro:

```css
border-color: var(--danger-light);
```

---

## 📱 Responsividade

* mobile first
* layout em coluna no mobile
* botões full width

---

## 🚫 Regras obrigatórias

* não usar cores fora de `variables.css`
* não usar CSS global
* não usar inline styles
* manter consistência visual

---

# 🤖 BLOCO PARA IA (usar em prompts)

Use o seguinte padrão de UI:

Tema:

* dark mode
* visual moderno e minimalista
* não usar fundo branco

Cores:

* usar apenas variables.css
* proibido usar HEX ou cores fixas

Background:

* usar var(--bg-gradient)

Componentes:

* usar glass effect (var(--glass-bg), border, shadow)
* cards com hover (translateY + shadow)
* botões com gradiente

Inputs:

* tema escuro
* erro com var(--danger-light)

Regras:

* usar CSS Modules
* não usar CSS global
* não usar inline styles
* manter consistência visual

Responsividade:

* mobile first
* layout em coluna no mobile

Objetivo:

* UI moderna
* padrão SaaS premium
* foco em clareza e conversão
