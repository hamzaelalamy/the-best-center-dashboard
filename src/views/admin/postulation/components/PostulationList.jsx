import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from 'constants/config';

const API_BASE_URL = BASE_URL;
const ITEMS_PER_PAGE = 10;

const PostulationList = () => {
  const [postulations, setPostulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchPostulations();
  }, [currentPage]);

  const fetchPostulations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/application`, {
        params: {
          page: currentPage,
          limit: ITEMS_PER_PAGE
        }
      });
      console.log('Postulations fetched:', response.data);

      const fullResponse = await axios.get(`${API_BASE_URL}/application`);

      const postulationsData = response.data.applications || response.data;
      setPostulations(Array.isArray(postulationsData) ? postulationsData : []);

      const total = fullResponse.data.length;
      setTotalPages(Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)));

      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des postulations:', error);
      setError('Une erreur est survenue lors du chargement des postulations.');
      setLoading(false);
    }
  };

  const handleDeletePostulation = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/application/${id}`);
      fetchPostulations();
    } catch (error) {
      console.error('Erreur lors de la suppression de la postulation:', error);
      setError('Une erreur est survenue lors de la suppression de la postulation.');
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="card w-[70rem] p-4">
      <div className="flex items-center justify-between p-3 rounded-t-3xl">
        <div className="text-lg font-bold text-navy-700 dark:text-white">
          Liste des Postulations
        </div>
      </div>
      <div className="w-full px-4 overflow-x-scroll md:overflow-x-hidden">
        {postulations.length > 0 ? (
          <table className="w-full min-w-[500px] overflow-x-scroll">
            <thead>
              <tr>
                <th className="py-3 tracking-wide text-gray-600 uppercase text-start sm:text-xs lg:text-xs">Nom</th>
                <th className="py-3 tracking-wide text-gray-600 uppercase text-start sm:text-xs lg:text-xs">Prénom</th>
                <th className="py-3 tracking-wide text-gray-600 uppercase text-start sm:text-xs lg:text-xs">Email</th>
                <th className="py-3 tracking-wide text-gray-600 uppercase text-start sm:text-xs lg:text-xs">Telephone</th>
                <th className="py-3 tracking-wide text-gray-600 uppercase text-start sm:text-xs lg:text-xs">Offre</th>
                <th className="py-3 tracking-wide text-gray-600 uppercase text-start sm:text-xs lg:text-xs">CV</th>
                <th className="py-3 tracking-wide text-gray-600 uppercase text-start sm:text-xs lg:text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {postulations.map((postulation) => (
                <tr key={postulation._id}>
                  <td className="py-3 text-sm">{postulation.nom}</td>
                  <td className="py-3 text-sm">{postulation.prenom}</td>
                  <td className="py-3 text-sm">{postulation.email}</td>
                  <td className="py-3 text-sm">{postulation.phone}</td>
                  <td className="py-3 text-sm">{postulation.offre}</td>
                  <td className="py-3 text-sm">
                    <a href={postulation.cv} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Voir CV</a>
                  </td>
                  <td className="py-3 text-sm">
                    <button className="text-red-500" onClick={() => handleDeletePostulation(postulation._id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-4 text-center">Aucune postulation disponible</div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Précédent
          </button>
          <span className="px-4 py-2 text-sm font-medium text-gray-700">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 ml-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default PostulationList;