import { Button } from "@/components/ui/button";
import { Bell, Bookmark, Home, Mail } from "lucide-react";
import Link from "next/link";
import NotificationsButton from "./NotificationsButton";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import MessagesButton from "./MessagesButton";
import streamServerClient from "@/lib/stream";

interface MenuBarProps {
  className?: string;
}

const MenuBar = async ({ className }: MenuBarProps) => {
  const { user } = await validateRequest();

  if (!user) return null;

  const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

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
        initialState={{ unreadCount: unreadNotificationsCount }}
      />

      <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />

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
