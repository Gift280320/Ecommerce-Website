
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Calendar, TrendingUp, FileText } from "lucide-react";
import { useEmployeeStore } from "@/stores/employeeStore";
import { usePayrollStore } from "@/stores/payrollStore";

export const Dashboard = () => {
  const { employees } = useEmployeeStore();
  const { payrolls } = usePayrollStore();

  // Calculate dashboard metrics
  const totalEmployees = employees.length;
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  const currentMonthPayrolls = payrolls.filter(p => p.month === currentMonth);
  const totalSalaryThisMonth = currentMonthPayrolls.reduce((sum, p) => sum + p.netPay, 0);
  const averageSalary = totalEmployees > 0 ? totalSalaryThisMonth / totalEmployees : 0;

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees.toString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Monthly Payroll",
      value: `KSh ${totalSalaryThisMonth.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Average Salary",
      value: `KSh ${averageSalary.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Payrolls Processed",
      value: currentMonthPayrolls.length.toString(),
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to PayrollPro - Your complete payroll management solution
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employees.slice(0, 5).map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{employee.name}</p>
                    <p className="text-sm text-gray-500">{employee.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">KSh {employee.basicSalary.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Basic Salary</p>
                  </div>
                </div>
              ))}
              {employees.length === 0 && (
                <p className="text-gray-500 text-center py-4">No employees registered yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Add New Employee</p>
                    <p className="text-sm text-gray-500">Register a new staff member</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Process Payroll</p>
                    <p className="text-sm text-gray-500">Calculate monthly salaries</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Generate Reports</p>
                    <p className="text-sm text-gray-500">Export payroll summaries</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
