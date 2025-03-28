import logo from "../../assets/logo.png";
import location from "../../assets/location.svg";
import list from "../../assets/list.svg";
import profile from "../../assets/profile.svg";

function HomeNavbar() {
  return (
    <div className="outer flex justify-between px-16 pb-2">
      <div className="left flex items-center gap-10">
        <img src={logo} className="w-48 h-10 mt-2" />
        <div className="location flex items-center cursor-pointer">
          <img src={location} alt="" className="w-[35px] h-[35px]" />
          <h1 className="text-lg font-semibold">Ncr Sec</h1>
        </div>
      </div>
      <div className="center flex gap-10 items-center">
        <h1 className="text-xl font-semibold cursor-pointer hover:scale-110 hover:text-[#1ac073]">
          Home
        </h1>
        <h1 className="text-xl font-semibold cursor-pointer hover:scale-110 hover:text-[#1ac073]">
          Summary
        </h1>
        <h1 className="text-xl font-semibold cursor-pointer hover:scale-110 hover:text-[#1ac073]">
          Polls
        </h1>
      </div>
      <div className="right flex gap-10 items-center">
        <img src={list} alt="" className="w-[35px] h-[35px] cursor-pointer" />
        <img
          src={profile}
          alt=""
          className="w-[35px] h-[35px] cursor-pointer"
        />
      </div>
    </div>
  );
}

export default HomeNavbar;
