import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteContactMessageMutation,
  useGetContactMessageByIdQuery,
  useMarkContactMessageAsReadMutation,
} from "../../../store/api/contactApi";
import "./AdminContactMessageDetail.scss";
import Loader from "../../../components/common/loader/Loader";

const AdminContactMessageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const messageId = Number(id);

  const { data, isLoading, isError } = useGetContactMessageByIdQuery(
    messageId,
    {
      skip: !messageId,
    },
  );

  const [markAsRead, { isLoading: isMarkingRead }] =
    useMarkContactMessageAsReadMutation();

  const [deleteMessage, { isLoading: isDeleting }] =
    useDeleteContactMessageMutation();

  const contactMessage = data?.data;

  const handleMarkAsRead = async () => {
    if (!contactMessage) return;

    try {
      await markAsRead(contactMessage.id).unwrap();
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  };

  const handleDelete = async () => {
    if (!contactMessage) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this customer query?",
    );

    if (!confirmed) return;

    try {
      await deleteMessage(contactMessage.id).unwrap();

      navigate("/admin/contact-messages");
    } catch (error) {
      console.error("Failed to delete contact message:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-contact-detail">
        <Loader />
      </div>
    );
  }

  if (isError || !contactMessage) {
    return (
      <div className="admin-contact-detail">
        <div className="detail-error">
          <h4>Query Not Found</h4>
          <p>The customer query could not be found.</p>

          <button
            type="button"
            onClick={() => navigate("/admin/contact-messages")}
          >
            Back to Queries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-contact-detail">
      {/* Header */}
      <div className="detail-header">
        <div>
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/admin/contact-messages")}
          >
            ← Back to Queries
          </button>

          <h2>Customer Query</h2>

          <p>View the complete message submitted by the customer.</p>
        </div>

        <div className="detail-actions">
          {!contactMessage.isRead && (
            <button
              type="button"
              className="mark-read-btn"
              onClick={handleMarkAsRead}
              disabled={isMarkingRead}
            >
              {isMarkingRead ? "Updating..." : "Mark as Read"}
            </button>
          )}

          <button
            type="button"
            className="delete-btn"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="detail-card">
        {/* Customer Information */}
        <div className="customer-section">
          <div className="section-title">Customer Information</div>

          <div className="customer-grid">
            <div className="info-item">
              <span className="label">Name</span>
              <span className="value">{contactMessage.name}</span>
            </div>

            <div className="info-item">
              <span className="label">Email</span>
              <span className="value">{contactMessage.email || "-"}</span>
            </div>

            <div className="info-item">
              <span className="label">Phone</span>
              <span className="value">{contactMessage.phone}</span>
            </div>

            <div className="info-item">
              <span className="label">Submitted</span>
              <span className="value">
                {new Date(contactMessage.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="status-section">
          <span className="section-title">Status</span>

          {contactMessage.isRead ? (
            <span className="status-badge read">Read</span>
          ) : (
            <span className="status-badge unread">Unread</span>
          )}
        </div>

        {/* Message */}
        <div className="message-section">
          <div className="section-title">Customer Message</div>

          <div className="message-box">{contactMessage.message}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminContactMessageDetail;
