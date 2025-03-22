import styles from '../styles/ExamsEachMonthChart.module.css';

import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import useAppContext from '~hooks/useAppContext';
import themeUtils from '~utils/theme-utils';

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

        const hexToRgb = (hex: string) => {
            const sanitizedHex = hex.replace('#', '');
            const bigint = parseInt(sanitizedHex, 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return `rgb(${r}, ${g}, ${b})`;
        };
        const rgbToRgba = (rgb: string, alpha: number) => {
            return rgb.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
        };
        const color = themeUtils.getVariable('color-primary');

        const opacityColor = (() => {
            if (color.startsWith('#')) return rgbToRgba(hexToRgb(color), 0.2);
            return rgbToRgba(color, 0.2);
        })();

        chartInstanceRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: data,
                    backgroundColor: opacityColor,
                    borderColor: color,
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
        <section className={styles.chartContainer}>
            <canvas ref={chartRef}></canvas>
        </section>
    );
}
