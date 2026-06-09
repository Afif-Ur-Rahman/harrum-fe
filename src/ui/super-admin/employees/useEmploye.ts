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

type EmployeeRoleKey = keyof Employees;

interface EmployeeSection {
  key: EmployeeRoleKey;
  title: string;
  roleLabel: string;
  emoji: string;
  emptyText: string;
}

const useEmployees = () => {
  const EMPLOYEE_SECTIONS: EmployeeSection[] = useMemo<EmployeeSection[]>(
    () => [
      {
        key: "worker",
        title: "Workers",
        roleLabel: "Worker",
        emoji: "🧑",
        emptyText: "No workers found.",
      },
      {
        key: "accountant",
        title: "Accountants",
        roleLabel: "Accountant",
        emoji: "💼",
        emptyText: "No accountants found.",
      },
    ],
    [],
  );
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [employees, setEmployees] = useState<Employees>({
    worker: [],
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
      setEmployees(res?.data?.data || { worker: [], accountant: [] });
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

  const flatEmployees = useMemo(() => {
    return EMPLOYEE_SECTIONS.flatMap((section) =>
      (employees[section.key] || []).map((employee: User) => ({
        ...employee,
        roleLabel: section.roleLabel,
      })),
    );
  }, [employees, EMPLOYEE_SECTIONS]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();

    return flatEmployees.filter((employee) => {
      const matchesRole =
        roleFilter === "all" || employee.roleLabel.toLowerCase() === roleFilter;

      const matchesSearch =
        !query ||
        employee.username?.toLowerCase().includes(query) ||
        employee.email?.toLowerCase().includes(query);

      return matchesRole && matchesSearch;
    });
  }, [flatEmployees, search, roleFilter]);

  const tabs = [
    { value: "all", label: "All Staff" },
    ...EMPLOYEE_SECTIONS.map((section) => ({
      value: section.roleLabel.toLowerCase(),
      label: section.title,
    })),
  ];

  const countsByRole = useMemo(() => {
    return EMPLOYEE_SECTIONS.map((section) => ({
      roleLabel: section.roleLabel,
      title: section.title,
      total: employees[section.key]?.length || 0,
    }));
  }, [EMPLOYEE_SECTIONS, employees]);

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
    flatEmployees,
    search,
    roleFilter,
    setSearch,
    setRoleFilter,
    filtered,
    tabs,
    countsByRole,
  };
};
export { useEmployees };
