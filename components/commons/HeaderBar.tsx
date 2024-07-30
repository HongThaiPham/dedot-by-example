import Link from "next/link";
import ConnectWalletButton from "./ConnectWalletButton";
import NetworkSelect from "./NetworkSelect";

const HeaderBar = () => {
  return (
    <header className="sticky flex top-0 h-16 items-center justify-between gap-4 border-b bg-white">
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-2xl">
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-2 rounded-sm">
                dedot
              </span>{" "}
              by Example
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <NetworkSelect />
          <ConnectWalletButton />
        </div>
      </nav>
    </header>
  );
};

export default HeaderBar;
