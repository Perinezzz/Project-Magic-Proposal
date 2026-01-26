"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
var PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
var HOST = '0.0.0.0';
//... rest of the code remains the same...
app.listen(PORT, HOST, function () {
    console.log("\n Servidor rodando em http://".concat(HOST, ":").concat(PORT));
    console.log(" API dispon\u00EDvel em http://".concat(HOST, ":").concat(PORT, "/api"));
    console.log("\n Demo Credentials:");
    console.log("   Email: perine@demo.com");
    console.log("   Senha: admin\n");
});
