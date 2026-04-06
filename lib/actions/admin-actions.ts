"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

export async function updateUserRole(userId: string, newRole: Role) {
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });
  revalidatePath("/dashboard/founder");
}

export async function deleteUser(userId: string) {
  // Safety: Don't delete yourself
  await prisma.user.delete({
    where: { id: userId },
  });
  revalidatePath("/dashboard/founder");
}