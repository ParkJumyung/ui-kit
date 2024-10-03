import Footer from "@/app/components/Footer/Footer";
import Header from "@/app/components/Header/Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full flex-col grow h-full">
      <Header />
      <main className="mt-10 w-full h-full grow py-6 px-40 flex items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
