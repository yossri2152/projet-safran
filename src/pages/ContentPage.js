import React, { useState, useEffect } from 'react';

const ContentPage = () => {
  const [ensembles, setEnsembles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContent, setSelectedContent] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    // Simulation du chargement des données
    const loadData = () => {
      try {
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
          "QUALITE,COUT, DELAI ET SECURITE": ["chiffrage", "ETQ", "FAI"],
          "PROCEDURE ET INSTRUCTION": [
            "INTERLOCUTEUR",
            "NORME",
            "PROCEDURES",
            "RETEX INDUS HABILLAGE",
            "SIEGE TECHNIQUE"
          ],
          "Deplacement et Transfert": ["Colis Tunisie", "Deplacement"],
        });
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des données");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDocumentClick = async (documentName) => {
    setSelectedDocument(documentName);
    setSelectedContent('Chargement en cours...');
    
    try {
      const documentMap = {
        "Congés": "/documents/conges.html",
        "POINTAGE": "/documents/pointage.html",
        "TELETRAVAIL TT": "/documents/teletravail.html",
        // Ajoutez d'autres mappings ici
      };
  
      const filePath = documentMap[documentName] || `/documents/${documentName.toLowerCase().replace(/\s+/g, '-')}.html`;
      
      console.log("Tentative de chargement:", filePath); // Ajout pour débogage
      
      const response = await fetch(filePath);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const htmlContent = await response.text();
      setSelectedContent(htmlContent);
    } catch (err) {
      console.error('Erreur détaillée:', err);
      setSelectedContent(`
        <div class="p-4 bg-red-50 border border-red-200 rounded">
          <h3 class="text-red-600 font-medium">Erreur de chargement</h3>
          <p>Impossible de charger le document "${documentName}".</p>
          <p class="text-sm mt-2">${err.message}</p>
          <p class="text-xs mt-2">Vérifiez que le fichier existe à l'emplacement: public/documents/${documentName.toLowerCase().replace(/\s+/g, '-')}.html</p>
        </div>
      `);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded max-w-2xl mx-auto mt-8">
        <h2 className="text-red-600 font-bold mb-2">Erreur</h2>
        <p>{error}</p>
        <p className="mt-2 text-sm">Les données locales sont affichées.</p>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col md:flex-row">
      {/* Liste des ensembles et sous-ensembles */}
      <div className="w-full md:w-1/3 pr-0 md:pr-4 mb-4 md:mb-0 md:border-r">
        <h2 className="text-xl font-bold mb-4">Documents disponibles</h2>
        <div className="max-h-screen overflow-y-auto">
          {Object.entries(ensembles).map(([ensemble, sousEnsembles]) => (
            <div key={ensemble} className="mb-6">
              <h3 className="font-semibold text-lg mb-2">{ensemble}</h3>
              <ul className="pl-4">
                {sousEnsembles.map((sousEnsemble) => (
                  <li 
                    key={sousEnsemble} 
                    className={`py-2 px-3 mb-1 rounded cursor-pointer transition-colors ${
                      selectedDocument === sousEnsemble 
                        ? 'bg-blue-100 text-blue-800 font-medium' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleDocumentClick(sousEnsemble)}
                  >
                    {sousEnsemble}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Affichage du contenu du document */}
      <div className="w-full md:w-2/3 pl-0 md:pl-4">
        {selectedDocument ? (
          <>
            <div className="sticky top-0 bg-white py-4 z-10 border-b">
              <h2 className="text-xl font-bold">{selectedDocument}</h2>
            </div>
            <div 
              className="prose max-w-none mt-4 p-4 bg-white rounded-lg shadow-sm"
              dangerouslySetInnerHTML={{ __html: selectedContent }} 
            />
          </>
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-500 italic">
            Sélectionnez un document dans la liste pour afficher son contenu
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPage;