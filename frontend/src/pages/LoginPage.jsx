import React from 'react';

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form className="space-y-4">
          <input className="w-full px-3 py-2 border rounded" type="text" placeholder="Username or Email" />
          <input className="w-full px-3 py-2 border rounded" type="password" placeholder="Password" />
          <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
