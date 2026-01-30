import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { ClientReport } from "./ClientReport.entity";
import { DeliveryChannel } from "./DeliveryChannel.entity";

@Entity("client_report_delivery")
export class ClientReportDelivery {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ClientReport, cr => cr.deliveries)
  clientReport: ClientReport;

  @ManyToOne(() => DeliveryChannel, dc => dc.deliveries)
  deliveryChannel: DeliveryChannel;

  // SFTP
  @Column({ nullable: true })
  sftpHost: string;

  @Column({ nullable: true })
  sftpPort: number;

  @Column({ nullable: true })
  sftpUser: string;

  @Column({ nullable: true })
  sftpPassword: string;

  @Column({ nullable: true })
  sftpRemotePath: string;

  // EMAIL
  @Column({ nullable: true })
  emailTo: string;

  @Column({ nullable: true })
  emailCc: string;

  @Column({ nullable: true })
  emailSubjectTemplate: string;

  // DIRECTORY
  @Column({ nullable: true })
  localPath: string;
}
