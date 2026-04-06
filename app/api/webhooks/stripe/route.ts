import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body, 
      signature, 
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const userId = session.metadata.userId;
    const newTier = session.metadata.tier;

    console.log(`🔔 Processing Payment: User ${userId} -> ${newTier}`);

    try {
      await prisma.$transaction(async (tx) => {
        // 1. Get the user
        const user = await tx.user.findUnique({
          where: { id: userId },
        });

        if (!user) throw new Error("User not found");

        let orgId = user.orgId;

        // 2. If user has no Org, create one!
        if (!orgId) {
          const newOrg = await tx.organization.create({
            data: {
              name: `${user.name || 'User'}'s Organization`,
              subscriptionTier: newTier,
            }
          });
          orgId = newOrg.id;

          // Link the user to this new Org
          await tx.user.update({
            where: { id: userId },
            data: { orgId: orgId }
          });
          console.log(`✨ Created new Organization: ${orgId}`);
        } else {
          // 3. If Org exists, just upgrade it
          await tx.organization.update({
            where: { id: orgId },
            data: { subscriptionTier: newTier }
          });
          console.log(`✅ Upgraded existing Organization: ${orgId}`);
        }

        // 4. Create the Transaction record
        await tx.transaction.create({
          data: {
            amount: session.amount_total / 100,
            status: "COMPLETED",
            stripeId: session.id,
            userId: userId,
          }
        });
      });
    } catch (error) {
      console.error("❌ Webhook Database Error:", error);
    }
  }

  return new NextResponse("Success", { status: 200 });
}