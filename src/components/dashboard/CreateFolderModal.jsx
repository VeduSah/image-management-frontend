import React, { useState } from 'react';
import axios from 'axios';

const CreateFolderModal = ({ parentFolder, onClose, onFolderCreated }) => {
    const [name, setName] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://image-management-backend-green.vercel.app/api/folders', { name, parentFolder: parentFolder === 'root' ? null : parentFolder });
            onFolderCreated();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Error creating folder');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Create New Folder</h2>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Folder Name</label>
                        <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFolderModal;