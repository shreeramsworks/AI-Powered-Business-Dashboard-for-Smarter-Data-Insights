
import React from 'react';
import { ClientData } from '../types';
import Card from './Card';

interface ClientTableProps {
    data: ClientData[];
}

const statusColorMap: { [key: string]: string } = {
  Delivered: 'bg-green-500/20 text-green-300',
  Shot: 'bg-cyan-500/20 text-cyan-300',
  Booked: 'bg-blue-500/20 text-blue-300',
  Pending: 'bg-yellow-500/20 text-yellow-300',
  Cancelled: 'bg-red-500/20 text-red-300',
};

const ClientTable: React.FC<ClientTableProps> = ({ data }) => {
    return (
        <Card className="h-96 flex flex-col">
            <h3 className="text-lg font-bold text-blue-200 mb-4 font-orbitron">Recent Clients</h3>
            <div className="overflow-auto flex-grow">
                <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-slate-800/60 backdrop-blur-sm">
                        <tr>
                            <th className="p-3 font-bold text-orange-400">Client</th>
                            <th className="p-3 font-bold text-orange-400">Email</th>
                            <th className="p-3 font-bold text-orange-400">No. of Headshots</th>
                            <th className="p-3 font-bold text-orange-400">Price</th>
                            <th className="p-3 font-bold text-orange-400">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((client, index) => (
                            <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                                <td className="p-3 font-medium text-white">{client.Clients}</td>
                                <td className="p-3 text-gray-300">{client.Email}</td>
                                <td className="p-3 text-gray-300">{client['No. of Headshots']}</td>
                                <td className="p-3 text-gray-300">${client.Price.toLocaleString()}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColorMap[client.Status] || 'bg-gray-500/20 text-gray-300'}`}>
                                        {client.Status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default ClientTable;