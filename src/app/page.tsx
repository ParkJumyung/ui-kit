import Image from "next/image";
import Link from "next/link";

import Banner from "@/app/assets/Banner.svg";
import Button from "@/components/Button/Button";

export default function Home() {
  return (
    <main className="flex w-full flex-col gap-14 min-h-screen items-center justify-center">
      <div className="flex flex-col items-center w-screen bg-primary p-10 gap-8">
        <Image src={Banner} alt="Banner" className="w-1/2"></Image>
        <div className="flex gap-4 items-center font-medium">
          <span>Based on</span>
          <div className="flex w-14 h-[1px] bg-dark_white"></div>
          <span>Ziggle</span>
        </div>
      </div>
      <Link href={"/docs/components/button"}>
        <Button>Docs</Button>
      </Link>
    </main>
  );
}
