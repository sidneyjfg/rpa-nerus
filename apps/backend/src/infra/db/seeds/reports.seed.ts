import { AppDataSource } from "../data-source";
import { Report } from "../entities/Report.entity";
import { Platform } from "../entities/Platform.entity";
import { Client } from "../entities/Client.entity";
import { ClientReport } from "../entities/ClientReport.entity";
import { ensureDeliveryChannels } from "./helpers/ensureDeliveryChannels";

async function run() {
  const code = process.argv[2];
  if (!code) throw new Error("Informe: npm run seed:report SHOPEE_FULFILLMENT");

  await AppDataSource.initialize();
  await ensureDeliveryChannels();

  const reportRepo = AppDataSource.getRepository(Report);
  const platformRepo = AppDataSource.getRepository(Platform);
  const clientRepo = AppDataSource.getRepository(Client);
  const clientReportRepo = AppDataSource.getRepository(ClientReport);

  // garante plataforma base
  let platform = await platformRepo.findOneBy({ code: "SHOPEE" });
  if (!platform) {
    platform = await platformRepo.save({
      code: "SHOPEE",
      name: "Shopee",
    });
  }

  let report = await reportRepo.findOneBy({ code });
  if (!report) {
    report = await reportRepo.save({
      code,
      name: code,
      platform,
    });
    console.log("🌱 Relatório criado:", code);
  }

  const clients = await clientRepo.find();

  for (const client of clients) {
    const exists = await clientReportRepo.findOneBy({ client, report });
    if (!exists) {
      await clientReportRepo.save({
        client,
        report,
        active: false,
      });
    }
  }

  console.log("✅ Seed report finalizada:", code);
  process.exit(0);
}

run();
