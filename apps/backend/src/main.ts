import { env } from "./config/env";
import { AppDataSource } from "./infra/db/data-source";
import { startScheduler } from "./modules/rpa/automations/scheduler.worker";
import { createLogger } from "./shared/logger";

const log = createLogger("bootstrap");

async function bootstrap() {
  await AppDataSource.initialize();
  startScheduler()

  log.info("✅ MySQL conectado com sucesso");
  log.info(`Ambiente: ${env.NODE_ENV}`);
  log.info(`Porta: ${env.APP_PORT}`);
}

bootstrap().catch((err) => {
  log.error("❌ Falha ao iniciar aplicação", err);
  process.exit(1);
});
