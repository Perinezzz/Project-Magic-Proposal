import express, { Express, Request, Response } from 'express';
import type { CorsOptions } from 'cors';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

const app: Express = express();
const PORT: number = process.env.PORT? parseInt(process.env.PORT) : 3001;
const HOST: string = '0.0.0.0';

//... rest of the code remains the same...

app.listen(PORT, HOST, () => {
  console.log(`\n Servidor rodando em http://${HOST}:${PORT}`);
  console.log(` API disponível em http://${HOST}:${PORT}/api`);
  console.log(`\n Demo Credentials:`);
  console.log(`   Email: perine@demo.com`);
  console.log(`   Senha: admin\n`);
});