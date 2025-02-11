import NavbarComponent from "@/components/navbar-component";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarComponent />
      <main
        className="transition-colors duration-300 p-4"
        style={{ height: "calc(100vh - 60px)" }}
      >
        {children}
      </main>
    </>
  );
}
