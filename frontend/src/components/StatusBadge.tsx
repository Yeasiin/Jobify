import clsx from "clsx";

type Status = "pending" | "reviewing" | "shortlisted" | "rejected" | "accepted";

const statusStyles: Record<Status, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  reviewing: "bg-blue-100 text-blue-800 border-blue-300",
  shortlisted: "bg-indigo-100 text-indigo-800 border-indigo-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
  accepted: "bg-green-100 text-green-800 border-green-300",
};

export const StatusBadge = ({ status }: { status: Status }) => {
  return (
    <span
      className={clsx(
        "px-3 py-1 text-xs font-medium rounded-full border",
        statusStyles[status]
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
