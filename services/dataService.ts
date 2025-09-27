
import { ClientData, Status } from '../types';

// ====================================================================================
// PASTE YOUR NEW GOOGLE APPS SCRIPT URL HERE
// Replace the placeholder URL below with the "Web app URL" you copied in Part 1.
// ====================================================================================
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbypEkhqysoWorlec_nwygvNGvbTL3y_2qF5d3DRdKJocU92tVjNMOMUkNVEGTS0vwAHGA/exec';

// Type assertion to handle the raw data from the sheet.
interface RawClientData {
    Clients: string;
    'No. of Headshots': any;
    Price: any;
    Status: string;
    Email: string;
}

const cleanData = (rawData: RawClientData[]): ClientData[] => {
    return rawData.map(item => {
        // Safely parse numbers, defaulting to 0 if invalid
        const headshots = parseInt(item['No. of Headshots'], 10);
        const price = parseFloat(String(item.Price).replace(/[^0-9.-]+/g, ""));

        return {
            Clients: item.Clients || 'N/A',
            'No. of Headshots': !isNaN(headshots) ? headshots : 0,
            Price: !isNaN(price) ? price : 0,
            Status: (item.Status as Status) || Status.Pending,
            Email: item.Email || 'N/A',
        };
    }).filter(item => item.Clients && item.Clients !== 'N/A' && item.Clients.trim() !== ''); // Filter out empty or invalid rows
};


export const fetchData = async (): Promise<ClientData[]> => {
    // FIX: Removed the check for a placeholder URL. The URL has been provided,
    // so this check is obsolete and was causing a TypeScript compile error.
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawData: RawClientData[] = await response.json();
    return cleanData(rawData);
};