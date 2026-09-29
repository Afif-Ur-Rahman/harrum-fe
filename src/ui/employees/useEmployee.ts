import { useEffect, useMemo, useState } from "react";

import { updateEmployeePermissions } from "@/api/api-call";
import {
  createEmployees,
  deleteEmployee,
  getAllEmployees,
  updateEmployee,
} from "@/api/api-call/employee";
import { usePersistStore } from "@/store/presistStore";
import { Employee, Employees } from "@/types/employees";
import { PagePermission } from "@/types/permissions";
import { showToast } from "@/utils/toast";

import { EmployeeFormType } from "./schema";

const EMPLOYEE_SECTIONS = [
  { key: "salesman" as const, roleLabel: "Salesman" },
  { key: "accountant" as const, roleLabel: "Accountant" },
];

type EmployeeRole = keyof Employees;

const isEmployeeRole = (type: unknown): type is EmployeeRole => {
  return type === "salesman" || type === "accountant";
};

const useEmployees = () => {
  const { employees, employeesLoaded, setEmployees } = usePersistStore();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(!employeesLoaded);
  const [permissionLoading, setPermissionLoading] = useState(false);

  useEffect(() => {
    const fetchAllEmployees = async () => {
      if (employeesLoaded) return;

      setLoading(true);

      const res = await getAllEmployees();

      if (res?.error) {
        showToast("error", res.error);
      }

      setEmployees(res?.data?.data || { salesman: [], accountant: [] });
      setLoading(false);
    };

    fetchAllEmployees();
  }, [employeesLoaded, setEmployees]);

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
        [newEmployee.type]: [...(employees[newEmployee.type] || []), newEmployee],
      });

      showToast("success", "Employee added successfully");
      setOpen(false);
    } catch (error) {
      showToast("error", (error as Error).message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  const onUpdateEmployee = async (id: string, data: EmployeeFormType) => {
    try {
      setLoading(true);

      const res = await updateEmployee(id, data);

      if (res?.error) {
        showToast("error", res.error);
        return;
      }

      const updatedEmployee = res?.data?.data;

      if (!updatedEmployee) {
        showToast("error", "Updated employee was not returned by the server");
        return;
      }

      if (!isEmployeeRole(updatedEmployee.type)) {
        showToast("error", "Invalid employee type returned by server");
        return;
      }

      const nextEmployees: Employees = {
        salesman: [],
        accountant: [],
      };

      for (const employee of [...employees.salesman, ...employees.accountant]) {
        if (employee._id !== id) {
          nextEmployees[employee.type].push(employee);
        }
      }

      nextEmployees[updatedEmployee.type].push(updatedEmployee);

      setEmployees(nextEmployees);
      setSelectedEmployee(null);
      setEditOpen(false);

      showToast("success", "Employee updated successfully");
    } catch (error) {
      showToast("error", (error as Error).message || "Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

  const onUpdatePermissions = async (employeeId: string, pages: PagePermission[]) => {
    try {
      setPermissionLoading(true);

      const res = await updateEmployeePermissions(employeeId, { pages });

      if (res?.error) {
        showToast("error", res.error);
        return false;
      }

      const updatedPermissions = res?.data?.data;

      if (!updatedPermissions) {
        showToast("error", "Updated permissions were not returned by the server");
        return false;
      }

      const updateEmployeePermissionsInList = (list: Employee[]) =>
        list.map(employee =>
          employee._id === employeeId
            ? {
                ...employee,
                permissions: updatedPermissions.pages,
              }
            : employee,
        );

      setEmployees({
        salesman: updateEmployeePermissionsInList(employees.salesman),
        accountant: updateEmployeePermissionsInList(employees.accountant),
      });

      if (selectedEmployee?._id === employeeId) {
        setSelectedEmployee({
          ...selectedEmployee,
          permissions: updatedPermissions.pages,
        });
      }

      showToast("success", "Permissions updated successfully");

      return true;
    } catch (error) {
      showToast("error", (error as Error).message || "Failed to update permissions");

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

      const updatedEmployees: Employees = {
        salesman: employees.salesman.filter(employee => employee._id !== id),
        accountant: employees.accountant.filter(employee => employee._id !== id),
      };

      setEmployees(updatedEmployees);

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

  const flatEmployees = useMemo(() => {
    return EMPLOYEE_SECTIONS.flatMap(section =>
      (employees[section.key] || []).map(employee => ({
        ...employee,
        roleLabel: section.roleLabel,
      })),
    );
  }, [employees]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return flatEmployees;

    return flatEmployees.filter(employee =>
      [
        employee.username,
        employee.email,
        employee.phone,
        employee.guardianName,
        employee.guardianPhone,
        employee.permanentAddress,
        employee.currentAddress,
        employee.roleLabel,
      ].some(value => value?.toLowerCase().includes(query)),
    );
  }, [flatEmployees, search]);

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
    flatEmployees,
    search,
    setSearch,
    filtered,
  };
};

export { useEmployees };
