import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ResultsPage.css';

function ResultsPage() {
    const [attendanceData, setAttendanceData] = useState([]);
    const [statuses, setStatuses] = useState({});

    useEffect(() => {
        axios.get('http://localhost:8081/attendance')
            .then(response => {
                const data = response.data;
                const formattedData = Object.entries(data).map(([name, datetime]) => {
                    const [firstName, lastName] = name.split('-');
                    const [date, time] = datetime.split(' ');
                    return { firstName, lastName, date, time, name };
                });
                setAttendanceData(formattedData);
            })
            .catch(error => {
                console.error('Error fetching attendance data:', error);
            });
    }, []);

    const handleStatusChange = (name, event) => {
        setStatuses({
            ...statuses,
            [name]: event.target.value
        });
    };

    const getRowClass = (status) => {
        if (status === 'Late') {
            return 'table-warning';
        } else if (status === 'Absent') {
            return 'table-danger';
        } else {
            return '';
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Attendance Results</h1>
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th style={{ fontSize: '1.25rem' }}>First Name</th>
                        <th style={{ fontSize: '1.25rem' }}>Last Name</th>
                        <th style={{ fontSize: '1.25rem' }}>Date</th>
                        <th style={{ fontSize: '1.25rem' }}>Time</th>
                        <th style={{ fontSize: '1.25rem' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceData.map((entry, index) => (
                        <tr key={index} className={getRowClass(statuses[entry.name])}>
                            <td>{entry.firstName}</td>
                            <td>{entry.lastName}</td>
                            <td>{entry.date}</td>
                            <td>{entry.time}</td>
                            <td>
                                <select 
                                    className="form-select" 
                                    value={statuses[entry.name] || 'On Time'} 
                                    onChange={(e) => handleStatusChange(entry.name, e)}
                                >
                                    <option value="On Time">On Time</option>
                                    <option value="Late">Late</option>
                                    <option value="Absent">Absent</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ResultsPage;
