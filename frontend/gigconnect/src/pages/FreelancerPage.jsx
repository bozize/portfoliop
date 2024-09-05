import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateFreelancerProfileThunk, fetchSkillsThunk, fetchFreelancerDataThunk } from '../redux/freelancerSlice';

const FreelancerProfileForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { availableSkills = [], profile = {}, status, profileComplete } = useSelector((state) => state.freelancer);

    const [formData, setFormData] = useState({
        bio: profile.bio || '',
        skills: profile.skills?.map(skill => skill.id) || []
    });

    useEffect(() => {
        dispatch(fetchSkillsThunk());
        dispatch(fetchFreelancerDataThunk());
    }, [dispatch]);

    useEffect(() => {
        if (status === 'succeeded' && profileComplete) {
            navigate('/freelancer-dashboard');
        }
    }, [status, profileComplete, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(updateFreelancerProfileThunk(formData));
        if (updateFreelancerProfileThunk.fulfilled.match(resultAction)) {
            navigate('/freelancer-dashboard');
        } else {
            console.error('Profile update failed:', resultAction.payload);
        }
    };

    const handleSkillChange = (e) => {
        const value = Array.from(e.target.selectedOptions, option => parseInt(option.value, 10));
        setFormData((prevData) => ({
            ...prevData,
            skills: value
        }));
    };

    if (profileComplete) {
        return null; // Don't render the form if profile is complete
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Bio:
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Bio"
                />
            </label>
            <label>
                Skills:
                <select multiple onChange={handleSkillChange} value={formData.skills}>
                    {availableSkills.map(skill => (
                        <option key={skill.id} value={skill.id}>
                            {skill.name}
                        </option>
                    ))}
                </select>
            </label>
            <button type="submit">Update Profile</button>
        </form>
    );
};

export default FreelancerProfileForm;
