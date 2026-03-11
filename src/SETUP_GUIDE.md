# Theme & CSS Setup Guide

## File Structure
```
src/
├── theme.js         ← Sirf yahan se colors change karo
├── App.css          ← Homepage ka CSS
├── Contact.css      ← Contact page ka CSS
├── Dashboard.css    ← Dashboard ka CSS
├── App.jsx          
├── Contact.jsx      
├── Dashboard.jsx    
└── main.jsx         
```

---

## App.jsx mein yeh changes karo

### 1. Upar se import add karo:
```js
import theme from './theme.js'
import './App.css'
```

### 2. Purana theme object HATAO:
```js
// YEH HATAO:
const theme = { bg: "...", ... }
```

### 3. CSS string (`const css = ...`) HATAO
Poori css variable wali string hatao — ab .css file kaam karegi.

### 4. `<style>{css}</style>` HATAO App() mein se

### 5. theme variables use hote rahenge same:
```js
// Yeh sab kaam karta rahega:
style={{ background: theme.bg }}
style={{ color: theme.text }}
```

---

## Contact.jsx mein yeh changes karo

### 1. Upar se import add karo:
```js
import theme from './theme.js'
import './Contact.css'
```

### 2. Purana `const t = { ... }` HATAO

### 3. `const css = ...` string HATAO

### 4. `<style>{css}</style>` HATAO

### 5. Poori file mein `t.` ko `theme.` se replace karo:
- `t.bg` → `theme.bg`
- `t.accent` → `theme.accent`
- `t.text` → `theme.text`
- etc.

---

## Dashboard.jsx mein yeh changes karo

### 1. Upar se import add karo:
```js
import './Dashboard.css'
```

### 2. `const css = ...` string HATAO

### 3. `<style>{css}</style>` HATAO

---

## Theme Change karna

Sirf `theme.js` kholo aur colors badlo:
```js
// Dark theme ke liye:
bg: "#0a0a0f",
bgCard: "#12121a",
text: "#f0ede8",
border: "rgba(255,255,255,0.07)",

// Light theme ke liye:
bg: "#ffffff",
bgCard: "#f5f5f7",
text: "#1a1a2e",
border: "rgba(0,0,0,0.08)",
```

Ek baar save karo — teenon pages update! 🎉