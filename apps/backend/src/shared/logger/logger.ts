import fs from "fs";
import path from "path";

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  module: string;
  message: string;
  data?: any;
  timestamp: string;
}

const LOG_DIR = path.resolve(process.cwd(), "logs");

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function writeToFile(entry: LogEntry) {
  const file = path.join(LOG_DIR, `${entry.level}.log`);
  fs.appendFileSync(file, JSON.stringify(entry) + "\n");
}

function formatConsole(entry: LogEntry) {
  const base = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.module}]`;

  switch (entry.level) {
    case "info":
      console.log(base, entry.message, entry.data ?? "");
      break;
    case "warn":
      console.warn(base, entry.message, entry.data ?? "");
      break;
    case "error":
      console.error(base, entry.message, entry.data ?? "");
      break;
    case "debug":
      console.debug(base, entry.message, entry.data ?? "");
      break;
  }
}

export function createLogger(module: string) {
  function log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      level,
      module,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    formatConsole(entry);
    writeToFile(entry);
  }

  return {
    info: (msg: string, data?: any) => log("info", msg, data),
    warn: (msg: string, data?: any) => log("warn", msg, data),
    error: (msg: string, data?: any) => log("error", msg, data),
    debug: (msg: string, data?: any) => log("debug", msg, data),
  };
}
