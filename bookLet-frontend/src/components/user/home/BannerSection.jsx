import React from "react";
import images from "../../../assets/assets";

const BannerSection = () => {
  return (
    <div className="bg-web-primary">
      <div className="flex flex-row justify-center items-center">
        <img src={images.banner} alt="banner" className="w-[50%]" />

        <div className="w-[50%]  p-8 ">
          <h1 className="text-center font-bold text-4xl ">Why Shop with Us?</h1>
          <p className="text-center text-xl mt-4 w-[80%] mx-auto">
            We are committed to providing our customers with the best possible
            shopping experience. Our team is dedicated to ensuring that you find
            the perfect book for your needs, and we are always here to help.
            Whether you have a question about a specific title or need
            assistance with your order, we are just a phone call or email away.
          </p>
        {/* //button */}
        <button className="bg-web-secondary text-web-primary font-semibold text-xl py-4 px-8 rounded-full mt-4 flex justify-center mx-auto" onClick={
            () => window.location.href = "/books"
        }>
            Shop Now
          </button>
        </div>

          

    </div>
    </div>
  );
};

export default BannerSection;
