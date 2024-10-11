import AccountComponent from "@/components/AccountComponent";
import ImageManagementComponent from "@/components/ImageManagement";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    return <p>Not logged in</p>;
  }
  const images = await db.images.findMany({
    where: {
      createdById: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  if (images.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <ImageManagementComponent />
        <div className="max-w-7xl">
          <Card>
            <CardHeader>
              <CardTitle>No images found</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </main>
    );
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <ImageManagementComponent />
      <div className="max-w-7xl">
        <Card>
          <CardHeader className="relative">
            <CardTitle>Images</CardTitle>
            <CardDescription>
              View and manage your uploaded images.
            </CardDescription>
            <Link className="absolute right-5 flex" href="/account">
              View all images
              <ChevronRight />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {images.map((image) => (
                <AccountComponent imageData={image} key={image.id} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
