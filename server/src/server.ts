import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (imagens, etc)
app.use('/public', express.static(path.join(__dirname, '../public')));

// ========================================
// Mock Database (In-memory for now)
// Will be replaced with PostgreSQL
// ========================================

interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  avatar_url?: string;
  role: 'admin' | 'consultant' | 'viewer';
  agency_id: string;
  is_active: boolean;
}

interface Agency {
  id: string;
  name: string;
  slug: string;
  theme_primary: string;
  theme_accent: string;
}

interface Proposal {
  id: string;
  agency_id: string;
  creator_id: string;
  destination_name: string;
  check_in: string;
  check_out: string;
  travelers_count: number;
  total_price: number;
  data: any;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

// Mock data
const agencies: Agency[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Demo Agency',
    slug: 'demo-agency',
    theme_primary: '#0052CC',
    theme_accent: '#FFC107',
  },
];

const users: User[] = [
  {
    id: '650e8400-e29b-41d4-a716-446655440000',
    email: 'perine@demo.com',
    password_hash: 'admin', // Senha simples para demo
    name: 'Perine',
    role: 'admin',
    agency_id: '550e8400-e29b-41d4-a716-446655440000',
    is_active: true,
  },
];

const proposals: Proposal[] = [];
const sessions: Map<string, any> = new Map();

// ========================================
// AUTH ROUTES
// ========================================

// Login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email e senha são obrigatórios',
      });
    }

    // Find user
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email ou senha incorretos',
      });
    }

    // Verify password - usar comparação simples para demo
    const passwordMatch = password === user.password_hash;

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Email ou senha incorretos',
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        error: 'Usuário inativo',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Store session
    sessions.set(token, {
      userId: user.id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Return user without password
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword,
      token,
      message: 'Login realizado com sucesso',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao fazer login',
    });
  }
});

// Validate Token
app.post('/api/auth/validate', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token não fornecido',
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      // Check if session exists
      if (!sessions.has(token)) {
        return res.status(401).json({
          success: false,
          error: 'Sessão inválida',
        });
      }

      res.json({
        success: true,
        user: decoded,
      });
    } catch (jwtError) {
      res.status(401).json({
        success: false,
        error: 'Token inválido ou expirado',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao validar token',
    });
  }
});

// Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      sessions.delete(token);
    }

    res.json({
      success: true,
      message: 'Logout realizado com sucesso',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao fazer logout',
    });
  }
});

// Get Profile
app.get('/api/auth/profile', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Não autenticado',
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = users.find(u => u.id === decoded.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado',
        });
      }

      const { password_hash, ...userWithoutPassword } = user;

      res.json({
        success: true,
        user: userWithoutPassword,
      });
    } catch (jwtError) {
      res.status(401).json({
        success: false,
        error: 'Token inválido',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao obter perfil',
    });
  }
});

// ========================================
// PROPOSAL ROUTES
// ========================================

// Get all proposals for user's agency
app.get('/api/proposals', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Não autenticado',
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = users.find(u => u.id === decoded.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado',
        });
      }

      // Filter proposals by user's agency
      const userProposals = proposals.filter(p => p.agency_id === user.agency_id);

      res.json({
        success: true,
        proposals: userProposals,
        count: userProposals.length,
      });
    } catch (jwtError) {
      res.status(401).json({
        success: false,
        error: 'Token inválido',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar propostas',
    });
  }
});

// Create proposal
app.post('/api/proposals', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Não autenticado',
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = users.find(u => u.id === decoded.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado',
        });
      }

      const { destination_name, check_in, check_out, travelers_count, total_price, data } = req.body;

      const proposal: Proposal = {
        id: uuidv4(),
        agency_id: user.agency_id,
        creator_id: user.id,
        destination_name,
        check_in,
        check_out,
        travelers_count,
        total_price,
        data,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      proposals.push(proposal);

      res.status(201).json({
        success: true,
        proposal,
        message: 'Proposta criada com sucesso',
      });
    } catch (jwtError) {
      res.status(401).json({
        success: false,
        error: 'Token inválido',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao criar proposta',
    });
  }
});

// Get single proposal
app.get('/api/proposals/:id', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Não autenticado',
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = users.find(u => u.id === decoded.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado',
        });
      }

      const proposal = proposals.find(
        p => p.id === req.params.id && p.agency_id === user.agency_id
      );

      if (!proposal) {
        return res.status(404).json({
          success: false,
          error: 'Proposta não encontrada',
        });
      }

      res.json({
        success: true,
        proposal,
      });
    } catch (jwtError) {
      res.status(401).json({
        success: false,
        error: 'Token inválido',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar proposta',
    });
  }
});

// Update proposal
app.put('/api/proposals/:id', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Não autenticado',
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = users.find(u => u.id === decoded.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado',
        });
      }

      const proposal = proposals.find(
        p => p.id === req.params.id && p.agency_id === user.agency_id
      );

      if (!proposal) {
        return res.status(404).json({
          success: false,
          error: 'Proposta não encontrada',
        });
      }

      // Update fields
      Object.assign(proposal, req.body, {
        updated_at: new Date().toISOString(),
      });

      res.json({
        success: true,
        proposal,
        message: 'Proposta atualizada com sucesso',
      });
    } catch (jwtError) {
      res.status(401).json({
        success: false,
        error: 'Token inválido',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar proposta',
    });
  }
});

// Delete proposal
app.delete('/api/proposals/:id', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Não autenticado',
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = users.find(u => u.id === decoded.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado',
        });
      }

      const index = proposals.findIndex(
        p => p.id === req.params.id && p.agency_id === user.agency_id
      );

      if (index === -1) {
        return res.status(404).json({
          success: false,
          error: 'Proposta não encontrada',
        });
      }

      proposals.splice(index, 1);

      res.json({
        success: true,
        message: 'Proposta deletada com sucesso',
      });
    } catch (jwtError) {
      res.status(401).json({
        success: false,
        error: 'Token inválido',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar proposta',
    });
  }
});

// ========================================
// Health Check
// ========================================

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'API rodando com sucesso',
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`📝 API disponível em http://localhost:${PORT}/api`);
  console.log(`\n🧪 Demo Credentials:`);
  console.log(`   Email: perine@demo.com`);
  console.log(`   Senha: admin\n`);
});
