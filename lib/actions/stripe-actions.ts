"use server";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createCheckoutSession(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;
  const tier = formData.get("tier") as string;
  const price = Number(formData.get("price"));

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: `${tier} Audit Plan` },
        unit_amount: price * 100,
      },
      quantity: 1,
    }],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing/plans`,
    metadata: {
      userId: userId,
      tier: tier, 
    },
  });

  redirect(checkoutSession.url!);
}

/**
 * FIXED: ACTIVATE PROJECT
 * Removed revalidatePath to prevent render errors.
 */
export async function verifyAndActivateProject(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  
  if (session.payment_status === "paid") {
    const userId = session.metadata?.userId;
    const tier = session.metadata?.tier;

    const project = await prisma.auditProject.findFirst({
      where: { clientId: userId, status: "DRAFT", tier: tier as "BASIC" | "PRO" | "ENTERPRISE" },
      orderBy: { createdAt: 'desc' }
    });

    if (project) {
      await prisma.auditProject.update({
        where: { id: project.id },
        data: { 
          status: "IN_PROGRESS", 
          tier: tier as "PRO" | "ENTERPRISE",
          activatedAt: new Date() // Track activation time   
        }
      });

      await prisma.transaction.create({
        data: {
          amount: (session.amount_total || 0) / 100,
          status: "COMPLETED",
          userId: userId!,
          stripeId: session.id
        }
      });

      // We handle revalidation in the caller or via redirect
      return { success: true };
    }
  }
  return { success: false };
}