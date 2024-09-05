import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateClientProfileThunk, fetchClientDataThunk } from '../redux/clientSlice';
import { useNavigate } from 'react-router-dom';

const ClientProfileForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profileComplete, profile, status } = useSelector((state) => state.client);
  const [formData, setFormData] = useState({
    company_name: '',
    website: ''
  });

  useEffect(() => {
    dispatch(fetchClientDataThunk());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'succeeded') {
      if (profileComplete) {
        navigate('/client-dashboard');
      } else {
        setFormData({
          company_name: profile.company_name || '',
          website: profile.website || '',
        });
      }
    }
  }, [status, profileComplete, profile, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(updateClientProfileThunk(formData));
    if (updateClientProfileThunk.fulfilled.match(resultAction)) {
      navigate('/client-dashboard');
    } else {
      console.log('Profile update failed:', resultAction.payload);
    }
  };

  if (status === 'loading' || profileComplete) {
    return null; // Don't render anything if loading or profile is complete
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Company Name:
        <input
          type="text"
          name="company_name"
          value={formData.company_name}
          onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
          required
        />
      </label>
      <label>
        Website (optional):
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />
      </label>
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default ClientProfileForm;
