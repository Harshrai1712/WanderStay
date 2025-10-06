import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { PiPaperPlane } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaRegUserCircle } from "react-icons/fa";
import { BiSearchAlt2 } from "react-icons/bi";
import { AiOutlineHome } from "react-icons/ai";
import { UserContext } from "../../context/userContext";

const URL_TO_UPLOADS = 
    process.env.NODE_ENV === "development"
        ? "http://localhost:5001/uploads/"
        : "https://WanderStay-clone-64cu.onrender.com/uploads/";

function Navbar() {
    const { user } = useContext(UserContext);

    return (
        <div>
            <div className="flex justify-between max-w-global mx-auto">
                <Link to={"/"} className="flex items-center gap-1">
                    <PiPaperPlane className="text-primary" size={30} />
                    <h1 className="text-2xl font-bold text-primary">WanderStay</h1>
                </Link>
                {/* second section */}
                <div className="hidden md:flex items-center gap-3 border rounded-full px-6 py-1 shadow-md shadow-gray-200">
                    <div>Anywhere</div>
                    <div className="border-l border-gray-300">&nbsp;</div>
                    <div>Any week</div>
                    <div className="border-l border-gray-300">&nbsp;</div>
                    <div>Add Guests</div>
                    <div className="border rounded-3xl p-2 bg-primary text-white">
                        <BiSearchAlt2 size={18} />
                    </div>
                </div>
                {/* third section */}
                <div className="flex items-center gap-3">
                    {user && (
                        <Link
                            to={"/"}
                            aria-label="Home"
                            className="flex items-center gap-2 border rounded-3xl py-2 px-4 shadow-md shadow-gray-100 hover:shadow-lg transition-shadow"
                        >
                            <AiOutlineHome size={20} />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                    )}
                    <Link
                        to={user ? "/account" : "/login"}
                        aria-label="User"
                        className="flex gap-3 items-center border rounded-3xl py-2 px-5 shadow-md shadow-gray-100 hover:shadow-lg transition-all"
                    >
                        <RxHamburgerMenu size={24} />
                        {user && user.profilePhoto ? (
                            <img 
                                src={URL_TO_UPLOADS + user.profilePhoto}
                                alt={user.name}
                                className="w-8 h-8 rounded-full object-cover border-2 border-primary"
                            />
                        ) : (
                            <FaRegUserCircle size={24} />
                        )}
                        {user && (
                            <span className="hidden md:inline text-sm font-medium">
                                {user.name}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
