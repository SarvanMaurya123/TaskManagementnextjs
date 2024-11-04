// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const CreateTaskForm: React.FC = () => {
//     const [userId, setUserId] = useState<string | null>(null);
//     const [title, setTitle] = useState<string>('');
//     const [description, setDescription] = useState<string>('');
//     const [priority, setPriority] = useState<string>('Medium');
//     const [deadline, setDeadline] = useState<string>('');
//     const [status, setStatus] = useState<string>('Pending');
//     const [attachments, setAttachments] = useState<File[]>([]);

//     // Retrieve userId from session storage when component mounts
//     useEffect(() => {
//         const storedUserId = sessionStorage.getItem('userId');
//         if (storedUserId) {
//             setUserId(storedUserId);
//         } else {
//             console.error('User ID not found in session storage');
//         }
//     }, []);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         // Validate userId is present
//         if (!userId) {
//             toast.error('User ID is not available. Please log in again.');
//             return;
//         }

//         // Validate deadline
//         if (new Date(deadline) < new Date()) {
//             toast.error('Deadline cannot be in the past');
//             return;
//         }

//         // Prepare task data
//         const formData = new FormData();
//         formData.append('title', title);
//         formData.append('description', description);
//         formData.append('assignedTo', userId);
//         formData.append('priority', priority);
//         formData.append('deadline', deadline);
//         formData.append('status', status);
//         attachments.forEach((file) => formData.append('attachments', file));

//         try {
//             const response = await axios.post('/api/admin/teamleader/task/', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             console.log('API Response:', response.data); // Log the response
//             toast.success(response.data.message);

//             // Reset form fields
//             setTitle('');
//             setDescription('');
//             setPriority('Medium');
//             setDeadline('');
//             setAttachments([]);
//         } catch (err: any) {
//             console.error('Error creating task:', err.response?.data);
//             toast.error(err.response?.data?.message || 'An error occurred while creating the task');
//         }
//     };

//     const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) {
//             setAttachments(Array.from(e.target.files));
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
//             <h2 className="text-xl font-bold mb-4">Create Task</h2>

//             <div className="mb-4">
//                 <label className="block mb-1" htmlFor="title">Title</label>
//                 <input
//                     type="text"
//                     id="title"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     required
//                     className="w-full p-2 border border-gray-300 rounded"
//                 />
//             </div>

//             <div className="mb-4">
//                 <label className="block mb-1" htmlFor="description">Description</label>
//                 <textarea
//                     id="description"
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     required
//                     className="w-full p-2 border border-gray-300 rounded"
//                 />
//             </div>

//             <div className="mb-4">
//                 <label className="block mb-1" htmlFor="priority">Priority</label>
//                 <select
//                     id="priority"
//                     value={priority}
//                     onChange={(e) => setPriority(e.target.value)}
//                     className="w-full p-2 border border-gray-300 rounded"
//                 >
//                     <option value="Low">Low</option>
//                     <option value="Medium">Medium</option>
//                     <option value="High">High</option>
//                 </select>
//             </div>

//             <div className="mb-4">
//                 <label className="block mb-1" htmlFor="deadline">Deadline</label>
//                 <input
//                     type="date"
//                     id="deadline"
//                     value={deadline}
//                     onChange={(e) => setDeadline(e.target.value)}
//                     required
//                     className="w-full p-2 border border-gray-300 rounded"
//                 />
//             </div>

//             <div className="mb-4">
//                 <label className="block mb-1" htmlFor="status">Status</label>
//                 <select
//                     id="status"
//                     value={status}
//                     onChange={(e) => setStatus(e.target.value)}
//                     className="w-full p-2 border border-gray-300 rounded"
//                 >
//                     <option value="Pending">Pending</option>
//                     <option value="In Progress">In Progress</option>
//                     <option value="Completed">Completed</option>
//                 </select>
//             </div>

//             <div className="mb-4">
//                 <label className="block mb-1" htmlFor="attachments">Attachments</label>
//                 <input
//                     type="file"
//                     id="attachments"
//                     onChange={handleAttachmentChange}
//                     multiple
//                     className="w-full p-2 border border-gray-300 rounded"
//                 />
//             </div>

//             <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//                 Create Task
//             </button>
//         </form>
//     );
// };

// export default CreateTaskForm;
