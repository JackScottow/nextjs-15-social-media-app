import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 bg-card shadow">
      <div className="mx-auto flex max-w-7xl flex-shrink items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="text-xl font-bold">
          Next<span className="text-primary">Book</span>
        </Link>
        <SearchField />
        <UserButton className="sm:ms-auto" />
      </div>
    </header>
  );
};

export default Navbar;
