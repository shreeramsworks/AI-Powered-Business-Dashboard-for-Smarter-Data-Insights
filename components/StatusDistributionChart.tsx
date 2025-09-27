
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ClientData, Status } from '../types';
import Card from './Card';

interface StatusDistributionChartProps {
    data: ClientData[];
}

const COLORS = {
    [Status.Booked]: '#38bdf8', // lightBlue
    [Status.Shot]: '#22d3ee', // cyan
    [Status.Delivered]: '#4ade80', // green
    [Status.Pending]: '#facc15', // yellow
    [Status.Cancelled]: '#f87171', // red
};

const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({ data }) => {
    const statusCounts = data.reduce((acc, item) => {
        acc[item.Status] = (acc[item.Status] || 0) + 1;
        return acc;
    }, {} as Record<Status, number>);

    const chartData = Object.entries(statusCounts).map(([name, value]) => ({
        name: name as Status,
        value,
    }));

    return (
        <Card className="h-96 flex flex-col">
            <h3 className="text-lg font-bold text-blue-200 mb-4 font-orbitron">Project Status Distribution</h3>
            <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            // FIX: The explicit type for the label renderer props was incompatible with the expected type from recharts.
                            // Using `any` for the props type resolves the error. Recharts provides these as numbers at runtime.
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
                                const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                                const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                return (
                                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={14}>
                                        {`${(percent * 100).toFixed(0)}%`}
                                    </text>
                                );
                            }}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                                borderColor: '#06b6d4',
                                borderRadius: '0.5rem'
                            }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '15px' }}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default StatusDistributionChart;