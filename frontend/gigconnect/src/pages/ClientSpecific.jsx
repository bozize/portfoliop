import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchClientDataThunk } from '../redux/clientSlice';

const ClientPage = () => {
  const dispatch = useDispatch();
  const { clientId } = useParams();
  const { company_name, website, status, error } = useSelector((state) => state.client);

  useEffect(() => {
    dispatch(fetchClientDataThunk(clientId));
  }, [dispatch, clientId]);

  if (status === 'loading') {
    return <p>Loading client data...</p>;
  }

  if (status === 'failed') {
    return <p>Error: {error?.message}</p>;
  }

  return (
    <div>
      <h1>Client Page for {company_name || 'N/A'}</h1>
      <p>Website: {website || 'N/A'}</p>
      {/* Display other client-specific information here */}
    </div>
  );
};

export default ClientPage;

