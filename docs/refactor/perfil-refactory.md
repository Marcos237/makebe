# 🎯 Aplicar padrão do Login no PerfilForm (SEM alterar estrutura)

## 📌 Regras obrigatórias

### ❌ NÃO pode:

* remover campos
* adicionar campos
* mudar tipo (`text`, `password`, etc.)
* alterar lógica (onChange, hooks, etc.)

### ✅ PODE:

* ajustar largura
* ajustar altura
* ajustar espaçamento
* aplicar estilos visuais (igual login)

---

## 🧱 Estrutura (wrapper padrão login)

```tsx
<div className={styles.container}>
  <div className={styles.banner}>
    <Banner />
  </div>

  <div className={styles.formPersistir}>
    <div className={styles.card}>

      <div className={styles.header}>
        <h2>Perfil</h2>
        <p>Gerencie seus dados</p>
      </div>

      <form className={styles.form}>
        {/* ⚠️ SEU FORM ORIGINAL AQUI (SEM ALTERAR LÓGICA) */}
      </form>

    </div>
  </div>
</div>
```

---

## 🎨 CSS – PerfilForm.module.css

### 🔥 Base (igual login)

```css
.container {
  min-height: 100vh;
  background: var(--bg-gradient);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
}

.formPersistir {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 16px;
}

.card {
  width: 100%;
  max-width: 420px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-large);
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  padding: 28px;
}
```

---

## 🔥 CAMPOS (PADRONIZAÇÃO VISUAL)

👉 Aqui é onde você iguala ao login

```css
.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

---

### 🔥 Inputs (forçar padrão login)

```css
.form input {
  height: 48px;
  border-radius: 10px;
}
```

---

### 🔥 Campo com ícone (igual senha login)

```css
.form .MuiInputBase-root {
  border-radius: 10px !important;
}
```

---

## 🔥 BOTÃO (igual login)

```css
.botaoArea {
  display: flex;
  width: 100%;
  margin-top: 20px;
}

.botaoArea button {
  width: 100%;
  padding: 14px 24px;
  border-radius: 999px;
  background: linear-gradient(160deg, #1f5f8f, #0b2f4f);
  color: white;
  font-weight: 600;
}
```

---

## 🌐 index.css (OBRIGATÓRIO)

👉 resolve Tooltip + largura

```css
[class*="botaoArea"] span {
  display: flex;
  width: 100%;
}

[class*="botaoArea"] button {
  width: 100%;
  flex: 1;
}
```

---

## 🧠 Ajustes visuais permitidos nos campos

Você pode:

### ✔ aumentar altura

```css
height: 48px;
```

### ✔ borda arredondada

```css
border-radius: 10px;
```

### ✔ espaçamento

```css
gap: 16px;
```

---

## ❌ NÃO fazer nos campos

* mudar `type`
* mudar props
* trocar componente
* remover validação
* mexer no onChange

---

## 💎 Resultado esperado

* Campos com **mesmo tamanho do login**
* Mesmo espaçamento vertical
* Mesmo estilo visual
* Botão idêntico
* Layout consistente

---

## 🚀 Regra final

👉 **Você estiliza, não reprograma**

👉 **Se mexeu na lógica → errado**
👉 **Se só mexeu no CSS → certo**

---
