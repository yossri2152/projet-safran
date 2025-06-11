import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import EnsemblesBubble from '../components/EnsemblesBubble';
import api from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [ensembles, setEnsembles] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // D'abord essayer de récupérer depuis l'API
                const response = await api.get('/ensembles');
                if (response.data && Object.keys(response.data).length > 0) {
                    setEnsembles(response.data);
                } else {
                    // Si l'API ne retourne rien, utiliser les données locales
                    setEnsembles({
                        "Congé et Vacance": ["Congés", "POINTAGE", "TELETRAVAIL TT"],
                        "QRQC": ["Fiche Bleue", "Fiche Jaune", "TACHES"],
                        "INDUSTRIA - LISATION": [
                            "acronymes lexique",
                            "certif",
                            "convertion",
                            "convergence / Legacy",
                            "Découpe Tissu",
                            "ECR",
                            "Etiquette",
                            "Gabarit Carton",
                            "Impression 3D",
                            "MAKE OR BUY",
                            "MODE OPERATOIRE",
                            "OF INDUS",
                            "OF RETOUCHE",
                            "OUTILLAGE",
                            "RECHANGE",
                            "VALIDAION PLAN"
                        ],
                        "INFORMATIQUE": ["M3", "SMARTEAM"],
                        "PRODUCTION ET PLANIFICATION": ["PLANNING", "SORTIE DE STOCK"],
                        "METHODE": ["COLLE", "DEMANDE PROGRAMME DE COUPE"],
                        "QUALITE,COUT,  DELAI ET SECURITE": ["chiffrage", "ETQ", "FAI"],
                        "PROCEDURE ET INSTRUCTION": [
                            "INTERLOCUTEUR",
                            "NORME",
                            "PROCEDURES",
                            "RETEX INDUS HABILLAGE",
                            "SIEGE TECHNIQUE"
                        ],
                        "Deplacement et Transfert": ["Colis Tunisie", "Deplacement"],
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error("API error, using local data", err);
                // En cas d'erreur API, utiliser les données locales
                setEnsembles({
                        "Congé et Vacance": ["Congés", "POINTAGE", "TELETRAVAIL TT"],
                        "QRQC": ["Fiche Bleue", "Fiche Jaune", "TACHES"],
                        "INDUSTRIA - LISATION": [
                            "acronymes lexique",
                            "certif",
                            "convertion",
                            "convergence / Legacy",
                            "Découpe Tissu",
                            "ECR",
                            "Etiquette",
                            "Gabarit Carton",
                            "Impression 3D",
                            "MAKE OR BUY",
                            "MODE OPERATOIRE",
                            "OF INDUS",
                            "OF RETOUCHE",
                            "OUTILLAGE",
                            "RECHANGE",
                            "VALIDAION PLAN"
                        ],
                        "INFORMATIQUE": ["M3", "SMARTEAM"],
                        "PRODUCTION ET PLANIFICATION": ["PLANNING", "SORTIE DE STOCK"],
                        "METHODE": ["COLLE", "DEMANDE PROGRAMME DE COUPE"],
                        "QUALITE,COUT,  DELAI ET SECURITE": ["chiffrage", "ETQ", "FAI"],
                        "PROCEDURE ET INSTRUCTION": [
                            "INTERLOCUTEUR",
                            "NORME",
                            "PROCEDURES",
                            "RETEX INDUS HABILLAGE",
                            "SIEGE TECHNIQUE"
                        ],
                        "Deplacement et Transfert": ["Colis Tunisie", "Deplacement"],
                    });
                setError("Erreur de connexion au serveur - Affichage des données locales");
                setLoading(false);
            }
        };

        // Petit délai pour simuler le chargement (optionnel)
        const timer = setTimeout(() => {
            fetchData();
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (loading) return <div className="loading-spinner">Chargement...</div>;

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            {user && (
                <div className="alert alert-success">
                    Welcome, {user.name} ({user.role})
                </div>
            )}
            <div className="bubble-view-container">
                {ensembles && <EnsemblesBubble ensembles={ensembles} />}
            </div>
        </div>
    );
};

export default Dashboard;