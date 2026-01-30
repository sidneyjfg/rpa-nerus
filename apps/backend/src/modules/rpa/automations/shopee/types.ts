// apps/backend/src/automations/shopee/types.ts

import { Client } from "../../../../infra/db/entities/Client.entity"
import { ClientPlatformConfig } from "../../../../infra/db/entities/ClientPlatformConfig.entity"
import { ClientReport } from "../../../../infra/db/entities/ClientReport.entity"
import { ClientReportDelivery } from "../../../../infra/db/entities/ClientReportDelivery.entity"

// types.ts
export type AutomationContext = {
    client: Client
    platformConfig: ClientPlatformConfig
    report: ClientReport
    deliveries: ClientReportDelivery[]
    dateRange: { start: Date; end: Date }
    runId: number   // <-- number, não string
}


export type StepResult<T = unknown> = {
    ok: true
    data?: T
} | {
    ok: false
    error: Error
}
