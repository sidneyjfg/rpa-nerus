import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm"
import { Client } from "./Client.entity"
import { Platform } from "./Platform.entity"
import { Report } from "./Report.entity"

export type ScheduleType =
    | "CRON"
    | "EVERY_MINUTES"
    | "EVERY_HOURS"
    | "DAILY"

// AutomationSchedule.entity.ts
@Entity("automation_schedules")
export class AutomationSchedule {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Client, { nullable: false })
    client: Client

    @ManyToOne(() => Platform, { nullable: false })
    platform: Platform

    @ManyToOne(() => Report, { nullable: false })
    report: Report

    @Column({ default: true })
    enabled: boolean

    @Column({
        type: "enum",
        enum: ["CRON", "EVERY_MINUTES", "EVERY_HOURS", "DAILY"],
    })
    type: ScheduleType

    @Column({ nullable: true })
    cronExpression: string

    @Column({ nullable: true })
    everyMinutes: number

    @Column({ nullable: true })
    everyHours: number

    @Column({ type: "time", nullable: true })
    dailyAt: string

    @Column({ default: "America/Sao_Paulo" })
    timezone: string

    @Column({ type: "datetime", nullable: true })
    lastRunAt: Date

    @Column({ type: "datetime", nullable: true })
    nextRunAt: Date

    // -------- LOCK --------
    @Column({ default: false })
    locked: boolean

    @Column({ type: "datetime", nullable: true })
    lockedAt: Date

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
