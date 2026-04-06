"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Severity, IssueStatus } from "@prisma/client";

export async function saveIssue(formData: FormData) {
  // 1. Extract and Validate Form Data
  const projectId = formData.get("projectId") as string;
  const title = formData.get("title") as string;
  const wcagMapping = formData.get("wcagMapping") as string;
  const severity = formData.get("severity") as Severity;
  const description = formData.get("description") as string;
  const recommendation = formData.get("recommendation") as string;

  if (!projectId || !title) {
    throw new Error("Missing required project or title data.");
  }

  // 2. Create the issue using Schema-compliant 'OPEN' status
  await prisma.issue.create({
    data: {
      title,
      wcagMapping,
      severity,
      description,
      recommendation,
      status: "OPEN", // Matches your schema: OPEN, NEEDS_CLIENT_INPUT, FIXED_PENDING_VERIFY, VERIFIED
      auditProjectId: projectId,
      isManual: true, 
    },
  });
}
export async function submitProjectForQA(projectId: string) {
  // 1. Update the project status to the next phase in the MVP lifecycle
  await prisma.auditProject.update({
    where: { id: projectId },
    data: {
      status: "SUBMITTED_FOR_QA", // Matches your Schema Enum
    },
  });

  // 2. Revalidate the paths so the dashboards update immediately
  revalidatePath("/dashboard/auditor");
  revalidatePath(`/dashboard/auditor/projects/${projectId}`);
  
  // 3. Send the Auditor back to their main workspace
  redirect("/dashboard/auditor");
}
