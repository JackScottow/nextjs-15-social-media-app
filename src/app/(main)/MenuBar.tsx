import { Button } from "@/components/ui/button";
import { Bell, Bookmark, Home, Mail } from "lucide-react";
import Link from "next/link";

interface MenuBarProps {
  className?: string;
}

const MenuBar = ({ className }: MenuBarProps) => {
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

      <Button
        variant="ghost"
        className="flex justify-start"
        title="Notifications"
        asChild
      >
        <Link href="/notifications">
          <Bell className="lg:mr-4" />
          <span className="hidden lg:inline">Notifications</span>
        </Link>
      </Button>

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
