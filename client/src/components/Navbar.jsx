import React, { useEffect } from "react";
import DesktopSidebar from "./DesktopSidebar";
import MobileNav from "./MobileNav";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserThunk } from "../store/features/user/user.thunk";
import { getAllInterviewReportsThunk } from "../store/features/interview/interview.thunk";



const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const  user  = useSelector(state => state.user.user);
  const allInterviewReports = useSelector(state => state.interview.allInterviewReports);
  const loading = useSelector(state => state.interview.loading);
  const profileLoading = useSelector(state => state.user.profileLoading);


  const initials = user?.fullname || user?.username
    ? user.username.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const onLogout = async () => {
    await dispatch(logoutUserThunk()).unwrap();
    navigate("/login", { replace: true });
  };

  const fetchAllReports = async () => {
    if(allInterviewReports.length == 0) 
      await dispatch(getAllInterviewReportsThunk()).unwrap();
  }

  useEffect(()=>{
      dispatch(getAllInterviewReportsThunk()).unwrap();
  },[dispatch])



  const Avatar = ({ size = "w-7 h-7", radius = "rounded-lg" }) =>
    user?.profilePicture ? (
      <img src={user.profilePicture} alt={user.fullname} className={`${size} ${radius} object-cover shrink-0`} />
    ) : (
      <div
        className={`${size} ${radius} shrink-0 flex items-center justify-center text-white text-xs font-bold`}
        style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
      >
        {initials}
      </div>
    );


  return (
    <div className={`${(loading || profileLoading)?"pointer-events-none":""}`} >
      <DesktopSidebar Avatar={Avatar} user={user} onLogout={onLogout} fetchAllReports={fetchAllReports}/>
      <MobileNav Avatar={Avatar} user={user} onLogout={onLogout} fetchAllReports={fetchAllReports}/>
    </div>
  );
};

export default Navbar;
