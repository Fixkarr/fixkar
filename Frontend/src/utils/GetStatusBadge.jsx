 export const GetStatusBadge = ({status}) => {
    if (status === "pending")
      return (
        <span className="badge bg-warning text-dark px-3 py-2">Pending</span>
      );
    if (status === "accepted")
      return <span className="badge bg-primary px-3 py-2">Accepted</span>;

    if (status === "in-progress")
      return <span className="badge bg-warning px-3 py-2">In Progress</span>;

    if (status === "completed")
      return <span className="badge bg-success px-3 py-2">Completed</span>;

    if (status === "cancelled")
      return <span className="badge bg-danger px-3 py-2">Cancelled</span>;
    if (status === "rejected")
      return <span className="badge bg-danger px-3 py-2">Rejected</span>;
    if (status === "reached")
      return <span className="badge bg-info px-3 py-2">Reached</span>;

    return <span className="badge bg-secondary px-3 py-2">Unknown</span>;
  };