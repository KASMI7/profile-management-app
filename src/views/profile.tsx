import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from '../components/Header';
import UserModal from '../components/UserModal';
import { fetchProfiles, createProfile, updateProfile, deleteProfile } from '../services'; // Import necessary service functions
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
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

  const navigate = useNavigate();

  // Fetch profile list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProfiles(); // Fetch profiles using the service function
        setProfileList(data);
        if (data.length === 0) {
          navigate('/profile-form'); // Redirect if no profiles are found
        }
      } catch (error) {
        setError('Error fetching profiles');
      }
    };

    fetchData();
  }, [navigate]);

  // Memoize openModal to avoid unnecessary re-renders
  const openModal = useCallback((profile: Profile | null = null) => {
    if (profile) {
      setModalProfile({ ...profile });
      setIsNewProfile(false);
    } else {
      setModalProfile({ id: String(Date.now()), name: '', email: '', age: undefined });
      setIsNewProfile(true);
    }
    setIsModalOpen(true);
    setIsChanged(false);
    setError(null);
  }, []);

  // Memoize closeModal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setError(null);
  }, []);

  // Memoize handleInputChange to avoid unnecessary re-renders
  const handleInputChange = useCallback((field: keyof Profile, value: string | number) => {
    if (modalProfile) {
      const updatedProfile = { ...modalProfile, [field]: value };
      setModalProfile(updatedProfile);
      setIsChanged(true);
    }
  }, [modalProfile]);

  const handleDeleteConfirmation = (id: string | null, name: string) => {
    setDeleteConfirmation({ id, name });
  };
  const saveProfileHandler = useCallback(async () => {
    if (modalProfile) {
      if (!modalProfile.name.trim() || !modalProfile.email.trim()) {
        setError('Please fill in all required fields (Name and Email).');
        return;
      }

      const duplicateNameProfile = profileList.find((profile) => profile.name === modalProfile.name && profile.id !== modalProfile.id);
      if (duplicateNameProfile) {
        setError('This name is already used by another profile. Please use a different name.');
        return;
      }

      try {
        let savedProfile: Profile; // Explicitly define the type of savedProfile

        if (isNewProfile) {
          savedProfile = await createProfile(modalProfile); // Use createProfile for new profiles
          setProfileList([...profileList, savedProfile]);
        } else {
          savedProfile = await updateProfile(modalProfile); // Use updateProfile for existing profiles
          const updatedProfiles = profileList.map((profile) => (profile.id === modalProfile.id ? savedProfile : profile));
          setProfileList(updatedProfiles);
        }

        closeModal();
      } catch (error) {
        setError('Error saving profile');
      }
    }
  }, [modalProfile, isNewProfile, profileList, closeModal]);

  const deleteProfileHandler = useCallback(async () => {
    if (deleteConfirmation.id !== null) {
      try {
        await deleteProfile(deleteConfirmation.id); // Use deleteProfile service
        const updatedProfileList = profileList.filter((profile) => profile.id !== deleteConfirmation.id);
        setProfileList(updatedProfileList);
        setDeleteConfirmation({ id: null, name: '' });

        if (updatedProfileList.length === 0) {
          navigate('/profile-form');
        }
      } catch (error) {
        setError('Error deleting profile');
      }
    }
  }, [deleteConfirmation, profileList, navigate]);

  // Use useMemo to avoid recalculating lastUser unnecessarily
  const lastUser = useMemo(() => (profileList.length > 0 ? profileList[profileList.length - 1] : null), [profileList]);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Header lastUser={lastUser} />
      <div className='min-h-[90vh] flex flex-col bg-gray-100 px-6'>
        <div className='w-full flex justify-between items-center mt-10 mb-6'>
          <h1 className='text-[#F56124] font-[500]' style={{ fontSize: 'clamp(15px, 4vw, 30px)' }}>
            Manage Profiles
          </h1>
          <button className='btn border-none text-white' style={{ background: 'linear-gradient(to right, #f78312 0, #f44336 100%)' }} onClick={() => openModal()}>
            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-plus-circle-fill mr-2'>
              <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z' />
            </svg>
            Add Profile
          </button>
        </div>

        {/* Profile Table */}
        <div className='max-h-[70vh] overflow-auto bg-white shadow-lg rounded-lg overflow-x-auto'>
          <table className='min-w-full leading-normal relative'>
            <thead className='text-white sticky top-0' style={{ background: 'linear-gradient(to right, #f78312 0, #f44336 100%)' }}>
              <tr>
                <th className='px-5 py-3 text-left text-sm font-semibold uppercase tracking-wider'>Name</th>
                <th className='px-5 py-3 text-left text-sm font-semibold uppercase tracking-wider'>Email</th>
                <th className='px-5 py-3 text-left text-sm font-semibold uppercase tracking-wider'>Age</th>
                <th className='px-5 py-3 text-left text-sm font-semibold uppercase tracking-wider'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-white'>
              {profileList.map((profile, index) => (
                <tr key={profile.id} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors duration-300`}>
                  <td className='px-5 py-5 text-sm text-gray-900'>
                    <div className='flex items-center'>
                      <div className='ml-3'>
                        <p className='text-gray-900 whitespace-no-wrap'>{profile.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className='px-5 py-5 text-sm'>
                    <p className='text-gray-500 whitespace-no-wrap'>{profile.email}</p>
                  </td>
                  <td className='px-5 py-5 text-sm'>
                    <p className='text-gray-500 whitespace-no-wrap'>{profile.age || 'N/A'}</p>
                  </td>
                  <td className='px-5 py-5 text-sm space-x-2'>
                    <button onClick={() => openModal(profile)} className='inline-block text-blue-500 hover:text-blue-700 transition-colors duration-300 mr-5'>
                      <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-pencil-square'>
                        <path d='M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z' />
                        <path fillRule='evenodd' d='M1 13.5A1.5 1.5 0 0 0 2.5 15h11a.5.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z' />
                      </svg>
                    </button>
                    <button onClick={() => handleDeleteConfirmation(profile.id, profile.name)} className='inline-block text-red-500 hover:text-red-700 transition-colors duration-300'>
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
          onSave={saveProfileHandler}
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
              <button onClick={deleteProfileHandler} className='btn btn-error'>
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
