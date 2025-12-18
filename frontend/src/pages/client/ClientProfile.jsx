import React from "react";

export default function ClientProfile() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="bg-white shadow rounded-lg p-6 max-w-xl">

        <p className="mb-4 text-gray-700">Name: Clevo Lih</p>
        <p className="mb-4 text-gray-700">Email: clevolih@gmail.com</p>
        <p className="mb-4 text-gray-700">Phone: +123 456 789</p>

        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
