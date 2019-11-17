import { Expense } from '../expense/expense.model';

export interface Month {
    key?: string;
    name: string;
    amountFinal: string;
    number: number;
    expenses: Expense[];
}