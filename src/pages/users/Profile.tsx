"use client";

import React, { useState } from "react";

// Dummy data for profile
const dummyProfile = {
  username: "JohnDoe",
  email: "johndoe@example.com",
  bio: "Game enthusiast. Passionate about life simulation games.",
  profileImage: "/images/profile.jpg", // Example image path
  coverImage: "/images/cover.jpg", // Example image path
  followers: 230,
  following: 180,
  posts: 45,
};

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(dummyProfile);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Here, you would typically send a request to the server to update the profile data
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "cover") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "profile") {
          setProfileData({ ...profileData, profileImage: reader.result as string });
        } else {
          setProfileData({ ...profileData, coverImage: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Profile Header */}
        <div className="relative">
          <div className="w-full h-64 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${profileData.coverImage})` }}>
            {/* Cover Image */}
            {isEditing && (
              <div className="absolute top-0 right-0 p-4">
                <label htmlFor="cover-image" className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer">
                  Change Cover Image
                </label>
                <input
                  type="file"
                  id="cover-image"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "cover")}
                />
              </div>
            )}
          </div>

          <div className="absolute bottom-[-40px] left-4">
            <div className="relative">
              <img
                src={profileData.profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white"
              />
              {isEditing && (
                <div className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer">
                  <label htmlFor="profile-image" className="text-white">+</label>
                </div>
              )}
              <input
                type="file"
                id="profile-image"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e, "profile")}
              />
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-24">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">{profileData.username}</h2>
            <p className="text-gray-700 dark:text-gray-300">{profileData.bio}</p>
            <div className="mt-4 flex justify-center space-x-6">
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">{profileData.posts}</span> Posts
              </div>
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">{profileData.followers}</span> Followers
              </div>
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">{profileData.following}</span> Following
              </div>
            </div>
          </div>

          {/* Edit Button */}
          {isEditing ? (
            <div className="mt-8 text-center">
              <form onSubmit={handleProfileUpdate}>
                <div className="mb-4">
                  <label htmlFor="bio" className="block text-gray-700 dark:text-gray-200">Bio</label>
                  <textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full mt-2 p-4 bg-gray-200 dark:bg-gray-700 rounded-md"
                    rows={4}
                  />
                </div>

                <div className="mb-4">
                  <button type="submit" className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="mt-8 text-center">
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
