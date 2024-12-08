import { useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import { CandlestickController, CandlestickElement, OhlcElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';

// Register the candlestick components
ChartJS.register(CandlestickController, CandlestickElement, OhlcElement);

function CandlestickChart({ data }) {
  const chartData = {
    datasets: [
      {
        label: 'Price',
        data: data.map(item => ({
          x: new Date(item[0]),
          o: item[1], // open
          h: item[2], // high
          l: item[3], // low
          c: item[4]  // close
        })),
        color: {
          up: 'rgba(75, 192, 112, 1)',
          down: 'rgba(255, 99, 132, 1)',
        }
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day'
        },
        grid: {
          display: false
        }
      },
      y: {
        position: 'right',
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const point = context.raw;
            return [
              `Open: $${point.o.toFixed(2)}`,
              `High: $${point.h.toFixed(2)}`,
              `Low: $${point.l.toFixed(2)}`,
              `Close: $${point.c.toFixed(2)}`
            ];
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '400px' }}>
      <Chart type='candlestick' data={chartData} options={options} />
    </div>
  );
}

export default CandlestickChart;