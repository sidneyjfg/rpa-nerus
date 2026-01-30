import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Client } from "./Client.entity";
import { Report } from "./Report.entity";
import { RunStep } from "./RunStep.entity";

@Entity("runs")
export class Run {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client)
  client: Client;

  @ManyToOne(() => Report)
  report: Report;

  @Column()
  status: "RUNNING" | "SUCCESS" | "ERROR";

  @Column({ type: "datetime" })
  startedAt: Date;

  @Column({ type: "datetime", nullable: true })
  finishedAt: Date;

  @OneToMany(() => RunStep, rs => rs.run)
  steps: RunStep[];
}
