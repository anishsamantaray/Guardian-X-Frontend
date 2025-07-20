'use client';

import { useState } from 'react';
import { signup } from '@/services/authService';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    whatsapp: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      router.push('/home');
    } catch {
      alert('Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-4">
      <h1 className="text-xl font-semibold mb-4">Create Account</h1>
      <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full p-2 border mb-2" />
      <input name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border mb-2" />
      <input name="phone" placeholder="Phone Number" onChange={handleChange} className="w-full p-2 border mb-2" />
      <input name="address" placeholder="Home Address" onChange={handleChange} className="w-full p-2 border mb-2" />
      <label className="flex items-center mb-4">
        <input type="checkbox" name="whatsapp" onChange={handleChange} className="mr-2" />
        Get WhatsApp alerts
      </label>
      <button className="w-full bg-green-600 text-white p-2 rounded">
        Sign Up & Continue
      </button>
    </form>
  );
}
