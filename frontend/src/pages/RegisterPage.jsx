import React from 'react';

function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form className="space-y-4">
          <input className="w-full px-3 py-2 border rounded" type="text" placeholder="Username" />
          <input className="w-full px-3 py-2 border rounded" type="email" placeholder="Email" />
          <input className="w-full px-3 py-2 border rounded" type="password" placeholder="Password" />
          <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
