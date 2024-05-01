import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;





  useEffect(() => {
    if (email) {
      axios.get(`http://localhost:8081/getClasses?email=${encodeURIComponent(email)}`)
        .then(res => {
          setClasses(res.data);
        })
        .catch(err => {
          console.error("Failed to fetch classes:", err);
        });
    }
  }, [email]);

  const handleClassClick = (classTitle) => {
    navigate('/class', { state: { title: classTitle } });
  };

  if (!email) {
    return <div className="bg-primary text-white vh-100 d-flex justify-content-center align-items-center"><p>Please log in to view classes.</p></div>;
  }

  if (!classes.length) {
    return <div className="bg-primary text-white vh-100 d-flex justify-content-center align-items-center"><p>No classes available or still loading...</p></div>;
  }

  return (
    <div className="container py-5">
      <h2 className="text-white mb-4">My Classes</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {classes.map(cls => (
          <div key={cls.class_id} className="col" onClick={() => handleClassClick(cls.title)}>
            <div className="card h-100" style={{ cursor: 'pointer' }}>
              <div className="card-body">
                <h5 className="card-title">{cls.title}</h5>
                <p className="card-text">{cls.description || "No description available."}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClassesPage;
