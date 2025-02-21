"use client";

import React, { useState, useEffect } from "react";
import { IUser } from "@/types/user";
import { fetchProfile, updateProfileDetails, fetchUserWallet } from "@/services/userApi";
import UserNavbar from "@/components/UserNavbar";
import { toast } from "react-toastify";
import UserProtectedRoute from "@/HOC/UserProtectedRoute";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ProfileSection Component
interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => (
  <div className="p-4 bg-white shadow-md rounded-lg mb-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

// InfoItem Component
interface InfoItemProps {
  label: string;
  value: string | undefined;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <p className="text-gray-700">
    <span className="font-semibold">{label}: </span>
    {value || "Not provided"}
  </p>
);

// Badge Component
interface BadgeProps {
  children: React.ReactNode;
  color?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, color = "bg-green-500" }) => (
  <span className={`${color} text-white text-xs px-2 py-1 rounded-full`}>
    {children}
  </span>
);

// EditableField Component
interface EditableFieldProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onChange,
}) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">
      {label}
    </label>
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>
);

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [hasWallet, setHasWallet] = useState(false);
  const [hasCanceledSession, setHasCanceledSession] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<IUser | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const router=useRouter();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const profile = await fetchProfile();
        setUser(profile);
        setEditedUser(profile);
        
        // Check wallet separately and handle possible 404
        try {
          const walletData = await fetchUserWallet();
          
          if (walletData?.data?.transactions?.length > 0) {
            setHasWallet(true);
            
            const hasCancellation = walletData.data.transactions.some(
              (txn: any) => 
                txn.type === 'refund' && 
                txn.description?.toLowerCase().includes('cancel')
            );
            
            setHasCanceledSession(hasCancellation);
          }
        } catch (walletErr) {
          // Silently handle wallet not found - no need to set an error state
          // Just means user doesn't have a wallet yet
          console.log("Wallet not found or error fetching wallet");
          setHasWallet(false);
          setHasCanceledSession(false);
        }
        
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to fetch profile");
        }
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!editedUser) return;

    setUpdateLoading(true);
    setUpdateError(null);

    try {
      await updateProfileDetails(editedUser);
      toast.success("profile updated successfully");
      const updatedProfile = await fetchProfile();
      setUser(updatedProfile);
      setIsEditing(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setUpdateError(err.message || "Failed to update profile");
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
    setUpdateError(null);
  };

  const handleInputChange = (field: keyof IUser, value: string) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        [field]: value,
      });
    }
  };

  const handleLanguageAdd = (language: string) => {
    if (editedUser && language.trim()) {
      const newLanguage = language.trim();
      if (editedUser.knownLanguages?.includes(newLanguage)) {
        toast.warning("Language already added");
        return;
      }

      setEditedUser({
        ...editedUser,
        knownLanguages: [...(editedUser.knownLanguages || []), newLanguage],
      });
    }
  };

  const handleLanguageRemove = (index: number) => {
    if (editedUser && editedUser.knownLanguages) {
      const newLanguages = [...editedUser.knownLanguages];
      newLanguages.splice(index, 1);
      setEditedUser({
        ...editedUser,
        knownLanguages: newLanguages,
      });
    }
  };


  const handleWallet=()=>{
    router.push(`/dashboard/profile/wallet`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (!user || !editedUser) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      <div className="container mx-auto px-4 py-2">
        <div className="max-w-3xl mx-auto bg-blue-100 rounded-lg shadow-lg">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-center mb-8">
              {isEditing ? "Edit Profile" : "User Profile"}
            </h1>

            {updateError && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {updateError}
              </div>
            )}

            {isEditing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateProfile();
                }}
              >
                <div className="space-y-6">
                  <EditableField
                    label="Full Name"
                    value={editedUser.fullName}
                    onChange={(value) => handleInputChange("fullName", value)}
                  />

                  <EditableField
                    label="Phone"
                    value={editedUser.phone}
                    onChange={(value) => handleInputChange("phone", value)}
                  />
                  <EditableField
                    label="Country"
                    value={editedUser.country}
                    onChange={(value) => handleInputChange("country", value)}
                  />
                  <EditableField
                    label="Native Language"
                    value={editedUser.nativeLanguage}
                    onChange={(value) =>
                      handleInputChange("nativeLanguage", value)
                    }
                  />
                  {/* Languages Section */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Known Languages
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editedUser.knownLanguages?.map((lang, index) => (
                        <span
                          key={`lang-${index}`}
                          className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center"
                        >
                          {lang.toString()}
                          <button
                            type="button"
                            onClick={() => handleLanguageRemove(index)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            x
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add language"
                        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleLanguageAdd(
                              (e.target as HTMLInputElement).value
                            );
                            (e.target as HTMLInputElement).value = "";
                          }
                        }}
                      />
                    </div>
                  </div>
                  <EditableField
                    label="Learning Language"
                    value={editedUser.learnLanguage}
                    onChange={(value) =>
                      handleInputChange("learnLanguage", value)
                    }
                  />
                  <EditableField
                    label="Learning Proficiency"
                    value={editedUser.learnProficiency}
                    onChange={(value) =>
                      handleInputChange("learnProficiency", value)
                    }
                  />
                  <EditableField
                    label="Topics to Talk About"
                    value={editedUser.talkAbout}
                    onChange={(value) => handleInputChange("talkAbout", value)}
                  />
                  <EditableField
                    label="Learning Goal"
                    value={editedUser.learningGoal}
                    onChange={(value) =>
                      handleInputChange("learningGoal", value)
                    }
                  />
                  <EditableField
                    label="Why Chat"
                    value={editedUser.whyChat}
                    onChange={(value) => handleInputChange("whyChat", value)}
                  />
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className={`px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200 ${
                        updateLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {updateLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <>
                <div className="flex flex-col items-center mb-8">
                  <div className="relative">
                    <Image
                      src={user.profilePhoto || "/default-profile.png"}
                      alt={user.fullName}
                      width={128}
                      height={128}
                      unoptimized
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    {user.isActive && (
                      <span className="absolute -bottom-2 right-0 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <h2 className="mt-4 text-2xl font-bold text-gray-800">
                    {user.fullName}
                  </h2>
                  {user.isVerified && (
                    <Badge color="bg-blue-300">Verified Account</Badge>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <ProfileSection title="Contact Information">
                    <InfoItem label="Email" value={user.email} />
                    <InfoItem label="Phone" value={user.phone} />
                    <InfoItem label="Country" value={user.country} />
                  </ProfileSection>

                  <ProfileSection title="Language Details">
                    <InfoItem
                      label="Native Language"
                      value={user.nativeLanguage}
                    />
                    {user.knownLanguages && user.knownLanguages.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {user.knownLanguages.map((lang, index) => (
                          <Badge key={`lang-${index}`}>{lang}</Badge>
                        ))}
                      </div>
                    )}
                  </ProfileSection>

                  <ProfileSection title="Learning Goals">
                    <InfoItem label="Learning" value={user.learnLanguage} />
                    <InfoItem
                      label="Proficiency"
                      value={user.learnProficiency}
                    />
                    <InfoItem label="Topics" value={user.talkAbout} />
                  </ProfileSection>

                  <ProfileSection title="Additional Information">
                    <div className="text-gray-600">
                      <p className="mb-2">
                        <span className="font-medium">Learning Goal:</span>{" "}
                        {user.learningGoal}
                      </p>
                      <p>
                        <span className="font-medium">Why Chat:</span>{" "}
                        {user.whyChat}
                      </p>
                    </div>
                  </ProfileSection>
                </div>

                {/* Only render Wallet section if user has wallet */}
                {hasWallet && (
                  <ProfileSection title="Wallet">
                    {hasCanceledSession ? (
                      <p className="text-gray-700">
                        A tutor canceled your session. The amount has been refunded
                        to your wallet.
                      </p>
                    ) : (
                      <p className="text-gray-700">
                        View your wallet balance and transaction history.
                      </p>
                    )}
                    <button 
                      onClick={handleWallet}
                      className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      View Wallet
                    </button>
                  </ProfileSection>
                )}

                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-8 px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200 shadow-md"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProtectedRoute(ProfilePage);