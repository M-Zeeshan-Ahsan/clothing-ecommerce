import { useSelector } from "react-redux";

import type { RootState } from "../../store/store";

import "./AdminHeader.scss";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const userName = user?.name || "Admin";

  const avatarLetter = userName.charAt(0).toUpperCase();

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
          <div className="admin-header__avatar">{avatarLetter}</div>

          <div>
            <strong>{userName}</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
