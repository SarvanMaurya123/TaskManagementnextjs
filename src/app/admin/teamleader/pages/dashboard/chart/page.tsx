'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define the type for chart data
interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
    }[];
}

interface DepartmentCount {
    _id: string;
    count: number;
}

const DepartmentChart = () => {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/admindashboard/chartdeveloper', { signal: controller.signal });
                const data = response.data;

                if (!data.departmentCounts || !Array.isArray(data.departmentCounts)) {
                    throw new Error('Invalid data format received.');
                }

                const labels = data.departmentCounts.map((dept: DepartmentCount) => dept._id);
                const counts = data.departmentCounts.map((dept: DepartmentCount) => dept.count);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Number of Users',
                            data: counts,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                });
                setError(null);
            } catch (error: any) {
                if (axios.isCancel(error)) {
                    console.log("Request canceled:", error.message);
                } else {
                    console.error("Error fetching data:", error);
                    setError(error.message || "Failed to fetch department data.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => controller.abort();
    }, [loading]); // Now refetches when `loading` is set to `true`

    // Function to retry fetching data
    const retryFetch = () => {
        setLoading(true);
        setError(null);
        setChartData(null);
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'User Distribution by Department',
            },
        },
    };

    return (
        <div className="w-full h-72 md:h-96">
            {loading && (
                <div className="flex items-center justify-center h-full">
                    <div className="loader"></div> {/* Placeholder for a real spinner */}
                    <span className="ml-2 text-gray-600">Loading data...</span>
                </div>
            )}
            {error && (
                <div className="text-center">
                    <p className="text-red-500">{error}</p>
                    <button
                        onClick={retryFetch}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Retry
                    </button>
                </div>
            )}
            {chartData && <Bar data={chartData} options={options} />}
        </div>
    );
};

export default DepartmentChart;
