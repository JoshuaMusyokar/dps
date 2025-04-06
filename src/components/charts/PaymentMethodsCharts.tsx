import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const PaymentMethodsChart = ({
  data,
}: {
  data: { card: number; bank: number; wallet: number };
}) => {
  const chartData = {
    labels: ["Card", "Bank Transfer", "Digital Wallet"],
    datasets: [
      {
        data: [data.card, data.bank, data.wallet],
        backgroundColor: [
          "rgba(79, 70, 229, 0.8)",
          "rgba(99, 102, 241, 0.8)",
          "rgba(129, 140, 248, 0.8)",
        ],
        borderColor: [
          "rgba(79, 70, 229, 1)",
          "rgba(99, 102, 241, 1)",
          "rgba(129, 140, 248, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
    cutout: "70%",
  };

  return <Doughnut data={chartData} options={options} />;
};
