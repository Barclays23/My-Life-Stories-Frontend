import React from 'react';
import './Hero2.css';

const Hero = () => {
  return (
    <div className="hero relative h-[16rem] sm:h-[24rem] md:h-[32rem] lg:h-[40rem] xl:h-[48rem] overflow-hidden">
      <img
        src="/assets/images/Hero-Image-Roomies.jpg"
        alt="Hero"
        className="hero-image w-full h-full object-cover"
      />
      <div className="gradient-shade absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

      <div className="hero-content mt-[15%] relative z-10 px-0">
        <h1 className="hero-title text-xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold">
          Fr<span className='text-orange-500'>o</span>m
          G<span className='text-orange-500'>o</span>ld
          t<span className='text-orange-500'>o</span> <span className='text-orange-500'></span>
          C<span className='text-orange-500'>o</span>de
          {/* From Gold to Code */}
        </h1>
        <p className="mt-2 text-sm sm:text-lg md:text-xl lg:text-3xl font-medium">
          My Journey into the IT World
        </p>
      </div>
    </div>
  );
};

export default Hero;
