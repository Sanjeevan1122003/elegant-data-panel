import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Expense {
  id: number;
  user_expense_id: number;
  amount: number;
  type: string;
  category: string;
  date: string;
}

interface ExpenseTableProps {
  expenses: Expense[];
  isLoading?: boolean;
}

const ExpenseTable = ({ expenses, isLoading = false }: ExpenseTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Expense; direction: "asc" | "desc" } | null>(null);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded w-32 mb-4" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  const handleSort = (key: keyof Expense) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { key, direction: "desc" };
      }
      return null;
    });
  };

  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...expenses];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (expense) =>
          expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.amount.toString().includes(searchTerm)
      );
    }

    // Filter by type
    if (filterType !== "all") {
      result = result.filter((expense) => expense.type.toLowerCase() === filterType);
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
        }

        const aString = String(aValue);
        const bString = String(bValue);
        return sortConfig.direction === "asc"
          ? aString.localeCompare(bString)
          : bString.localeCompare(aString);
      });
    }

    return result;
  }, [expenses, searchTerm, filterType, sortConfig]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by category, type, or amount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-background"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-40 h-10 bg-background">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="font-semibold">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("user_expense_id")}
                  className="h-8 px-2 hover:bg-muted/50"
                >
                  ID
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="font-semibold">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("date")}
                  className="h-8 px-2 hover:bg-muted/50"
                >
                  Date
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="font-semibold">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("category")}
                  className="h-8 px-2 hover:bg-muted/50"
                >
                  Category
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="font-semibold">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("type")}
                  className="h-8 px-2 hover:bg-muted/50"
                >
                  Type
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="font-semibold text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("amount")}
                  className="h-8 px-2 hover:bg-muted/50 ml-auto"
                >
                  Amount
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No expenses found
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedExpenses.map((expense) => (
                <TableRow key={expense.id} className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{expense.user_expense_id}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(expense.date)}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        expense.type === "Income"
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {expense.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    <span className={expense.type === "Income" ? "text-success" : "text-destructive"}>
                      {expense.type === "Income" ? "+" : "-"}${expense.amount.toFixed(2)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      <div className="px-4 pb-4 text-sm text-muted-foreground">
        Showing {filteredAndSortedExpenses.length} of {expenses.length} transactions
      </div>
    </div>
  );
};

export default ExpenseTable;
