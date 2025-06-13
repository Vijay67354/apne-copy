import React from 'react';

// JSON data
const jobData = [
  {
    "logo": "G",
    "title": "Cloud Engineer",
    "location": "Hyderabad",
    "level": "Intermediate Level",
    "description": "Join the technology team as a Cloud Engineer, where you will be responsible for designing and managing our cloud infrastructure. You will collabora"
  },
  {
    "logo": "G",
    "title": "Human Resources Specialist",
    "location": "Washington",
    "level": "Intermediate Level",
    "description": "As a Human Resources Specialist, you will support various HR functions, including recruitment, employee relations, and compliance. You will play a"
  },
  {
    "logo": "G",
    "title": "Cybersecurity Analyst",
    "location": "Mumbai",
    "level": "Intermediate Level",
    "description": "Protect our systems as a Cybersecurity Analyst. In this role, you will monitor security systems, analyze potential threats, and implement protectiv"
  },
  {
    "logo": "G",
    "title": "Mobile App Developer",
    "location": "Hyderabad",
    "level": "Intermediate Level",
    "description": "Join our team as a Mobile App Developer to create engaging mobile applications for iOS and Android platforms. You will be responsible for the full"
  },
  {
    "logo": "G",
    "title": "UX/UI Designer",
    "location": "Hyderabad",
    "level": "Intermediate Level",
    "description": "We are seeking a talented UX/UI Designer to enhance our user experience across digital platforms. You will collaborate with product managers and de"
  },
  {
    "logo": "G",
    "title": "DevOps Engineer",
    "location": "Washington",
    "level": "Senior Level",
    "description": "Enhance our deployment pipeline as a DevOps Engineer. The role will involve automating processes, managing cloud infrastructure, and im"
  }
];

// MainCard Component
const MainCard = ({ logo, title, location, level, description }) => {
  return (
    <div className="max-w-sm rounded-lg  p-6 border border-gray-200">
      {/* Logo */}
      <div className="mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold">
          {logo || 'G'}
        </div>
      </div>

      {/* Job Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>

      {/* Tags: Location and Level */}
      <div className="flex space-x-2 mb-4">
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {location}
        </span>
        <span className="bg-pink-100 text-pink-800 text-sm font-medium px-3 py-1 rounded-full">
          {level}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-6">{description}</p>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Apply now
        </button>
        <button className="border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition">
          Learn more
        </button>
      </div>
    </div>
  );
};

// App Component to render the cards
const App = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Latest Jobs</h1>
      <p className="text-gray-600 mb-6">Get your desired job from top companies</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {jobData.map((job, index) => (
          <MainCard
            key={index}
            logo={job.logo}
            title={job.title}
            location={job.location}
            level={job.level}
            description={job.description}
          />
        ))}
      </div>
    </div>
  );
};

export default App;