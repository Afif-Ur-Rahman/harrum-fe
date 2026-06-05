import React from "react";

function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="  w-full flex flex-col items-center ">
        <div className="flex flex-col gap-20 min-h-screen w-full px-3 sm:px-4 md:px-6 lg:px-6  py-12 max-w-7xl z-30">
          {children}
        </div>
      </div>
    </>
  );
}

export default PageLayout;
