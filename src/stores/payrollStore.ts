
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string; // YYYY-MM format
  basicSalary: number;
  overtimeHours: number;
  overtimeRate: number;
  bonuses: number;
  nhifDeduction: number;
  nssfDeduction: number;
  advances: number;
  otherDeductions: number;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  createdAt: string;
}

interface PayrollStore {
  payrolls: PayrollRecord[];
  addPayroll: (payroll: Omit<PayrollRecord, 'id' | 'createdAt'>) => void;
  getEmployeePayrolls: (employeeId: string) => PayrollRecord[];
  getMonthlyPayrolls: (month: string) => PayrollRecord[];
  deletePayroll: (id: string) => void;
}

export const usePayrollStore = create<PayrollStore>()(
  persist(
    (set, get) => ({
      payrolls: [],
      addPayroll: (payrollData) => {
        const newPayroll: PayrollRecord = {
          ...payrollData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          payrolls: [...state.payrolls, newPayroll],
        }));
      },
      getEmployeePayrolls: (employeeId) => {
        return get().payrolls.filter((payroll) => payroll.employeeId === employeeId);
      },
      getMonthlyPayrolls: (month) => {
        return get().payrolls.filter((payroll) => payroll.month === month);
      },
      deletePayroll: (id) => {
        set((state) => ({
          payrolls: state.payrolls.filter((payroll) => payroll.id !== id),
        }));
      },
    }),
    {
      name: 'payroll-storage',
    }
  )
);
