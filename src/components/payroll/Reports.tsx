
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEmployeeStore } from "@/stores/employeeStore";
import { usePayrollStore } from "@/stores/payrollStore";
import { Download, FileText, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const Reports = () => {
  const { employees } = useEmployeeStore();
  const { payrolls, getEmployeePayrolls, getMonthlyPayrolls } = usePayrollStore();
  const { toast } = useToast();

  const [reportType, setReportType] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const generatePayslip = (employeeId: string, month: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    const payroll = payrolls.find(p => p.employeeId === employeeId && p.month === month);
    
    if (!employee || !payroll) {
      toast({
        title: "Error",
        description: "Payroll data not found",
        variant: "destructive",
      });
      return;
    }

    // Create a simple HTML payslip for printing/PDF
    const payslipHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payslip - ${employee.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .section { margin: 20px 0; }
          .row { display: flex; justify-content: space-between; margin: 5px 0; }
          .total { font-weight: bold; font-size: 1.2em; border-top: 1px solid #333; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PayrollPro Management System</h1>
          <h2>Payslip for ${new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
        </div>
        
        <div class="section">
          <h3>Employee Details</h3>
          <div class="row"><span>Name:</span><span>${employee.name}</span></div>
          <div class="row"><span>ID Number:</span><span>${employee.idNumber}</span></div>
          <div class="row"><span>Position:</span><span>${employee.position}</span></div>
          <div class="row"><span>Phone:</span><span>${employee.phoneNumber}</span></div>
        </div>
        
        <div class="section">
          <h3>Earnings</h3>
          <div class="row"><span>Basic Salary:</span><span>KSh ${payroll.basicSalary.toLocaleString()}</span></div>
          <div class="row"><span>Overtime (${payroll.overtimeHours} hrs @ KSh ${payroll.overtimeRate}/hr):</span><span>KSh ${(payroll.overtimeHours * payroll.overtimeRate).toLocaleString()}</span></div>
          <div class="row"><span>Bonuses:</span><span>KSh ${payroll.bonuses.toLocaleString()}</span></div>
          <div class="row total"><span>Gross Pay:</span><span>KSh ${payroll.grossPay.toLocaleString()}</span></div>
        </div>
        
        <div class="section">
          <h3>Deductions</h3>
          <div class="row"><span>NHIF:</span><span>KSh ${payroll.nhifDeduction.toLocaleString()}</span></div>
          <div class="row"><span>NSSF:</span><span>KSh ${payroll.nssfDeduction.toLocaleString()}</span></div>
          <div class="row"><span>Advances:</span><span>KSh ${payroll.advances.toLocaleString()}</span></div>
          <div class="row"><span>Other Deductions:</span><span>KSh ${payroll.otherDeductions.toLocaleString()}</span></div>
          <div class="row total"><span>Total Deductions:</span><span>KSh ${payroll.totalDeductions.toLocaleString()}</span></div>
        </div>
        
        <div class="section">
          <div class="row total" style="color: green; font-size: 1.5em;">
            <span>Net Pay:</span><span>KSh ${payroll.netPay.toLocaleString()}</span>
          </div>
        </div>
        
        <div class="section" style="text-align: center; margin-top: 40px;">
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
      </html>
    `;

    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(payslipHTML);
      printWindow.document.close();
      printWindow.print();
    }

    toast({
      title: "Success",
      description: "Payslip generated successfully",
    });
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast({
        title: "Error",
        description: "No data to export",
        variant: "destructive",
      });
      return;
    }

    const headers = Object.keys(data[0]).join(',');
    const csvContent = [
      headers,
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Report exported successfully",
    });
  };

  const getReportData = () => {
    if (reportType === "monthly") {
      return getMonthlyPayrolls(selectedMonth);
    } else if (reportType === "employee" && selectedEmployee) {
      return getEmployeePayrolls(selectedEmployee);
    }
    return [];
  };

  const reportData = getReportData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Records</h1>
        <p className="text-gray-600">Generate payroll reports and payslips</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly Report</SelectItem>
                  <SelectItem value="employee">Employee History</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reportType === "monthly" && (
              <div>
                <label className="block text-sm font-medium mb-2">Month</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            )}

            {reportType === "employee" && (
              <div>
                <label className="block text-sm font-medium mb-2">Employee</label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-end">
              <Button
                onClick={() => exportToCSV(
                  reportData.map(p => ({
                    Employee: p.employeeName,
                    Month: p.month,
                    'Basic Salary': p.basicSalary,
                    'Overtime Hours': p.overtimeHours,
                    'Gross Pay': p.grossPay,
                    'Total Deductions': p.totalDeductions,
                    'Net Pay': p.netPay
                  })),
                  `payroll-report-${reportType}-${reportType === 'monthly' ? selectedMonth : selectedEmployee}.csv`
                )}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Data */}
      <Card>
        <CardHeader>
          <CardTitle>
            {reportType === "monthly" 
              ? `Monthly Report - ${new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
              : `Employee History - ${employees.find(e => e.id === selectedEmployee)?.name || 'Select Employee'}`
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reportData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Overtime</TableHead>
                  <TableHead>Gross Pay</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Pay</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((payroll) => (
                  <TableRow key={payroll.id}>
                    <TableCell className="font-medium">{payroll.employeeName}</TableCell>
                    <TableCell>{new Date(payroll.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</TableCell>
                    <TableCell>KSh {payroll.basicSalary.toLocaleString()}</TableCell>
                    <TableCell>KSh {(payroll.overtimeHours * payroll.overtimeRate).toLocaleString()}</TableCell>
                    <TableCell>KSh {payroll.grossPay.toLocaleString()}</TableCell>
                    <TableCell>KSh {payroll.totalDeductions.toLocaleString()}</TableCell>
                    <TableCell className="font-medium text-green-600">
                      KSh {payroll.netPay.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generatePayslip(payroll.employeeId, payroll.month)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Payslip
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No payroll records found</p>
              <p className="text-sm text-gray-400">Process some payrolls to see reports here</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {reportData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {reportData.length}
                </p>
                <p className="text-sm text-gray-600">Total Records</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  KSh {reportData.reduce((sum, p) => sum + p.grossPay, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Gross Pay</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  KSh {reportData.reduce((sum, p) => sum + p.netPay, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Net Pay</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
