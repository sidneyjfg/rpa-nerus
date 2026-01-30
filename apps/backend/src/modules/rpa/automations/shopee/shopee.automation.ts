// apps/backend/src/automations/shopee/shopee.automation.ts
import puppeteer from "puppeteer"
import { DataSource, Repository } from "typeorm"
import { step as loginStep } from "./steps/01-login.step"
import { step as navigateStep } from "./steps/02-navigate-nfe.step"
import { step as selectDateStep } from "./steps/03-select-date.step"
import { step as downloadStep } from "./steps/04-download-by-type.step"
import { step as uploadStep } from "./steps/05-upload-sftp.step"
import { Client } from "../../../../infra/db/entities/Client.entity"
import { ClientPlatformConfig } from "../../../../infra/db/entities/ClientPlatformConfig.entity"
import { ClientReport } from "../../../../infra/db/entities/ClientReport.entity"
import { ClientReportDelivery } from "../../../../infra/db/entities/ClientReportDelivery.entity"
import { Platform } from "../../../../infra/db/entities/Platform.entity"
import { Run } from "../../../../infra/db/entities/Run.entity"
import { RunStep } from "../../../../infra/db/entities/RunStep.entity"
import { createLogger } from "../../../../shared/logger"
import { DeliveryService } from "../../../../shared/services/delivere.service"



const log = createLogger("shopee-automation")

const INVOICE_TYPES = [
    "NFe Entrada",
    "NFe Remessa Simbólica",
    "Nota fiscal de retorno",
    "NFe Retorno Simbólico",
    "NFe Vendas",
]

export async function runShopeeAutomation(
    dataSource: DataSource,
    params: {
        clientId: number
        platformId: number
        reportId: number
        dateRange: { start: Date; end: Date }
    }
) {
    const { clientId, platformId, reportId, dateRange } = params

    const clientRepo = dataSource.getRepository(Client)
    const configRepo = dataSource.getRepository(ClientPlatformConfig)
    const reportRepo = dataSource.getRepository(ClientReport)
    const deliveryRepo = dataSource.getRepository(ClientReportDelivery)
    const runRepo = dataSource.getRepository(Run)
    const runStepRepo = dataSource.getRepository(RunStep)

    const client = await clientRepo.findOneByOrFail({ id: clientId })

    const platformConfig = await configRepo.findOneOrFail({
        where: {
            client: { id: clientId },
            platform: { id: platformId },
        },
        relations: ["client", "platform"],
    })

    const clientReport = await reportRepo.findOneOrFail({
        where: {
            client: { id: clientId },
            report: { id: reportId },
        },
        relations: ["client", "report"],
    })

    const deliveries = await deliveryRepo.find({
        where: {
            clientReport: { id: clientReport.id },
        },
        relations: ["deliveryChannel"],
    })

    const run = await runRepo.save(
        runRepo.create({
            client,
            report: clientReport.report,
            status: "RUNNING",
            startedAt: new Date(),
        })
    )

    const ctx = {
        client,
        platformConfig,
        report: clientReport,
        deliveries,
        dateRange,
        runId: run.id,
    }

    const deliveryService = new DeliveryService()
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    try {
        await exec(runStepRepo, run, "01-login", () => loginStep(page, ctx))
        await exec(runStepRepo, run, "02-navigate-nfe", () => navigateStep(page, ctx))
        await exec(runStepRepo, run, "03-select-date", () => selectDateStep(page, ctx))

        const allFiles: string[] = []

        for (const type of INVOICE_TYPES) {
            const files = await exec(
                runStepRepo,
                run,
                "04-download-" + type,
                () => downloadStep(page, ctx, { invoiceType: type })
            )
            allFiles.push(...files)
        }

        await exec(
            runStepRepo,
            run,
            "05-upload",
            () => uploadStep(page, ctx, { files: allFiles, deliveryService })
        )

        await runRepo.update(run.id, {
            status: "SUCCESS",
            finishedAt: new Date(),
        })
    } catch (err) {
        const error = err as Error
        log.error("Automation ERROR", error)

        await runRepo.update(run.id, {
            status: "ERROR",
            finishedAt: new Date(),
        })

        throw error
    } finally {
        await browser.close()
    }
}


async function exec<T>(
    repo: Repository<RunStep>,
    run: Run,
    name: string,
    fn: () => Promise<T>
): Promise<T> {
    const step = await repo.save(
        repo.create({
            run,
            stepName: name,
            status: "RUNNING",
            startedAt: new Date(),
        })
    )

    try {
        const result = await fn()
        await repo.update(step.id, {
            status: "SUCCESS",
            finishedAt: new Date(),
        })
        return result
    } catch (err) {
        const error = err as Error
        await repo.update(step.id, {
            status: "ERROR",
            errorMessage: error.message,
            finishedAt: new Date(),
        })
        throw error
    }
}

