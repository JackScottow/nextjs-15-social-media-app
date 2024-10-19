import { Metadata } from "next";
import signupImage from "@/assets/signup-image.jpg";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

const page = () => {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-md border-2 bg-card shadow">
        <div className="w-full space-y-10 overflow-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Sign Up To NextBook</h1>
            <p className="text-muted-foreground">
              The <span className="italic">BEST</span> social media site
            </p>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link href="/login" className="block text-center hover:underline">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
        <Image
          src={signupImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
};

export default page;
