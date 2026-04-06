"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Severity, IssueStatus } from "@prisma/client";

export async function createManualIssue(formData: FormData, projectId: string) {
  const title = formData.get("title") as string;
  const severity = formData.get("severity") as Severity;
  const wcagMapping = formData.get("wcagMapping") as string;
  const description = formData.get("description") as string;

  if (!title || !projectId) throw new Error("Missing required fields");

  await prisma.issue.create({
    data: {
      title,
      severity,
      wcagMapping,
      description,
      status: IssueStatus.OPEN,
      auditProjectId: projectId,
    },
  });

  // This clears the cache and refreshes the Workbench instantly
  revalidatePath(`/dashboard/projects/${projectId}/review`);
}