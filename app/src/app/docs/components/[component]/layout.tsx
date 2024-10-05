import fs from "fs";
import path from "path";

import Footer from "@/app/components/Footer/Footer";
import Header from "@/app/components/Header/Header";

import Sidebar from "./Sidebar";

function getSubfolders(directoryPath: string): string[] {
  const fullPath = path.join(process.cwd(), directoryPath);
  return fs.readdirSync(fullPath).filter((file: string) => {
    const filePath = path.join(fullPath, file);
    return fs.statSync(filePath).isDirectory();
  });
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const subfolders = getSubfolders("src/components");
  console.log(subfolders);

  return (
    <div className="flex w-full flex-col justify-center h-full">
      <Header />
      <div className="flex h-full relative w-full justify-center pl-40">
        <Sidebar subfolders={subfolders} />
        <main className="w-full h-full max-w-3xl grow py-6 mx-40 flex items-center justify-center">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
