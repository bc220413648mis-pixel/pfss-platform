"use server";

import { chromium } from "playwright";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function runAutoScan(pageId: string, url: string, projectId: string) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // --- PROFESSIONAL URL NORMALIZATION ---
    // If the URL is just a path (e.g. "/"), we need to get the domain from the project
    let targetUrl = url;
    
    if (!url.startsWith('http')) {
      const project = await prisma.auditProject.findUnique({
        where: { id: projectId },
        select: { domain: true }
      });
      
      if (project?.domain) {
        // Ensure the domain has https://
        const base = project.domain.startsWith('http') ? project.domain : `https://${project.domain}`;
        // Combine base domain with the page path
        targetUrl = new URL(url, base).toString();
      }
    }

    console.log(`🚀 Pathfinder Engine: Scanning ${targetUrl}`);

    // 1. Navigate to the fully qualified URL
    await page.goto(targetUrl, { waitUntil: "networkidle", timeout: 30000 });

    // 2. Inject Axe-Core
    await page.addScriptTag({ url: "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.2/axe.min.js" });

    // 3. Run Scan
    const results = await page.evaluate(async () => {
      // @ts-ignore
      return await window.axe.run();
    });

    const violations = results.violations;

    // 4. Save results to Database
    for (const v of violations) {
      const severityMap: Record<string, "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"> = {
        critical: "CRITICAL",
        serious: "HIGH",
        moderate: "MEDIUM",
        minor: "LOW",
      };

      await prisma.issue.create({
        data: {
          title: v.help,
          description: v.description,
          wcagMapping: v.tags.find((t: string) => t.startsWith("wcag")) || "Best Practice",
          severity: severityMap[v.impact || "moderate"] || "MEDIUM",
          recommendation: `Guidance: ${v.helpUrl}`,
          status: "OPEN",
          isManual: false,
          auditProjectId: projectId,
          pageId: pageId,
        },
      });
    }

    await browser.close();
    revalidatePath(`/dashboard/client/projects/${projectId}/report`);
    return { success: true, count: violations.length };

  } catch (error) {
    await browser.close();
    console.error("Pathfinder Scan Engine Error:", error);
    return { error: "Could not resolve URL. Ensure the project domain is valid." };
  }
}