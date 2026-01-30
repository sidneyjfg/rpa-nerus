import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column } from "typeorm";
import { Client } from "./Client.entity";
import { Report } from "./Report.entity";
import { ClientReportDelivery } from "./ClientReportDelivery.entity";

@Entity("client_reports")
export class ClientReport {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, c => c.reports)
  client: Client;

  @ManyToOne(() => Report, r => r.clientReports)
  report: Report;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => ClientReportDelivery, d => d.clientReport)
  deliveries: ClientReportDelivery[];
}
