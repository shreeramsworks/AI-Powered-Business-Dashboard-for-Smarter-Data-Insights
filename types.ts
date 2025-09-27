
export enum Status {
    Booked = 'Booked',
    Shot = 'Shot',
    Delivered = 'Delivered',
    Pending = 'Pending',
    Cancelled = 'Cancelled'
}

export interface ClientData {
    Clients: string;
    'No. of Headshots': number;
    Price: number;
    Status: Status;
    Email: string;
}

export interface Message {
    text: string;
    from: 'user' | 'bot' | 'error';
}