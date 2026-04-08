import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid"; // Run 'npm install uuid' or just use crypto.randomUUID()

export async function POST(req: Request) {
  const { email } = await req.json();
  
  // 1. Find the user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // 2. Generate a random token and expiry (1 hour from now)
  const token = crypto.randomUUID();
  const expiry = new Date(Date.now() + 3600000); 

  // 3. SAVE IT TO DATABASE (This was likely the missing part!)
  await prisma.user.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry
    }
  });

  // 4. LOG TO TERMINAL (Look for this in VS Code!)
  console.log("------------------------------------------");
  console.log(`RESET LINK: http://localhost:3000/reset-password?token=${token}`);
  console.log("------------------------------------------");

  return NextResponse.json({ message: "Token generated" });
}