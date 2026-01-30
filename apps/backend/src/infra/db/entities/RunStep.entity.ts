import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Run } from "./Run.entity";

@Entity("run_steps")
export class RunStep {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Run, r => r.steps)
  run: Run;

  @Column()
  stepName: string;

  @Column()
  status: "RUNNING" | "SUCCESS" | "ERROR";

  @Column({ nullable: true, type: "text" })
  errorMessage: string;

  @Column({ type: "datetime" })
  startedAt: Date;

  @Column({ type: "datetime", nullable: true })
  finishedAt: Date;
}
