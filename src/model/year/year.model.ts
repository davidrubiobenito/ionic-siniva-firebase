import { Month } from '../month/month.model';

export interface Year {
    key?: string;
    number: number;
    amountFinal: string;
    months : Month[];
}