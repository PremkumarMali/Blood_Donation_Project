import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const InventoryAnalytics = ({ locationId }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [locationId]);

  const fetchData = async () => {
    try {
      const url = locationId 
        ? `http://localhost:8080/api/storage/location/${locationId}`
        : `http://localhost:8080/api/storage`;
      const res = await axios.get(url);
      
      const counts = {};
      res.data.forEach(item => {
        counts[item.bloodType] = (counts[item.bloodType] || 0) + item.units;
      });

      const labels = Object.keys(counts);
      const data = Object.values(counts);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Units Available',
            data,
            backgroundColor: [
              'rgba(239, 68, 68, 0.6)',
              'rgba(59, 130, 246, 0.6)',
              'rgba(16, 185, 129, 0.6)',
              'rgba(245, 158, 11, 0.6)',
              'rgba(139, 92, 246, 0.6)',
              'rgba(236, 72, 153, 0.6)',
            ],
            borderColor: [
              '#dc2626',
              '#2563eb',
              '#059669',
              '#d97706',
              '#7c3aed',
              '#db2777',
            ],
            borderWidth: 1,
          },
        ],
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching analytics data", err);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading Analytics...</div>;
  if (!chartData) return <div>No data available for analytics.</div>;

  return (
    <div className="row g-4 mb-5">
      <div className="col-md-7">
        <div className="glass-card p-4 h-100 shadow">
          <h5 className="mb-4">Blood Stock Level (Units)</h5>
          <Bar 
            data={chartData} 
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false }
              },
              scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' } },
                x: { grid: { display: false } }
              }
            }} 
          />
        </div>
      </div>
      <div className="col-md-5">
        <div className="glass-card p-4 h-100 shadow">
          <h5 className="mb-4">Distribution by Type</h5>
          <Pie 
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom', labels: { color: '#666' } }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryAnalytics;
