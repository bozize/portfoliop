import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FreelancerProfile = () => {
  const { id } = useParams();
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFreelancerProfile = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/freelancers/${id}/`);
        setFreelancer(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch freelancer profile');
        setLoading(false);
      }
    };

    fetchFreelancerProfile();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!freelancer) return <div>No freelancer found</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{freelancer.user.username} Profile</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Bio</h2>
        <p>{freelancer.bio}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {freelancer.skills.map(skill => (
            <span key={skill.id} className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
              {skill.name}
            </span>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Job Categories</h2>
        <div className="flex flex-wrap gap-2">
          {freelancer.job_categories.map(category => (
            <span key={category.id} className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
              {category.name}
            </span>
          ))}
        </div>
      </div>
      {/* Add more sections as needed, such as portfolio, reviews, etc. */}
    </div>
  );
};

export default FreelancerProfile;
