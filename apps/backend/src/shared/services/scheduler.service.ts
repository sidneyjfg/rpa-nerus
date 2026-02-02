import { AutomationSchedule } from "../../infra/db/entities/AutomationSchedules "
import { cronMatch, diffHours, diffMinutes, isSameDay, isSameTime } from "../utils/scheduler-utils"

export function shouldRunNow(
    s: AutomationSchedule,
    now: Date
): boolean {

    if (!s.lastRunAt) return true

    if (s.type === "EVERY_MINUTES") {
        return diffMinutes(now, s.lastRunAt) >= s.everyMinutes!
    }

    if (s.type === "EVERY_HOURS") {
        return diffHours(now, s.lastRunAt) >= s.everyHours!
    }

    if (s.type === "DAILY") {
        return isSameTime(now, s.dailyAt!) &&
            !isSameDay(now, s.lastRunAt)
    }

    if (s.type === "CRON") {
        return cronMatch(s.cronExpression!, now)
    }

    return false
}

