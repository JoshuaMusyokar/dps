import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { RevenueData } from "../../types";
import { ChartOptions } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const RevenueChart = ({ data }: { data: RevenueData[] }) => {
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: "Revenue",
        data: data.map((item) => item.amount),
        borderColor: "rgb(79, 70, 229)",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (tickValue: string | number) => {
            return `$${(typeof tickValue === "number"
              ? tickValue
              : parseFloat(tickValue)
            ).toLocaleString()}`;
          },
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};
