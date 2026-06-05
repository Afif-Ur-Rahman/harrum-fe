import {
  createEmployees,
  deleteEmployee,
  getAllEmployees,
} from "@/api/api-call/employee";
import { EmployeeFormType } from "./schema";
import { Employees } from "@/types/employees";
import { useEffect, useState } from "react";
import { showToast } from "@/utils/toast";

type EmployeeRoleKey = keyof Employees;

interface EmployeeSection {
  key: EmployeeRoleKey;
  title: string;
  roleLabel: string;
  emoji: string;
  emptyText: string;
}

const useEmployees = () => {
  const EMPLOYEE_SECTIONS: EmployeeSection[] = [
    {
      key: "waiter",
      title: "Waiters",
      roleLabel: "Waiter",
      emoji: "🧑‍🍳",
      emptyText: "No waiters found.",
    },
    {
      key: "chef",
      title: "Chefs",
      roleLabel: "Chef",
      emoji: "👨‍🍳",
      emptyText: "No chefs found.",
    },
    {
      key: "accountant",
      title: "Accountants",
      roleLabel: "Accountant",
      emoji: "💼",
      emptyText: "No accountants found.",
    },
  ];
  const [employees, setEmployees] = useState<Employees>({
    waiter: [],
    chef: [],
    accountant: [],
  });
  const [open, setOpen] = useState(false);
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllEmployees = async () => {
      setLoading(true);
      const res = await getAllEmployees();
      if (res?.error) {
        showToast("error", res.error);
      }
      setEmployees(res?.data?.data || { waiter: [], chef: [], accountant: [] });
      setLoading(false);
    };
    fetchAllEmployees();

  }, []);

  const onAddEmployee = async (data: EmployeeFormType) => {
    try {
      setLoading(true);

      const res = await createEmployees(data);

      if (res?.error) {
        showToast("error", res.error);
        return;
      }

      const newEmployee = res?.data?.data;
      if (!newEmployee) return;

      setEmployees((prev) => ({
        ...prev,
        [newEmployee.type]: [
          ...(prev[newEmployee.type as keyof Employees] || []),
          newEmployee,
        ],
      }));
      showToast("success", "Employee added successfully");

      setOpen(false);
    } catch (err) {
      showToast("error", (err as Error).message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  const onDeleteEmployee = async (
    id: string,
  ): Promise<{ state: boolean; message?: string; error?: string }> => {
    try {
      const res = await deleteEmployee(id);

      if (res?.error) {
        return {
          state: false,
          error: res.error,
        };
      }
      setEmployees((prev) => {
        const updatedEmployees = { ...prev };
        for (const role in updatedEmployees) {
          updatedEmployees[role as keyof Employees] =
            updatedEmployees[role as keyof Employees]?.filter(
              (emp) => emp._id !== id,
            ) || [];
        }
        return updatedEmployees;
      });

      return { state: true, message: res?.data?.message };
    } catch (err) {
      return {
        state: false,
        error: (err as Error).message || "Failed to delete employee",
      };
    }
  };

  return {
    employees,
    loading,
    open,
    setOpen,
    openDialogId,
    setOpenDialogId,
    onAddEmployee,
    onDeleteEmployee,
    EMPLOYEE_SECTIONS,
  };
};
export { useEmployees };
