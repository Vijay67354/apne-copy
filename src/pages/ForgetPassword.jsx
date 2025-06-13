// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';


// function ForgotPassword() {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

// const handleSubmit = async () => {
//   if (!email) {
//     setMessage('Please enter your email address');
//     return;
//   }
//   if (!/\S+@\S+\.\S+/.test(email)) {
//     setMessage('Please enter a valid email address');
//     return;
//   }

//   try {
//     const response = await axios.post('http://localhost:5006/api/forgot-password', {
//       email,
//     });

//     const msg = response.data.message || 'Password reset instructions sent to your email.';
//     setMessage(msg);

//     // ✅ Navigate to OTP Verification page if success
//     if (msg.toLowerCase().includes('sent')) {
//       setTimeout(() => {
//         navigate('/otpverification', { state: { email } }); // optional: pass email in route state
//       }, 1000); // Optional delay to show success message briefly
//     }

//   } catch (err) {
//     console.error('Forgot password error:', err);
//     setMessage(err.response?.data?.error || 'Failed to send reset instructions. Please try again.');
//   }
// };

//   return (
//     <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
//       <div className="w-full max-w-md text-center">
//         {/* Logo */}
//         <img
//           src="sd"
//           alt="Logo"
//           className="mx-auto mb-8 w-48"
//           onError={(e) => (e.target.src = '/images/logo.png')} // Fallback to the logo path from Navbar
//         />

//         {/* Heading */}
//         <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password</h1>
//         <p className="text-gray-600 mb-6">
//           To reset your password, please confirm your Email
//         </p>

//         {/* Message (Success/Error) */}
//         {message && (
//           <div
//             className={`mb-4 p-3 rounded-lg text-sm ${
//               message.includes('sent')
//                 ? 'bg-green-100 text-green-700'
//                 : 'bg-red-100 text-red-700'
//             }`}
//           >
//             {message}
//           </div>
//         )}

//         {/* Email Input */}
//         <div className="mb-6">
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => {
//               setEmail(e.target.value);
//               setMessage('');
//             }}
//             placeholder="Confirm email"
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
//           />
//         </div>

//         {/* Reset Password Button */}
//         <button
//           onClick={handleSubmit}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-full transition-all duration-200"
//         >
//           Reset Password
//         </button>

//         {/* Divider */}
//         <div className="relative my-6">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-300"></div>
//           </div>
//           <div className="relative flex justify-center text-sm">
//             <span className="px-4 bg-white text-gray-500">or</span>
//           </div>
//         </div>

//         {/* Back to Log in Link */}
//         <button
//           onClick={() => navigate('/login')} // Navigate back to the login page
//           className="text-gray-800 hover:text-blue-700 font-medium flex items-center justify-center gap-2 transition-colors"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M15 19l-7-7 7-7"
//             />
//           </svg>
//           Back to Log in
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ForgotPassword;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Enhanced helper function to format phone number for multiple countries
  const formatPhoneNumber = (phoneNumber) => {
    // Remove all non-digit characters except +
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // If it already starts with +, return as is (user provided country code)
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    
    // Remove any leading + that might be left from cleaning
    const digitsOnly = cleaned.replace(/^\+/, '');
    
    // Handle different country patterns
    if (digitsOnly.length === 10) {
      // Could be US (10 digits) or India without country code (10 digits)
      // Default to US for 10 digits, but you might want to add country selection
      return `+1${digitsOnly}`;
    } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
      // Indian number with country code but without +
      return `+${digitsOnly}`;
    } else if (digitsOnly.length === 10 && /^[6-9]/.test(digitsOnly)) {
      // Indian mobile numbers start with 6, 7, 8, or 9
      return `+91${digitsOnly}`;
    } else if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
      // Other international numbers
      return `+${digitsOnly}`;
    }
    
    // If none of the patterns match, add + and return
    return `+${digitsOnly}`;
  };

  // Enhanced validation for international phone numbers
  const validatePhoneNumber = (phoneNumber) => {
    const formatted = formatPhoneNumber(phoneNumber);
    
    // Basic validation: should start with + and have 10-15 digits total
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(formatted)) {
      return false;
    }
    
    // Additional validation for specific countries
    if (formatted.startsWith('+91')) {
      // Indian numbers: +91 followed by 10 digits starting with 6-9
      return /^\+91[6-9]\d{9}$/.test(formatted);
    } else if (formatted.startsWith('+1')) {
      // US numbers: +1 followed by 10 digits
      return /^\+1\d{10}$/.test(formatted);
    }
    
    // For other countries, basic length validation
    return true;
  };

  const handleSubmit = async () => {
    if (!email || !phone) {
      setMessage('Please enter both email and phone number');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage('Please enter a valid email address');
      return;
    }

    // Format and validate the phone number
    const formattedPhone = formatPhoneNumber(phone);
    
    if (!validatePhoneNumber(phone)) {
      setMessage('Please enter a valid phone number');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5006/api/forgetpassword', { 
        email, 
        phone: formattedPhone 
      });
      const msg = response.data.message || 'OTP sent to your email and phone.';
      setMessage(msg);
      if (msg.toLowerCase().includes('sent')) {
        setTimeout(() => {
          navigate('/otp-verification', { state: { email } });
        }, 1000);
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      setMessage(err.response?.data?.error || 'Failed to send OTP. Please try again.');
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Allow digits, +, spaces, and hyphens for better UX
    const cleaned = value.replace(/[^\d+\s-]/g, '');
    setPhone(cleaned);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <img
          src="/images/nexthire-logo.png"
          alt="NextHire Logo"
          className="mx-auto mb-8 w-48"
          onError={(e) => (e.target.src = '')}
        />

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password</h1>
        <p className="text-gray-600 mb-6">Enter your email and phone number to receive an OTP</p>

        {/* Message (Success/Error) */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              message.includes('sent') ? 'bg-green-100 text-green-700' : 'bg-pink-100 text-pink-700'
            }`}
          >
            {message}
          </div>
        )}

        {/* Email Input */}
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setMessage('');
            }}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-blue-50"
          />
        </div>

        {/* Phone Input */}
        <div className="mb-6">
          <input
            type="text"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="Enter phone number (e.g., +91 9876543210 or +1 2345678901)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-blue-50"
          />
          <div className="text-xs text-gray-500 mt-1 text-left space-y-1">
            <p>• US: 10 digits (e.g., 2345678901) → +1 2345678901</p>
            <p>• India: 10 digits starting with 6-9 (e.g., 9876543210) → +91 9876543210</p>
            <p>• International: Include country code (e.g., +44 7123456789)</p>
          </div>
        </div>

        {/* Send OTP Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
        >
          Send OTP
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Back to Log in Link */}
        <button
          onClick={() => navigate('/login')}
          className="text-gray-800 hover:text-blue-700 font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Log in
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;