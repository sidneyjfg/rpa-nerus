import { AppDataSource } from "../data-source";
import { Platform } from "../entities/Platform.entity";
import { Report } from "../entities/Report.entity";
import { DeliveryChannel } from "../entities/DeliveryChannel.entity";

export async function runSeeds() {
  const platformRepo = AppDataSource.getRepository(Platform);
  const reportRepo = AppDataSource.getRepository(Report);
  const channelRepo = AppDataSource.getRepository(DeliveryChannel);

  // Platforms
  const shopee = await platformRepo.save({ code: "SHOPEE", name: "Shopee" });
  await platformRepo.save({ code: "AMAZON", name: "Amazon" });
  await platformRepo.save({ code: "NW", name: "NW" });

  // Reports
  await reportRepo.save({
    code: "SHOPEE_FULFILLMENT",
    name: "Shopee Fulfillment",
    platform: shopee,
  });

  // Delivery Channels
  await channelRepo.save({ code: "SFTP", name: "SFTP" });
  await channelRepo.save({ code: "EMAIL", name: "Email" });
  await channelRepo.save({ code: "DIRECTORY", name: "Directory" });

  console.log("🌱 Seeds executadas com sucesso");
}
