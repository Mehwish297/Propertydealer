'use client';
import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  phone: string;
  cnic: string;
  plotNumber: string;
}

const plotDetails: Record<string, { size: string; price: string }> = {
  '101': { size: '5 Marla', price: '50 Lac' },
  '102': { size: '10 Marla', price: '90 Lac' },
  '103': { size: '1 Kanal', price: '1.5 Crore' },
};

export default function BookPlotPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    cnic: '',
    plotNumber: '',
  });

  const [step, setStep] = useState<'form' | 'review' | 'final'>('form');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const isValidPhone = (phone: string) => /^\d{10,13}$/.test(phone);
  const isValidCNIC = (cnic: string) => /^\d{5}-\d{7}-\d{1}$/.test(cnic);

  const handleConfirm = () => {
    if (
      !formData.name.trim() ||
      !isValidEmail(formData.email) ||
      !isValidPhone(formData.phone) ||
      !isValidCNIC(formData.cnic) ||
      !plotDetails[formData.plotNumber]
    ) {
      alert('Please fill all fields correctly!');
      return;
    }
    setStep('review');
  };

  const handleFinalConfirm = async () => {
    try {
      await axios.post('https://jamila.pythonanywhere.com/book-plot/', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        cnic: formData.cnic,
        plot_number: formData.plotNumber
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setStep('final');
    } catch (err: any) {
      console.error("Backend error:", err.response?.data);
      alert('Booking failed: ' + JSON.stringify(err.response?.data?.error || err.message));
    }
  };

  const selectedPlot = plotDetails[formData.plotNumber];

  return (
    <main className="min-h-screen flex justify-center items-start sm:items-center bg-green-50 py-10 px-4 sm:px-0">
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg perspective min-h-[450px]">
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div
              key="form"
              className="absolute w-full p-6 sm:p-8 bg-white rounded-xl shadow-xl backface-hidden"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-lg sm:text-xl font-bold text-green-700 mb-4 text-center">Book Your Plot</h2>
              <div className="space-y-4 text-sm sm:text-base">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg"
                />
                <input
                  type="text"
                  name="cnic"
                  placeholder="CNIC (e.g. 35202-1234567-8)"
                  value={formData.cnic}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg"
                />
                <input
                  type="text"
                  name="plotNumber"
                  placeholder="Plot Number (e.g. 101)"
                  value={formData.plotNumber}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg"
                />

                {selectedPlot && (
                  <p className="text-sm text-green-700">
                    Size: <strong>{selectedPlot.size}</strong>, Price: <strong>{selectedPlot.price}</strong>
                  </p>
                )}

                <button
                  onClick={handleConfirm}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          )}

          {step === 'review' && (
            <motion.div
              key="review"
              className="absolute w-full p-6 sm:p-8 bg-white rounded-xl shadow-xl backface-hidden"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-lg sm:text-xl font-bold text-green-700 mb-4 text-center">Confirm Details</h2>
              <div className="text-sm sm:text-base text-gray-800 space-y-2">
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>CNIC:</strong> {formData.cnic}</p>
                <p><strong>Plot Number:</strong> {formData.plotNumber}</p>
                <p><strong>Size:</strong> {selectedPlot?.size}</p>
                <p><strong>Price:</strong> {selectedPlot?.price}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button
                  onClick={() => setStep('form')}
                  className="w-full sm:w-1/2 bg-gray-300 text-gray-800 py-2 rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={handleFinalConfirm}
                  className="w-full sm:w-1/2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          )}

          {step === 'final' && (
            <motion.div
              key="final"
              className="absolute w-full p-6 sm:p-8 bg-white rounded-xl shadow-xl backface-hidden text-center"
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-green-700">Plot Booked!</h2>
              <p className="mt-2 text-gray-600">Thank you, {formData.name}. Your plot has been successfully booked.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .perspective {
          perspective: 1200px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </main>
  );
}
