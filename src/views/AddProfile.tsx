import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { createProfile, fetchProfiles } from '../services'; // Import the createProfile and fetchProfiles functions

interface FormData {
  id: string;
  name: string;
  email: string;
  age: number;
}

const AddProfile: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    id: '',
    name: '',
    email: '',
    age: 0,
  });

  const [emailError, setEmailError] = useState<string | null>(null); // State for email validation
  const [error, setError] = useState<string>(''); // General error state
  const [lastUser, setLastUser] = useState<FormData | null>(null); // State to store the last user
  const navigate = useNavigate();

  // Fetch profiles and get the last user
  useEffect(() => {
    const getLastUser = async () => {
      try {
        const profiles = await fetchProfiles(); // Fetch all profiles
        if (profiles.length > 0) {
          const lastProfile = profiles[profiles.length - 1];
          setLastUser({
            ...lastProfile,
            age: lastProfile.age ?? 0, // Ensure age is a number, default to 0 if undefined
          });
        }
      } catch (err) {
        console.error('Failed to fetch profiles:', err);
      }
    };
    getLastUser();
  }, []);

  // Memoized handleInputChange to avoid unnecessary re-renders
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    // For email validation
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic regex for email validation
      if (!emailRegex.test(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError(null);
      }
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === 'age' ? Number(value) : value,
    }));
  }, []);

  // Memoized handleSubmit to avoid unnecessary re-renders
  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();

      // Check for email validation
      if (emailError) {
        return; // Prevent form submission if email is invalid
      }

      try {
        // Fetch the list of profiles to check for duplicate names
        const profileList = await fetchProfiles();

        // Check if a profile with the same name exists
        const existingUser = profileList.find((profile) => profile.name === formData.name);

        if (existingUser) {
          // If the user already exists, display a warning
          setError('This username is already registered.');
          return;
        }

        // Generate a unique id for the new profile
        const newProfile = { ...formData, id: String(Date.now()) }; // Use Date.now() as a simple unique id

        // Use the createProfile service function to add the new profile
        await createProfile(newProfile);

        // Clear error message if successful
        setError('');

        // Redirect to the profile list after successful profile creation
        navigate('/profile');
      } catch (err) {
        console.error('Failed to add profile:', err);
        setError('Failed to add profile. Please try again.');
      }
    },
    [emailError, formData, navigate]
  );

  // Memoized lastUser value
  const lastUserMemo = useMemo(() => lastUser, [lastUser]);

  return (
    <div className='w-full h-full'>
      <Header lastUser={lastUserMemo} />
      <div className='min-h-[90vh] flex flex-col justify-center items-center bg-gray-100 px-4'>
        <div className='bg-white rounded-lg shadow-lg px-8 py-[30px] w-full max-w-sm sm:max-w-md lg:max-w-lg transition-all duration-300 ease-in-out my-5'>
          <p className='text-[30px] mb-5 font-[500]' style={{ color: '#F56124' }}>
            Add Profile
          </p>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label htmlFor='name' className='block text-gray-600 text-sm font-medium mb-1'>
                Name<span className='text-red-500 ml-1'>*</span>
              </label>
              <input
                type='text'
                minLength={3}
                id='name'
                name='name'
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#F56124]'
                placeholder='Enter your name'
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className='mb-4'>
              <label htmlFor='email' className='block text-gray-600 text-sm font-medium mb-1'>
                Email<span className='text-red-500 ml-1'>*</span>
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#F56124] ${
                  emailError ? 'border-red-500' : ''
                }`}
                placeholder='Enter your email'
                required
              />
              {emailError && <p className='text-red-500 text-sm'>{emailError}</p>}
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
              />
            </div>

            {error && (
              <div className='text-red-500 text-sm'>
                <p>{error}</p>
              </div>
            )}

            <button
              type='submit'
              className='btn border-none w-full mt-5 text-white py-2 rounded-lg'
              style={{ background: 'linear-gradient(to right, #f78312 0, #f44336 100%)' }}
            >
              Add Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProfile;
