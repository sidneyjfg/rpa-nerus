// 01-login.step.ts
import { Page } from "puppeteer"
import { AutomationContext } from "../types"
import { createLogger } from "../../../../../shared/logger"
import { clickButtonByAnyText } from "../../../../../shared/puppeteer/click-by-text"
import { delay } from "../../../../../shared/puppeteer/wait"
import { TotpService } from "../../../../../shared/auth/totp/totp.service"

const log = createLogger("shopee-login-step")

export async function step(page: Page, ctx: AutomationContext): Promise<void> {
    log.info("RunStep START")

    try {
        await page.goto(ctx.platformConfig.loginUrl, { waitUntil: "networkidle0" })

        await page.type('input[type="text"]', ctx.platformConfig.username)
        await page.type('input[type="password"]', ctx.platformConfig.password)

        await clickButtonByAnyText(page, ["Faça login", "Sign in"])
        await delay(3000)

        // dispara envio do OTP (parte visual = step)
        await page.click(
            "button.simple-otp__addition__change-type-btn"
        )

        const otpType =
            ctx.platformConfig.otpType === "APP"
                ? "AUTHENTICATOR"
                : ctx.platformConfig.otpType

        await TotpService.resolve(
            page,
            otpType === "EMAIL"
                ? {
                    type: "EMAIL",
                    from: "Shopee via Suporte - O2",
                    regex: /\b(\d{6})\b/,
                    sinceMs: Date.now() - 10_000,
                }
                : otpType === "AUTHENTICATOR"
                    ? {
                        type: "AUTHENTICATOR",
                        secret: ctx.platformConfig.otpSecret!,
                    }
                    : { type: "NONE" },
            ".simple-otp input"
        )

        await clickButtonByAnyText(page, ["Verificar", "Verify"])
        await delay(8000)

        log.info("RunStep SUCCESS")
    } catch (err) {
        log.error("RunStep ERROR", err)
        throw err
    }
}

