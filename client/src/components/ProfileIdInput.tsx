import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

/**
 * ProfileIdInput Component: Allows setting of the current user's profile ID manually. This component comes in handy in
 * scenarios where the profile ID needs to be switched frequently within the UI, such as testing different user profiles.
 */
const ProfileIdInput: React.FC = () => {
    const { profileId, setProfileId } = useUser();
    const [input, setInput] = useState(profileId?.toString() || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };
    

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const id = parseInt(input, 10);
        console.log("Attempting to set profile ID:", id); 
        if (!isNaN(id) && id > 0) {
            setProfileId(id);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="number"
                value={input}
                onChange={handleChange}
                placeholder="Enter Profile ID"
            />
            <button type="submit">Set Profile ID</button>
        </form>
    );
};

export default ProfileIdInput;
