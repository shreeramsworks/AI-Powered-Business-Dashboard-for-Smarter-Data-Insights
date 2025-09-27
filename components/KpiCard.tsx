
import React from 'react';
import Card from './Card';

interface KpiCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon }) => {
    return (
        <Card className="flex flex-col justify-between hover:scale-105 transform">
            <div className="flex justify-between items-start">
                <p className="text-sm text-blue-200 uppercase tracking-wider">{title}</p>
                <div className="text-cyan-400">{icon}</div>
            </div>
            <p className="text-4xl font-orbitron text-white mt-2">{value}</p>
        </Card>
    );
};

export default KpiCard;