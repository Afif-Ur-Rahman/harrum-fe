import { useEffect, useMemo, useState } from "react";

import { updateEmployeePermissions } from "@/api/api-call";
import {
  createEmployees,
  deleteEmployee,
  getAllEmployees,
  updateEmployee,
} from "@/api/api-call/employee";
import { usePersistStore } from "@/store/presistStore";
import type { Employee, EmployeeRole, Employees } from "@/types/employees";
import type { PagePermission } from "@/types/permissions";
import { showToast } from "@/utils/toast";

import { EMPLOYEE_SECTIONS } from "./constants";
import type { EmployeeFormType } from "./schema";

const EMPLOYEE_ROLES: EmployeeRole[] = [
  "cleaner",
  "mop_boy",
  "salesman",
  "accountant",
  "manager",
  "senior_salesman",
];

const createEmptyEmployees = (): Employees => ({
  cleaner: [],
  mop_boy: [],
  salesman: [],
  accountant: [],
  manager: [],
  senior_salesman: [],
});

const isEmployeeRole = (type: unknown): type is EmployeeRole =>
  typeof type === "string" && EMPLOYEE_ROLES.includes(type as EmployeeRole);

const mapEmployeeGroups = (
  employees: Employees,
  mapper: (list: Employee[]) => Employee[],
): Employees => ({
  cleaner: mapper(employees.cleaner),
  mop_boy: mapper(employees.mop_boy),
  salesman: mapper(employees.salesman),
  accountant: mapper(employees.accountant),
  manager: mapper(employees.manager),
  senior_salesman: mapper(employees.senior_salesman),
});

const useEmployees = () => {
  const { employees, employeesLoaded, setEmployees } = usePersistStore();

  const groupedEmployees = useMemo<Employees>(
    () => ({
      ...createEmptyEmployees(),
      ...employees,
    }),
    [employees],
  );

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(!employeesLoaded);
  const [permissionLoading, setPermissionLoading] = useState(false);

  useEffect(() => {
    const fetchAllEmployees = async () => {
      if (employeesLoaded) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const res = await getAllEmployees();

        if (res?.error) {
          showToast("error", "Error", res.error);
        }

        setEmployees({
          ...createEmptyEmployees(),
          ...(res?.data?.data ?? {}),
        });
      } catch (error) {
        showToast("error", "Error", (error as Error).message || "Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };

    fetchAllEmployees();
  }, [employeesLoaded, setEmployees]);

  const onAddEmployee = async (data: EmployeeFormType) => {
    try {
      setLoading(true);

      const res = await createEmployees(data);

      if (res?.error) {
        showToast("error", "Error", res.error);
        return;
      }

      const newEmployee = res?.data?.data;

      if (!newEmployee) {
        showToast("error", "Error", "Created employee was not returned by the server");
        return;
      }

      if (!isEmployeeRole(newEmployee.type)) {
        showToast("error", "Error", "Invalid employee type returned by server");
        return;
      }

      setEmployees({
        ...groupedEmployees,
        [newEmployee.type]: [...groupedEmployees[newEmployee.type], newEmployee],
      });

      showToast("success", "Success", "Employee added successfully");
      setOpen(false);
    } catch (error) {
      showToast("error", "Error", (error as Error).message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  const onUpdateEmployee = async (id: string, data: EmployeeFormType) => {
    try {
      setLoading(true);

      const res = await updateEmployee(id, data);

      if (res?.error) {
        showToast("error", "Error", res.error);
        return;
      }

      const updatedEmployee = res?.data?.data;

      if (!updatedEmployee) {
        showToast("error", "Error", "Updated employee was not returned by the server");
        return;
      }

      if (!isEmployeeRole(updatedEmployee.type)) {
        showToast("error", "Error", "Invalid employee type returned by server");
        return;
      }

      const nextEmployees = createEmptyEmployees();

      for (const group of Object.values(groupedEmployees)) {
        for (const employee of group) {
          if (employee._id !== id && isEmployeeRole(employee.type)) {
            const role: EmployeeRole = employee.type;
            nextEmployees[role].push(employee);
          }
        }
      }

      nextEmployees[updatedEmployee.type].push(updatedEmployee);

      setEmployees(nextEmployees);
      setSelectedEmployee(null);
      setEditOpen(false);

      showToast("success", "Success", "Employee updated successfully");
    } catch (error) {
      showToast("error", "Error", (error as Error).message || "Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

  const onUpdatePermissions = async (employeeId: string, pages: PagePermission[]) => {
    try {
      setPermissionLoading(true);

      const res = await updateEmployeePermissions(employeeId, { pages });

      if (res?.error) {
        showToast("error", "Error", res.error);
        return false;
      }

      const updatedPermissions = res?.data?.data;

      if (!updatedPermissions) {
        showToast("error", "Error", "Updated permissions were not returned by the server");
        return false;
      }

      setEmployees(
        mapEmployeeGroups(groupedEmployees, list =>
          list.map(employee =>
            employee._id === employeeId
              ? {
                  ...employee,
                  permissions: updatedPermissions.pages,
                }
              : employee,
          ),
        ),
      );

      if (selectedEmployee?._id === employeeId) {
        setSelectedEmployee({
          ...selectedEmployee,
          permissions: updatedPermissions.pages,
        });
      }

      showToast("success", "Success", "Permissions updated successfully");

      return true;
    } catch (error) {
      showToast("error", "Error", (error as Error).message || "Failed to update permissions");
      return false;
    } finally {
      setPermissionLoading(false);
    }
  };

  const onDeleteEmployee = async (id: string) => {
    try {
      const res = await deleteEmployee(id);

      if (res?.error) {
        return {
          state: false,
          error: res.error,
        };
      }

      setEmployees(
        mapEmployeeGroups(groupedEmployees, list => list.filter(employee => employee._id !== id)),
      );

      if (selectedEmployee?._id === id) {
        setSelectedEmployee(null);
      }

      return {
        state: true,
        message: res?.data?.message,
      };
    } catch (error) {
      return {
        state: false,
        error: (error as Error).message || "Failed to delete employee",
      };
    }
  };

  const filteredEmployees = useMemo<Employees>(() => {
    const query = search.toLowerCase().trim();

    return {
      cleaner: groupedEmployees.cleaner.filter(employee =>
        matchesSearch(employee, query, "Cleaner"),
      ),
      mop_boy: groupedEmployees.mop_boy.filter(employee =>
        matchesSearch(employee, query, "Mop Boy"),
      ),
      salesman: groupedEmployees.salesman.filter(employee =>
        matchesSearch(employee, query, "Salesman"),
      ),
      accountant: groupedEmployees.accountant.filter(employee =>
        matchesSearch(employee, query, "Accountant"),
      ),
      manager: groupedEmployees.manager.filter(employee =>
        matchesSearch(employee, query, "Manager"),
      ),
      senior_salesman: groupedEmployees.senior_salesman.filter(employee =>
        matchesSearch(employee, query, "Senior Salesman"),
      ),
    };
  }, [groupedEmployees, search]);

  function matchesSearch(employee: Employee, query: string, roleLabel: string): boolean {
    if (!query) return true;

    return [
      employee.username,
      employee.email,
      employee.cnic,
      employee.phone,
      employee.guardianName,
      employee.guardianPhone,
      employee.permanentAddress,
      employee.currentAddress,
      roleLabel,
    ].some(value => value?.toLowerCase().includes(query));
  }

  const flatEmployees = useMemo(
    () =>
      EMPLOYEE_SECTIONS.flatMap(({ key, roleLabel }) =>
        groupedEmployees[key].map(employee => ({
          ...employee,
          roleLabel,
        })),
      ),
    [groupedEmployees],
  );

  const filtered = useMemo(
    () =>
      EMPLOYEE_SECTIONS.flatMap(({ key, roleLabel }) =>
        filteredEmployees[key].map(employee => ({
          ...employee,
          roleLabel,
        })),
      ),
    [filteredEmployees],
  );

  return {
    loading,
    permissionLoading,
    open,
    setOpen,
    editOpen,
    setEditOpen,
    selectedEmployee,
    setSelectedEmployee,
    onAddEmployee,
    onUpdateEmployee,
    onUpdatePermissions,
    onDeleteEmployee,
    employees: groupedEmployees,
    filteredEmployees,
    flatEmployees,
    filtered,
    search,
    setSearch,
  };
};

export { useEmployees };
