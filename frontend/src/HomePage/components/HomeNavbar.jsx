import logo from "../../assets/logo.png";
import location from "../../assets/location.svg";
import list from "../../assets/list.svg";
import profile from "../../assets/profile.svg";
import { NavLink } from "react-router-dom";

function HomeNavbar() {
  return (
    <div className="outer flex justify-between px-16 pb-2">
      {/* Left Section */}
      <div className="left flex items-center gap-10">
        <img src={logo} className="w-48 h-10 mt-2" />
        <div className="location flex items-center cursor-pointer">
          <img src={location} alt="Location" className="w-[35px] h-[35px]" />
          <h1 className="text-lg font-semibold">Ncr Sec</h1>
        </div>
      </div>

      {/* Center Section - Navigation Links */}
      <div className="center flex gap-10 items-center">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `text-xl font-semibold cursor-pointer hover:scale-110 ${
              isActive ? "text-[#1ac073]" : "hover:text-[#1ac073]"
            }`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/summary"
          className={({ isActive }) =>
            `text-xl font-semibold cursor-pointer hover:scale-110 ${
              isActive ? "text-[#1ac073]" : "hover:text-[#1ac073]"
            }`
          }
        >
          Summary
        </NavLink>

        <NavLink
          to="/polls"
          className={({ isActive }) =>
            `text-xl font-semibold cursor-pointer hover:scale-110 ${
              isActive ? "text-[#1ac073]" : "hover:text-[#1ac073]"
            }`
          }
        >
          Polls
        </NavLink>
      </div>

      {/* Right Section */}
      <div className="right flex gap-10 items-center">
        <img src={list} alt="List" className="w-[35px] h-[35px] cursor-pointer" />
        <img src={profile} alt="Profile" className="w-[35px] h-[35px] cursor-pointer" />
      </div>
    </div>
  );
}

export default HomeNavbar;
