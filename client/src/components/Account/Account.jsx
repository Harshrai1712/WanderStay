import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountNav from "./AccountNav";
import { UserContext } from "../../context/UserContext";
import ClipLoader from "react-spinners/ClipLoader";
import { FaRegUserCircle } from "react-icons/fa";
import { AiOutlineCloudUpload } from "react-icons/ai";
import * as api from '../../api/requester'

const URL_TO_UPLOADS = 
    process.env.NODE_ENV === "development"
        ? "http://localhost:4000/uploads/"
        : "https://wanderstay-backend-ll12.onrender.com/uploads/";

function Account() {
    const { user, ready, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);

    // Debug: Log user data
    console.log('Account - User data:', user);
    console.log('Account - Profile photo:', user?.profilePhoto);
    console.log('Account - Full URL:', user?.profilePhoto ? URL_TO_UPLOADS + user.profilePhoto : 'No photo');

    if (!ready) {
        return (
            <div className="flex flex-col items-center justify-center mt-32">
                <ClipLoader className="mb-4"/>
                <span>Loading...</span>
            </div>
        );
    }

    if (ready && !user) {
        return navigate("/login");
    }

    const onLogout = async () => {
        await api.logout();
        setUser(null);
        navigate('/')
    }

    const uploadProfilePhoto = async (ev) => {
        const files = ev.target.files;
        if (files.length > 0) {
            setUploading(true);
            const data = new FormData();
            data.append("photos", files[0]);
            
            try {
                const response = await api.uploadPhotoFromDevice(data);
                console.log("Profile photo uploaded:", response);
                
                if (response && response.length > 0) {
                    const photoFilename = response[0];
                    
                    // Update profile with new photo
                    const updatedUser = await api.updateProfile({ profilePhoto: photoFilename });
                    console.log("Profile updated:", updatedUser);
                    
                    if (updatedUser) {
                        setUser(updatedUser);
                    }
                }
            } catch (error) {
                console.log("Upload error:", error);
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <div>
            <AccountNav />
            <div className="flex flex-col items-center justify-center mt-16">
                {/* Profile Photo */}
                <div className="relative">
                    {user.profilePhoto ? (
                        <img 
                            src={URL_TO_UPLOADS + user.profilePhoto} 
                            alt={user.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-lg mb-4"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4 border-4 border-primary shadow-lg">
                            <FaRegUserCircle size={80} className="text-gray-400" />
                        </div>
                    )}
                    
                    {/* Upload button overlay */}
                    <label className="absolute bottom-3 right-0 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-opacity-80 shadow-lg">
                        {uploading ? (
                            <ClipLoader size={20} color="white" />
                        ) : (
                            <AiOutlineCloudUpload size={24} />
                        )}
                        <input
                            type="file"
                            onChange={uploadProfilePhoto}
                            accept="image/*"
                            disabled={uploading}
                            hidden
                        />
                    </label>
                </div>
                
                <h1 className="text-3xl mb-1">Welcome {user.name}</h1>
                <p>{user.email}</p>
                <button onClick={onLogout} className="primary max-w-xs md:max-w-md mt-4">Logout</button>
            </div>
        </div>
    );
}

export default Account;
