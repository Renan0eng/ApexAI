import HomeFooter from "@/sections/public/home-footer";
import HomeTopNav from "@/sections/public/home-top-nav";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main style={{
      backgroundImage: "/background.png",
      backgroundAttachment: "fixed",
    }}>
      {/* Top nav */}
      <HomeTopNav />
      {children}
      {/* footer */}
      <HomeFooter />
    </main>
  );
}