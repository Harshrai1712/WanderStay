import axios from "axios";
import React, { useState } from "react";
import {
    AiOutlineCloudUpload,
    AiOutlineStar,
    AiFillStar,
} from "react-icons/ai";
import { RiDeleteBin7Line } from "react-icons/ri";
import * as api from "../../api/requester";

const URL_TO_UPLOADS =
    process.env.NODE_ENV === "development"
        ? "http://localhost:5001/uploads/"
        : "https://wanderstay-backend-ll12.onrender.com/uploads/";

function UploadPhotos({ uploadPhotos, setUploadPhotos }) {
    const [uploadPhotoByLink, setUploadPhotoByLink] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    async function uploadFromLink(ev) {
        ev.preventDefault();
        if (!uploadPhotoByLink.trim()) {
            alert('Please enter a valid image URL');
            return;
        }

        try {
            setIsUploading(true);
            console.log('Starting upload from link:', uploadPhotoByLink);
            
            const response = await api.uploadPhotoFromLink(uploadPhotoByLink);
            console.log('Upload from link response:', response);
            
            if (response) {
                setUploadPhotos((prev) => [...prev, response]);
                setUploadPhotoByLink("");
            } else {
                throw new Error('No response from server');
            }
        } catch (error) {
            console.error('Upload from link error:', error);
            alert(`Failed to upload image: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    }

    async function uploadFromDevice(ev) {
        const files = Array.from(ev.target.files);
        if (files.length === 0) return;

        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append("photos", files[i]);
        }
        
        try {
            setIsUploading(true);
            console.log('Starting upload from device, files:', files.length);
            
            const response = await api.uploadPhotoFromDevice(data);
            console.log('Upload from device response:', response);
            
            if (response && Array.isArray(response)) {
                setUploadPhotos((prev) => [...prev, ...response]);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Upload from device error:', error);
            alert(`Failed to upload images: ${error.message}`);
        } finally {
            setIsUploading(false);
            // Clear the file input
            ev.target.value = '';
        }
    }

    const deletePhoto = (ev, photo) => {
        ev.preventDefault();
        setUploadPhotos([
            ...uploadPhotos.filter((currentPhoto) => currentPhoto !== photo),
        ]);
    };

    const coverPhoto = (ev, photo) => {
        ev.preventDefault();
        setUploadPhotos([
            photo,
            ...uploadPhotos.filter((currentPhoto) => currentPhoto !== photo),
        ]);
    };

    return (
        <>
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Paste URL here..."
                    value={uploadPhotoByLink}
                    onChange={(ev) => setUploadPhotoByLink(ev.target.value)}
                    disabled={isUploading}
                    className={isUploading ? 'opacity-50' : ''}
                />
                <button
                    onClick={uploadFromLink}
                    disabled={isUploading}
                    className={`border rounded-2xl px-4 grow ${
                        isUploading 
                            ? 'opacity-50 cursor-not-allowed bg-gray-200' 
                            : 'hover:bg-gray-100'
                    }`}
                >
                    {isUploading ? 'Uploading...' : 'Add photo'}
                </button>
            </div>
            <div className="grid gap-2 mt-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {uploadPhotos.length > 0 &&
                    uploadPhotos.map((photo) => (
                        <div className="flex relative" key={photo}>
                            <img
                                className="rounded-2xl aspect-square object-cover"
                                src={URL_TO_UPLOADS + photo}
                                alt=""
                            />
                            <button
                                onClick={(ev) => coverPhoto(ev, photo)}
                                className="bg-neutral-900 bg-opacity-60 px-2 py-1 rounded-full text-white absolute top-3 left-3"
                            >
                                {photo === uploadPhotos[0] && (
                                    <AiFillStar size={26} />
                                )}
                                {photo !== uploadPhotos[0] && (
                                    <AiOutlineStar size={26} />
                                )}
                            </button>
                            <button
                                onClick={(ev) => deletePhoto(ev, photo)}
                                className="bg-neutral-900 bg-opacity-60 px-2 py-1 rounded-full text-white absolute bottom-3 right-3"
                            >
                                <RiDeleteBin7Line size={26} />
                            </button>
                        </div>
                    ))}
            </div>
            <label className={`flex h-32 mt-2 max-w-lg md:max-w-xs items-center justify-center gap-1 border bg-transparent rounded-2xl text-gray-500 ${
                isUploading 
                    ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                    : 'cursor-pointer hover:bg-gray-50'
            }`}>
                <AiOutlineCloudUpload size={38} />
                {isUploading ? 'Uploading...' : 'Upload from device'}
                <input
                    onChange={uploadFromDevice}
                    type="file"
                    multiple
                    hidden
                    disabled={isUploading}
                />
            </label>
        </>
    );
}

export default UploadPhotos;
