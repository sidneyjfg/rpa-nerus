import { AutomationSchedule } from "../../infra/db/entities/AutomationSchedules ";

export function calcDateRange(
    s: AutomationSchedule,
    now = new Date()
): { start: Date; end: Date } {

    // primeira execução → pega só hoje
    if (!s.lastRunAt) {
        const start = new Date(now)
        start.setHours(0, 0, 0, 0)

        return { start, end: now }
    }

    // padrão: desde última execução
    let start = new Date(s.lastRunAt)
    let end = now

    if (s.type === "EVERY_MINUTES") {
        start = new Date(
            now.getTime() - s.everyMinutes! * 60 * 1000
        )
    }

    if (s.type === "EVERY_HOURS") {
        start = new Date(
            now.getTime() - s.everyHours! * 60 * 60 * 1000
        )
    }

    if (s.type === "DAILY") {
        start = new Date(s.lastRunAt)
        start.setHours(0, 0, 0, 0)
    }

    if (s.type === "CRON") {
        // CRON: sempre incremental
        start = new Date(s.lastRunAt)
    }

    return { start, end }
}
