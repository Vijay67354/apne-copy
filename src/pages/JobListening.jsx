

import React from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin, Star, CalendarDays } from 'lucide-react';

const JobListening = () => {
    const { state } = useLocation();
    const { job } = state || {};

    if (!job) {
        return <div className="text-center mt-10">Job not found.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-4 mt-4">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Left Section: Job Details */}
                <div className="flex-1 bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-xl font-bold">{job.designation}</h2>
                            <div className="flex items-center mt-1">
                                <span className="text-gray-600 font-medium">{job.company}</span>
                                {job.rating && (
                                    <div className="flex items-center ml-2 bg-gray-100 px-2 py-0.5 rounded">
                                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                        <span className="ml-1 text-sm">
                                            {job.rating} ({job.reviews})
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <img
                            src="https://via.placeholder.com/48" // Replace with job.logo if available
                            alt={`${job.company} logo`}
                            className="w-12 h-12 rounded-md object-contain"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4 text-gray-500 mb-4">
                        <div className="flex items-center">
                            <CalendarDays size={16} className="mr-1" />
                            <span>{job.experience}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin size={16} className="mr-1" />
                            <span>{job.location}</span>
                        </div>
                        <div>
                            <span>Posted: {job.postedAt}</span>
                        </div>
                        <div>
                            <span>Openings: {job.openings}</span>
                        </div>
                        <div>
                            <span>Applicants: {job.applicants}</span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="font-semibold">Job Description</h3>
                        <p className="text-gray-600 mt-1">{job.description}</p>
                        <div className="mt-2">
                            <span className="font-semibold">Role: </span>
                            <span>{job.role}</span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="font-semibold">Required Candidate Profile</h3>
                        <p className="text-gray-600 mt-1">
                            HSC or graduate, fast and accurate typing skills, detail-oriented, basic Excel knowledge, willing to work in night shifts.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                            Register to Apply
                        </button>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                            Login to Apply
                        </button>
                    </div>
                </div>

                {/* Right Section: Suggested Jobs */}
                <div className="w-full md:w-80 bg-white rounded-lg shadow-md p-4">
                    <h3 className="font-bold text-lg mb-4">Jobs you might be interested in</h3>
                    <div className="space-y-4">
                        {/* Suggested Job 1 */}
                        <div className="border-b pb-2">
                            <h4 className="font-semibold">Back Office Executive (Neelankarai)</h4>
                            <p className="text-gray-600">Cameo Corporate Services</p>
                            <div className="flex items-center mt-1">
                                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                <span className="ml-1 text-sm">3.4 (205 reviews)</span>
                            </div>
                            <p className="text-gray-500 mt-1">Chennai (Neelankarai)</p>
                            <p className="text-gray-400 text-sm mt-1">Posted 2 days ago</p>
                        </div>
                        {/* Suggested Job 2 */}
                        <div className="border-b pb-2">
                            <h4 className="font-semibold">Data Entry (Fresher)</h4>
                            <p className="text-gray-600">Rapid Care</p>
                            <div className="flex items-center mt-1">
                                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                <span className="ml-1 text-sm">4.4 (104 reviews)</span>
                            </div>
                            <p className="text-gray-500 mt-1">Chennai</p>
                            <p className="text-gray-400 text-sm mt-1">Posted 8 days ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobListening;