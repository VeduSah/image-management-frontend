import React, { useState } from 'react';
import axios from 'axios';

const UploadImageModal = ({ parentFolder, onClose, onImageUploaded }) => {
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size > 1 * 1024 * 1024) { // 1MB
            setError('File is too large. Max size is 1MB.');
            setFile(null);
        } else {
            setError('');
            setFile(selectedFile);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select an image file.');
            return;
        }

        setIsUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', file);
        formData.append('folderId', parentFolder);

        try {
            await axios.post('https://image-management-backend-green.vercel.app/api/images/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onImageUploaded();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Error uploading image');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Upload Image</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                
                {/* Disclaimer */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-yellow-800 text-sm">
                            <strong>Note:</strong> Maximum image size is 1MB. Supported formats: JPG, PNG, GIF, WEBP.
                        </p>
                    </div>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Image Name
                        </label>
                        <input 
                            type="text" 
                            name="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" 
                            required 
                            disabled={isUploading}
                            placeholder="Enter image name"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                            Image File
                        </label>
                        <input 
                            type="file" 
                            name="image" 
                            onChange={onFileChange} 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" 
                            accept="image/*" 
                            required 
                            disabled={isUploading}
                        />
                        {file && (
                            <p className="text-green-600 text-xs mt-1">
                                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isUploading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                </>
                            ) : (
                                'Upload'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadImageModal;