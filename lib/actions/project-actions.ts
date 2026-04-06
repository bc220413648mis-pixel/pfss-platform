"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuditStatus } from "@prisma/client";

/**
 * Submits a project from the Auditor to the QA Queue
 */
export async function submitProjectToQA(projectId: string) {
  try {
    await prisma.auditProject.update({
      where: { id: projectId },
      data: { 
        status: "SUBMITTED_FOR_QA" as AuditStatus,
        updatedAt: new Date() // Force a timestamp update
      },
    });
  } catch (error) {
    console.error("Submission Error:", error);
    throw new Error("Database update failed. Please try again.");
  }

  // MUST BE OUTSIDE TRY/CATCH
  revalidatePath("/dashboard/auditor");
  revalidatePath(`/dashboard/projects/${projectId}`);
  redirect("/dashboard/auditor/tasks"); // Redirecting to the tasks list
}

/**
 * QA Admin Approves the audit
 */
export async function approveAudit(projectId: string) {
  try {
    await prisma.auditProject.update({
      where: { id: projectId },
      data: { status: "QA_APPROVED" as AuditStatus },
    });
  } catch (error) {
    console.error("Approval Error:", error);
    throw new Error("Failed to approve audit");
  }

  revalidatePath("/dashboard/qa");
  revalidatePath("/dashboard/founder");
  redirect("/dashboard/qa");
}

/**
 * QA Admin Rejects the audit
 */
export async function rejectAudit(projectId: string) {
  try {
    await prisma.auditProject.update({
      where: { id: projectId },
      data: { status: "QA_RETURNED" as AuditStatus },
    });
  } catch (error) {
    console.error("Rejection Error:", error);
    throw new Error("Failed to reject audit");
  }

  revalidatePath("/dashboard/qa");
  revalidatePath("/dashboard/auditor");
  redirect("/dashboard/qa");
}