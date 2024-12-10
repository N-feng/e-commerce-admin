import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const f = createUploadthing();

// const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      // const user = await auth(req);
      const { userId } = auth();

      // If you throw, the user will not be able to upload
      // if (!user) throw new UploadThingError("Unauthorized");
      if (!userId) {
        throw new NextResponse("Unauthenticated", { status: 403 });
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      // return { userId: user.id };
      return { userId: userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
  productImage: f({
      image: { maxFileSize: "4MB", maxFileCount: 5 },
    })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      // const user = await auth(req);
      const { userId } = auth();

      // If you throw, the user will not be able to upload
      // if (!user) throw new UploadThingError("Unauthorized");
      if (!userId) {
        throw new NextResponse("Unauthenticated", { status: 403 });
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      // return { userId: user.id };
      return { userId: userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
  mealImage: f({
        image: { maxFileSize: "4MB", maxFileCount: 5 },
      })
      // Set permissions and file types for this FileRoute
      .middleware(async ({ req }) => {
        // This code runs on your server before upload
        // const user = await auth(req);
        const { userId } = auth();
        console.log('userId: ', userId);
  
        // If you throw, the user will not be able to upload
        // if (!user) throw new UploadThingError("Unauthorized");
        if (!userId) {
          throw new NextResponse("Unauthenticated", { status: 403 });
        }
  
        // Whatever is returned here is accessible in onUploadComplete as `metadata`
        // return { userId: user.id };
        console.log('{ customId: userId }: ', { customId: userId });
        return { userId: userId }
      })
      .onUploadComplete(async ({ metadata, file }) => {
        // This code RUNS ON YOUR SERVER after upload
        console.log("Upload complete for userId:", metadata.userId);
  
        console.log("file url", file.url);
  
        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata.userId };
      }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
