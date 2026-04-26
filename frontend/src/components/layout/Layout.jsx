import Player from "./Player";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-night text-white">
      <div className="pointer-events-none absolute inset-0 bg-beat-radial" />
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-beatPurple/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-12 right-0 h-96 w-96 rounded-full bg-beatPink/10 blur-3xl" />

      <div className="relative z-10 flex min-h-screen gap-4 p-3 sm:p-4 lg:gap-6 lg:p-6">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />

          <main className="scrollbar-hidden flex-1 overflow-y-auto px-1 pb-36 pt-4 sm:px-2 lg:px-0">
            {children}
          </main>
        </div>
      </div>

      <Player />
    </div>
  );
};

export default Layout;
