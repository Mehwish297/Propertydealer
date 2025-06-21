'use client';

import { useState, useEffect } from 'react';
import { FaAsymmetrik } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type Plot = {
  id: number;
  title: string;
  location: string;
  price: string;
  image: string;
};

export default function Home() {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState<null | number>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const response = await axios.get('https://jamila.pythonanywhere.com/get-plots/');
        setPlots(response.data);
      } catch (error) {
        console.error('Failed to fetch plots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlots();
  }, []);

  const handleBookingClick = () => {
    router.push('/book');
  };

  const filteredPlots = plots.filter(
    (plot) =>
      plot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plot.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen overflow-x-hidden relative">
      {/* Background Image + Overlay */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        <div className="w-full h-full bg-white/70"></div>
      </div>

      {/* Header */}
      <header className="w-full flex flex-wrap items-center justify-between px-4 py-2 bg-blue-100 shadow-sm z-10 relative">
        <div className="flex items-center gap-1">
          <FaAsymmetrik className="text-4xl text-green-600" />
          <span className="text-lg md:text-xl font-semibold text-green-700">SAAN-PLOTS</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          <button className="relative group text-green-700 text-sm font-medium px-4 py-2 bg-transparent hover:text-green-900 transition rounded-md">
            Contact Us
          </button>

          <button
            onClick={() => setShowLoginModal(true)}
            className="relative group text-green-700 text-sm font-medium px-4 py-2 bg-transparent hover:text-green-900 transition rounded-md"
          >
            Login / Signup
          </button>

          <button
            onClick={handleBookingClick}
            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
          >
            Book a Plot
          </button>
        </div>
      </header>

      {/* Welcome + Search */}
      <div className="pt-28 text-center relative z-10">
        <h2 className="text-2xl text-green-800 font-semibold">Welcome to Asaan-Plots</h2>
        <p className="text-gray-700 text-sm mt-2">Explore and reserve plots with ease.</p>
      </div>

      <section className="mt-10 mx-auto bg-white/30 backdrop-blur-md p-6 rounded-xl shadow-lg w-[90%] max-w-xl z-10 relative">
        <h2 className="text-xl font-semibold text-green-800 mb-4 text-center">Find Your Perfect Plot</h2>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search with city name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition w-full sm:w-auto">
            Search
          </button>
        </div>
      </section>

      {/* Plots */}
      <section className="pt-16 pb-12 px-4 relative z-10">
        <h2 className="text-2xl text-center text-green-800 font-bold mb-8">Available Plots</h2>

        {filteredPlots.length === 0 && (
          <p className="text-center text-red-600 mb-4">No plots found for "{searchQuery}"</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlots.map((plot, i) => {
            const isEvenRow = Math.floor(i / 3) % 2 === 0;
            const direction = isEvenRow ? -100 : 100;

            return (
              <motion.div
                key={plot.id}
                initial={{ x: direction, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                viewport={{ once: false, amount: 0.6 }}
                className="bg-white/80 backdrop-blur-md rounded-xl overflow-hidden shadow-md"
              >
                <img src={plot.image} alt={plot.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-green-700">{plot.title}</h3>
                  <p className="text-sm text-gray-600">{plot.location}</p>
                  <p className="text-sm font-semibold text-green-600 mt-2">{plot.price}</p>
                  <button
                    onClick={() => setSelectedPlot(i)}
                    className="mt-4 w-full bg-green-600 text-white py-1 rounded hover:bg-green-700 transition"
                  >
                    Book Now
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Booking Modal */}
      {selectedPlot !== null && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setSelectedPlot(null)}
            >
              ×
            </button>
            <img
              src={plots[selectedPlot].image}
              alt={plots[selectedPlot].title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold text-green-700">{plots[selectedPlot].title}</h2>
            <p className="text-sm text-gray-600">{plots[selectedPlot].location}</p>
            <p className="text-lg font-semibold text-green-600 mt-3">{plots[selectedPlot].price}</p>
            <button
              onClick={() => router.push('/book')}
              className="bg-green-600 text-white px-6 py-2 mt-4 rounded-md hover:bg-green-700 transition w-full"
            >
              Proceed to Booking
            </button>
          </div>
        </div>
      )}

      {/* Login/Signup Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
              onClick={() => setShowLoginModal(false)}
            >
              ×
            </button>

            <h2 className="text-xl font-bold text-center text-green-700 mb-4">
              Login or Signup
            </h2>

            <div className="flex flex-col gap-4">
              <button
                className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-900 transition"
                onClick={() => {
                  setShowLoginModal(false);
                  router.push('/admin');
                }}
              >
                Login as Admin
              </button>
              <button
                className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-900 transition"
                onClick={() => {
                  setShowLoginModal(false);
                  router.push('/customer-login');
                }}
              >
                Customer login not added yet
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
