export interface Reservation {
  id?: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  bookingTime: string;
  status?: 'confirmed' | 'cancelled';
  createdAt?: any;
  clientTimestamp?: number;
}

export enum ServiceType {
  HAIRCUT = 'CLASSIC HAIRCUT',
  HAIRCUT_WASH = 'CLASSIC HAIRCUT + WASH',
  VIP_RITUAL = 'FULL RITUAL (VIP)'
}
