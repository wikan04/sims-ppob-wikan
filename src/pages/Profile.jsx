import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getProfile,
  updateProfile,
  updateProfileImage,
  reset,
} from "../features/profile/profileSlice";
import { logout } from "../features/auth/authSlice";
import { getProfileImage, getAvatarWithFallback } from "../utils/helpers";
import Button from "../components/common/Button";
import LogoutModal from "../components/common/LogoutModal";
import Loading from "../components/common/Loading";
import { AtSign, User, Edit2 } from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.profile
  );

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name,
        last_name: profile.last_name,
      });
    }
  }, [profile]);

  useEffect(() => {
    if (isError) {
      alert(message);
    }

    if (isSuccess && isEditing) {
      alert("Profile berhasil diupdate");
      setIsEditing(false);
      dispatch(getProfile());
    }

    dispatch(reset());
  }, [isError, isSuccess, message, isEditing, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        alert("Format file harus JPEG atau PNG");
        return;
      }

      const maxSize = 100 * 1024;
      if (file.size > maxSize) {
        alert("Ukuran file maksimal 100KB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      try {
        await dispatch(updateProfileImage(file)).unwrap();
        alert("Foto profile berhasil diupdate");
        dispatch(getProfile());
        setPreviewImage(null);
      } catch (error) {
        alert("Gagal upload foto: " + error);
        setPreviewImage(null);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    dispatch(logout());
    setShowLogoutModal(false);
    navigate("/login");
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      first_name: profile.first_name,
      last_name: profile.last_name,
    });
  };

  if (isLoading && !profile) {
    return <Loading />;
  }

  const displayImage = previewImage || getProfileImage(profile);
  const avatarProps = getAvatarWithFallback(displayImage);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <img
            {...avatarProps}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
          />
          <button
            type="button"
            onClick={handleImageClick}
            className={`absolute bottom-0 right-0 bg-white p-2 rounded-full border-2 border-gray-200 ${
              isEditing
                ? "hover:bg-gray-50 cursor-pointer"
                : "cursor-not-allowed opacity-50"
            }`}
            disabled={!isEditing}
          >
            <Edit2 className="w-4 h-4 text-gray-600" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <h2 className="text-2xl font-bold mt-4">
          {profile?.first_name} {profile?.last_name}
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email (Read Only) */}
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={profile?.email || ""}
              disabled
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-500"
            />
          </div>
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Nama Depan
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 pl-10 border border-gray-300 rounded-md ${
                !isEditing ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
              }`}
            />
          </div>
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            Nama Belakang
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 pl-10 border border-gray-300 rounded-md ${
                !isEditing ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
              }`}
            />
          </div>
        </div>

        {/* Buttons */}
        {!isEditing ? (
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
            <Button type="button" variant="primary" onClick={handleLogoutClick}>
              Logout
            </Button>
          </div>
        ) : (
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Loading..." : "Simpan"}
          </Button>
        )}

        {/* Cancel Button saat Edit Mode */}
        {isEditing && (
          <Button type="button" variant="outline" onClick={handleCancel}>
            Batalkan
          </Button>
        )}
      </form>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        isLoading={false}
      />
    </div>
  );
};

export default Profile;
