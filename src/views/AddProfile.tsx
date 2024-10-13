import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
const BASE_URL = process.env.REACT_APP_API_URL;

interface FormData {
  id: number; // Added id field
  name: string;
  email: string;
  age: string;
}

const AddProfile: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    id: 0, // Initialize id to 0, will be set when profile is created
    name: '',
    email: '',
    age: ''
  });

  const [error, setError] = useState<string>(''); // State to hold the error message
  const navigate = useNavigate();

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  // Handle form submission with POST request
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // Make a request to check if the user already exists in the backend (json-server)
    const response = await fetch(`${BASE_URL}/profile-list`);
    const profileList = (await response.json()) as FormData[];

    // Check if a profile with the same name exists
    const existingUser = profileList.find((profile) => profile.name === formData.name);

    if (existingUser) {
      // If the user already exists, display a warning and allow proceeding
      setError('This username is already registered. Do you want to proceed anyway?');
      return;
    }

    // Generate a unique id for the new profile
    const newProfile = { ...formData, id: Date.now() }; // Use Date.now() as a simple unique id

    try {
      // Send a POST request to add the profile
      const postResponse = await fetch('http://localhost:3001/profile-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProfile)
      });

      if (!postResponse.ok) {
        throw new Error('Failed to add profile');
      }

      // Clear error message if successful
      setError('');

      // Redirect to the profile list after successful profile creation
      navigate('/profile');
    } catch (err) {
      setError('Failed to add profile. Please try again.');
    }
  };

  return (
    <div className='w-full h-full'>
      <Header />
      <div className='min-h-[90vh] flex flex-col justify-center items-center bg-gray-100 px-4'>
        <div className='bg-white rounded-lg shadow-lg px-8 py-[30px] w-full max-w-sm sm:max-w-md lg:max-w-lg transition-all duration-300 ease-in-out my-5'>
          <p className='text-[30px] mb-5 font-[500]' style={{ color: '#F56124' }}>
            Add Profile
          </p>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label htmlFor='name' className='block text-gray-600 text-sm font-medium mb-1'>
                Name<span className='text-red-500'>*</span>
              </label>
              <input type='text' minLength={3} id='name' name='name' className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#F56124]' placeholder='Enter your name' value={formData.name} onChange={handleInputChange} required />
            </div>

            <div className='mb-4'>
              <label htmlFor='email' className='block text-gray-600 text-sm font-medium mb-1'>
                Email<span className='text-red-500'>*</span>
              </label>
              <input type='email' id='email' name='email' value={formData.email} onChange={handleInputChange} className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#F56124]' placeholder='Enter your email' required />
            </div>

            <div className='mb-4'>
              <label htmlFor='age' className='block text-gray-600 text-sm font-medium mb-1'>
                Age
              </label>
              <input
                type='number'
                id='age'
                name='age'
                value={formData.age || ''}
                onChange={(e) => {
                  const ageValue = Number(e.target.value);
                  if (ageValue >= 0 && ageValue < 120) {
                    handleInputChange(e);
                  }
                }}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#F56124]'
                placeholder='Enter your age'
                min={0}
                max={119}
                required
              />
            </div>

            {error && (
              <div className='text-red-500 text-sm'>
                <p>{error}</p>
              </div>
            )}

            <button type='submit' className='btn border-none w-full mt-5 text-white py-2 rounded-lg' style={{ background: 'linear-gradient(to right, #f78312 0, #f44336 100%)' }}>
              Add Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProfile;
