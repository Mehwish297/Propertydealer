'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Plot {
  plot_number: string;
  title: string;
  location: string;
  price: string;
  image: string;
}

interface Booking {
  id: number;
  name: string;
  email: string;
  plot_number: string;
  phone: string;
  cnic: string; 
}

export default function AdminDashboard() {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [newPlot, setNewPlot] = useState({
    plot_number: '',
    title: '',
    location: '',
    price: '',
    image: null as File | null,
  });

  const [removeId, setRemoveId] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/get-plots/');
        setPlots(res.data);
      } catch (err) {
        console.error('Failed to fetch plots', err);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/get-bookings/');
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      }
    };

    fetchPlots();
    fetchBookings();
  }, []);

  const handleAddPlot = async () => {
    if (
      newPlot.plot_number.trim() &&
      newPlot.title.trim() &&
      newPlot.location.trim() &&
      newPlot.price.trim() &&
      newPlot.image
    ) {
      const formData = new FormData();
      formData.append('plot_number', newPlot.plot_number);
      formData.append('title', newPlot.title);
      formData.append('location', newPlot.location);
      formData.append('price', newPlot.price);
      formData.append('image', newPlot.image);

      try {
        const res = await axios.post('http://127.0.0.1:8000/add-plot/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        alert('Plot added successfully!');
        setNewPlot({ plot_number: '', title: '', location: '', price: '', image: null });
        setImagePreview('');
        setPlots([...plots, res.data]);
      } catch (err) {
        console.error(err);
        alert('Failed to add plot');
      }
    } else {
      alert('Please fill all fields');
    }
  };

  const handleRemovePlot = async () => {
    if (removeId.trim() === '') return alert('Enter Plot Number');

    try {
      await axios.post('http://127.0.0.1:8000/remove-plot/', { plot_number: removeId });
      setPlots(plots.filter((plot) => plot.plot_number !== removeId));
      setRemoveId('');
      alert('Plot removed');
    } catch (err) {
      console.error(err);
      alert('Failed to remove plot');
    }
  };

  const handleRemoveBooking = async (bookingId: number) => {
    try {
      await axios.post('http://127.0.0.1:8000/remove-booking/', { id: bookingId });
      setBookings(bookings.filter((b) => b.id !== bookingId));
      alert('Booking removed successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to remove booking');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPlot({ ...newPlot, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="w-full max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6 text-center">Admin Dashboard</h1>

        <div className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-green-700 mb-4">Add New Plot</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Plot Number"
              value={newPlot.plot_number}
              onChange={(e) => setNewPlot({ ...newPlot, plot_number: e.target.value })}
              className="px-4 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="Title"
              value={newPlot.title}
              onChange={(e) => setNewPlot({ ...newPlot, title: e.target.value })}
              className="px-4 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="Location"
              value={newPlot.location}
              onChange={(e) => setNewPlot({ ...newPlot, location: e.target.value })}
              className="px-4 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="Price"
              value={newPlot.price}
              onChange={(e) => setNewPlot({ ...newPlot, price: e.target.value })}
              className="px-4 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <label className="block col-span-1 md:col-span-2">
              <span className="block mb-1 text-sm text-green-800 font-medium">Upload Plot Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              />
            </label>
          </div>

          <button
            onClick={handleAddPlot}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            Add Plot
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-red-700 mb-4">Remove Plot</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Enter Plot Number"
              value={removeId}
              onChange={(e) => setRemoveId(e.target.value)}
              className="px-4 py-2 rounded-md border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <button
              onClick={handleRemovePlot}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Remove
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-green-700 mb-4">Available Plots</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {plots.map((plot) => (
              <div key={plot.plot_number} className="border p-4 rounded-xl bg-green-50 shadow-sm">
                <img src={plot.image} alt={plot.title} className="h-40 w-full object-cover rounded mb-2" />
                <h3 className="text-base font-bold text-green-800">{plot.title}</h3>
                <p className="text-sm text-gray-600">{plot.location}</p>
                <p className="text-green-700 font-semibold">{plot.price}</p>
                <p className="text-xs text-gray-500">Plot #: {plot.plot_number}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-700 mb-4">User Bookings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="border p-4 rounded-xl bg-blue-50 shadow-sm">
                <h3 className="text-base font-bold text-blue-800">Plot #: {booking.plot_number}</h3>
                <p className="text-sm text-gray-700">Customer: {booking.name}</p>
                <p className="text-sm text-gray-600">Email: {booking.email}</p>
                <p className="text-sm text-gray-600">Phone: {booking.phone}</p>
                <p className="text-sm text-gray-600">CNIC: {booking.cnic}</p>
                <button
                  onClick={() => handleRemoveBooking(booking.id)}
                  className="mt-2 bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Remove Booking
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
