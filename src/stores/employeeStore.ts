
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Employee {
  id: string;
  name: string;
  idNumber: string;
  phoneNumber: string;
  position: string;
  basicSalary: number;
  createdAt: string;
}

interface EmployeeStore {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  getEmployee: (id: string) => Employee | undefined;
}

export const useEmployeeStore = create<EmployeeStore>()(
  persist(
    (set, get) => ({
      employees: [],
      addEmployee: (employeeData) => {
        const newEmployee: Employee = {
          ...employeeData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          employees: [...state.employees, newEmployee],
        }));
      },
      updateEmployee: (id, updatedData) => {
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id ? { ...emp, ...updatedData } : emp
          ),
        }));
      },
      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id),
        }));
      },
      getEmployee: (id) => {
        return get().employees.find((emp) => emp.id === id);
      },
    }),
    {
      name: 'employee-storage',
    }
  )
);
