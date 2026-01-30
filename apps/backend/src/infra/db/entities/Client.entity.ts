import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ClientReport } from "./ClientReport.entity";

@Entity("clients")
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  cnpj: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => ClientReport, cr => cr.client)
  reports: ClientReport[];
}
