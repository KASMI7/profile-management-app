import React, { useState, useCallback } from 'react';

interface User {
  name: string;
  email: string;
  age?: number;
}

interface ModalProps {
  user: User;
  isNewUser: boolean;
  isChanged: boolean;
  error: string | null;
  onClose: () => void;
  onSave: () => void;
  onChange: (field: keyof User, value: string | number) => void;
}

const UserModal: React.FC<ModalProps> = React.memo(({ user, isNewUser, isChanged, onClose, onSave, onChange, error }) => {
  // Email error state for validation
  const [emailError, setEmailError] = useState<string | null>(null);

  // Memoized form submission handler to prevent unnecessary re-renders
  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Prevent submission if there is an email validation error
      if (emailError) {
        return;
      }
      onSave();
    },
    [emailError, onSave]
  );

  // Memoized email change handler to prevent unnecessary re-renders
  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const emailValue = e.target.value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(emailValue)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError(null); // Clear error if email is valid
      }
      onChange('email', emailValue);
    },
    [onChange]
  );

  return (
    <dialog id='user_modal' className='modal modal-open'>
      <div className='modal-box w-full sm:w-[50%] transition-all duration-300 ease-in-out bg-[#F7F7F7] rounded-[8px]'>
        <h3 className='font-bold text-lg mb-4'>{isNewUser ? 'Add New Profile' : 'Edit Profile'}</h3>
        {/* Bind the form submission to the handleFormSubmit */}
        <form onSubmit={handleFormSubmit}>
          <div className='mb-4'>
            <label htmlFor='username' className='block text-gray-600 text-sm font-medium mb-1'>
              Username<span className='text-red-500 ml-1'>*</span>
            </label>
            <input type='text' minLength={3} id='username' name='username' className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500' placeholder='Enter your username' value={user.name} onChange={(e) => onChange('name', e.target.value)} required />
          </div>

          <div className='mb-4'>
            <label htmlFor='email' className='block text-gray-600 text-sm font-medium mb-1'>
              Email<span className='text-red-500 ml-1'>*</span>
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={user.email}
              onChange={handleEmailChange}
              disabled={!isNewUser} // Disable email editing for existing users
              className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 ${emailError ? 'border-red-500' : ''}`}
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
              value={user.age || ''}
              onChange={(e) => {
                const ageValue = Number(e.target.value);
                if (ageValue >= 0 && ageValue < 120) {
                  onChange('age', ageValue);
                }
              }}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
              placeholder='Enter your age'
              min={0}
              max={119}
            />
          </div>
          {error && <p className='text-red-500 text-sm'>{error}</p>}
          <div className='w-full flex justify-end mt-10'>
            <button type='button' className='btn bg-gray-200 mr-4' onClick={onClose}>
              Cancel
            </button>
            <button type='submit' className='btn border-none text-white w-[20%]' style={{ background: 'linear-gradient(to right, #f78312 0, #f44336 100%)' }} disabled={!isChanged && !isNewUser}>
              Save
            </button>
          </div>
        </form>
      </div>
      <form method='dialog' className='modal-backdrop' onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
});

export default UserModal;
