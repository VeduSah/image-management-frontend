import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateFolderModal from './CreateFolderModal.jsx';
import UploadImageModal from './UploadImageModal.jsx';
import Spinner from '../layout/Spinner.jsx';

const Dashboard = () => {
    const [contents, setContents] = useState({ subFolders: [], images: [] });
    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [path, setPath] = useState([{ _id: 'root', name: 'My Drive' }]);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    
    const currentFolderId = path[path.length - 1]._id;
    const isRootFolder = currentFolderId === 'root';

    // Check screen size on resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchContents = useCallback(async () => {
        setLoading(true);
        setSearchResults(null);
        setSearchQuery('');
        try {
            const res = await axios.get(`https://image-management-backend-green.vercel.app/api/folders/${currentFolderId}`);
            setContents(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load folder contents');
        }
        setLoading(false);
    }, [currentFolderId]);

    useEffect(() => {
        fetchContents();
    }, [fetchContents]);
    
    const handleSearch = async (e) => {
        e.preventDefault();
        const query = searchQuery.trim();
        
        if (!query) {
            // If search is empty, show current folder contents
            setSearchResults(null);
            return;
        }
        
        setLoading(true);
        try {
            const res = await axios.get(`https://image-management-backend-green.vercel.app/api/images/search?q=${encodeURIComponent(query)}`);
            setSearchResults(res.data);
            
            if (res.data.length === 0) {
                toast.info(`No images found for "${query}"`);
            } else {
                toast.success(`Found ${res.data.length} image${res.data.length !== 1 ? 's' : ''} for "${query}"`);
            }
        } catch (err) {
            console.error('Search error:', err);
            setSearchResults([]);
            toast.error('Search failed. Please try again.');
        }
        setLoading(false);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchResults(null);
        toast.info('Search cleared');
        fetchContents();
    };

    const handleFolderClick = (folder) => {
        setPath([...path, folder]);
        setSearchResults(null);
        setSearchQuery('');
        toast.info(`Opened folder: ${folder.name}`);
    };

    const handleBreadcrumbClick = (index) => {
        const clickedFolder = path[index];
        setPath(path.slice(0, index + 1));
        setSearchResults(null);
        setSearchQuery('');
        if (index < path.length - 1) {
            toast.info(`Navigated to: ${clickedFolder.name}`);
        }
    };

    const itemsToDisplay = searchResults ? { subFolders: [], images: searchResults } : contents;

    return (
        <div className="container mx-auto p-2 md:p-4">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4 bg-white p-3 rounded-lg shadow">
                <div className="w-full">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
                        <input 
                            type="search" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for images..." 
                            className="flex-1 p-3 md:p-2 border rounded text-base"
                        />
                        <div className="flex gap-2">
                            <button 
                                type="submit" 
                                className="flex-1 bg-blue-500 text-white px-4 py-3 md:py-2 rounded hover:bg-blue-600 text-base"
                            >
                                Search
                            </button>
                            {searchResults && (
                                <button 
                                    type="button" 
                                    onClick={handleClearSearch}
                                    className="flex-1 bg-gray-500 text-white px-4 py-3 md:py-2 rounded hover:bg-gray-600 text-base"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </form>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button 
                        onClick={() => setShowImageModal(true)} 
                        className={`flex-1 text-white px-4 py-3 md:py-2 rounded text-base ${
                            isRootFolder 
                                ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                                : 'bg-green-500 hover:bg-green-600'
                        }`}
                        disabled={isRootFolder}
                        title={isRootFolder ? "Please select a folder to upload images" : "Upload Image"}
                    >
                        {isMobile ? 'Upload' : 'Upload Image'}
                        {isRootFolder && (
                            <span className="ml-1 text-xs">(Select folder)</span>
                        )}
                    </button>
                    <button 
                        onClick={() => setShowFolderModal(true)} 
                        className="flex-1 bg-blue-500 text-white px-4 py-3 md:py-2 rounded hover:bg-blue-600 text-base"
                    >
                        {isMobile ? 'Folder' : 'Create Folder'}
                    </button>
                </div>
            </div>

            {/* Breadcrumbs - Hide when searching */}
            {!searchResults && (
                <nav className="flex mb-4 overflow-x-auto" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3 whitespace-nowrap">
                        {path.map((p, index) => (
                            <li key={p._id} className="inline-flex items-center">
                                <button onClick={() => handleBreadcrumbClick(index)} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                                    {index > 0 && ( <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg> )}
                                    {p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name}
                                </button>
                            </li>
                        ))}
                    </ol>
                </nav>
            )}
            
            {searchResults && (
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                    <h2 className="text-xl font-bold">
                        Search Results for "{searchQuery.length > 20 ? searchQuery.substring(0, 20) + '...' : searchQuery}"
                    </h2>
                    <span className="text-sm text-gray-600">
                        {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                    </span>
                </div>
            )}

            {loading ? <Spinner /> : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {/* Display Folders - only show when not searching */}
                    {!searchResults && itemsToDisplay.subFolders.map(folder => (
                        <div key={folder._id} onClick={() => handleFolderClick(folder)} className="p-3 bg-white rounded-lg shadow cursor-pointer text-center hover:bg-gray-50">
                            <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg>
                            <p className="mt-2 text-sm truncate">{folder.name}</p>
                        </div>
                    ))}
                    {/* Display Images */}
                    {itemsToDisplay.images.map(image => (
                        <div key={image._id} className="p-2 bg-white rounded-lg shadow text-center">
                            <img src={image.imageUrl} alt={image.name} className="w-full h-24 md:h-32 object-cover rounded"/>
                            <p className="mt-2 text-sm truncate">{image.name}</p>
                        </div>
                    ))}
                </div>
            )}

            {itemsToDisplay.subFolders.length === 0 && itemsToDisplay.images.length === 0 && !loading && (
                <p className="text-center text-gray-500 mt-8">
                    {searchResults ? 'No images found matching your search.' : 'This folder is empty.'}
                </p>
            )}

            {showFolderModal && (
                <CreateFolderModal 
                    parentFolder={currentFolderId} 
                    onClose={() => setShowFolderModal(false)} 
                    onFolderCreated={() => {
                        fetchContents();
                        toast.success('Folder created successfully!');
                    }} 
                />
            )}
            
            {showImageModal && (
                <UploadImageModal 
                    parentFolder={currentFolderId} 
                    onClose={() => setShowImageModal(false)} 
                    onImageUploaded={() => {
                        fetchContents();
                        toast.success('Image uploaded successfully!');
                    }} 
                />
            )}
        </div>
    );
};

export default Dashboard;