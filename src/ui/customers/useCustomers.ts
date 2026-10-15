import { useEffect, useMemo, useState } from "react";

import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  updateCustomer,
} from "@/api/api-call/customers";
import { usePersistStore } from "@/store/presistStore";
import { Customer } from "@/types";
import { showToast } from "@/utils/toast";

import { CustomerFormType } from "./form";

const useCustomers = () => {
  const {
    customers,
    setCustomers,
    setCustomersLoaded,
    addCustomer,
    updateCustomerById,
    removeCustomerById,
  } = usePersistStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchCustomers = async () => {
      try {
        const res = await getAllCustomers();

        if (cancelled) return;

        if (res?.error) {
          showToast("error", "Error", res.error);
          return;
        }

        setCustomers(res?.data?.data || []);
        setCustomersLoaded(true);
      } catch {
        if (!cancelled) {
          showToast("error", "Error", "Failed to fetch customers");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchCustomers();

    return () => {
      cancelled = true;
    };
  }, [setCustomers, setCustomersLoaded]);

  const openAddDialog = () => {
    setEditingCustomer(null);
    setOpen(true);
  };

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer);
    setOpen(true);
  };

  const onSubmitCustomer = async (data: CustomerFormType) => {
    setSaving(true);

    try {
      const response = editingCustomer
        ? await updateCustomer(editingCustomer._id, {
            name: data.name,
            phone: data.phone,
            email: data.email,
          })
        : await createCustomer({
            name: data.name,
            phone: data.phone,
            email: data.email,
            remainingAmount: Number(data.remainingAmount) || 0,
          });

      if (response?.error || !response?.data) {
        showToast("error", "Error", response?.error || "Request failed");
        return;
      }

      const savedCustomer = response.data.data;

      if (editingCustomer) {
        updateCustomerById(savedCustomer);
        showToast("success", "Success", "Customer updated successfully");
      } else {
        addCustomer(savedCustomer);
        showToast("success", "Success", "Customer added successfully");
      }

      setOpen(false);
      setEditingCustomer(null);
    } catch {
      showToast("error", "Error", "Failed to save customer");
    } finally {
      setSaving(false);
    }
  };

  const onDeleteCustomer = async (
    id: string,
  ): Promise<{ state: boolean; message?: string; error?: string }> => {
    try {
      const res = await deleteCustomer(id);

      if (res?.error || !res?.data) {
        return {
          state: false,
          error: res?.error || "Failed to delete customer",
        };
      }

      removeCustomerById(id);

      return { state: true, message: res.data.message };
    } catch {
      return {
        state: false,
        error: "Failed to delete customer",
      };
    }
  };

  const updateCustomerInList = (updated: Customer) => {
    updateCustomerById(updated);
  };

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return customers;

    return customers.filter(
      customer =>
        customer.name?.toLowerCase().includes(query) ||
        customer.phone?.toLowerCase().includes(query) ||
        customer.email?.toLowerCase().includes(query),
    );
  }, [customers, search]);

  return {
    customers,
    filtered,
    loading,
    saving,
    search,
    setSearch,
    open,
    setOpen,
    editingCustomer,
    openAddDialog,
    openEditDialog,
    onSubmitCustomer,
    onDeleteCustomer,
    updateCustomerInList,
  };
};

export { useCustomers };
