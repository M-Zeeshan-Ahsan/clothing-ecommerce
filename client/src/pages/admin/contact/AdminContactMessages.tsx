import { useState } from "react";
import {
  useDeleteContactMessageMutation,
  useGetContactMessagesQuery,
  useMarkContactMessageAsReadMutation,
} from "../../../store/api/contactApi";
import "./AdminContactMessages.scss";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/common/loader/Loader";
const AdminContactMessages = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const limit = 10;

  const { data, isLoading, isError } = useGetContactMessagesQuery({
    page,
    limit,
  });

  const [markContactMessageAsRead, { isLoading: isMarkingRead }] =
    useMarkContactMessageAsReadMutation();

  const [deleteContactMessage, { isLoading: isDeleting }] =
    useDeleteContactMessageMutation();

  const messages = data?.data.messages || [];
  const pagination = data?.data.pagination;

  // Mark as Read
  const handleMarkAsRead = async (id: number) => {
    try {
      await markContactMessageAsRead(id).unwrap();
    } catch (error) {
      console.error("Failed to mark contact message as read:", error);
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer query?",
    );

    if (!confirmed) return;

    try {
      await deleteContactMessage(id).unwrap();

      // Agar current page par sirf 1 item tha
      // aur ye delete hone ke baad page empty ho gaya
      if (messages.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Failed to delete contact message:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-contact-messages">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="admin-contact-messages">
        <p>Failed to load customer queries.</p>
      </div>
    );
  }

  return (
    <div className="admin-contact-messages">
      {/* Header */}
      <div className="contact-page-header d-flex justify-content-between align-items-center">
        <div>
          <h2>Customer Queries</h2>
          <p className="mb-0">Messages submitted through the contact form.</p>
        </div>

        <span className="total-badge">Total: {pagination?.total || 0}</span>
      </div>

      {/* Table */}
      <div className="queries-card">
        <div className="queries-table-wrapper">
          <table className="queries-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <h5>No Customer Queries</h5>
                      <p>There are currently no customer messages.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                messages.map((item, index) => (
                  <tr key={item.id}>
                    {/* Number */}
                    <td>{(page - 1) * limit + index + 1}</td>

                    {/* Customer */}
                    <td>
                      <span className="customer-name">{item.name}</span>
                    </td>

                    {/* Contact */}
                    <td>
                      <div className="contact-info">
                        <span className="email">{item.email || "-"}</span>

                        <span className="phone">{item.phone}</span>
                      </div>
                    </td>

                    {/* Message */}
                    <td>
                      <div className="message-text" title={item.message}>
                        {item.message}
                      </div>
                    </td>

                    {/* Date */}
                    <td>
                      <span className="query-date">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      {item.isRead ? (
                        <span className="status-badge read">Read</span>
                      ) : (
                        <span className="status-badge unread">Unread</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="query-actions">
                        <button
                          type="button"
                          className="view-btn"
                          onClick={() =>
                            navigate(`/admin/contact-messages/${item.id}`)
                          }
                        >
                          View
                        </button>

                        {!item.isRead && (
                          <button
                            type="button"
                            className="mark-read-btn"
                            onClick={() => handleMarkAsRead(item.id)}
                            disabled={isMarkingRead}
                          >
                            Mark Read
                          </button>
                        )}

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleDelete(item.id)}
                          disabled={isDeleting}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="pagination-wrapper">
            <span className="pagination-info">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <div className="pagination-buttons">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </button>

              <button
                type="button"
                disabled={page === pagination.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContactMessages;
