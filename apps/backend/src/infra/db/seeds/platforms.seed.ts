import { AppDataSource } from "../data-source";
import { Platform } from "../entities/Platform.entity";
import { Client } from "../entities/Client.entity";
import { ClientPlatformConfig } from "../entities/ClientPlatformConfig.entity";
import { ensureDeliveryChannels } from "./helpers/ensureDeliveryChannels";

async function run() {
  const code = process.argv[2];
  if (!code) throw new Error("Informe: npm run seed:platform SHOPEE");

  await AppDataSource.initialize();
  await ensureDeliveryChannels();

  const platformRepo = AppDataSource.getRepository(Platform);
  const clientRepo = AppDataSource.getRepository(Client);
  const configRepo = AppDataSource.getRepository(ClientPlatformConfig);

  let platform = await platformRepo.findOneBy({ code });
  if (!platform) {
    platform = await platformRepo.save({
      code,
      name: code,
    });
    console.log("🌱 Plataforma criada:", code);
  }

  const clients = await clientRepo.find();

  for (const client of clients) {
    const exists = await configRepo.findOneBy({ client, platform });
    if (!exists) {
      await configRepo.save({
        client,
        platform,
        loginUrl: "",
        username: "",
        password: "",
        otpType: "NONE",
      });
    }
  }

  console.log("✅ Seed platform finalizada:", code);
  process.exit(0);
}

run();
