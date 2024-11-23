import TrendingBar from "@/components/TrendingBar";
import { Metadata } from "next";
import Bookmarks from "./Bookmarks";
export const metadata: Metadata = {
  title: "Bookmarks",
};
export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded bg-card p-5 shadow">
          <h1 className="text-center text-2xl font-bold">Bookmarks</h1>
        </div>
        <Bookmarks />
      </div>
      <TrendingBar />
    </main>
  );
}