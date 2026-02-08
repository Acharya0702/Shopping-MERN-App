import React from "react";
import featured from "../../assets/featured.webp";
import { Link } from "react-router-dom";

const FeaturedCollection = () => {
  return (
    <section className="p-16">
      <div className="container mx-auto flex  lg:flex-row flex-col-reverse items-center bg-green-50 rounded-3xl">
        {/* Left Content */}
        <div className="lg:w-1/2  p-8 text-center lg:text-left">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Comfort and Style
          </h2>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Apparel made for your everyday life
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Discover High quality, comfortable clothing that effortlessly blends
            fashion and function. Designed to make you look and feel great
            everyday.
          </p>
          <Link
            to="/collections/all"
            className="bg-black text-white p-3 rounded-lg text-lg hover:bg-gray-800"
          >
            Shop Now
          </Link>
        </div>
        {/* Right Content */}
        <div className="lg:w-1/2 ">
          <img
            src={featured}
            alt="feature collection"
            className="w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
