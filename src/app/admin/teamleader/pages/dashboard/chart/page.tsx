'use client'
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
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/admindashboard/chartdeveloper');
                const data = response.data; // Access the response data
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
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to fetch department data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allow the chart to resize freely
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
        <div className="w-full h-72 md:h-96"> {/* Set responsive height */}
            {loading && (
                <div className="flex items-center justify-center h-full">
                    <div className="spinner" aria-label="Loading users..."></div>
                    <span className="ml-2 text-gray-600"></span>
                </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
            {chartData && <Bar data={chartData} options={options} />}
        </div>
    );
};

export default DepartmentChart;
