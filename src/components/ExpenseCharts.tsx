import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Expense {
  id: number;
  amount: number;
  type: string;
  category: string;
  date: string;
}

interface ExpenseChartsProps {
  expenses: Expense[];
  isLoading?: boolean;
}

const COLORS = ["hsl(195 100% 39%)", "hsl(186 100% 55%)", "hsl(142 76% 36%)", "hsl(0 84% 60%)", "hsl(270 76% 48%)", "hsl(30 100% 50%)"];

const ExpenseCharts = ({ expenses, isLoading = false }: ExpenseChartsProps) => {
  const [filterType, setFilterType] = useState<"All" | "Income" | "Expense">("All");
  const [chartType, setChartType] = useState<"pie" | "bar" | "line">("pie");

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-8 bg-muted animate-pulse rounded w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[300px] bg-muted animate-pulse rounded" />
          <div className="h-[300px] bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  // Filter expenses based on type
  const filteredExpenses = filterType === "All" 
    ? expenses 
    : expenses.filter(exp => exp.type === filterType);

  if (!filteredExpenses || filteredExpenses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No expense data available to display charts
      </div>
    );
  }

  // Aggregate by category
  const categoryData = Object.values(
    filteredExpenses.reduce((acc: any, exp) => {
      if (!acc[exp.category]) {
        acc[exp.category] = { name: exp.category, amount: 0 };
      }
      acc[exp.category].amount += Number(exp.amount);
      return acc;
    }, {})
  );

  // Aggregate by type
  const typeData = Object.values(
    filteredExpenses.reduce((acc: any, exp) => {
      if (!acc[exp.type]) {
        acc[exp.type] = { name: exp.type, amount: 0 };
      }
      acc[exp.type].amount += Number(exp.amount);
      return acc;
    }, {})
  );

  const renderChart = () => {
    const chartData = chartType === "pie" ? categoryData : typeData;
    
    switch (chartType) {
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `$${value.toFixed(2)}`}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--popover-foreground))",
                }}
              />
              <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                formatter={(value: number) => `$${value.toFixed(2)}`}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--popover-foreground))",
                }}
              />
              <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
              <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                formatter={(value: number) => `$${value.toFixed(2)}`}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--popover-foreground))",
                }}
              />
              <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground">Financial Overview</h2>
        
        <div className="flex flex-wrap gap-2">
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Income">Income Only</SelectItem>
              <SelectItem value="Expense">Expense Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pie">Pie Chart</SelectItem>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-card-foreground text-center">
            {chartType === "pie" ? "Expenses by Category" : "Income vs Expenses"}
          </h3>
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

export default ExpenseCharts;
