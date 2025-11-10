import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Plus, Pencil, Trash2, Download, Filter, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ExpenseTable from "@/components/ExpenseTable";
import ExpenseCharts from "@/components/ExpenseCharts";
import ExpenseModal from "@/components/ExpenseModal";
import { Card } from "@/components/ui/card";

// Mock data for demonstration
const mockExpenses = [
  { id: 1, user_expense_id: 1, amount: 1200, type: "Income", category: "Salary", date: "2025-01-15" },
  { id: 2, user_expense_id: 2, amount: 50, type: "Expense", category: "Food", date: "2025-01-16" },
  { id: 3, user_expense_id: 3, amount: 30, type: "Expense", category: "Transport", date: "2025-01-17" },
  { id: 4, user_expense_id: 4, amount: 200, type: "Expense", category: "Shopping", date: "2025-01-18" },
  { id: 5, user_expense_id: 5, amount: 500, type: "Income", category: "Freelance", date: "2025-01-20" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState(mockExpenses);
  const [modalType, setModalType] = useState<"add" | "update" | "delete" | null>(null);
  const [showCharts, setShowCharts] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const totalIncome = expenses
    .filter((e) => e.type === "Income")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = expenses
    .filter((e) => e.type === "Expense")
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "See you soon!",
    });
    navigate("/");
  };

  const handleExportPDF = () => {
    toast({
      title: "Exporting PDF",
      description: "Your expense report is being generated...",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-soft backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground hidden sm:inline">
                Expense Tracker
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
            <div className="text-sm text-muted-foreground mb-1">Total Balance</div>
            <div className={`text-2xl sm:text-3xl font-bold ${balance >= 0 ? "text-success" : "text-destructive"}`}>
              ${balance.toFixed(2)}
            </div>
          </Card>
          <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
            <div className="text-sm text-muted-foreground mb-1">Total Income</div>
            <div className="text-2xl sm:text-3xl font-bold text-success">${totalIncome.toFixed(2)}</div>
          </Card>
          <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
            <div className="text-sm text-muted-foreground mb-1">Total Expense</div>
            <div className="text-2xl sm:text-3xl font-bold text-destructive">${totalExpense.toFixed(2)}</div>
          </Card>
          <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
            <div className="text-sm text-muted-foreground mb-1">Transactions</div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">{expenses.length}</div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setModalType("add")}
            className="bg-gradient-primary hover:opacity-90 shadow-soft"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button
            onClick={() => setModalType("update")}
            variant="outline"
            size="sm"
            className="border-border shadow-soft"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Update
          </Button>
          <Button
            onClick={() => setModalType("delete")}
            variant="outline"
            size="sm"
            className="border-border shadow-soft hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button
            onClick={handleExportPDF}
            variant="outline"
            size="sm"
            className="border-border shadow-soft"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button
            onClick={() => setShowCharts(!showCharts)}
            variant="outline"
            size="sm"
            className="border-border shadow-soft ml-auto"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {showCharts ? "Hide" : "Show"} Charts
          </Button>
        </div>

        {/* Charts */}
        {showCharts && (
          <Card className="p-6 shadow-soft border-border/50 bg-gradient-card">
            <ExpenseCharts expenses={expenses} isLoading={isLoading} />
          </Card>
        )}

        {/* Expense Table */}
        <Card className="shadow-soft border-border/50 bg-gradient-card overflow-hidden">
          <ExpenseTable expenses={expenses} isLoading={isLoading} />
        </Card>
      </div>

      {/* Modals */}
      <ExpenseModal
        type={modalType}
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        expenses={expenses}
        onSuccess={(updatedExpenses) => {
          setExpenses(updatedExpenses);
          setModalType(null);
        }}
      />
    </div>
  );
};

export default Dashboard;
