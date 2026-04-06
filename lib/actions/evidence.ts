"use server";

import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Configure Cloudinary with your .env credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadEvidence(formData: FormData) {
  const file = formData.get("image") as File;
  const issueId = formData.get("issueId") as string;
  const projectId = formData.get("projectId") as string;

  if (!file || file.size === 0) return { error: "No file provided" };

  try {
    // 1. Convert the file into a format Cloudinary understands
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    // 2. Upload to a dedicated 'pathfinder' folder in the cloud
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "pathfinder_evidence",
    });

    // 3. Save the permanent Cloudinary URL to your Evidence table
    await prisma.evidence.create({
      data: {
        url: uploadResponse.secure_url,
        description: "Audit Screenshot",
        issueId: issueId,
      },
    });

    // 4. Refresh the page so the image appears instantly
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Upload Error:", error);
    return { error: "Upload failed" };
  }
}