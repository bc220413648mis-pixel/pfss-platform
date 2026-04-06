"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Severity, IssueStatus } from "@prisma/client";

export async function createIssue(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const pageId = formData.get("pageId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const severity = formData.get("severity") as Severity;
  const wcagMapping = formData.get("wcagMapping") as string;
  const recommendation = formData.get("recommendation") as string;

  await prisma.issue.create({
    data: {
      title,
      description,
      severity,
      wcagMapping,
      recommendation,
      status: IssueStatus.OPEN,
      isManual: true,
      auditProjectId: projectId,
      pageId: pageId,
    },
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
}