"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust path to your auth config
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SubscriptionTier, AuditStatus } from "@prisma/client";

export async function createProject(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const domain = formData.get("domain") as string;
  const tier = formData.get("tier") as SubscriptionTier;
  const wcagVersion = formData.get("wcagVersion") as string;
  const complianceLevel = formData.get("complianceLevel") as string;
  
  // Extract dynamic pages
  const pageUrls = formData.getAll("pages") as string[];
  const pageNames = formData.getAll("pageNames") as string[];

  const project = await prisma.auditProject.create({
    data: {
      domain,
      tier,
      wcagVersion,
      complianceLevel,
      status: AuditStatus.DRAFT,
      clientId: session.user.id, // Assigning to creator as default
      pages: {
        create: pageUrls.map((url, index) => ({
          url,
          name: pageNames[index] || `Page ${index + 1}`,
        })),
      },
    },
  });

  revalidatePath("/dashboard/client");
  redirect(`/dashboard/client/projects/${project.id}/`);
}