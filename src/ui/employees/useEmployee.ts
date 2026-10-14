import { useEffect, useMemo, useState } from "react";

import { updateEmployeePermissions } from "@/api/api-call";
import {
  createEmployees,
  deleteEmployee,
  getAllEmployees,
  updateEmployee,
} from "@/api/api-call/employee";
import { usePersistStore } from "@/store/presistStore";
import { Employee, EmployeeRole, Employees } from "@/types/employees";
import { PagePermission } from "@/types/permissions";
import { showToast } from "@/utils/toast";

import { EmployeeFormType } from "./schema";

const EMPLOYEE_SECTIONS = [
  { key: "cleaner", roleLabel: "Cleaner" },
  { key: "mop_boy", roleLabel: "Mop Boy" },
  { key: "salesman", roleLabel: "Salesman" },
  { key: "accountant", roleLabel: "Accountant" },
  { key: "manager", roleLabel: "Manager" },
  { key: "senior_salesman", roleLabel: "Senior Salesman" },
] as const satisfies {
  key: EmployeeRole;
  roleLabel: string;
}[];

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

      try {
        const res = await getAllEmployees();

        if (res?.error) {
          showToast("error", res.error);
        }

        setEmployees(res?.data?.data || createEmptyEmployees());
      } catch (error) {
        showToast("error", (error as Error).message || "Failed to fetch employees");
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
        showToast("error", res.error);
        return;
      }

      const newEmployee = res?.data?.data;

      if (!newEmployee) {
        showToast("error", "Created employee was not returned by the server");
        return;
      }

      if (!isEmployeeRole(newEmployee.type)) {
        showToast("error", "Invalid employee type returned by server");
        return;
      }

      setEmployees({
        ...employees,
        [newEmployee.type]: [...employees[newEmployee.type], newEmployee],
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

      const nextEmployees = createEmptyEmployees();

      for (const employee of Object.values(employees).flat() as Employee[]) {
        if (employee._id !== id && isEmployeeRole(employee.type)) {
          const role: EmployeeRole = employee.type;
          nextEmployees[role].push(employee);
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

      setEmployees(
        mapEmployeeGroups(employees, list =>
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

      const updatedEmployees = mapEmployeeGroups(employees, list =>
        list.filter(employee => employee._id !== id),
      );

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
      employees[section.key].map(employee => ({
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
        employee.cnic,
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
