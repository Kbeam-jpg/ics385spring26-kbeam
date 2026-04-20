import {useMemo} from "react";
import {
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale,
  BarElement,
  ArcElement, 
  Title, 
  Tooltip, 
  Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

import WeatherWidget from "./WeatherWidget";

// register chart.js components that's in use
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
)

export default function Dashboard() {

  /**
   * Chart 1: visitor arrivals bar chart
   */
  const monthlyVisitorData = useMemo(() => {
    // ** HARDCODED FOR NOW **
    const monthlyData = {
      '2025-02': 141968,
      '2025-03': 158260,
      '2025-04': 139871,
      '2025-05': 130213,
      '2025-06': 155217,
      '2025-07': 160836,
      '2025-08': 141621,
      '2025-09': 128617,
      '2025-10': 146002,
      '2025-11': 124356,
      '2025-12': 166315,
      '2026-01': 154982,
      '2026-02': 152151
    };

    return {
      labels: Object.keys(monthlyData),
      datasets: [
        {
          label: 'Visitor Arrivals',
          data: Object.values(monthlyData),
          backgroundColor: 'rgba(13, 110, 122, 1)',
        },
      ],
    };
  }, []);
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Visitor Arrivals (Hilo) - Past Year',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  /**
   * Chart 2: visitors by origin doughnut chart
   */
  const originArrivalData = useMemo(() => {

    const visitorsByCountry202602 = {
      'United States': Math.round(588010 * 0.211),
      'Japan': Math.round(52377*0.061),
      'Canada': Math.round(46392*0.194),
      'Europe': Math.round(8830*0.292),
      'Oceania': Math.round(9504*0.0911),
      'China': Math.round(2829*0.450),
      'Korea': Math.round(15124*0.200),
      'Latin America': Math.round(6368*0.190),
    };

    const colors = [
      'rgba(255,0,0,1)',
      'rgba(0,255,0,1)',
      'rgba(0,0,255,1)',
      'rgba(255,128,64,1)',
      'rgba(255,64,128,1)',
      'rgba(128,64,255,1)',
      'rgba(64,255,128,1)',
      'rgba(64,128,255,1)',
    ];

    return {
      labels: Object.keys(visitorsByCountry202602),
      datasets: [
        {
          label: "Arrival by Origin (Feb 2026)",
          data: Object.values(visitorsByCountry202602),
          backgroundColor: colors
        },
      ],
    };
  }, []);
  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          generateLabels: (chart) => {
            const data = chart.data;
            return data.labels.map((label, i) => {
              const value = data.datasets[0].data[i];
              const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return {
                text: `${label}: ${percentage}%`,
                fillStyle: data.datasets[0].backgroundColor[i],
                hidden: false,
                index: i,
              };
            });
          },
        },
      },
      title: {
        display: true,
        text: 'Visitors by Origin (Feb 2026',
      },
    },
  };

  // const trend = monthlyData[-2] < monthlyData[-1] ? "increased" : "decreased";

  return (
    <section className="dashboard-section">
      <WeatherWidget city="Hilo"/>

      <div className="chart-container">
        <Bar data={monthlyVisitorData} options={barChartOptions} />
        {/* increase or decrease from last month? */}
      </div>

      <div className="chart-container">
        <Doughnut data={originArrivalData} options={doughnutChartOptions} />
      </div>
    </section>
  );
}


