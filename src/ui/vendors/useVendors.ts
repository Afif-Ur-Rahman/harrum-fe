"use client";

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
import { usePersistStore } from "@/store/presistStore";

const useVendors = () => {
  const {
    vendors,
    vendorsLoaded,
    setVendors,
    addVendor,
    updateVendorById,
    removeVendorById,
  } = usePersistStore();

  const [loading, setLoading] = useState(!vendorsLoaded);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const fetchVendors = async (force = false) => {
    if (vendorsLoaded && !force) {
      setLoading(false);
      return;
    }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        });

    setSaving(false);

    if (response?.error || !response?.data) {
      showToast("error", response?.error || "Request failed");
      return;
    }

    const savedVendor = response.data.data;

    if (editingVendor) {
      updateVendorById(savedVendor);
      showToast("success", "Vendor updated successfully");
    } else {
      addVendor(savedVendor);
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

    removeVendorById(id);

    return { state: true, message: res.data.message };
  };

  const updateVendorInList = (updated: Vendor) => {
    updateVendorById(updated);
  };

  const dueAmount = useMemo(
    () =>
      vendors.reduce((sum, vendor) => sum + (vendor.remainingAmount || 0), 0),
    [vendors],
  );

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
    dueAmount,
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
    fetchVendors,
  };
};

export { useVendors };
