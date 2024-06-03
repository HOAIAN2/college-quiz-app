import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import useAppContext from '../hooks/useAppContext';
import styles from '../styles/ExamsEachMonthChart.module.css';

type ExamsEachMonthChartProps = {
	data: number[];
	label?: string;
};

export default function ExamsEachMonthChart({
	data,
	label
}: ExamsEachMonthChartProps) {
	const { appLanguage } = useAppContext();
	const chartRef = useRef<HTMLCanvasElement | null>(null);
	const chartInstanceRef = useRef<Chart | null>(null);

	useEffect(() => {
		if (!chartRef.current) return;

		if (chartInstanceRef.current) {
			chartInstanceRef.current.destroy();
		}

		const ctx = chartRef.current.getContext('2d');
		if (!ctx) return;

		const labels = data.map((_, index) => new Date(0, index).toLocaleString(appLanguage.language, { month: 'long' }));

		const backgroundColors = [
			'rgba(255, 99, 132, 0.2)',
			'rgba(255, 159, 64, 0.2)',
			'rgba(255, 205, 86, 0.2)',
			'rgba(75, 192, 192, 0.2)',
			'rgba(54, 162, 235, 0.2)',
			'rgba(153, 102, 255, 0.2)',
			'rgba(201, 203, 207, 0.2)'
		];
		const borderColors = [
			'rgb(255, 99, 132)',
			'rgb(255, 159, 64)',
			'rgb(255, 205, 86)',
			'rgb(75, 192, 192)',
			'rgb(54, 162, 235)',
			'rgb(153, 102, 255)',
			'rgb(201, 203, 207)'
		];
		// const color = getComputedStyle(document.documentElement).getPropertyValue('--color-blue')

		chartInstanceRef.current = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [{
					label: label,
					data: data,
					backgroundColor: backgroundColors,
					borderColor: borderColors,
					borderWidth: 1
				}]
			},
			options: {
				responsive: true, // Make the chart responsive
				maintainAspectRatio: false, // Prevent the chart from maintaining its aspect ratio
				scales: {
					y: {
						beginAtZero: true
					}
				}
			}
		});
		return () => {
			if (chartInstanceRef.current) {
				chartInstanceRef.current.destroy();
			}
		};
	}, [appLanguage.language, data, label]);

	return (
		<div className={styles['chart-container']}>
			<canvas ref={chartRef}></canvas>
		</div>
	);
}
