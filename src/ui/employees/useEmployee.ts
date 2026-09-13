import {
  createEmployees,
  deleteEmployee,
  getAllEmployees,
} from "@/api/api-call/employee";
import { EmployeeFormType } from "./schema";
import { Employees } from "@/types/employees";
import { useEffect, useMemo, useState } from "react";
import { showToast } from "@/utils/toast";
import { User } from "@/types";
import { usePersistStore } from "@/store/presistStore";

type EmployeeRoleKey = keyof Employees;

interface EmployeeSection {
  key: EmployeeRoleKey;
  roleLabel: string;
}

const EMPLOYEE_SECTIONS: EmployeeSection[] = [
  { key: "worker", roleLabel: "Worker" },
  { key: "accountant", roleLabel: "Accountant" },
];

const useEmployees = () => {
  const { employees, employeesLoaded, setEmployees } = usePersistStore();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(!employeesLoaded);

  useEffect(() => {
    const fetchAllEmployees = async () => {
      if (employeesLoaded) return;

      setLoading(true);
      const res = await getAllEmployees();
      if (res?.error) {
        showToast("error", res.error);
      }
      setEmployees(res?.data?.data || { worker: [], accountant: [] });
      setLoading(false);
    };
    fetchAllEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      setEmployees({
        ...employees,
        [newEmployee.type]: [
          ...(employees[newEmployee.type as keyof Employees] || []),
          newEmployee,
        ],
      });
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

      const updatedEmployees = { ...employees };
      for (const role in updatedEmployees) {
        updatedEmployees[role as keyof Employees] =
          updatedEmployees[role as keyof Employees]?.filter(
            (emp) => emp._id !== id,
          ) || [];
      }
      setEmployees(updatedEmployees);

      return { state: true, message: res?.data?.message };
    } catch (err) {
      return {
        state: false,
        error: (err as Error).message || "Failed to delete employee",
      };
    }
  };

  const flatEmployees = useMemo(() => {
    return EMPLOYEE_SECTIONS.flatMap((section) =>
      (employees[section.key] || []).map((employee: User) => ({
        ...employee,
        roleLabel: section.roleLabel,
      })),
    );
  }, [employees]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return flatEmployees;

    return flatEmployees.filter(
      (employee) =>
        employee.username?.toLowerCase().includes(query) ||
        employee.email?.toLowerCase().includes(query),
    );
  }, [flatEmployees, search]);

  return {
    loading,
    open,
    setOpen,
    onAddEmployee,
    onDeleteEmployee,
    flatEmployees,
    search,
    setSearch,
    filtered,
  };
};

export { useEmployees };
