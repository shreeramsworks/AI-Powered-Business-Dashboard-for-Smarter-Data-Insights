
import React, { useState, useEffect, useMemo } from 'react';
import { ClientData, Status } from './types';
import { fetchData } from './services/dataService';
import KpiCard from './components/KpiCard';
import RevenueChart from './components/RevenueChart';
import StatusDistributionChart from './components/StatusDistributionChart';
import ClientTable from './components/ClientTable';
import Chatbot from './components/Chatbot';
import { Users, DollarSign, Target, CheckCircle } from './constants';

const App: React.FC = () => {
    const [data, setData] = useState<ClientData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const sheetData = await fetchData();
                setData(sheetData);
                setError(null);
            } catch (err) {
                setError('Failed to fetch or parse data from Google Sheets.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const { totalRevenue, totalClients, avgHeadshots, deliveredProjects } = useMemo(() => {
        if (!data || data.length === 0) {
            return { totalRevenue: 0, totalClients: 0, avgHeadshots: 0, deliveredProjects: 0 };
        }

        const totalRevenue = data.reduce((sum, item) => sum + item.Price, 0);
        const totalClients = data.length;
        const totalHeadshots = data.reduce((sum, item) => sum + item['No. of Headshots'], 0);
        const avgHeadshots = totalClients > 0 ? parseFloat((totalHeadshots / totalClients).toFixed(1)) : 0;
        const deliveredProjects = data.filter(item => item.Status === Status.Delivered).length;
        
        return { totalRevenue, totalClients, avgHeadshots, deliveredProjects };
    }, [data]);

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-black flex items-center justify-center text-cyan-400 font-orbitron">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
                    <p className="mt-4 text-lg tracking-widest">LOADING CYBERNETIC DATA...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen w-full bg-black flex items-center justify-center text-red-500 font-orbitron">
                <div className="border border-red-500 p-8 rounded-lg bg-red-900/20 text-center">
                    <h2 className="text-2xl mb-4">SYSTEM ERROR</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#010409] via-black to-[#0d1b2a] text-gray-200 p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-orbitron text-cyan-300 tracking-widest text-shadow-glow">Cyberpunk Analytics Dashboard</h1>
                <p className="text-blue-300">Real-time data stream from Google Sheets</p>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<DollarSign />} />
                <KpiCard title="Total Clients" value={totalClients.toString()} icon={<Users />} />
                <KpiCard title="Avg. Headshots" value={avgHeadshots.toString()} icon={<Target />} />
                <KpiCard title="Projects Delivered" value={deliveredProjects.toString()} icon={<CheckCircle />} />
                
                <div className="md:col-span-2 lg:col-span-4">
                    <RevenueChart data={data} />
                </div>

                <div className="md:col-span-2 lg:col-span-2">
                    <StatusDistributionChart data={data} />
                </div>
                
                <div className="md:col-span-2 lg:col-span-2">
                    <ClientTable data={data.slice(0, 5)} />
                </div>
            </main>
            <Chatbot />
        </div>
    );
};

export default App;