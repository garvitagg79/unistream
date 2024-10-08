import { Sidebar, SidebarSkeleton } from "./_components/sidebar";
import { NavBar } from "./_components/navbar";
import { Container } from "./_components/container";
import { Suspense } from "react";

const BrowseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavBar />
      <div className="flex h-full pt-20">
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar />
        </Suspense>
        <Container>{children}</Container>
      </div>
    </>
  );
};

export default BrowseLayout;
