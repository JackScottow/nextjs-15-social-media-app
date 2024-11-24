import { Button } from "@/components/ui/button";
import { Bell, Bookmark, Home, Mail } from "lucide-react";
import Link from "next/link";
import NotificationsButton from "./NotificationsButton";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

interface MenuBarProps {
  className?: string;
}

const MenuBar = async ({ className }: MenuBarProps) => {
  const { user } = await validateRequest();
  if (!user) return null;
  const unreadNotificationCount = await prisma.notification.count({
    where: { recipientId: user.id, read: false },
  });
  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex justify-start"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home className="lg:mr-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationCount }}
      />

      <Button
        variant="ghost"
        className="flex justify-start"
        title="Messages"
        asChild
      >
        <Link href="/messages">
          <Mail className="lg:mr-4" />
          <span className="hidden lg:inline">Messages</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="flex justify-start"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark className="lg:mr-4" />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
};

export default MenuBar;
