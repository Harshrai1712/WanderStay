import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import * as api from "../../api/requester";

const URL_TO_UPLOADS = 
    process.env.NODE_ENV === "development"
        ? "http://localhost:5001/uploads/"
        : "https://WanderStay-clone-64cu.onrender.com/uploads/";

function Register() {
    const [name, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");
    const [isEmpty, setIsEmpty] = useState(true);
    const navigate = useNavigate();

    const handleSubmit = async (ev) => {
        ev.preventDefault();

        const data = { name, email, password, profilePhoto };
        await api.register(data);
        navigate("/");
    };

    const uploadProfilePhoto = async (ev) => {
        const files = ev.target.files;
        if (files.length > 0) {
            const data = new FormData();
            data.append("photos", files[0]);
            
            try {
                const response = await api.uploadPhotoFromDevice(data);
                console.log("Profile photo uploaded:", response);
                if (response && response.length > 0) {
                    setProfilePhoto(response[0]);
                }
            } catch (error) {
                console.log("Upload error:", error);
            }
        }
    };

    useEffect(() => {
        const emptyInputs = !email && !password;

        setIsEmpty(emptyInputs);
    }, [name, email, password]);

    return (
        <div className="max-w-global mx-auto flex justify-center mt-20">
            <div className="flex flex-col">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form onSubmit={handleSubmit} className="max-w-md" action="">
                    {/* Profile Photo Upload */}
                    <div className="flex flex-col items-center mb-6">
                        {profilePhoto ? (
                            <div className="relative">
                                <img
                                    src={URL_TO_UPLOADS + profilePhoto}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                                />
                                <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-opacity-80">
                                    <AiOutlineCloudUpload size={20} />
                                    <input
                                        type="file"
                                        onChange={uploadProfilePhoto}
                                        accept="image/*"
                                        hidden
                                    />
                                </label>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-32 h-32 border-4 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-primary transition-colors">
                                <FaRegUserCircle size={40} className="text-gray-400 mb-2" />
                                <span className="text-xs text-gray-500 text-center px-2">Upload Photo</span>
                                <input
                                    type="file"
                                    onChange={uploadProfilePhoto}
                                    accept="image/*"
                                    hidden
                                />
                            </label>
                        )}
                        <p className="text-sm text-gray-500 mt-2">Profile Photo (Optional)</p>
                    </div>

                    <input
                        type="text"
                        placeholder="Mario Angelov"
                        value={name}
                        onChange={(ev) => setUsername(ev.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                    />
                    <button disabled={isEmpty} className="primary mt-5">Register</button>
                </form>
                <div className="text-center mt-4">
                    Already have an account?{" "}
                    <Link className="font-semibold underline" to={"/login"}>
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
