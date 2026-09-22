import "./AdminHeader.scss";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
  return (
    <header className="admin-header">
      <button
        type="button"
        className="admin-header__menu"
        onClick={onMenuClick}
      >
        ☰
      </button>

      <div className="admin-header__title">Admin Panel</div>

      <div className="admin-header__right">
        <span className="admin-header__notification">♢</span>

        <div className="admin-header__user">
          <div className="admin-header__avatar">A</div>

          <div>
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
