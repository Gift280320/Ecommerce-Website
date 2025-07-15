import { useState } from "react";
import { Dashboard } from "@/components/payroll/Dashboard";
import { EmployeeManagement } from "@/components/payroll/EmployeeManagement";
import { PayrollProcessing } from "@/components/payroll/PayrollProcessing";
import { Reports } from "@/components/payroll/Reports";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Users, Calculator, FileText, BarChart3, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { id: "dashboard", title: "Dashboard", icon: BarChart3 },
  { id: "employees", title: "Employees", icon: Users },
  { id: "payroll", title: "Payroll", icon: Calculator },
  { id: "reports", title: "Reports", icon: FileText },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleNavigation = (section: string) => {
    console.log(`Navigating to: ${section}`);
    setActiveTab(section);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onNavigate={handleNavigation} />;
      case "employees":
        return <EmployeeManagement />;
      case "payroll":
        return <PayrollProcessing />;
      case "reports":
        return <Reports />;
      default:
        return <Dashboard onNavigate={handleNavigation} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r border-gray-200">
          <SidebarContent>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-lg font-bold text-gray-900">PayrollPro</h1>
                  <p className="text-sm text-gray-500">Management System</p>
                </div>
              </div>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                          "w-full justify-start gap-3 transition-colors",
                          activeTab === item.id
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900 capitalize">
                {navigationItems.find(item => item.id === activeTab)?.title}
              </h2>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
