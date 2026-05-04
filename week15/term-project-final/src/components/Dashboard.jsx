/*
Name: Kendall Beam
Assignment: Term Project 3
Description: Left side dashboard, houses charts and weather widget
Filename: Dashboard.jsx
Date: May 3 2026

AI Use:
-- assume this is generated with very specific instructions for quickness
*/

import {useEffect, useMemo, useState} from "react";
import {
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale,
  BarElement,
  Title, 
  Tooltip, 
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import WeatherWidget from './WeatherWidget';

// register chart.js components in use
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

/**
 * **Generated**
 * 
 * @returns {JSX.Element} dashboard-section = 
 * weather-select + WeatherWidget/>, chart-controls + Bars/> chart
 */
export default function Dashboard() {
  const [volcanoRecords, setVolcanoRecords] = useState([]); // <= handle fetch load time
  const [selectedMetric, setSelectedMetric] = useState('duration'); // <= set metric for chart
  const [selectedCity, setSelectedCity] = useState('Hilo'); // <= set city to query into weather api
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  // calls fetchVolcanoData() from /api/properties/volcano, sets to volcanoRecords if good
  useEffect(() => {
    const controller = new AbortController();

    async function fetchVolcanoData() {
      try {
        const response = await fetch('/api/properties/volcano', { signal: controller.signal });
        if (!response.ok) throw new Error('Failed to fetch volcano data');
        const data = await response.json();
        setVolcanoRecords(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load volcano chart data');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchVolcanoData();

    return () => controller.abort();
  }, []);

  // chart.js color options for metric selection
  const metricOptions = {
    duration: {
      label: 'Duration (hours)',
      formatter: (record) => Number.parseFloat(record.duration),
      color: 'rgba(13, 110, 122, 1)'
    },
    max_height_m: {
      label: 'Max Height (m)',
      formatter: (record) => Number(record.max_height_m),
      color: 'rgba(220, 83, 43, 1)'
    },
    volume_million_m3: {
      label: 'Volume (million m³)',
      formatter: (record) => Number(record.volume_million_m3),
      color: 'rgba(50, 116, 187, 1)'
    }
  };

  // used by chart to display which data
  const activeMetric = metricOptions[selectedMetric];

  // sets datasets:
  // **Generated**
  const volcanoChartData = useMemo(() => {
    return {
      datasets: [
        {
          label: activeMetric.label,
          data: volcanoRecords.map((record) => ({
            x: `#${record.id}`,
            y: activeMetric.formatter(record),
            ...record
          })),
          backgroundColor: activeMetric.color,
          borderRadius: 6,
        },
      ],
    };
  }, [activeMetric, volcanoRecords]);

  // sets plugins: && scales: 
  // legend at top, title changes by active metric, 
  // tooltip: bars labeled by id, on hover shows all record information
  // **Generated**
  const volcanoChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Kilauea Eruptions by ${activeMetric.label}`,
      },
      tooltip: {
        callbacks: {
          title: (items) => {
            const record = items[0].raw;
            return `Eruption #${record.id}`;
          },
          label: (context) => {
            const record = context.raw;

            return [
              `Start: ${record.start_date}`,
              `End: ${record.end_date}`,
              `Duration: ${record.duration}`,
              `Max height: ${record.max_height_m} m`,
              `Volume: ${record.volume_million_m3} million m³`,
              `Description: ${record.description}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: activeMetric.label,
        },
      },
      x: {
        reverse: true,
        title: {
          display: true,
          text: 'Eruption',
        },
      },
    },
  }), [activeMetric]);

  // useState for metric buttons
  const handleMetricChange = (metricKey) => {
    setSelectedMetric(metricKey);
  };

  const cities = ['Hilo', 'Volcano Village', 'Kailua-Kona'];

  return (
    <section className="dashboard-section">
      <div className="weather-header" style={{ marginBottom: '1.5rem' }}>
        <h3>Weather</h3>
        <select name="weatherselect" className="weather-select" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
          {cities.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </div>
      <WeatherWidget city={selectedCity} /> {/* **Weather Widget* **/}
      
      <div className="chart-container card">
        <div className="chart-controls" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {Object.entries(metricOptions).map(([metricKey, metric]) => (
            <button
              key={metricKey}
              type="button"
              onClick={() => handleMetricChange(metricKey)}
              aria-pressed={selectedMetric === metricKey}
              style={{
                padding: '0.6rem 0.9rem',
                borderRadius: '999px',
                border: '1px solid rgba(13, 110, 122, 0.35)',
                background: selectedMetric === metricKey ? 'rgba(13, 110, 122, 1)' : 'white',
                color: selectedMetric === metricKey ? 'white' : 'rgba(13, 110, 122, 1)',
                cursor: 'pointer',
              }}
            >
              {metric.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Loading volcano data...</p>
        ) : error ? (
          <p>{error}</p>
        ) : volcanoRecords.length === 0 ? (
          <p>No volcano records found.</p>
        ) : (
          <div style={{ height: '420px' }}>
            <Bar data={volcanoChartData} options={volcanoChartOptions} />
          </div>
        )}
      </div>
    </section>
  );
}


