import { AppDataSource } from "../data-source";

async function run() {
  await AppDataSource.initialize();

  console.log("⚠ Desativando foreign keys...");
  await AppDataSource.query("SET FOREIGN_KEY_CHECKS = 0;");

  const tables = AppDataSource.entityMetadatas.map(
    m => m.tableName
  );

  for (const table of tables) {
    console.log("🗑 Drop:", table);
    await AppDataSource.query(`DROP TABLE IF EXISTS \`${table}\``);
  }

  console.log("✅ Reativando foreign keys...");
  await AppDataSource.query("SET FOREIGN_KEY_CHECKS = 1;");

  await AppDataSource.destroy();
  console.log("🔥 Banco resetado com sucesso");
  process.exit(0);
}

run();
