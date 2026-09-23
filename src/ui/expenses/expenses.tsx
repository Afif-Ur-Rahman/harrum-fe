"use client";
import { Plus, Wallet2 } from "lucide-react";

import { EmptyState, ReuseableDialog } from "@/components";
import { PageLayout } from "@/components/layout";
import { Loader } from "@/components/ui/loader";

import { ExpenseCard, ExpenseFilterDialog } from "./blocks";
import { ExpenseForm } from "./form";
import { useExpenses } from "./useExpenses";

export const Expenses = () => {
  const {
    expenses,
    total,
    loading,
    saving,
    open,
    setOpen,
    onSubmitExpense,
    filters,
    setFilters,
    activeFilterCount,
  } = useExpenses();

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <PageLayout>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8 shadow-lg shadow-cyan-950/20 backdrop-blur-xl">
              <Wallet2 className="h-5 w-5 text-cyan-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Expenses</h1>
              <p className="mt-1 text-xs text-slate-400">
                {total} expense{total !== 1 ? "s" : ""}
                {hasActiveFilters ? ` · ${expenses.length} matching` : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ExpenseFilterDialog
            filters={filters}
            activeCount={activeFilterCount}
            onApply={setFilters}
          />
          <ReuseableDialog
            title="Add Expense"
            open={open}
            setOpen={setOpen}
            triggerButton={
              <button
                type="button"
                className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-4 py-2.5 text-sm font-medium text-slate-300 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:bg-white/12 hover:text-white active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Expense</span>
              </button>
            }
            content={<ExpenseForm onSubmitExpense={onSubmitExpense} loading={saving} />}
          />
        </div>
      </div>

      {loading ? (
        <Loader label="expenses" />
      ) : expenses.length === 0 ? (
        <EmptyState
          icon={Wallet2}
          title={hasActiveFilters ? "No matching expenses" : "No expenses yet"}
          description={
            hasActiveFilters
              ? "Try adjusting the filters to find the expenses you're looking for."
              : "Add your first shop expense using the button above."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {expenses.map(expense => (
            <ExpenseCard key={expense._id} expense={expense} />
          ))}
        </div>
      )}
    </PageLayout>
  );
};
