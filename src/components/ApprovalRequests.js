import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ApprovalRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPendingUsers = async () => {
            try {
                const response = await api.get('/users/pending');
                setRequests(response.data);
            } catch (error) {
                console.error("Error fetching requests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPendingUsers();
    }, []);

    const handleApproval = async (userId, action) => {
        try {
            await api.patch(`/users/${userId}/${action}`);
            setRequests(requests.filter(req => req._id !== userId));
        } catch (error) {
            console.error("Approval error:", error);
        }
    };

    if (loading) return <div>Chargement des demandes...</div>;

    return (
        <div className="approval-requests">
            <h2>Demandes d'Approvation ({requests.length})</h2>
            
            {requests.length === 0 ? (
                <p>Aucune demande en attente</p>
            ) : (
                <div className="request-list">
                    {requests.map(request => (
                        <div key={request._id} className="request-card">
                            <div className="request-info">
                                <h3>{request.name}</h3>
                                <p>{request.email}</p>
                                <p>Rôle demandé: {request.role}</p>
                            </div>
                            <div className="request-actions">
                                <button 
                                    className="btn-approve"
                                    onClick={() => handleApproval(request._id, 'approve')}
                                >
                                    Accepter
                                </button>
                                <button 
                                    className="btn-reject"
                                    onClick={() => handleApproval(request._id, 'reject')}
                                >
                                    Rejeter
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApprovalRequests;