import AccountComponent from "@/components/AccountComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";

export default async function AccountPage() {
  const session = await getServerAuthSession();
  if (!session?.user.email) {
    return <p>Not logged in</p>;
  }
  const images = await db.images.findMany({
    where: {
      createdById: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (images.length === 0) {
    return (
      <main className="mx-auto max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Your Images</CardTitle>
            <CardDescription>
              View and manage your uploaded images.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <p>No images found</p>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle>Your Images</CardTitle>
          <CardDescription>
            View and manage your uploaded images.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <AccountComponent imageData={image} key={image.id} />
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
