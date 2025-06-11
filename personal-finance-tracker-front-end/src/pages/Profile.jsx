import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import { getCurrentUser } from "../services/auth.service";
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const Profile = () => {
  const { account } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getCurrentUser();

        // Check if we have data directly or in a data property
        if (response && (response.data || response.isSuccess)) {
          setProfileData(response.data || response);
        } else {
          setError("Failed to fetch profile data");
        }
      } catch (err) {
        setError("Error fetching profile data");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    // If we already have account data, use it instead of fetching
    if (account) {
      setProfileData(account);
      setLoading(false);
    } else {
      fetchProfile();
    }
  }, [account]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "Not provided";
    const phone = phoneNumber.toString();
    // Check if the phone number has enough digits for formatting
    if (phone.length >= 10) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    }
    return phone;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-red-600 text-lg">{error}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Profile
          </h1>
          <p className="text-gray-600">
            Manage your account information and preferences.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="flex-shrink-0">
                <UserCircleIcon className="h-24 w-24 text-gray-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profileData?.firstName} {profileData?.lastName}
                </h2>
                <p className="text-gray-600">{profileData?.email}</p>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      profileData?.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {profileData?.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {profileData?.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Personal Information
                  </h3>
                  <dl className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <UserCircleIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Full Name
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {profileData?.firstName} {profileData?.lastName}
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Email Address
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {profileData?.email}
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Phone Number
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {formatPhoneNumber(profileData?.phoneNumber)}
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Date of Birth
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {profileData?.dob
                            ? formatDate(profileData.dob)
                            : "Not provided"}
                        </dd>
                      </div>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Account Details
                  </h3>
                  <dl className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Account Status
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {profileData?.isActive ? "Active" : "Inactive"}
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <UserCircleIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Role
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {profileData?.role}
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Member Since
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {profileData?.createdAt
                            ? formatDate(profileData.createdAt)
                            : "Unknown"}
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Last Updated
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {profileData?.updatedAt
                            ? formatDate(profileData.updatedAt)
                            : "Unknown"}
                        </dd>
                      </div>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Edit Profile
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
