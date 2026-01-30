import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Platform } from "./Platform.entity";
import { ClientReport } from "./ClientReport.entity";

@Entity("reports")
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @ManyToOne(() => Platform, p => p.reports)
  platform: Platform;

  @OneToMany(() => ClientReport, cr => cr.report)
  clientReports: ClientReport[];
}
