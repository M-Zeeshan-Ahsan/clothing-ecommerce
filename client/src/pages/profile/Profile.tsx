import { useNavigate } from "react-router-dom";

import { useGetProfileQuery } from "../../store/api/authApi";
import { getApiErrorMessage } from "../../utils/apiError";

import "./Profile.scss";

const Profile = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useGetProfileQuery();

  if (isLoading) {
    return (
      <main className="profile-page">
        <div className="profile-page__container">
          <div className="profile-page__loading">Loading profile...</div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="profile-page">
        <div className="profile-page__container">
          <div className="profile-page__error">
            <h2>Unable to load profile</h2>

            <p>{getApiErrorMessage(error)}</p>

            <button onClick={() => navigate("/login")}>Go to Login</button>
          </div>
        </div>
      </main>
    );
  }

  const profile = data?.data;

  if (!profile) {
    return null;
  }

  return (
    <main className="profile-page">
      <div className="profile-page__container">
        {/* Header */}
        <div className="profile-page__header">
          <span className="profile-page__eyebrow">MY ACCOUNT</span>

          <h1>My Profile</h1>

          <p>Manage your account information and view your profile details.</p>
        </div>

        {/* Profile Card */}
        <section className="profile-page__card">
          <div className="profile-page__avatar">
            {profile.name.charAt(0).toUpperCase()}
          </div>

          <div className="profile-page__details">
            <div className="profile-page__item">
              <span>Name</span>
              <strong>{profile.name}</strong>
            </div>

            <div className="profile-page__item">
              <span>Email Address</span>
              <strong>{profile.email}</strong>
            </div>

            <div className="profile-page__item">
              <span>Member Since</span>
              <strong>
                {new Date(profile.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </strong>
            </div>
          </div>
        </section>

        {/* Account Actions */}
        <section className="profile-page__actions">
          <button onClick={() => navigate("/orders")}>My Orders</button>

          {/* <button onClick={() => navigate("/wishlist")}>My Wishlist</button> */}

          <button onClick={() => navigate("/")}>Continue Shopping</button>
        </section>
      </div>
    </main>
  );
};

export default Profile;
