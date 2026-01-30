import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ClientReportDelivery } from "./ClientReportDelivery.entity";

@Entity("delivery_channels")
export class DeliveryChannel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; // SFTP, EMAIL, DIRECTORY

  @Column()
  name: string;

  @OneToMany(() => ClientReportDelivery, d => d.deliveryChannel)
  deliveries: ClientReportDelivery[];
}
