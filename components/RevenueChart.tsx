
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ClientData } from '../types';
import Card from './Card';

interface RevenueChartProps {
    data: ClientData[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
    const chartData = data.map((item, index) => ({
        name: item.Clients,
        revenue: item.Price
    }));

    return (
        <Card className="h-96">
            <h3 className="text-lg font-bold text-blue-200 mb-4 font-orbitron">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b" 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      tickFormatter={(value) => value.substring(0, 8) + (value.length > 8 ? '...' : '')}
                    />
                    <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.8)',
                            borderColor: '#06b6d4',
                            color: '#e0f2fe',
                            borderRadius: '0.5rem'
                        }}
                        itemStyle={{ color: '#e0f2fe' }}
                        labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#06b6d4" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default RevenueChart;