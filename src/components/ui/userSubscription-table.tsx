import { Table } from "@radix-ui/themes";
import { SubscriptionItem } from "@/types/subscription";
import Nodata from "./nodata";

interface UserSubscriptionTableProps {
  fetchSubscriptionHistory: () => void;
  subscriptionHistory: SubscriptionItem[];
}

export function UserSubscriptionTable({
  subscriptionHistory,
}: UserSubscriptionTableProps) {
  const subscriptionColumns = ["Date", "Plan", "Amount", "Status"];
  return (
    <Table.Root>
      <Table.Header className="bg-gray-50">
        <Table.Row>
          {subscriptionColumns.map((column, i) => (
            <Table.ColumnHeaderCell
              key={i}
              className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tacking-wide"
            >
              {column}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {subscriptionHistory.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={5}>
              <Nodata />
            </Table.Cell>
          </Table.Row>
        ) : (
          subscriptionHistory.map((s: SubscriptionItem, index) => {
            return (
              <Table.Row
                key={s._id}
                className={`border-t border-gray-100 hover:bg-gray-50 transition
              ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                align="center"
              >
                <Table.Cell className="px-4 py-3 text-gray-700">
                  {new Date(s.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Table.Cell>
                <Table.Cell className="px-4 py-3 font-medium text-gray-800">
                  {s.plan.charAt(0).toUpperCase() + s.plan.slice(1)}
                </Table.Cell>
                <Table.Cell className="px-4 py-3 text-gray-700">
                  {s.price} {s.currency}
                </Table.Cell>
                <Table.Cell
                  className={`${s.status === "active" ? "text-green-600" : s.status === "expired" ? "text-yellow-600" : "text-red-600"}`}
                >
                  {s.status === "active"
                    ? "Active"
                    : s.status === "expired"
                      ? "Expired"
                      : "Cancel"}
                </Table.Cell>
              </Table.Row>
            );
          })
        )}
      </Table.Body>
    </Table.Root>
  );
}
