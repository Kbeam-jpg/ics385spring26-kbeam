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

// register chart.js components that's in use
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function Dashboard() {
  const [volcanoRecords, setVolcanoRecords] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('duration');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const activeMetric = metricOptions[selectedMetric];

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

  const handleMetricChange = (metricKey) => {
    setSelectedMetric(metricKey);
  };

  return (
    <section className="dashboard-section">
      <div className="chart-container">
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


