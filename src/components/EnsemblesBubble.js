import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EnsemblesBubble.css';

const EnsemblesBubble = ({ ensembles }) => {
    const [selectedEnsemble, setSelectedEnsemble] = useState(null);
    const [isCenter, setIsCenter] = useState(false);
    const navigate = useNavigate();

    const createSlug = (text) => {
        return text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleSubClick = (ensemble, subEnsemble) => {
        const ensembleSlug = createSlug(ensemble);
        const subSlug = createSlug(subEnsemble);
        navigate(`/content/${ensembleSlug}/${subSlug}`);
    };

    const handleBubbleClick = (ensembleName) => {
        if (selectedEnsemble === ensembleName) {
            setSelectedEnsemble(null);
            setIsCenter(false);
        } else {
            setSelectedEnsemble(ensembleName);
            setIsCenter(true);
        }
    };

    // Positionnement des bulles autour du cercle central
    const getBubblePosition = (index, total) => {
        const radius = 200; // Rayon du cercle
        const angle = (index * (2 * Math.PI / total)) - (Math.PI / 2); // Décalage pour commencer en haut
        return {
            left: `calc(50% + ${radius * Math.cos(angle)}px)`,
            top: `calc(50% + ${radius * Math.sin(angle)}px)`,
        };
    };

    return (
        <div className="bubble-container">
            {/* Cercle central qui affiche les sous-ensembles */}
            {selectedEnsemble && (
                <div className={`center-bubble ${isCenter ? 'active' : ''}`}>
                    <h3>{selectedEnsemble}</h3>
                    <div className="sub-ensembles">
                        {ensembles[selectedEnsemble].map((sub) => (
                            <div 
                                key={sub} 
                                className="sub-ensemble"
                                onClick={() => handleSubClick(selectedEnsemble, sub)}
                            >
                                {sub}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Bulles périphériques */}
            {Object.entries(ensembles).map(([ensembleName], index) => (
                <div 
                    key={ensembleName}
                    className={`bubble ${selectedEnsemble === ensembleName ? 'selected' : ''}`}
                    style={getBubblePosition(index, Object.keys(ensembles).length)}
                    onClick={() => handleBubbleClick(ensembleName)}
                    onMouseEnter={(e) => e.currentTarget.classList.add('hovered')}
                    onMouseLeave={(e) => e.currentTarget.classList.remove('hovered')}
                >
                    <div className="bubble-label">{ensembleName}</div>
                </div>
            ))}
        </div>
    );
};

export default EnsemblesBubble;