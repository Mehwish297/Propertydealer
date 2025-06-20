'use client';
import React from 'react';

interface Plot {
  id: number;
  title: string;
  location: string;
  size: string;
  price: string;
  image: string;
  onBook: (plot: Plot) => void;
}

const PlotCard: React.FC<{ plot: Plot; onBook: (plot: Plot) => void }> = ({ plot, onBook }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl overflow-hidden shadow-md transition-transform hover:scale-[1.02]">
      <img src={plot.image} alt={plot.title} className="w-full h-40 sm:h-48 md:h-56 object-cover" />
      <div className="p-4 sm:p-5 md:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-green-700">{plot.title}</h3>
        <p className="text-sm sm:text-base text-gray-600 mt-1">{plot.location}, {plot.size}</p>
        <p className="text-sm sm:text-base font-semibold text-green-600 mt-2">{plot.price}</p>
        <button
          className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          onClick={() => onBook(plot)}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default PlotCard;
