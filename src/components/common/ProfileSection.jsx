import { getProfileImage, getAvatarWithFallback } from "../../utils/helpers";

const ProfileSection = ({ profile }) => {
  if (!profile) return null;

  const avatarProps = getAvatarWithFallback(getProfileImage(profile));

  return (
    <div className="flex flex-col items-start space-y-0">
      <img
        {...avatarProps}
        alt="Profile"
        className="w-16 h-16 rounded-full object-cover mb-4"
      />
      <p className="text-lg">Selamat datang,</p>
      <h2 className="text-3xl font-semibold">
        {profile?.first_name} {profile?.last_name}
      </h2>
    </div>
  );
};

export default ProfileSection;
