# 🚀 Backend + Autenticação - Setup Guide

## O Que Foi Implementado

### ✅ Backend API (Express.js)
- `server/src/server.ts` - API Express com autenticação
- JWT Token-based authentication
- CRUD para propostas
- Mock database (em memória)

### ✅ Frontend Authentication
- `src/context/AuthContext.tsx` - State management
- `src/services/authService.ts` - Auth service
- `src/components/ui/Header.tsx` - Login header fixo

### ✅ Database Schema
- `database/schema.sql` - PostgreSQL schema
- Pronto para integração futura com Supabase

### ✅ Demo User
```
Email: perine@demo.com
Senha: admin
```

---

## 🚀 Como Rodar Tudo

### 1. Setup do Frontend

```bash
cd projetozzz
npm install
npm run dev
# Acessa em http://localhost:5174
```

### 2. Setup do Backend

```bash
cd server
npm install

# Copiar .env.example para .env
cp .env.example .env

# Rodar em desenvolvimento
npm run dev
# Rodando em http://localhost:3001
```

### 3. Configurar variáveis de ambiente

**Frontend** (`projetozzz/.env`):
```
VITE_API_URL=http://localhost:3001
```

**Backend** (`server/.env`):
```
PORT=3001
JWT_SECRET=sua-chave-secreta-aqui
```

### 4. Testar login

1. Abra http://localhost:5174
2. Clique no botão "Entrar" no topo
3. Use as credenciais demo:
   - Email: `perine@demo.com`
   - Senha: `admin`
4. Pronto! Você está logado

---

## 🗂️ Estrutura de Arquivos

```
Project-Magic-Proposal/
├── database/
│   └── schema.sql ..................... Schema PostgreSQL
│
├── server/
│   ├── src/
│   │   └── server.ts .................. API Express
│   ├── package.json ................... Dependencies
│   ├── tsconfig.json .................. TypeScript config
│   └── .env.example ................... Variables template
│
└── projetozzz/ (Frontend)
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.tsx ........ Auth state
    │   ├── services/
    │   │   └── authService.ts ........ Auth API
    │   ├── components/ui/
    │   │   └── Header.tsx ............ Login header
    │   └── App.tsx ................... App principal
    ├── package.json
    └── .env.example
```

---

## 📚 Como Funciona

### 1. Login Flow

```
User → Header (Login Form)
    ↓
API POST /api/auth/login (email + password)
    ↓
Backend: Valida password com bcrypt
    ↓
JWT Token + User Data
    ↓
localStorage: token + user
    ↓
AuthContext updated
    ↓
Header mostra: User Profile + Logout button
```

### 2. Requisições Autenticadas

```
Frontend → GET /api/proposals
    ↓
Header: Authorization: Bearer {token}
    ↓
Backend: Valida token
    ↓
Retorna propostas do usuário
    ↓
Salva em estado React
```

---

## 🔐 Endpoints Disponíveis

### Authentication
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout
- `POST /api/auth/validate` - Validar token
- `GET /api/auth/profile` - Obter perfil

### Proposals
- `GET /api/proposals` - Listar todas
- `POST /api/proposals` - Criar nova
- `GET /api/proposals/:id` - Obter uma
- `PUT /api/proposals/:id` - Atualizar
- `DELETE /api/proposals/:id` - Deletar

### Health
- `GET /api/health` - Status da API

---

## 🚨 Importante: Como Migrar para PostgreSQL

No futuro, quando tiver PostgreSQL pronto:

### 1. Criar banco no Supabase ou PostgreSQL local

```bash
# Se usar local
createdb travel_proposal
psql travel_proposal < database/schema.sql
```

### 2. Instalar dependência de DB

```bash
cd server
npm install pg
```

### 3. Criar arquivo de conexão

```typescript
// server/src/db.ts
import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
```

### 4. Substituir mock database por queries SQL

```typescript
// Em server/src/server.ts
// Trocar: users.find(...)
// Por:    await pool.query('SELECT * FROM users WHERE email = $1', [email])
```

---

## 🔧 Desenvolvimento

### Adicionar novo endpoint

```typescript
// server/src/server.ts
app.post('/api/seu-endpoint', (req: Request, res: Response) => {
  try {
    // Sua lógica aqui
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Mensagem de erro'
    });
  }
});
```

### Usar endpoint no frontend

```typescript
// src/services/authService.ts
export async function seuMetodo() {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/seu-endpoint`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}
```

---

## 🐛 Troubleshooting

### Erro: "CORS error"
- Certifique-se que backend está rodando em `http://localhost:3001`
- Verifique `VITE_API_URL` no frontend

### Erro: "Token inválido"
- Faça logout e login novamente
- Limpe localStorage (F12 → Application → Clear All)

### Erro: "Conexão recusada"
- Verifique se ambos servidores estão rodando
- Frontend: `npm run dev` (porta 5174)
- Backend: `npm run dev` (porta 3001)

### Erro ao login
- Verifique credenciais demo
- Email: `perine@demo.com`
- Senha: `admin`

---

## 📊 Stack de Tecnologia

### Frontend
- React 19.2
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion

### Backend
- Node.js/Express
- TypeScript
- JWT (JSON Web Tokens)
- bcrypt (Password hashing)

### Database (Future)
- PostgreSQL
- Supabase

---

## 🎯 Próximos Passos

1. **Agora**: Testar login com credenciais demo
2. **Próxima semana**: Integrar PostgreSQL real
3. **Semana 2**: Adicionar CRUD de agências
4. **Semana 3**: Sistema de assinatura (Stripe)

---

## 📝 Notas Importantes

### Segurança
- ⚠️ `JWT_SECRET` deve ser mudado em produção
- ⚠️ Senhas são hasheadas com bcrypt
- ⚠️ Use HTTPS em produção
- ⚠️ Nunca comita credenciais em git

### Performance
- Tokens expiram em 7 dias
- Mock database está em memória (perdido ao reiniciar)
- PostgreSQL real será muito mais rápido

### Desenvolvimento
- Hot reload está habilitado
- Erro stack traces no console
- Demo data é resetada ao reiniciar

---

**Tudo pronto! Comece pelo login! 🚀**
