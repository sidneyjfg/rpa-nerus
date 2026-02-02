import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "../../config/env";
import { Client } from "./entities/Client.entity";
import { Platform } from "./entities/Platform.entity";
import { Report } from "./entities/Report.entity";
import { ClientReport } from "./entities/ClientReport.entity";
import { DeliveryChannel } from "./entities/DeliveryChannel.entity";
import { ClientReportDelivery } from "./entities/ClientReportDelivery.entity";
import { ClientPlatformConfig } from "./entities/ClientPlatformConfig.entity";

import { Run } from "./entities/Run.entity";
import { RunStep } from "./entities/RunStep.entity";
import { AutomationSchedule } from "./entities/AutomationSchedules ";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,

    synchronize: env.NODE_ENV !== "production",
    logging: env.NODE_ENV === "development",

    ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,

    entities: [
        Client,
        Platform,
        Report,
        ClientReport,
        DeliveryChannel,
        ClientReportDelivery,
        ClientPlatformConfig,
        AutomationSchedule,
        Run,
        RunStep,
    ],
    migrations: [],
});
