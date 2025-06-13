// import React from "react";
// import Slider from "react-slick";

// function HomeSlider() {
//   var settings = {
//     dots: true,
//     infinite: false,
//     speed: 500,
//     slidesToShow: 4,
//     slidesToScroll: 4,
//     initialSlide: 0,
//     autoplaySpeed: 2000,
//     autoplay: true,
//     Slider: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 3,
//           infinite: true,
//           dots: true
//         }
//       },
//       {
//         breakpoint: 600,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 2,
//           initialSlide: 2
//         }
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1
//         }
//       }
//     ]
//   };
//   return (
//     <div className="slider-container mt-12">
//       <Slider {...settings}>
//         <div>
//           <img src="https://cdn.apna.co/apna-learn/Support%20Icons/FD%20logo.png"/>
//         </div>
//         <div>
//         <img src="https://tse2.mm.bing.net/th?id=OIP.p8g02dm7amDVp6mam-HOvAHaHa&pid=Api&P=0&h=180"/>
//         </div>
//         <div>
//          <img src="https://tse1.mm.bing.net/th?id=OIP.Lqv0xCU4P2w3-vgvpBgBfgHaEK&pid=Api&P=0&h=180"/>
//         </div>
//         <div>
//        <img src="https://tse3.mm.bing.net/th?id=OIP.qvG1BA7VsojEUUmrjkOplQHaHa&pid=Api&P=0&h=180"/>
//         </div>
//         <div>
//         <img src="https://tse1.mm.bing.net/th?id=OIP.t_RhPeQId8Y6UdUTeSD0tQHaCF&pid=Api&P=0&h=180"/>
//         </div>
//         <div>
//           <img src="https://tse3.mm.bing.net/th?id=OIP.6A880rmiHZvbOShXt0wkRAAAAA&pid=Api&P=0&h=180"/>
//         </div>
//         <div>
//           <h3>7</h3>
//         </div>
//         <div>
//           <h3>8</h3>
//         </div>
//       </Slider>
//     </div>
//   );
// }

// export default HomeSlider;



// import React from "react";

// function HomeSlider() {
//   const images = [
//     { src: "/images/bigbasket.png", alt: "Big Basket" },
//     { src: "/images/telepormance.png", alt: "Teleperformance" },
//     { src: "/images/zomato.png", alt: "Zomato" },
//     { src: "/images/techmahindra.png", alt: "Tech Mahindra" },
//     { src: "/images/birla.png", alt: "Aditya Birla Capital" },
//     { src: "/images/zomato-veg.png", alt: "Zomato Veg" },
//   ];

//   return (
//     <div className="marquee-wrapper w-full py-4 bg-white">
//       <div className="marquee">
//         {[...images, ...images].map((img, index) => (
//           <div
//             key={index}
//             className="flex items-center justify-center px-6"
//           >
//             <img
//               src={img.src}
//               alt={img.alt}
//               className="w-32 h-12 object-contain"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default HomeSlider;


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