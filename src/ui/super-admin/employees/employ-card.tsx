import { ConfirmationDialog } from "@/components";
import { User } from "@/types";
import { Trash2 } from "lucide-react";
import Image from "next/image";

const ROLE_STYLES: Record<string, string> = {
  Waiter:     "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Chef:       "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Accountant: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
};

export const EmployeeCard = ({
  data,
  handleDelete,
  role,
}: {
  data: User;
  openDialogId: string | null;
  setOpenDialogId: (id: string | null) => void;
  handleDelete: (id: string) => Promise<{ state: boolean; error?: string }>;
  role: string;
}) => (
  <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center gap-3 hover:shadow-md transition-shadow group">

    {/* Delete */}
    <div className="absolute top-3.5 right-3.5">
      <ConfirmationDialog
        title="Delete Employee"
        description="Are you sure you want to delete this employee? This action cannot be undone."
        saveButtonTitle="Delete"
        confirmAction={() => handleDelete(data._id)}
        trigger={
          <button className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
            <Trash2 className="w-4 h-4" />
          </button>
        }
      />
    </div>

    {/* Avatar */}
    <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-gray-100 shrink-0">
      <Image
        src={data.image || "/images/r-dummy.png"}
        alt={data.fullName || role}
        width={64}
        height={64}
        className="w-full h-full object-cover"
      />
    </div>

    {/* Info */}
    <div className="text-center space-y-1">
      <p className="text-sm font-semibold text-gray-900 capitalize leading-tight">
        {data?.fullName || data?.username || role}
      </p>
      <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${ROLE_STYLES[role] ?? "bg-gray-100 text-gray-600"}`}>
        {role}
      </span>
      <p className="text-xs text-gray-400 truncate max-w-[180px]">{data.email}</p>
    </div>
  </div>
);
