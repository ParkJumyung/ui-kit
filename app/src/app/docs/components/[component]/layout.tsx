import componentsData from "@/public/components.json";
import Footer from "@/app/components/Footer/Footer";
import Header from "@/app/components/Header/Header";

import Sidebar from "./Sidebar";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const subfolders = componentsData
    .filter((x) => x.name !== "utils")
    .map((x) => x.name);

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
