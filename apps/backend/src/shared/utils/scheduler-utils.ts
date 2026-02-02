import { CronExpressionParser } from "cron-parser"
import { AutomationSchedule } from "../../infra/db/entities/AutomationSchedules "

export function diffMinutes(a: Date, b: Date): number {
    return Math.floor((a.getTime() - b.getTime()) / 60000)
}

export function diffHours(a: Date, b: Date): number {
    return Math.floor((a.getTime() - b.getTime()) / 3600000)
}

export function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    )
}

export function isSameTime(now: Date, hhmm: string): boolean {
    const [h, m] = hhmm.split(":").map(Number)
    return now.getHours() === h && now.getMinutes() === m
}

export function calcNextRun(
    s: AutomationSchedule,
    now = new Date()
): Date {

    if (s.type === "EVERY_MINUTES") {
        return new Date(
            now.getTime() + s.everyMinutes! * 60 * 1000
        )
    }

    if (s.type === "EVERY_HOURS") {
        return new Date(
            now.getTime() + s.everyHours! * 60 * 60 * 1000
        )
    }

    if (s.type === "DAILY") {
        const [h, m] = s.dailyAt!.split(":").map(Number)
        const next = new Date(now)
        next.setDate(next.getDate() + 1)
        next.setHours(h, m, 0, 0)
        return next
    }

    if (s.type === "CRON") {
        // próximo minuto, deixa o matcher decidir
        return new Date(now.getTime() + 60_000)
    }

    throw new Error("Tipo de schedule inválido")
}

export function cronMatch(
    expression: string,
    now = new Date()
): boolean {
    try {
        const interval = CronExpressionParser.parse(expression)
        const prev = interval.prev().toDate()

        // se o último tick foi há menos de 60s → roda agora
        return now.getTime() - prev.getTime() < 60_000
    } catch (err) {
        return false
    }
}