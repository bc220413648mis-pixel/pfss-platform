"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * QA APPROVAL: Moves project to Founder for final sign-off
 */
export async function approveAudit(projectId: string) {
  await prisma.auditProject.update({
    where: { id: projectId },
    data: { status: "QA_APPROVED" },
  });

  revalidatePath("/dashboard/qa");
  revalidatePath("/dashboard/founder");
  redirect("/dashboard/qa");
}

/**
 * QA REJECTION: Sends project back to Auditor to fix issues
 */
export async function returnToAuditor(projectId: string) {
  await prisma.auditProject.update({
    where: { id: projectId },
    data: { status: "QA_RETURNED" },
  });

  revalidatePath("/dashboard/qa");
  revalidatePath("/dashboard/auditor");
  redirect("/dashboard/qa");
}