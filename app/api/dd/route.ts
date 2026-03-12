import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Get DD logs
    const logDir = path.join(process.env.HOME || "", ".openclaw/workspace/data/ghl-operator/logs");
    let ddLogs: any[] = [];
    
    try {
      const files = fs.readdirSync(logDir).filter(f => f.startsWith("dd-") && f.endsWith(".log"));
      const latestLog = files.sort().pop();
      if (latestLog) {
        const logPath = path.join(logDir, latestLog);
        const logContent = fs.readFileSync(logPath, "utf8");
        const lines = logContent.split("\n").filter(l => l.includes("Due Diligence Complete")).slice(-5);
        ddLogs = lines.map(l => {
          const match = l.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}).*Due Diligence Complete.*?ARV: \$([0-9,]+).*MAO: \$([0-9,]+)/);
          return match ? { date: match[1], arv: match[2], mao: match[3] } : null;
        }).filter(Boolean);
      }
    } catch (e) {
      // Logs not accessible
    }

    // Get PDF reports
    const reportDir = path.join(process.env.HOME || "", "Desktop/ENZO/reports");
    let reports: { name: string; date: string }[] = [];
    try {
      reports = fs.readdirSync(reportDir)
        .filter(f => f.startsWith("DD_Report") && f.endsWith(".pdf"))
        .slice(-5)
        .map(f => ({ name: f, date: fs.statSync(path.join(reportDir, f)).mtime.toISOString() }));
    } catch (e) {
      // Reports dir not accessible
    }

    return NextResponse.json({
      ddLogs,
      reports,
      webhookStatus: "running",
      lastCheck: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load DD stats" }, { status: 500 });
  }
}
