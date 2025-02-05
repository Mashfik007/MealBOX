import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../../../Hooks/Context/User_context";
import useAxiosSecure from "../../../../Hooks/Axios secure/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Manage_User = () => {
  const { User, signout, isLoading } = useContext(UserContext);
  const [search, setSearch] = useState(""); // Controlled input for search
  const [datas, setDatas] = useState([]); // State to store filtered users
  const axiosSecure = useAxiosSecure();

  const { data = [], refetch } = useQuery({
    queryKey: ["admin-stat"],
    queryFn: async () => {
      if (!User?.email) return [];
      try {
        const response = await axiosSecure.get(
          `https://pro12-two.vercel.app/all_user?email=${User.email}`
        );
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        return [];
      }
    },
    enabled: !!User?.email, // Run query only if User is available.
  });

  // Update role to admin
  const updateRole = (id) => {
    axiosSecure
      .patch(`https://pro12-two.vercel.app/change_role/${id}`, { role: "admin" })
      .then((response) => {
        toast.success(response.data.message);
        refetch(); // Refresh data after update
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Error updating role");
      });
  };

  // Fetch filtered users based on search term
  useEffect(() => {
    if (search.trim()) {
      // If there's a search term, fetch filtered results
      axiosSecure
        .get(
          `https://pro12-two.vercel.app/all_user_search?search=${search}&email=${User.email}`
        )
        .then((response) => {
          const users = Array.isArray(response.data) ? response.data : [];
          setDatas(users);
        })
        .catch((error) => {
        });
    } else {
      // Reset to the full list of users if search is cleared
      setDatas(data); 
    }
  }, [search, data, User?.email, axiosSecure]);

  return (
    <div>
      <Toaster />
      <section className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

        {/* Search Input */}
        <input
          type="text"
          value={search} // Ensure input value is controlled
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username or email"
          className="p-3 border-2 border-gray-300 rounded-lg w-full mb-4"
        />

        {/* Users Table */}
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Subscription</th>
              <th className="p-3">Role</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {datas.length > 0 ? (
              datas.map((user) => {
                return (
                  <tr key={user._id}>
                    <td className="p-3">{user.fullName}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.badge}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">
                      <button
                        onClick={() => updateRole(user._id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                      >
                        Make Admin
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-3">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Manage_User;
