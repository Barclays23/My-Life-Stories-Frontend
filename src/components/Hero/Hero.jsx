import React from 'react';
import { Link } from 'react-router-dom';

const Hero = ({ hero }) => {
  return (
    <div
      className="relative bg-gray-100 dark:bg-gray-700 h-96 flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${hero.imageUrl || 'https://via.placeholder.com/1200x400'})` }} >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative z-10 text-center text-white">
        <h1 className="text-5xl font-bold mb-4">{hero.title}</h1>
        <p className="text-xl mb-6">{hero.subtitle}</p>
        {hero.buttonText && hero.buttonLink && (
          <Link to={hero.buttonLink} className="btn bg-primary-color text-white px-6 py-3 rounded">
            {hero.buttonText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default Hero;