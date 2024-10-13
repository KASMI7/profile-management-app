import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;
const API_URL = `${BASE_URL}/profile-list`;

// Profile interface for better type safety
interface Profile {
  id: string;
  name: string;
  email: string;
  age?: number;
}

// Fetch all profiles (GET)
export const fetchProfiles = async (): Promise<Profile[]> => {
  try {
    const response = await axios.get<Profile[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching profiles:', error);
    throw new Error('Error fetching profiles');
  }
};

// Create a new profile (POST)
export const createProfile = async (profile: Profile): Promise<Profile> => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.post<Profile>(API_URL, JSON.stringify(profile), config);
    return response.data;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw new Error('Error creating profile');
  }
};

// Update an existing profile (PUT)
export const updateProfile = async (profile: Profile): Promise<Profile> => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.put<Profile>(`${API_URL}/${profile.id}`, JSON.stringify(profile), config);
    return response.data;
  } catch (error) {
    console.error(`Error updating profile with ID ${profile.id}:`, error);
    throw new Error(`Error updating profile with ID ${profile.id}`);
  }
};

// Delete a profile (DELETE)
export const deleteProfile = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting profile with ID ${id}:`, error);
    throw new Error(`Error deleting profile with ID ${id}`);
  }
};
