import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: number;
  user_expense_id: number;
  amount: number;
  type: string;
  category: string;
  date: string;
}

interface ExpenseModalProps {
  type: "add" | "update" | "delete" | null;
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
  onSuccess: (updatedExpenses: Expense[]) => void;
}

const ExpenseModal = ({ type, isOpen, onClose, expenses, onSuccess }: ExpenseModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    user_expense_id: "",
    amount: "",
    type: "Expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [deleteIds, setDeleteIds] = useState("");

  useEffect(() => {
    if (type === "update" && formData.user_expense_id) {
      const expense = expenses.find((e) => e.user_expense_id === Number(formData.user_expense_id));
      if (expense) {
        setFormData({
          user_expense_id: expense.user_expense_id.toString(),
          amount: expense.amount.toString(),
          type: expense.type,
          category: expense.category,
          date: expense.date,
        });
      }
    }
  }, [formData.user_expense_id, expenses, type]);

  const handleAdd = () => {
    if (!formData.amount || !formData.category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newExpense: Expense = {
      id: expenses.length + 1,
      user_expense_id: expenses.length + 1,
      amount: Number(formData.amount),
      type: formData.type,
      category: formData.category,
      date: formData.date,
    };

    onSuccess([...expenses, newExpense]);
    toast({
      title: "Success",
      description: "Expense added successfully",
    });
    resetForm();
  };

  const handleUpdate = () => {
    if (!formData.user_expense_id) {
      toast({
        title: "Select expense",
        description: "Please select an expense to update",
        variant: "destructive",
      });
      return;
    }

    const updatedExpenses = expenses.map((e) =>
      e.user_expense_id === Number(formData.user_expense_id)
        ? {
            ...e,
            amount: Number(formData.amount),
            type: formData.type,
            category: formData.category,
            date: formData.date,
          }
        : e
    );

    onSuccess(updatedExpenses);
    toast({
      title: "Success",
      description: "Expense updated successfully",
    });
    resetForm();
  };

  const handleDelete = () => {
    const ids = deleteIds.split(",").map((id) => Number(id.trim()));
    const updatedExpenses = expenses.filter((e) => !ids.includes(e.user_expense_id));

    onSuccess(updatedExpenses);
    toast({
      title: "Success",
      description: `${ids.length} expense(s) deleted successfully`,
    });
    setDeleteIds("");
  };

  const resetForm = () => {
    setFormData({
      user_expense_id: "",
      amount: "",
      type: "Expense",
      category: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const getTitle = () => {
    switch (type) {
      case "add":
        return "Add Expense";
      case "update":
        return "Update Expense";
      case "delete":
        return "Delete Expense";
      default:
        return "";
    }
  };

  const getDescription = () => {
    switch (type) {
      case "add":
        return "Add a new income or expense entry";
      case "update":
        return "Update an existing expense entry";
      case "delete":
        return "Delete one or more expense entries";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-large">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {type === "delete" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deleteIds">Expense IDs (comma-separated)</Label>
                <Input
                  id="deleteIds"
                  placeholder="e.g., 1,2,3"
                  value={deleteIds}
                  onChange={(e) => setDeleteIds(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Warning: This action cannot be undone
              </p>
              <Button onClick={handleDelete} variant="destructive" className="w-full">
                Delete Expenses
              </Button>
            </div>
          ) : (
            <>
              {type === "update" && (
                <div className="space-y-2">
                  <Label htmlFor="selectExpense">Select Expense</Label>
                  <Select
                    value={formData.user_expense_id}
                    onValueChange={(value) => setFormData({ ...formData, user_expense_id: value })}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Choose an expense" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover max-h-60">
                      {expenses.map((exp) => (
                        <SelectItem key={exp.id} value={exp.user_expense_id.toString()}>
                          ID {exp.user_expense_id}: {exp.category} - ${exp.amount}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="Income">Income</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Food, Transport"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <Button
                onClick={type === "add" ? handleAdd : handleUpdate}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                {type === "add" ? "Add Expense" : "Update Expense"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseModal;
