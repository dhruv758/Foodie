import logo from "../../assets/logo.png";
import location from "../../assets/location.svg";
import list from "../../assets/list.svg";
import profile from "../../assets/profile.svg";
import { NavLink } from "react-router-dom";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

function HomeNavbar() {
  return (
    <div className="outer flex justify-between px-16 py-3">
      {/* Left Section */}
      <div className="left flex items-center gap-10">
        <img src={logo} className="w-40 h-8 mt-2" />
        <div className="location flex items-center cursor-pointer">
          <img src={location} alt="Location" className="w-[30px] h-[30px]" />
          <h1 className="text-lg font-medium">Ncr Sec</h1>
        </div>
      </div>

      {/* Center Section - Navigation Links */}
      <div className="center flex gap-10 items-center">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `text-xl font-medium cursor-pointer hover:scale-110 ${
              isActive ? "text-[#1ac073]" : "hover:text-[#1ac073]"
            }`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/summary"
          className={({ isActive }) =>
            `text-xl font-medium cursor-pointer hover:scale-110 ${
              isActive ? "text-[#1ac073]" : "hover:text-[#1ac073]"
            }`
          }
        >
          Summary
        </NavLink>

        <NavLink
          to="/polls"
          className={({ isActive }) =>
            `text-xl font-medium cursor-pointer hover:scale-110 ${
              isActive ? "text-[#1ac073]" : "hover:text-[#1ac073]"
            }`
          }
        >
          Polls
        </NavLink>
      </div>

      {/* Right Section */}
      <div className="right flex gap-10 items-center">
        <img src={list} alt="List" className="w-[30px] h-[30px] cursor-pointer" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <img
              src={profile}
              alt="Profile"
              className="w-[30px] h-[30px] cursor-pointer"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-white border-gray-400">
            <DropdownMenuItem className='text-gray-500 cursor-pointer font-medium' onClick={() => console.log("Change Password clicked")}>
              Change Password
            </DropdownMenuItem>
            <DropdownMenuSeparator className='bg-gray-400' />
            <DropdownMenuItem onClick={() => console.log("Logout clicked")} className="text-red-400 cursor-pointer font-medium">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default HomeNavbar;
