'use client'
import React, { useState, useEffect } from 'react';

interface SendChatProps {
    onClose: () => void; // Accept onClose as a prop
}

const SendChat: React.FC<SendChatProps> = ({ onClose }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<{ id: number; text: string; sender: 'me' | 'other' }[]>([]); // Store messages

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to send the message (this is where you would integrate with your backend)
        const newMessage = { id: messages.length + 1, text: message, sender: 'me' };
        setMessages((prev: any) => [...prev, newMessage]); // Add new message to state
        setMessage(''); // Clear the message input

        // Simulate receiving a message from the other party
        setTimeout(() => {
            const receivedMessage = { id: messages.length + 2, text: `Echo: ${newMessage.text}`, sender: 'other' };
            setMessages((prev: any) => [...prev, receivedMessage]); // Add received message
        }, 1000); // Simulate delay for receiving message

        // Optionally close the modal
        // onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Chat Team</h2>
                <div className="overflow-y-auto h-80 mb-4 border border-gray-300 rounded-md p-2">
                    {/* Display messages */}
                    {messages.map((msg) => (
                        <div key={msg.id} className={`p-2 rounded-lg mb-2 ${msg.sender === 'me' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
                            <span>{msg.text}</span>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSendMessage}>
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={2}
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                    <div className="flex justify-end mt-4">
                        <button type="button" onClick={onClose} className="mr-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400">
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SendChat;
