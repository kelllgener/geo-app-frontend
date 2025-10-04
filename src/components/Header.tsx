import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const Header = () => {
    const { user, logout } = useContext(AuthContext);

  return (
    <header className="flex justify-between items-center bg-gray-800 px-4 text-white p-4">
      <div>
        <h1 className="text-xl font-bold">Geo-App</h1>
      </div>

      <div className="dropdown">
        <div tabIndex={0} role="button" className="cursor-pointer m-1 flex gap-2 items-center">
          {user?.name}
          <ChevronDownIcon className="h-5" />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-1 w-25 p-2 text-black shadow-sm"
        >
          <li>
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
