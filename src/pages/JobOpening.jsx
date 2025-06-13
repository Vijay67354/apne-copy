
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Static JSON data for jobs
const allJobs = [
  {
    _id: "1",
    title: "Customer Service Representative",
    company: "Bajaj Allianz Life Insurance",
    location: "Mumbai",
    salary: "4 Lakhs",
    type: "Work from office",
    workType: "Full-Time",
    experience: "1-3 years",
    postedAt: "2025-06-01",
    skills: ["Communication", "Customer Support"],
    level: "Mid",
    role: "Customer Service",
    description: "Handle customer inquiries and provide support for insurance policies.",
    responsibilities: "Resolve customer issues, process claims, and provide policy information.",
    openings: 5,
    applicants: 20,
    requirements: ["Bachelor's degree", "Good communication skills"],
    urgent: false,
    img: "https://cdn.apna.co/apna-learn/Support%20Icons/FD%20logo.png",
  },
  {
    _id: "2",
    title: "Sales Executive",
    company: "Paytm Service Pvt. Ltd.",
    location: "Delhi",
    salary: "6 Lakhs",
    type: "Work from office",
    workType: "Full-Time",
    experience: "2-5 years",
    postedAt: "2025-06-02",
    skills: ["Sales", "Negotiation"],
    level: "Mid",
    role: "Sales",
    description: "Promote Paytm services and acquire new merchants.",
    responsibilities: "Meet sales targets, build client relationships, and conduct market research.",
    openings: 3,
    applicants: 15,
    requirements: ["Bachelor's degree", "Prior sales experience"],
    urgent: true,
    img: "https://tse2.mm.bing.net/th?id=OIP.p8g02dm7amDVp6mam-HOvAHaHa&pid=Api&P=0&h=180",
  },
  {
    _id: "3",
    title: "Delivery Partner",
    company: "Zomato",
    location: "Bangalore",
    salary: "3 Lakhs",
    type: "Work from field",
    workType: "Part-Time",
    experience: "0-1 years",
    postedAt: "2025-06-03",
    skills: ["Driving", "Time Management"],
    level: "Entry",
    role: "Delivery",
    description: "Deliver food orders to customers in a timely manner.",
    responsibilities: "Pick up and deliver orders, ensure customer satisfaction.",
    openings: 10,
    applicants: 50,
    requirements: ["Valid driver's license", "Own a bike"],
    urgent: false,
    img: "https://tse1.mm.bing.net/th?id=OIP.Lqv0xCU4P2w3-vgvpBgBfgHaEK&pid=Api&P=0&h=180",
  },
  {
    _id: "4",
    title: "Delivery Partner",
    company: "Swiggy",
    location: "Hyderabad",
    salary: "3.5 Lakhs",
    type: "Work from field",
    workType: "Part-Time",
    experience: "0-1 years",
    postedAt: "2025-06-04",
    skills: ["Driving", "Customer Service"],
    level: "Entry",
    role: "Delivery",
    description: "Deliver meals to customers efficiently.",
    responsibilities: "Ensure timely deliveries, maintain order accuracy.",
    openings: 8,
    applicants: 40,
    requirements: ["Valid driver's license", "Own a bike"],
    urgent: false,
    img: "https://tse3.mm.bing.net/th?id=OIP.qvG1BA7VsojEUUmrjkOplQHaHa&pid=Api&P=0&h=180",
  },
  {
    _id: "5",
    title: "Software Engineer",
    company: "Amazon",
    location: "Chennai",
    salary: "12 Lakhs",
    type: "Work from home",
    workType: "Full-Time",
    experience: "3-5 years",
    postedAt: "2025-06-05",
    skills: ["Java", "AWS"],
    level: "Senior",
    role: "Engineering",
    description: "Develop and maintain cloud-based applications.",
    responsibilities: "Write clean code, collaborate with teams, and deploy solutions.",
    openings: 2,
    applicants: 30,
    requirements: ["Bachelor's in Computer Science", "Experience with AWS"],
    urgent: true,
    img: "https://tse1.mm.bing.net/th?id=OIP.t_RhPeQId8Y6UdUTeSD0tQHaCF&pid=Api&P=0&h=180",
  },
  {
    _id: "6",
    title: "Product Manager",
    company: "Flipkart",
    location: "Pune",
    salary: "15 Lakhs",
    type: "Work from office",
    workType: "Full-Time",
    experience: "5-7 years",
    postedAt: "2025-06-06",
    skills: ["Product Management", "Agile"],
    level: "Senior",
    role: "Product Management",
    description: "Lead product development for e-commerce platform.",
    responsibilities: "Define product roadmap, work with cross-functional teams.",
    openings: 1,
    applicants: 25,
    requirements: ["MBA preferred", "Experience in e-commerce"],
    urgent: false,
    img: "https://tse3.mm.bing.net/th?id=OIP.6A880rmiHZvbOShXt0wkRAAAAA&pid=Api&P=0&h=180",
  },
  {
    _id: "7",
    title: "dasdaSoftware Engineer",
    company: "dasdasAmazon",
    location: "dasdasChennai",
    salary: "1dasd2 Lakhs",
    type: "dasdasWork from home",
    workType: "dadasFull-Time",
    experience: "3-5 years",
    postedAt: "dasd2025-06-05",
    skills: ["Java", "AWS"],
    level: "Senior",
    role: "Engineering",
    description: "dasdaDevelop and maintain cloud-based applications.",
    responsibilities: "Write clean code, collaborate with teams, and deploy solutions.",
    openings: 2,
    applicants: 30,
    requirements: ["dasBachelor's in Computer Science", "Experience with AWS"],
    urgent: true,
    img: "https://tse1.mm.bing.net/th?id=OIP.t_RhPeQId8Y6UdUTeSD0tQHaCF&pid=Api&P=0&h=180",
  },
];

const JobOpening = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const navigate = useNavigate();

  // Dynamically generate topCompanies from allJobs
  const topCompanies = React.useMemo(() => {
    const uniqueCompanies = [...new Set(allJobs.map((job) => job.company))];
    return uniqueCompanies.map((company, index) => {
      const job = allJobs.find((j) => j.company === company);
      return {
        id: index + 1,
        logo: job.img,
        company: company,
        description: job.description || `${company} job opportunities`,
        bgColor: "bg-white",
      };
    });
  }, []);

  // Handle responsive slides
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 600) {
        setSlidesToShow(2);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(3);
      } else {
        setSlidesToShow(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const maxSlide = Math.max(0, topCompanies.length - slidesToShow);
        return prev >= maxSlide ? 0 : prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [topCompanies.length, slidesToShow]);

  const nextSlide = () => {
    const maxSlide = Math.max(0, topCompanies.length - slidesToShow);
    setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxSlide = Math.max(0, topCompanies.length - slidesToShow);
    setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleViewJobs = (company) => {
    const jobsForCompany = allJobs.filter((job) => job.company === company);
    navigate('/jobopeningdetail', { state: { jobs: jobsForCompany, company } });
  };

  const simulateSendOtp = () => {
    // Simulate sending OTP (no API call, static behavior)
    setShowOtpPopup(true);
    toast.info('OTP sent to your mobile number! (Simulated)');
  };

  const simulateVerifyOtp = () => {
    // Simulate OTP verification (assume any 4-digit OTP is valid for static data)
    if (otp.length === 4 && /^\d+$/.test(otp)) {
      toast.success('Applied to all jobs at this company successfully! (Simulated)');
      setShowOtpPopup(false);
      setOtp('');
      setMobileNumber('');
      setSelectedCompany(null);

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      setOtpError('Please enter a valid 4-digit OTP.');
    }
  };

  const handleApply = (company) => {
    setSelectedCompany(company);
    setShowMobilePopup(true);
  };

  const handleMobileNext = () => {
    if (!mobileNumber || mobileNumber.length !== 10 || !/^\d+$/.test(mobileNumber)) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }
    setShowMobilePopup(false);
    simulateSendOtp();
  };

  const maxSlide = Math.max(0, topCompanies.length - slidesToShow);
  const totalDots = maxSlide + 1;

  return (
    <div className="w-full bg-[#f8f2f6] justify-center mx-auto px-4 py-14">
      <h1 className="text-3xl md:text-4xl Inter text-center font-bold text-left text-gray-800 mb-12">
        Job Openings in Top Companies
      </h1>

      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-200 -ml-4"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-200 -mr-4"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>

        {/* Slider Container */}
        <div className="overflow-hidden px-4">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-7"
            style={{
              transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)`,
            }}
          >
            {topCompanies.map((job) => (
              <div
                key={job.id}
                className="flex-shrink-0"
                style={{ width: `${100 / slidesToShow}%` }}
              >
                <div
                  className={`${job.bgColor} rounded-lg shadow-md pt-0 pb-6 pl-6 pr-6 h-80 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-200 m-2`}
                >
                  {/* Logo */}
                  <div className="flex justify-start">
                    <div className="w-32 h-32 flex items-center justify-center">
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-16 h-16 bg-gray-200 rounded-lg items-center justify-start text-gray-500 text-xs hidden">
                        Logo
                      </div>
                    </div>
                  </div>

                  {/* Company Name */}
                  <h3 className="text-2xl font-bold text-gray-800 text-left mb-3">{job.company}</h3>

                  {/* Description */}
                  <p className="text-black text-base text-left mb-6 flex-grow">{job.description}</p>

                  {/* Buttons */}
                  <div className="text-left flex gap-2">
                    <button
                      onClick={() => handleViewJobs(job.company)}
                      className="text-teal-600 hover:bg-[#1f8268] py-2 px-4 hover:text-white font-medium transition-colors duration-200 inline-flex items-center"
                    >
                      View jobs
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                    {/* <button
                      onClick={() => handleApply(job.company)}
                      className="bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700"
                    >
                      Apply for Job
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalDots }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                currentSlide === index ? 'bg-teal-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Mobile Number Popup */}
      <AnimatePresence>
        {showMobilePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowMobilePopup(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Enter your mobile number</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowMobilePopup(false)}
                  aria-label="Close mobile number popup"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center mb-4">
                <span className="text-gray-600 mr-2">+91</span>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Eg: 9876543210"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  maxLength="10"
                />
              </div>

              <p className="text-gray-600 text-sm mb-4">
                By continuing, you agree to the Apna’s{' '}
                <a href="#" className="text-green-600 hover:underline">Terms of service</a> and{' '}
                <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
              </p>

              <button
                onClick={handleMobileNext}
                className="bg-gray-200 w-full text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300"
                aria-label="Next"
              >
                NEXT
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OTP Popup */}
      <AnimatePresence>
        {showOtpPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowOtpPopup(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Enter OTP</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowOtpPopup(false)}
                  aria-label="Close OTP popup"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-600 mb-4">An OTP has been sent to +91{mobileNumber}</p>

              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setOtpError(null);
                }}
                placeholder="Enter 4-digit OTP"
                className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-600"
                maxLength="4"
              />

              {otpError && (
                <p className="text-red-600 text-sm mb-4">{otpError}</p>
              )}

              <button
                onClick={simulateVerifyOtp}
                className="bg-green-600 w-full text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700"
                aria-label="Verify OTP"
              >
                Verify OTP
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default JobOpening;