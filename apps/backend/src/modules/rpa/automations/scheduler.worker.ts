// scheduler.worker.ts
import { AppDataSource } from "../../../infra/db/data-source"
import { createLogger } from "../../../shared/logger"
import { shouldRunNow } from "../../../shared/services/scheduler.service"
import { calcDateRange } from "../../../shared/utils/calculade-date-range"
import { runShopeeAutomation } from "../automations/shopee/shopee.automation"
import { calcNextRun, diffMinutes } from "../../../shared/utils/scheduler-utils"
import { AutomationSchedule } from "../../../infra/db/entities/AutomationSchedules "

const log = createLogger("scheduler")

export async function startScheduler() {
    log.info("Scheduler iniciado")

    setInterval(async () => {
        const now = new Date()
        const repo = AppDataSource.getRepository(AutomationSchedule)

        const schedules = await repo.find({
            where: { enabled: true },
            relations: ["client", "platform", "report"],
        })

        for (const s of schedules) {

            // -------- LOCK ZUMBI --------
            if (s.locked && s.lockedAt && diffMinutes(now, s.lockedAt) > 30) {
                log.warn(`Liberando lock zumbi ${s.id}`)
                await repo.update(s.id, { locked: false, lockedAt: undefined })
                continue
            }

            if (!shouldRunNow(s, now)) continue

            // -------- TENTA LOCK ATÔMICO --------
            const result = await repo.update(
                { id: s.id, locked: false },
                { locked: true, lockedAt: now }
            )

            if (result.affected === 0) {
                // outro worker já pegou
                continue
            }

            log.info(`Disparando automação ${s.id} | ${s.platform}`)

            try {
                await runShopeeAutomation(AppDataSource, {
                    clientId: s.client.id,
                    platformId: s.platform.id,
                    reportId: s.report.id,
                    dateRange: calcDateRange(s),
                })

                await repo.update(s.id, {
                    lastRunAt: now,
                    nextRunAt: calcNextRun(s, now),
                })
            } catch (err) {
                log.error(`Erro na automação ${s.id} | ${s.platform}`, err)
            } finally {
                // -------- UNLOCK --------
                await repo.update(s.id, {
                    locked: false,
                    lockedAt: undefined,
                })

            }
        }
    }, 60_000)
}
