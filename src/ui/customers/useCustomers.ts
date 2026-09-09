import { useEffect, useMemo, useState } from "react";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  updateCustomer,
} from "@/api/api-call/customers";
import { Customer } from "@/types";
import { showToast } from "@/utils/toast";
import { CustomerFormType } from "./form";

const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    const res = await getAllCustomers();

    if (res?.error) {
      showToast("error", res.error);
      setLoading(false);
      return;
    }

    setCustomers(res?.data?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    (() => fetchCustomers())();
  }, []);

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

    setSaving(false);

    if (response?.error || !response?.data) {
      showToast("error", response?.error || "Request failed");
      return;
    }

    const savedCustomer = response.data.data;

    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) => (c._id === savedCustomer._id ? savedCustomer : c)),
      );
      showToast("success", "Customer updated successfully");
    } else {
      setCustomers((prev) => [savedCustomer, ...prev]);
      showToast("success", "Customer added successfully");
    }

    setOpen(false);
    setEditingCustomer(null);
  };

  const onDeleteCustomer = async (
    id: string,
  ): Promise<{ state: boolean; message?: string; error?: string }> => {
    const res = await deleteCustomer(id);

    if (res?.error || !res?.data) {
      return { state: false, error: res?.error || "Failed to delete customer" };
    }

    setCustomers((prev) => prev.filter((c) => c._id !== id));

    return { state: true, message: res.data.message };
  };

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return customers;

    return customers.filter(
      (customer) =>
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
  };
};

export { useCustomers };
