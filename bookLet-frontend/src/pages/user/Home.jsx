import React from "react";
import HeroSection from "../../components/user/home/HeroSection";
import BookSection from "../../components/user/home/BookSection";
import GenreSection from "../../components/user/home/GenreSection";
import DealSection from "../../components/user/home/DealSection";
import BannerSection from "../../components/user/home/BannerSection";
import ContactSection from "../../components/user/home/ContactSection";
import BestSelling from "../../components/user/home/BestSelling";

const Home = () => {
  return (
      <>
    <div className="bg-web-background">
    
    <div className="px-24">
    <HeroSection/>
      <GenreSection/>
      <BookSection/>
    <BestSelling/>
      <DealSection/>
    </div>
      <BannerSection/>
      <ContactSection/>
    </div>
      </>
  );
};

export default Home;