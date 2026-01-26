"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var dotenv_1 = require("dotenv");
var jsonwebtoken_1 = require("jsonwebtoken");
var uuid_1 = require("uuid");
var path_1 = require("path");
dotenv_1.default.config();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3001;
var JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Servir arquivos estáticos (imagens, etc)
app.use('/public', express_1.default.static(path_1.default.join(__dirname, '../public')));
// Mock data
var agencies = [
    {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Demo Agency',
        slug: 'demo-agency',
        theme_primary: '#0052CC',
        theme_accent: '#FFC107',
    },
];
var users = [
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
var proposals = [];
var sessions = new Map();
// ========================================
// AUTH ROUTES
// ========================================
// Login
app.post('/api/auth/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email_1, password, user, passwordMatch, token, password_hash, userWithoutPassword;
    return __generator(this, function (_b) {
        try {
            _a = req.body, email_1 = _a.email, password = _a.password;
            if (!email_1 || !password) {
                return [2 /*return*/, res.status(400).json({
                        success: false,
                        error: 'Email e senha são obrigatórios',
                    })];
            }
            user = users.find(function (u) { return u.email === email_1; });
            if (!user) {
                return [2 /*return*/, res.status(401).json({
                        success: false,
                        error: 'Email ou senha incorretos',
                    })];
            }
            passwordMatch = password === user.password_hash;
            if (!passwordMatch) {
                return [2 /*return*/, res.status(401).json({
                        success: false,
                        error: 'Email ou senha incorretos',
                    })];
            }
            if (!user.is_active) {
                return [2 /*return*/, res.status(403).json({
                        success: false,
                        error: 'Usuário inativo',
                    })];
            }
            token = jsonwebtoken_1.default.sign({
                id: user.id,
                email: user.email,
                role: user.role,
            }, JWT_SECRET, { expiresIn: '7d' });
            // Store session
            sessions.set(token, {
                userId: user.id,
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });
            password_hash = user.password_hash, userWithoutPassword = __rest(user, ["password_hash"]);
            res.json({
                success: true,
                user: userWithoutPassword,
                token: token,
                message: 'Login realizado com sucesso',
            });
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                error: 'Erro ao fazer login',
            });
        }
        return [2 /*return*/];
    });
}); });
// Validate Token
app.post('/api/auth/validate', function (req, res) {
    try {
        var authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Token não fornecido',
            });
        }
        var token = authHeader.substring(7);
        try {
            var decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
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
        }
        catch (jwtError) {
            res.status(401).json({
                success: false,
                error: 'Token inválido ou expirado',
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao validar token',
        });
    }
});
// Logout
app.post('/api/auth/logout', function (req, res) {
    try {
        var authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            var token = authHeader.substring(7);
            sessions.delete(token);
        }
        res.json({
            success: true,
            message: 'Logout realizado com sucesso',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao fazer logout',
        });
    }
});
// Get Profile
app.get('/api/auth/profile', function (req, res) {
    try {
        var authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Não autenticado',
            });
        }
        var token = authHeader.substring(7);
        try {
            var decoded_1 = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            var user = users.find(function (u) { return u.id === decoded_1.id; });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuário não encontrado',
                });
            }
            var password_hash = user.password_hash, userWithoutPassword = __rest(user, ["password_hash"]);
            res.json({
                success: true,
                user: userWithoutPassword,
            });
        }
        catch (jwtError) {
            res.status(401).json({
                success: false,
                error: 'Token inválido',
            });
        }
    }
    catch (error) {
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
app.get('/api/proposals', function (req, res) {
    try {
        var authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Não autenticado',
            });
        }
        var token = authHeader.substring(7);
        try {
            var decoded_2 = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            var user_1 = users.find(function (u) { return u.id === decoded_2.id; });
            if (!user_1) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuário não encontrado',
                });
            }
            // Filter proposals by user's agency
            var userProposals = proposals.filter(function (p) { return p.agency_id === user_1.agency_id; });
            res.json({
                success: true,
                proposals: userProposals,
                count: userProposals.length,
            });
        }
        catch (jwtError) {
            res.status(401).json({
                success: false,
                error: 'Token inválido',
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar propostas',
        });
    }
});
// Create proposal
app.post('/api/proposals', function (req, res) {
    try {
        var authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Não autenticado',
            });
        }
        var token = authHeader.substring(7);
        try {
            var decoded_3 = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            var user = users.find(function (u) { return u.id === decoded_3.id; });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuário não encontrado',
                });
            }
            var _a = req.body, destination_name = _a.destination_name, check_in = _a.check_in, check_out = _a.check_out, travelers_count = _a.travelers_count, total_price = _a.total_price, data = _a.data;
            var proposal = {
                id: (0, uuid_1.v4)(),
                agency_id: user.agency_id,
                creator_id: user.id,
                destination_name: destination_name,
                check_in: check_in,
                check_out: check_out,
                travelers_count: travelers_count,
                total_price: total_price,
                data: data,
                status: 'draft',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            proposals.push(proposal);
            res.status(201).json({
                success: true,
                proposal: proposal,
                message: 'Proposta criada com sucesso',
            });
        }
        catch (jwtError) {
            res.status(401).json({
                success: false,
                error: 'Token inválido',
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao criar proposta',
        });
    }
});
// Get single proposal
app.get('/api/proposals/:id', function (req, res) {
    try {
        var authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Não autenticado',
            });
        }
        var token = authHeader.substring(7);
        try {
            var decoded_4 = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            var user_2 = users.find(function (u) { return u.id === decoded_4.id; });
            if (!user_2) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuário não encontrado',
                });
            }
            var proposal = proposals.find(function (p) { return p.id === req.params.id && p.agency_id === user_2.agency_id; });
            if (!proposal) {
                return res.status(404).json({
                    success: false,
                    error: 'Proposta não encontrada',
                });
            }
            res.json({
                success: true,
                proposal: proposal,
            });
        }
        catch (jwtError) {
            res.status(401).json({
                success: false,
                error: 'Token inválido',
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar proposta',
        });
    }
});
// Update proposal
app.put('/api/proposals/:id', function (req, res) {
    try {
        var authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Não autenticado',
            });
        }
        var token = authHeader.substring(7);
        try {
            var decoded_5 = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            var user_3 = users.find(function (u) { return u.id === decoded_5.id; });
            if (!user_3) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuário não encontrado',
                });
            }
            var proposal = proposals.find(function (p) { return p.id === req.params.id && p.agency_id === user_3.agency_id; });
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
                proposal: proposal,
                message: 'Proposta atualizada com sucesso',
            });
        }
        catch (jwtError) {
            res.status(401).json({
                success: false,
                error: 'Token inválido',
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao atualizar proposta',
        });
    }
});
// Delete proposal
app.delete('/api/proposals/:id', function (req, res) {
    try {
        var authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Não autenticado',
            });
        }
        var token = authHeader.substring(7);
        try {
            var decoded_6 = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            var user_4 = users.find(function (u) { return u.id === decoded_6.id; });
            if (!user_4) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuário não encontrado',
                });
            }
            var index = proposals.findIndex(function (p) { return p.id === req.params.id && p.agency_id === user_4.agency_id; });
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
        }
        catch (jwtError) {
            res.status(401).json({
                success: false,
                error: 'Token inválido',
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao deletar proposta',
        });
    }
});
// ========================================
// Health Check
// ========================================
app.get('/api/health', function (req, res) {
    res.json({
        status: 'ok',
        message: 'API rodando com sucesso',
        timestamp: new Date().toISOString(),
    });
});
// Start server
app.listen(PORT, function () {
    console.log("\n\u2705 Servidor rodando em http://localhost:".concat(PORT));
    console.log("\uD83D\uDCDD API dispon\u00EDvel em http://localhost:".concat(PORT, "/api"));
    console.log("\n\uD83E\uDDEA Demo Credentials:");
    console.log("   Email: perine@demo.com");
    console.log("   Senha: admin\n");
});
