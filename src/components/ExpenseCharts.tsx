import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface Expense {
  id: number;
  amount: number;
  type: string;
  category: string;
  date: string;
}

interface ExpenseChartsProps {
  expenses: Expense[];
}

const COLORS = ["hsl(195 100% 39%)", "hsl(186 100% 55%)", "hsl(142 76% 36%)", "hsl(0 84% 60%)", "hsl(270 76% 48%)", "hsl(30 100% 50%)"];

const ExpenseCharts = ({ expenses }: ExpenseChartsProps) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No expense data available to display charts
      </div>
    );
  }

  // Aggregate by category
  const categoryData = Object.values(
    expenses.reduce((acc: any, exp) => {
      if (!acc[exp.category]) {
        acc[exp.category] = { name: exp.category, amount: 0 };
      }
      acc[exp.category].amount += Number(exp.amount);
      return acc;
    }, {})
  );

  // Aggregate by type
  const typeData = Object.values(
    expenses.reduce((acc: any, exp) => {
      if (!acc[exp.type]) {
        acc[exp.type] = { name: exp.type, amount: 0 };
      }
      acc[exp.type].amount += Number(exp.amount);
      return acc;
    }, {})
  );

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-foreground">Financial Overview</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart - By Category */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-card-foreground text-center">Expenses by Category</h3>
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
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - By Type */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-card-foreground text-center">Income vs Expenses</h3>
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
                }}
              />
              <Legend />
              <Bar dataKey="amount" fill="hsl(195 100% 39%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCharts;
