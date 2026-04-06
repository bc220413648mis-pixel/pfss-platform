"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SubscriptionTier } from "@prisma/client";

export async function createAuditAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const domain = formData.get("domain") as string;
  const tier = formData.get("tier") as SubscriptionTier;
  const wcagVersion = formData.get("wcagVersion") as string;
  const complianceLevel = formData.get("complianceLevel") as string;
  
  // Get arrays from dynamic inputs
  const pageNames = formData.getAll("pageNames") as string[];
  const pageUrls = formData.getAll("pageUrls") as string[];

  const project = await prisma.auditProject.create({
    data: {
      domain,
      tier,
      wcagVersion,
      complianceLevel,
      clientId: (session.user as any).id,
      pages: {
        create: pageNames.map((name, index) => ({
          name,
          url: pageUrls[index],
        }))
      }
    }
  });

  redirect("/dashboard/client");
}