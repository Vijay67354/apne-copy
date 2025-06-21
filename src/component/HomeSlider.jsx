
import React from "react";

function HomeSlider() {
  const images = [
    { src: "/images/bigbasket.png", alt: "Big Basket" },
    { src: "/images/telepormance.png", alt: "Teleperformance" },
      { src: "/images/zomato-veg.png", alt: "Zomato Veg" },
    // { src: "/images/techmahindra.png", alt: "Tech Mahindra" },
    { src: "/images/birla.png", alt: "Aditya Birla Capital" },
    { src: "/images/zomato-veg.png", alt: "Zomato Veg" },
  ];

  return (
  <div className="w-full ">
      <div className="marquee-wrapper bg-transparent w-full py-4">
        <div className="marquee">
          {[...images, ...images].map((img, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center px-8 flex-shrink-0"
            >
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-32 h-12 object-contain filter transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .marquee {
          display: flex;
          width: fit-content;
          animation: scroll-left 7s linear infinite;
        }
        
        .marquee-wrapper {
          overflow: hidden;
          white-space: nowrap;
        }
        
        .marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

export default HomeSlider;