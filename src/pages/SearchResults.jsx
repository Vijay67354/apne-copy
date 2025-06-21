


import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SearchResults = () => {
  const { state } = useLocation();
  const { searchParams = {}, filteredJobs: initialJobs = [] } = state || {};
  const [jobs, setJobs] = useState([]);
  const [suggestedJobs, setSuggestedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    datePosted: 'all',
    salary: 1.5,
    workMode: { home: false, office: false, field: false },
    workType: { fullTime: false, partTime: false },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(null);
  const [currentJobId, setCurrentJobId] = useState(null);
  const navigate = useNavigate();

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQ4ODkwMjYwfQ.fakeToken';

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`${API_BASE_URL}/api/jobs/search`, {
          params: {
            designation: searchParams.designation || '',
            experience: searchParams.experience || '',
            location: searchParams.location || '',
          },
        });
        setJobs(response.data || []);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchSuggestedJobs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/jobs/suggested`, {
          params: {
            location: searchParams.location || '',
            designation: searchParams.designation || '',
          },
        });
        setSuggestedJobs(response.data || []);
      } catch (err) {
        console.error('Error fetching suggested jobs:', err);
      }
    };

    if (initialJobs.length > 0) {
      setJobs(initialJobs);
      setLoading(false);
    } else {
      fetchJobs();
    }
    fetchSuggestedJobs();
  }, [searchParams, initialJobs]);

  const sendOtp = async (jobId) => {
    try {
      const fullMobileNumber = `+91${mobileNumber}`;
      const response = await axios.post(
      `https://verify.twilio.com/v2/Services/${API_BASE_URL_REACT_APP_TWILIO_SERVICE_SID}/Verifications`,
        {
          To: fullMobileNumber,
          Channel: 'sms',
        },
        {
          auth: {
            username: REACT_APP_TWILIO_ACCOUNT_SID_username,
            password: REACT_APP_TWILIO_ACCOUNT_SID_password
   
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          transformRequest: [(data) => {
            const params = new URLSearchParams();
            for (const key in data) {
              params.append(key, data[key]);
            }
            return params;
          }],
        }
      );

      if (response.data.status === 'pending') {
        setShowOtpPopup(true);
        setCurrentJobId(jobId);
        toast.info('OTP sent to your mobile number!');
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      toast.error('Failed to send OTP. Please try again.');
    }
  };

  const verifyOtp = async () => {
    try {
      const fullMobileNumber = `+91${mobileNumber}`;
      const response = await axios.post(
        API_BASE_URL,

        {
          To: fullMobileNumber,
          Code: otp,
        },
        {
           auth: {
            username: REACT_APP_TWILIO_ACCOUNT_SID_username,
            password: REACT_APP_TWILIO_ACCOUNT_SID_password
   
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          transformRequest: [(data) => {
            const params = new URLSearchParams();
            for (const key in data) {
              params.append(key, data[key]);
            }
            return params;
          }],
        }
      );

      if (response.data.status === 'approved') {
        await axios.post(
          `${API_BASE_URL}/api/jobs/${currentJobId}/apply`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success('Applied successfully!');
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === currentJobId ? { ...job, applicants: (job.applicants || 0) + 1 } : job
          )
        );

        setShowOtpPopup(false);
        setOtp('');
        setMobileNumber('');
        setCurrentJobId(null);

        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setOtpError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setOtpError('Failed to verify OTP. Please try again.');
    }
  };

  const handleApply = (jobId) => {
    setCurrentJobId(jobId);
    setShowMobilePopup(true);
  };

  const handleMobileNext = () => {
    if (!mobileNumber || mobileNumber.length !== 10 || !/^\d+$/.test(mobileNumber)) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }
    setShowMobilePopup(false);
    sendOtp(currentJobId);
  };

  const fetchJobDetails = async (jobId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/jobs/${jobId}`);
      setSelectedJob(response.data.data);
    } catch (error) {
      console.error('Error fetching job details:', error);
      if (error.response?.status === 404) {
        toast.error('This job is no longer available.');
        setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      } else {
        toast.error('Failed to load job details. Please try again later.');
      }
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1);
  };

  const filteredJobsWithFilters = useMemo(() => {
    return jobs.filter((job) => {
      const postedDate = new Date(job.postedAt);
      const today = new Date();
      const diffDays = Math.ceil((today - postedDate) / (1000 * 60 * 60 * 24));

      if (filters.datePosted === 'last24hours' && diffDays > 1) return false;
      if (filters.datePosted === 'last3days' && diffDays > 3) return false;
      if (filters.datePosted === 'last7days' && diffDays > 7) return false;

      const salaryString = typeof job.salary === 'string' ? job.salary : '0';
      const salaryRange = salaryString.match(/(\d+(\.\d+)?)-(\d+(\.\d+)?)/);
      const minSalary = salaryRange ? parseFloat(salaryRange[1]) : parseFloat(salaryString) || 0;
      if (minSalary < filters.salary) return false;

      const jobWorkMode = job.type?.toLowerCase().includes('work from') ? job.type.toLowerCase() : '';
      if (filters.workMode.home && !jobWorkMode.includes('work from home')) return false;
      if (filters.workMode.office && !jobWorkMode.includes('work from office')) return false;
      if (filters.workMode.field && !jobWorkMode.includes('work from field')) return false;

      const jobWorkType = job.type?.toLowerCase();
      if (filters.workType.fullTime && jobWorkType !== 'full-time') return false;
      if (filters.workType.partTime && jobWorkType !== 'part-time') return false;

      return true;
    });
  }, [jobs, filters]);

  const totalPages = Math.ceil(filteredJobsWithFilters.length / itemsPerPage);
  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = filteredJobsWithFilters.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateDaysAgo = (postedAt) => {
    const postedDate = new Date(postedAt);
    const today = new Date();
    const diffTime = Math.abs(today - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className=" flex flex-col bg-gray-50">
      <div className="w-full mx-auto max-w-[1250px] flex-grow">
        
        <div className="p-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {filteredJobsWithFilters.length} Explore and Find Latest Jobs
            </h1>
          </div>
          <div className="mt-5 flex gap-6">
            {/* Filters Section */}
            <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 uppercase">Filters</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() =>
                    setFilters({
                      datePosted: 'all',
                      salary: 1.5,
                      workMode: { home: false, office: false, field: false },
                      workType: { fullTime: false, partTime: false },
                    })
                  }
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 uppercase mb-2">Date Posted</h3>
                <div className="space-y-2">
                  {['all', 'last24hours', 'last3days', 'last7days'].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="date-posted"
                        value={option}
                        checked={filters.datePosted === option}
                        onChange={() => handleFilterChange('datePosted', option)}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">
                        {option === 'all'
                          ? 'All'
                          : option === 'last24hours'
                          ? 'Last 24 Hours'
                          : option === 'last3days'
                          ? 'Last 3 Days'
                          : 'Last 7 Days'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 uppercase mb-2">Salary</h3>
                <div>
                  <label className="block text-xs text-gray-600 mb-1 uppercase">Minimum yearly salary</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">₹0</span>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      step="0.5"
                      value={filters.salary}
                      onChange={(e) => handleFilterChange('salary', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 ${(filters.salary / 15) * 100}%, #e5e7eb ${(filters.salary / 15) * 100}%)`,
                      }}
                    />
                    <span className="text-sm text-gray-600">{filters.salary} Lakhs</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 uppercase mb-2">Work Mode</h3>
                <div className="space-y-2">
                  {['home', 'office', 'field'].map((mode) => (
                    <label key={mode} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.workMode[mode]}
                        onChange={() =>
                          handleFilterChange('workMode', {
                            ...filters.workMode,
                            [mode]: !filters.workMode[mode],
                          })
                        }
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">
                        {mode === 'home' ? 'Work from Home' : mode === 'office' ? 'Work from Office' : 'Work from Field'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            {/* Job Listings Section */}
            <div className="flex-1">
              {loading ? (
                <p className="text-gray-600">Loading...</p>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : filteredJobsWithFilters.length === 0 ? (
                <p className="text-gray-600">No jobs found.</p>
              ) : (
                <>
                  <div className="grid gap-4">
                    {currentJobs.map((job) => (
                      <div
                        key={job.id}
                        className="p-4 bg-white shadow-md rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => fetchJobDetails(job.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{job.designation}</h3>
                            <p className="text-sm text-gray-600">{job.company}</p>
                          </div>
                          <img
                            src={job.img || 'https://via.placeholder.com/64'}
                            alt={`${job.company} Logo`}
                            className="w-12 h-12 object-contain rounded"
                          />
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.243l-4.243-4.243m0 0L9.172 7.757M13.414 12H21m-9 9V13.414m0-4.828V3m-9 9h7.586"
                              />
                            </svg>
                            {job.location}
                          </span>
                          <span>₹{job.salary}</span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 20h5v-2a2 2 0 00-2-2h-1m-2 0H7a2 2 0 00-2 2v2h5m-2-8h8m-4 4v-8m-6 4h12"
                              />
                            </svg>
                            {job.experience}
                          </span>
                        </div>
                        <div className="mt-2 flex gap-2 text-xs text-gray-600">
                          {job.skills?.slice(0, 3).map((skill, index) => (
                            <span key={index} className="bg-gray-100 px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <p className="mt-2 text-xs text-gray-500">Posted: {calculateDaysAgo(job.postedAt)}</p>
                      </div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="mt-6 flex justify-center items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === 1
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === totalPages
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            {/* Sidebar Section */}
            <div className="w-1/4">
             <div>
               <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Know more about Freshers Jobs</h3>
                <img
                   src="https://storage.googleapis.com/mumbai_apnatime_prod/jobs_page/TrackForDesktop.webp"
                   alt="Phone Mockup"
                   className="mt-4 w-full"
                />
               </div>
             </div>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedJob(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-lg max-w-7xl h-[700px] w-full overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-labelledby="job-details-title"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm mr-2">
                      {selectedJob.company?.slice(0, 6).toUpperCase()}
                    </span>
                    <h2 id="job-details-title" className="text-xl font-semibold">
                      {selectedJob.designation}
                    </h2>
                  </div>
                  <p className="text-gray-600">{selectedJob.company}</p>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.243l-4.243-4.243m0 0L9.172 7.757M13.414 12H21m-9 9V13.414m0-4.828V3m-9 9h7.586"
                        />
                      </svg>
                      {selectedJob.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm0 6c-2.21 0-4-1.79-4-4s1.79-4 4 4-1.79 4-4 4zm0 2c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"
                        />
                      </svg>
                      ₹{selectedJob.salary}
                    </span>
                  </div>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedJob(null)}
                  aria-label="Close job details"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="text-gray-600 text-sm">Fixed</p>
                    <p className="font-semibold">₹{selectedJob.salary}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Earning Potential</p>
                    <p className="font-semibold">
                      ₹
                      {(() => {
                        const salaryRange = selectedJob.salary?.match(/(\d+(\.\d+)?)-(\d+(\.\d+)?)/);
                        const maxSalary = salaryRange ? parseFloat(salaryRange[3]) : parseFloat(selectedJob.salary) || 0;
                        return (maxSalary + 2).toFixed(1);
                      })()}{' '}
                      Lakhs P.A.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white text-gray-700 px-2 py-1 rounded text-sm">{selectedJob.type}</span>
                  <span className="bg-white text-gray-700 px-2 py-1 rounded text-sm">
                    {selectedJob.experience === '0 years' ? 'Freshers only' : selectedJob.experience}
                  </span>
                  {selectedJob.skills?.slice(0, 1).map((skill, index) => (
                    <span key={index} className="bg-white text-gray-700 px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-96 flex justify-between items-center mb-4">
                <button
                  onClick={() => handleApply(selectedJob.id)}
                  className="bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 flex-1 mr-2"
                >
                  Apply for Job
                </button>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Job Highlights</h3>
                <div className="flex gap-4 mt-2">
                  <span className="flex items-center text-orange-600 text-sm">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    {selectedJob.type || 'Flexible'}
                  </span>
                  <span className="flex items-center text-orange-600 text-sm">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l4.5 4.5M12 8V4m0 8H7.5m9 0h4.5"
                      />
                    </svg>
                    {selectedJob.experience}
                  </span>
                  <span className="flex items-center text-orange-600 text-sm">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    {selectedJob.skills?.join(', ') || 'No skills listed'}
                  </span>
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Job Description</h3>
                <p className="text-gray-600 mt-2">{selectedJob.description || 'No description available.'}</p>
              </div>
              {selectedJob.requirements && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Requirements</h3>
                  <ul className="list-disc pl-5 text-gray-600 mt-2">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Enter Mobile Number</h3>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                className="w-full p-2 border rounded mb-4"
              />
              <button
                onClick={handleMobileNext}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 w-full"
              >
                Next
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Enter OTP</h3>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-2 border rounded mb-4"
              />
              {otpError && <p className="text-red-600 text-sm mb-4">{otpError}</p>}
              <button
                onClick={verifyOtp}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 w-full"
              >
                Verify OTP
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer />
    </div>
  );
};

export default SearchResults;