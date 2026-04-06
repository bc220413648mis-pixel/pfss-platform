"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * PHASE 1: PROJECT ASSIGNMENT
 * Links a project to an Auditor and moves it to IN_PROGRESS.
 */
export async function assignAuditor(projectId: string, auditorId: string) {
  await prisma.auditProject.update({
    where: { id: projectId },
    data: {
      auditorId: auditorId,
      status: "IN_PROGRESS",  
    },
  });

  revalidatePath("/dashboard/founder/projects");
  revalidatePath("/dashboard/founder"); // Update the Overview counts too
}

/**
 * PHASE 2: SYSTEM GOVERNANCE
 * Updates the global MVP rules (QA Rating, Discounts, SLA).
 */
export async function updateGlobalSettings(formData: FormData) {
  // 1. Convert form data to correct types
  const qaThreshold = parseInt(formData.get("qaThreshold") as string) || 90;
  const ngoDiscount = parseFloat(formData.get("ngoDiscount") as string) || 50.0;
  const slaDays = parseInt(formData.get("slaDays") as string) || 3;

  // 2. Perform the update with String ID "1"
  // This uses 'upsert' so if the record doesn't exist, it creates it.
  await prisma.systemSettings.upsert({
    where: { 
      id: 1 // This fixes your "Type string" issue
    },
    update: {
      qaThreshold,
      ngoDiscount,
      slaDays
    },
    create: {
      id: 1,
      qaThreshold,
      ngoDiscount,
      slaDays
    }
  });

  revalidatePath("/dashboard/founder/settings");
}
/**
 * PHASE 3: FINAL DELIVERY
 * Moves project from QA_APPROVED to DELIVERED.
 */
export async function deliverProject(projectId: string) {
  await prisma.auditProject.update({
    where: { id: projectId },
    data: { status: "DELIVERED" },
  });

  revalidatePath("/dashboard/founder");
  revalidatePath("/dashboard/client"); // For the upcoming client view
}