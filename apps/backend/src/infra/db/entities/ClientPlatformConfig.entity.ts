import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from "typeorm";
import { Client } from "./Client.entity";
import { Platform } from "./Platform.entity";

export type OtpType = "EMAIL" | "APP" | "NONE";

@Entity("client_platform_config")
@Index(["client", "platform"], { unique: true })
export class ClientPlatformConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, { nullable: false })
  client: Client;

  @ManyToOne(() => Platform, { nullable: false })
  platform: Platform;

  // Acesso / autenticação na plataforma
  @Column()
  loginUrl: string;

  @Column()
  username: string;

  @Column()
  password: string;

  // OTP / Token
  @Column({ type: "enum", enum: ["EMAIL", "APP", "NONE"], default: "NONE" })
  otpType: OtpType;

  @Column({ nullable: true })
  otpSecret: string; // caso APP (TOTP secret)

  @Column({ nullable: true })
  token: string; // caso a plataforma use token adicional
}
