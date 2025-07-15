
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEmployeeStore } from "@/stores/employeeStore";
import { usePayrollStore, PayrollRecord } from "@/stores/payrollStore";
import { Calculator, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PayrollProcessing = () => {
  const { employees } = useEmployeeStore();
  const { payrolls, addPayroll } = usePayrollStore();
  const { toast } = useToast();

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [payrollData, setPayrollData] = useState({
    overtimeHours: "",
    overtimeRate: "150", // Default overtime rate per hour
    bonuses: "",
    nhifDeduction: "",
    nssfDeduction: "",
    advances: "",
    otherDeductions: "",
  });

  const calculatePayroll = () => {
    if (!selectedEmployee) return null;

    const employee = employees.find(emp => emp.id === selectedEmployee);
    if (!employee) return null;

    const basicSalary = employee.basicSalary;
    const overtimeAmount = (parseFloat(payrollData.overtimeHours) || 0) * (parseFloat(payrollData.overtimeRate) || 0);
    const bonuses = parseFloat(payrollData.bonuses) || 0;
    
    const grossPay = basicSalary + overtimeAmount + bonuses;
    
    // Calculate statutory deductions if not provided
    const nhifDeduction = parseFloat(payrollData.nhifDeduction) || Math.min(1700, Math.max(150, grossPay * 0.015));
    const nssfDeduction = parseFloat(payrollData.nssfDeduction) || Math.min(2160, grossPay * 0.06);
    const advances = parseFloat(payrollData.advances) || 0;
    const otherDeductions = parseFloat(payrollData.otherDeductions) || 0;
    
    const totalDeductions = nhifDeduction + nssfDeduction + advances + otherDeductions;
    const netPay = grossPay - totalDeductions;

    return {
      employee,
      basicSalary,
      overtimeAmount,
      bonuses,
      grossPay,
      nhifDeduction,
      nssfDeduction,
      advances,
      otherDeductions,
      totalDeductions,
      netPay,
    };
  };

  const calculation = calculatePayroll();

  const handleProcessPayroll = () => {
    if (!calculation) {
      toast({
        title: "Error",
        description: "Please select an employee and enter payroll details",
        variant: "destructive",
      });
      return;
    }

    // Check if payroll already exists for this employee and month
    const existingPayroll = payrolls.find(
      p => p.employeeId === selectedEmployee && p.month === selectedMonth
    );

    if (existingPayroll) {
      toast({
        title: "Error",
        description: "Payroll already processed for this employee this month",
        variant: "destructive",
      });
      return;
    }

    const payrollRecord: Omit<PayrollRecord, 'id' | 'createdAt'> = {
      employeeId: selectedEmployee,
      employeeName: calculation.employee.name,
      month: selectedMonth,
      basicSalary: calculation.basicSalary,
      overtimeHours: parseFloat(payrollData.overtimeHours) || 0,
      overtimeRate: parseFloat(payrollData.overtimeRate) || 0,
      bonuses: calculation.bonuses,
      nhifDeduction: calculation.nhifDeduction,
      nssfDeduction: calculation.nssfDeduction,
      advances: calculation.advances,
      otherDeductions: calculation.otherDeductions,
      grossPay: calculation.grossPay,
      totalDeductions: calculation.totalDeductions,
      netPay: calculation.netPay,
    };

    addPayroll(payrollRecord);
    
    // Reset form
    setSelectedEmployee("");
    setPayrollData({
      overtimeHours: "",
      overtimeRate: "150",
      bonuses: "",
      nhifDeduction: "",
      nssfDeduction: "",
      advances: "",
      otherDeductions: "",
    });

    toast({
      title: "Success",
      description: "Payroll processed successfully",
    });
  };

  // Get current month's processed payrolls
  const currentMonthPayrolls = payrolls.filter(p => p.month === selectedMonth);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payroll Processing</h1>
        <p className="text-gray-600">Calculate and process employee salaries</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payroll Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calculate Payroll
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="month">Pay Period</Label>
              <Input
                id="month"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="employee">Select Employee</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} - {employee.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedEmployee && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="overtimeHours">Overtime Hours</Label>
                    <Input
                      id="overtimeHours"
                      type="number"
                      value={payrollData.overtimeHours}
                      onChange={(e) => setPayrollData({...payrollData, overtimeHours: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="overtimeRate">Overtime Rate (KSh/hr)</Label>
                    <Input
                      id="overtimeRate"
                      type="number"
                      value={payrollData.overtimeRate}
                      onChange={(e) => setPayrollData({...payrollData, overtimeRate: e.target.value})}
                      placeholder="150"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bonuses">Bonuses (KSh)</Label>
                  <Input
                    id="bonuses"
                    type="number"
                    value={payrollData.bonuses}
                    onChange={(e) => setPayrollData({...payrollData, bonuses: e.target.value})}
                    placeholder="0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nhif">NHIF Deduction</Label>
                    <Input
                      id="nhif"
                      type="number"
                      value={payrollData.nhifDeduction}
                      onChange={(e) => setPayrollData({...payrollData, nhifDeduction: e.target.value})}
                      placeholder="Auto-calculated"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nssf">NSSF Deduction</Label>
                    <Input
                      id="nssf"
                      type="number"
                      value={payrollData.nssfDeduction}
                      onChange={(e) => setPayrollData({...payrollData, nssfDeduction: e.target.value})}
                      placeholder="Auto-calculated"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="advances">Advances</Label>
                    <Input
                      id="advances"
                      type="number"
                      value={payrollData.advances}
                      onChange={(e) => setPayrollData({...payrollData, advances: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="otherDeductions">Other Deductions</Label>
                    <Input
                      id="otherDeductions"
                      type="number"
                      value={payrollData.otherDeductions}
                      onChange={(e) => setPayrollData({...payrollData, otherDeductions: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleProcessPayroll} 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!selectedEmployee}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Process Payroll
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Calculation Preview */}
        {calculation && (
          <Card>
            <CardHeader>
              <CardTitle>Payroll Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Employee:</span>
                  <span className="font-medium">{calculation.employee.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Basic Salary:</span>
                  <span>KSh {calculation.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Overtime:</span>
                  <span>KSh {calculation.overtimeAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bonuses:</span>
                  <span>KSh {calculation.bonuses.toLocaleString()}</span>
                </div>
                <hr />
                <div className="flex justify-between font-medium">
                  <span>Gross Pay:</span>
                  <span>KSh {calculation.grossPay.toLocaleString()}</span>
                </div>
                <hr />
                <div className="flex justify-between text-red-600">
                  <span>NHIF:</span>
                  <span>KSh {calculation.nhifDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>NSSF:</span>
                  <span>KSh {calculation.nssfDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Advances:</span>
                  <span>KSh {calculation.advances.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Other Deductions:</span>
                  <span>KSh {calculation.otherDeductions.toLocaleString()}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg text-green-600">
                  <span>Net Pay:</span>
                  <span>KSh {calculation.netPay.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Current Month Payrolls */}
      <Card>
        <CardHeader>
          <CardTitle>
            Processed Payrolls - {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentMonthPayrolls.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Overtime</TableHead>
                  <TableHead>Gross Pay</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Pay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentMonthPayrolls.map((payroll) => (
                  <TableRow key={payroll.id}>
                    <TableCell className="font-medium">{payroll.employeeName}</TableCell>
                    <TableCell>KSh {payroll.basicSalary.toLocaleString()}</TableCell>
                    <TableCell>KSh {(payroll.overtimeHours * payroll.overtimeRate).toLocaleString()}</TableCell>
                    <TableCell>KSh {payroll.grossPay.toLocaleString()}</TableCell>
                    <TableCell>KSh {payroll.totalDeductions.toLocaleString()}</TableCell>
                    <TableCell className="font-medium text-green-600">
                      KSh {payroll.netPay.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 py-4">No payrolls processed for this month</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
