import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import UserModal from '../components/UserModal';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;
console.log('BASE_URL', BASE_URL);

interface Profile {
  id: string; // Updated id to string
  name: string;
  email: string;
  age?: number;
}

const ProfileTable: React.FC = () => {
  const [profileList, setProfileList] = useState<Profile[]>([]);
  const [modalProfile, setModalProfile] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string | null; name: string }>({ id: null, name: '' });

  const API_URL = `${BASE_URL}/profile-list`;

  // Fetch profile list from JSON server
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get<Profile[]>(API_URL);
        setProfileList(response.data);
      } catch (error) {
        setError('Error fetching profiles');
      }
    };

    fetchProfiles();
  }, []);

  const openModal = (profile: Profile | null = null) => {
    if (profile) {
      // Edit existing profile
      setModalProfile({ ...profile });
      setIsNewProfile(false);
    } else {
      // Create new profile
      setModalProfile({ id: String(Date.now()), name: '', email: '', age: undefined }); // Use string id
      setIsNewProfile(true);
    }
    setIsModalOpen(true);
    setIsChanged(false);
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const handleInputChange = (field: keyof Profile, value: string | number) => {
    if (modalProfile) {
      const updatedProfile = { ...modalProfile, [field]: value };
      setModalProfile(updatedProfile);
      setIsChanged(true);
    }
  };

  const saveProfile = async () => {
    if (modalProfile) {
      // Check for empty fields
      if (!modalProfile.name.trim() || !modalProfile.email.trim()) {
        setError('Please fill in all required fields (Name and Email).');
        return;
      }

      // Check for duplicate name
      const duplicateNameProfile = profileList.find(
        (profile) => profile.name === modalProfile.name && profile.id !== modalProfile.id
      );
      if (duplicateNameProfile) {
        setError('This name is already used by another profile. Please use a different name.');
        return;
      }

      setError(null); // Clear error if validation passes

      try {
        if (isNewProfile) {
          // Add new profile (POST)
          const response = await axios.post(API_URL, JSON.stringify(modalProfile));
          setProfileList([...profileList, response.data]);
        } else {
          // Convert the id to a string when making the PUT request
          const profileId = String(modalProfile.id);
          await axios.put(`${API_URL}/${profileId}`, modalProfile); // Ensure id is a string
          const updatedProfiles = profileList.map((profile) =>
            profile.id === modalProfile.id ? modalProfile : profile
          );
          setProfileList(updatedProfiles);
        }

        closeModal();
      } catch (error) {
        console.error('Error saving profile:', error); // Log error details
        setError('Error saving profile');
      }
    }
  };

  const handleDeleteConfirmation = (id: string, name: string) => {
    setDeleteConfirmation({ id, name });
  };

  const deleteProfile = async () => {
    if (deleteConfirmation.id !== null) {
      try {
        await axios.delete(`${API_URL}/${deleteConfirmation.id}`);
        setProfileList(profileList.filter((profile) => profile.id !== deleteConfirmation.id));
        setDeleteConfirmation({ id: null, name: '' });
      } catch (error) {
        setError('Error deleting profile');
      }
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Header />
      <div className='min-h-[90vh] flex flex-col bg-gray-100 px-6'>
        <div className='w-full flex justify-between items-center mt-10 mb-6'>
          <h1 className='text-[#F56124] font-[500]' style={{ fontSize: 'clamp(15px, 4vw, 30px)' }}>
            Manage Profiles
          </h1>
          <button
            className='btn border-none text-white'
            style={{ background: 'linear-gradient(to right, #f78312 0, #f44336 100%)' }}
            onClick={() => openModal()}
          >
            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-plus-circle-fill mr-2'>
              <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z' />
            </svg>
            Add Profile
          </button>
        </div>

        {/* Profile Table */}
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white shadow-xl rounded-md'>
            <thead>
              <tr className='bg-gray-300'>
                <th className='px-6 py-3 border-b border-gray-300 text-left text-xs md:text-sm leading-4 text-gray-600 uppercase'>
                  Name
                </th>
                <th className='px-6 py-3 border-b border-gray-300 text-left text-xs md:text-sm leading-4 text-gray-600 uppercase'>
                  Email
                </th>
                <th className='px-6 py-3 border-b border-gray-300 text-left text-xs md:text-sm leading-4 text-gray-600 uppercase'>
                  Age
                </th>
                <th className='px-6 py-3 border-b border-gray-300 text-left text-xs md:text-sm leading-4 text-gray-600 uppercase'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {profileList.map((profile) => (
                <tr key={profile.id}>
                  <td className='px-6 py-4 border-b border-gray-300 text-xs md:text-sm'>{profile.name}</td>
                  <td className='px-6 py-4 border-b border-gray-300 text-xs md:text-sm'>{profile.email}</td>
                  <td className='px-6 py-4 border-b border-gray-300 text-xs md:text-sm'>{profile.age || 'N/A'}</td>
                  <td className='px-6 py-4 border-b border-gray-300 text-xs md:text-sm'>
                    <button onClick={() => openModal(profile)}>
                      <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-pencil-square'>
                        <path d='M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z' />
                        <path fillRule='evenodd' d='M1 13.5A1.5 1.5 0 0 0 2.5 15h11a.5.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z' />
                      </svg>
                    </button>
                    <button onClick={() => handleDeleteConfirmation(profile.id, profile.name)} className='ml-5'>
                      <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='#Ff0000' className='bi bi-trash' viewBox='0 0 16 16'>
                        <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z' />
                        <path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z' />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      {isModalOpen && modalProfile && (
        <UserModal
          user={modalProfile}
          isNewUser={isNewProfile}
          isChanged={isChanged}
          error={error} // Pass the error to the modal
          onClose={closeModal}
          onSave={saveProfile}
          onChange={handleInputChange}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.id !== null && (
        <dialog id='user_modal' className='modal modal-open'>
          <div className='modal-box w-full sm:w-[50%] transition-all duration-300 ease-in-out bg-[#F7F7F7] rounded-[8px]'>
            <h3 className='text-3xl mt-2 mb-4'>Confirm Deletion</h3>
            <p>Are you sure you want to delete {deleteConfirmation.name}?</p>
            <div className='modal-action'>
              <button onClick={() => setDeleteConfirmation({ id: null, name: '' })} className='btn'>
                Cancel
              </button>
              <button onClick={deleteProfile} className='btn btn-error'>
                Delete
              </button>
            </div>
          </div>
          <form method='dialog' className='modal-backdrop' onClick={() => setDeleteConfirmation({ id: null, name: '' })}>
            <button>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default ProfileTable;
