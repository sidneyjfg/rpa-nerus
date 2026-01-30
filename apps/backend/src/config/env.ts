import "dotenv/config";
import { envSchema, type Env } from "./env.schema";

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Erros legíveis
  const formatted = parsed.error.issues.map((i) => {
    const path = i.path.join(".");
    return `${path}: ${i.message}`;
  });

  console.error("❌ Variáveis de ambiente inválidas. Corrija antes de iniciar:\n");
  for (const line of formatted) console.error(`- ${line}`);

  process.exit(1);
}

export const env: Env = parsed.data;
