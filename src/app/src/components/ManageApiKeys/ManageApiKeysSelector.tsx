import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_API_URL } from "../constants";
import copyClipboard from "../photos/copy-svgrepo-com.svg";

const ManageApiKeysSelector = ({ setShowApiKeys }) => {
    const [generatedApiKey, setGeneratedApiKey] = useState("");
    const [apiKeysList, setApiKeysList] = useState<any[]>([]);
    const [popupGeneratedApiKey, setPopupGeneratedApiKey] = useState(false);
    const [popupExistingApiKey, setPopupExistingApiKey] = useState(false);
    const [copiedApiKeyId, setCopiedApiKeyId] = useState(null);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchApiKeys();

        const handleOutsideClick = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                setShowApiKeys(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const generateApiKey = async () => {
        try {
            const response = await fetch(`${BASE_API_URL}/auth/api-key/new`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({}),
            });
            if (response.ok) {
                const apiKeyData = await response.json();
                console.log(apiKeyData);
                setGeneratedApiKey(apiKeyData.api_key);
                toast.success("API Key generated successfully!");
            } else {
                console.error("Failed to generate API Key:", response.status);
                toast.error("Failed to generate API Key");
            }
        } catch (error) {
            console.error("Error generating API Key:", error);
            toast.error("Error generating API Key");
        }
    };

    const fetchApiKeys = async () => {
        try {
            const response = await fetch(
                `${BASE_API_URL}/auth/api-key/list`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                const apiKeyList = await response.json();
                console.log(apiKeyList);
                setApiKeysList(apiKeyList);
            } else {
                console.error(
                    "Failed to fetch API keys::",
                    response.status
                );
            }
        } catch (error) {
            console.error("Error fetching API keys:", error);
        }
    };

    const copyToClipboard = (apiKey, setPopup, apiKeyId = null) => {
        navigator.clipboard.writeText(apiKey);
        setPopup(true);
        if (apiKeyId !== null) {
            setCopiedApiKeyId(apiKeyId);
        }
        setTimeout(() => {
            setPopup(false);
            setCopiedApiKeyId(null);
        }, 15000);
    };

    // console.log(apiKeysList);
    // console.log(typeof apiKeysList);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div
                ref={modalRef}
                className="bg-white rounded-md p-4 md:p-8 w-full max-w-md relative py-10"
            >
                <span
                    className="absolute font-bold top-0 right-0 cursor-pointer bg-slate-300 text-2xl rounded-full pb-1 px-2.5 m-1 transition duration-300 hover:bg-gray-500 hover:text-white hover:scale-110"
                    onClick={() => setShowApiKeys(false)}
                >
                    &times;
                </span>
                {/* h-[74vh] overflow-auto */}
                <div className="p-3 px-4 bg-gray-200 rounded shadow-lg max-w-xl mx-auto mt-2 ">
                    <h3 className="text-lg md:text-xl font-bold text-center text-[#4a4b4c] underline underline-offset-2">API Key Management</h3>
                    <div className="mt-2 relative">
                        <input
                            type="text"
                            value={generatedApiKey}
                            readOnly
                            placeholder="Your API Key will appear here"
                            className="p-3 border rounded focus:outline-none bg-gray-100 w-full shadow-md"
                        />
                        <span className="absolute right-0 top-0 mt-3 mr-3 cursor-copy bg-slate-700 rounded" onClick={() => copyToClipboard(generatedApiKey, setPopupGeneratedApiKey)} title="Copy API Key">
                            <img src={copyClipboard} alt="copyClipboard" className="p-1" />
                        </span>
                        {popupGeneratedApiKey && generatedApiKey && (
                            <div className="absolute -right-4 md:right-0 -top-6 text-blue-600 font-bold p-0.5 rounded bg-white text-sm">
                                copied!
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-center mt-4">
                        <button
                            onClick={generateApiKey}
                            className="bg-[#449293] text-white rounded-md text-lg py-1.5 px-6 font-medium shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                            title="Click to Generate API Key"
                        >
                            Generate API Key
                        </button>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-md shadow-md max-w-lg mx-auto mt-4 relative">
                        <h2 className="text-[#727679] font-semibold text-lg mb-2">Existing API Keys</h2>
                        {apiKeysList.length > 0 ? (
                            <ul className="space-y-2 max-h-48 md:max-h-64 overflow-auto">
                                {apiKeysList.map(apiKey => (
                                    <li key={apiKey.id} className="flex items-center justify-between bg-white rounded-md p-3 shadow-sm border border-gray-200 relative">
                                        <span className="flex-1 truncate">{apiKey.api_key}</span>
                                        <img
                                            src={copyClipboard}
                                            alt="Copy to Clipboard"
                                            className="cursor-copy p-1 bg-slate-700"
                                            onClick={() => copyToClipboard(apiKey.api_key, setPopupExistingApiKey, apiKey.id)}
                                            title="Copy API Key"
                                        />
                                        {copiedApiKeyId === apiKey.id && (
                                            <div className="absolute right-10 md:right top-[0.8rem] text-blue-600 font-bold p-0.5 rounded bg-white text-sm">
                                                copied!
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No API keys found.</p>
                        )}
                    </div>
                </div>
            </div>
            {/* <ToastContainer /> */}
        </div>
    );
};

export default ManageApiKeysSelector;
