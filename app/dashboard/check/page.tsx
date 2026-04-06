import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AuthCheck() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) redirect("/login");
// Ensure you are selecting the ID and Organization
const user = await prisma.user.findUnique({
  where: { email: session.user.email },
  include: { organization: true } 
});

// If the user exists in session but NOT in your Database
if (!user) {
  return (
    <div className="p-20 text-center">
      <p>User profile not found in database. Please contact support.</p>
    </div>
  );
}
  // Force redirect to the specific MVP Role Folder
  const role = (session.user as any).role;

  switch (role) {
    case "FOUNDER":
      redirect("/dashboard/founder");
    case "AUDITOR":
      redirect("/dashboard/auditor");
    case "QA_ADMIN":
      redirect("/dashboard/qa");
    default:
      redirect("/dashboard/client");
  }
}