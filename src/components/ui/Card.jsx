import React from 'react';

const Card = ({ name, specialty, rating, availability, location, photo, onBook, loadingPriority }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <img
        className="w-full aspect-[3/2] object-cover"
        src={photo}
        alt={`Photo of ${name}`}
        loading={loadingPriority ? "eager" : "lazy"}
        fetchpriority={loadingPriority ? "high" : "auto"}
        width={300}
        height={200}
        decoding="async"
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{name}</div>
        <p className="text-gray-700 text-base">Specialty: {specialty}</p>
        <p className="text-gray-700 text-base">Rating: {rating} / 5</p>
        <p className="text-gray-700 text-base">Availability: {availability}</p>
        <p className="text-gray-700 text-base">Location: {location}</p>
      </div>
      <div className="px-6 py-4">
        <button
          onClick={onBook}
          variant="outline"
          className="w-full py-2 px-4 bg-blue-700 hover:bg-blue-900 text-white rounded focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default Card;
