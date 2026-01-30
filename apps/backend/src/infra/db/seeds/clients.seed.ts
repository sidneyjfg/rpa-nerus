import { AppDataSource } from "../data-source";
import { Client } from "../entities/Client.entity";
import { Platform } from "../entities/Platform.entity";
import { ClientPlatformConfig } from "../entities/ClientPlatformConfig.entity";
import { Report } from "../entities/Report.entity";
import { ClientReport } from "../entities/ClientReport.entity";
import { ensureDeliveryChannels } from "./helpers/ensureDeliveryChannels";

async function run() {
  const name = process.argv[2];
  if (!name) throw new Error("Informe: npm run seed:client LINDT");

  await AppDataSource.initialize();
  await ensureDeliveryChannels();

  const clientRepo = AppDataSource.getRepository(Client);
  const platformRepo = AppDataSource.getRepository(Platform);
  const configRepo = AppDataSource.getRepository(ClientPlatformConfig);
  const reportRepo = AppDataSource.getRepository(Report);
  const clientReportRepo = AppDataSource.getRepository(ClientReport);

  let client = await clientRepo.findOneBy({ name });
  if (!client) {
    client = await clientRepo.save({
      name,
      cnpj: "00000000000000",
      active: true,
    });
    console.log("🌱 Cliente criado:", name);
  }

  const platforms = await platformRepo.find();
  const reports = await reportRepo.find();

  for (const platform of platforms) {
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

  for (const report of reports) {
    const exists = await clientReportRepo.findOneBy({ client, report });
    if (!exists) {
      await clientReportRepo.save({
        client,
        report,
        active: false,
      });
    }
  }

  console.log("✅ Seed client finalizada:", name);
  process.exit(0);
}

run();
