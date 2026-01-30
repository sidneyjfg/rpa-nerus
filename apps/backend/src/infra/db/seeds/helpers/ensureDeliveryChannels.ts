import { AppDataSource } from "../../data-source";
import { DeliveryChannel } from "../../entities/DeliveryChannel.entity";

export async function ensureDeliveryChannels() {
  const repo = AppDataSource.getRepository(DeliveryChannel);

  const channels = [
    { code: "SFTP", name: "SFTP" },
    { code: "EMAIL", name: "Email" },
    { code: "DIRECTORY", name: "Directory" },
  ];

  for (const ch of channels) {
    const exists = await repo.findOneBy({ code: ch.code });
    if (!exists) {
      await repo.save(ch);
      console.log(`🌱 Canal criado: ${ch.code}`);
    }
  }
}
