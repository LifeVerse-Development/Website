"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../stores/store";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { login } from "../../stores/authSlice";
import axios from 'axios';

interface User {
  identifier: string;
  socketId: string;
  accessToken: string;
  refreshToken: string;
  userId: string;
  titlePicture?: string;
  profilePicture?: string;
  email?: string;
  username: string;
  role: string;
  bio?: string;
  follower?: string[];
  following?: string[];
  posts?: any[];
  createdAt: Date;
  updatedAt: Date;
}

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      axios
        .get(`http://localhost:3001/api/users/${user.userId}`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${user.accessToken}`,
          },
        })
        .then((response) => {
          const fetchedProfileData: User = {
            ...response.data,
            posts: response.data.posts || [],
            follower: response.data.follower?.map((follower: { userId: string }) => follower.userId) || [],
            following: response.data.following?.map((following: { userId: string }) => following.userId) || [],
          };
          setProfileData(fetchedProfileData);
          setIsFollowing(fetchedProfileData.follower?.includes(user.userId) || false);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data: ", error);
          setLoading(false);
        });
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-xl">
          Please log in to view your profile.
        </div>
        <Footer />
      </div>
    );
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login(profileData!));
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "cover") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => (prev ? {
          ...prev,
          [type === "profile" ? "profilePicture" : "titlePicture"]: reader.result as string,
        } : prev));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await axios.post(`http://localhost:3001/api/users/${user?.userId}/unfollow`, {}, { headers: {
          Authorization: `Bearer ${user?.accessToken}`,
          'Access-Control-Allow-Origin': '*',
          'X-CSRF-TOKEN': 'X-CSRF-TOKEN'
        } });
        setIsFollowing(false);
      } else {
        await axios.post(`http://localhost:3001/api/users/${user?.userId}/follow`, {}, { headers: {
          Authorization: `Bearer ${user?.accessToken}`,
          'Access-Control-Allow-Origin': '*',
          'X-CSRF-TOKEN': 'X-CSRF-TOKEN'
        } });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-xl">
          Loading profile...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="max-w-7xl mx-auto p-6">
          <div className="relative">
            <div className="w-full h-64 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${profileData?.titlePicture || "/images/cover.jpg"})` }}>
              {isEditing && (
                <div className="absolute top-0 right-0 p-4">
                  <label htmlFor="cover-image" className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer">
                    Change cover
                  </label>
                  <input type="file" id="cover-image" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, "cover")} />
                </div>
              )}
            </div>

            <div className="absolute bottom-[-40px] left-4">
              <div className="relative">
                <img
                  src={profileData?.profilePicture || "/images/profile.jpg"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white"
                />
                {isEditing && (
                  <div className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer">
                    <label htmlFor="profile-image" className="text-white">+</label>
                  </div>
                )}
                <input type="file" id="profile-image" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, "profile")} />
              </div>
            </div>
          </div>
          <div className="mt-24 text-center">
            <h2 className="text-3xl font-semibold">{profileData?.username}</h2>
            <p className="text-gray-700 dark:text-gray-300">{profileData?.email}</p>
            <div className="mt-4 flex justify-center space-x-6">
              <div>
                <span className="font-semibold">{profileData?.posts?.length || 0}</span> Posts
              </div>
              <div>
                <span className="font-semibold">{profileData?.follower?.length || 0}</span> Followers
              </div>
              <div>
                <span className="font-semibold">{profileData?.following?.length || 0}</span> Following
              </div>
            </div>

            {isEditing ? (
              <form className="mt-8" onSubmit={handleProfileUpdate}>
                <label className="block">Bio</label>
                <textarea
                  value={profileData?.bio || ""}
                  onChange={(e) => setProfileData((prev) => prev ? { ...prev, bio: e.target.value } : prev)}
                  className="w-full mt-2 p-4 bg-gray-200 dark:bg-gray-700 rounded-md"
                  rows={4}
                />
                <button type="submit" className="mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition">Save</button>
              </form>
            ) : (
              <button onClick={() => setIsEditing(true)} className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                Edit profile
              </button>
            )}

            <button
              onClick={handleFollowToggle}
              className={`mt-8 px-6 py-3 ${isFollowing ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold rounded-md transition`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
