import { useEffect, useMemo, useState } from "react";
import {
  createVendor,
  deleteVendor,
  getAllVendors,
  updateVendor,
} from "@/api/api-call/vendors";
import { Vendor } from "@/types";
import { showToast } from "@/utils/toast";
import { VendorFormType } from "./form";

const useVendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const fetchVendors = async () => {
    setLoading(true);
    const res = await getAllVendors();

    if (res?.error) {
      showToast("error", res.error);
      setLoading(false);
      return;
    }

    setVendors(res?.data?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    (() => fetchVendors())();
  }, []);

  const openAddDialog = () => {
    setEditingVendor(null);
    setOpen(true);
  };

  const openEditDialog = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setOpen(true);
  };

  const onSubmitVendor = async (data: VendorFormType) => {
    setSaving(true);

    const response = editingVendor
      ? await updateVendor(editingVendor._id, {
          name: data.name,
          phone: data.phone,
          email: data.email,
        })
      : await createVendor({
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

    const savedVendor = response.data.data;

    if (editingVendor) {
      setVendors((prev) =>
        prev.map((v) => (v._id === savedVendor._id ? savedVendor : v)),
      );
      showToast("success", "Vendor updated successfully");
    } else {
      setVendors((prev) => [savedVendor, ...prev]);
      showToast("success", "Vendor added successfully");
    }

    setOpen(false);
    setEditingVendor(null);
  };

  const onDeleteVendor = async (
    id: string,
  ): Promise<{ state: boolean; message?: string; error?: string }> => {
    const res = await deleteVendor(id);

    if (res?.error || !res?.data) {
      return { state: false, error: res?.error || "Failed to delete vendor" };
    }

    setVendors((prev) => prev.filter((v) => v._id !== id));

    return { state: true, message: res.data.message };
  };

  const updateVendorInList = (updated: Vendor) => {
    setVendors((prev) =>
      prev.map((v) => (v._id === updated._id ? updated : v)),
    );
  };

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return vendors;

    return vendors.filter(
      (vendor) =>
        vendor.name?.toLowerCase().includes(query) ||
        vendor.phone?.toLowerCase().includes(query) ||
        vendor.email?.toLowerCase().includes(query),
    );
  }, [vendors, search]);

  return {
    vendors,
    filtered,
    loading,
    saving,
    search,
    setSearch,
    open,
    setOpen,
    editingVendor,
    openAddDialog,
    openEditDialog,
    onSubmitVendor,
    onDeleteVendor,
    updateVendorInList,
  };
};

export { useVendors };
