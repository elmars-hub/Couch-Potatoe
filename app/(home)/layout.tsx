import Header from "@/components/ui/functional/header";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-[50dvh] flex flex-col">
      <Header />
      <div className="max-w-screen-xl mx-auto w-full min-h-[80dvh]">
        {children}
      </div>
    </div>
  );
}
