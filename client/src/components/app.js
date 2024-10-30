import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDate } from '../utils/dateUtils';  // Import the date formatting utility

function CorpusList() {
  const [data, setData] = useState([]);
  const [fileContent, setFileContent] = useState(''); // State to hold the file content
  const [showModal, setShowModal] = useState(false);  // State to control the modal visibility
  const [selectedFile, setSelectedFile] = useState(''); // State to store the selected file path

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/data`)
      .then((response) => {
        setData(response.data);  // Set the full data response to state
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const hiddenColumns = ['_id', 'parentId', 'parentType'];  // Define the columns to hide

  // Function to handle file click and fetch file content
  const handleFileClick = (filePath) => {
    setSelectedFile(filePath);
    axios.get(`${process.env.REACT_APP_API_URL}/api/file?path=${encodeURIComponent(filePath)}`)
      .then((response) => {
        setFileContent(response.data); // Set the file content from the server response
        setShowModal(true);  // Show the modal after file content is loaded
      })
      .catch((error) => {
        console.error('Error fetching file content:', error);
      });
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setFileContent('');
  };

  return (
    <div>
      <h2>Deep Mountain Corpus Data:</h2>

      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            {data.length > 0 && Object.keys(data[0])
              .filter(key => !hiddenColumns.includes(key))  // Filter out the hidden columns
              .map((key) => (
                <th scope="row" key={key}>{key}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {Object.entries(item)
                .filter(([key]) => !hiddenColumns.includes(key))  // Filter out the hidden columns
                .map(([key, value], idx) => (
                  <td key={idx}>
                    {/* If the key is "update" or "timestamp", format the value */}
                    {key === 'update' || key === 'timestamp' ? formatDate(value) :
                    key === 'file' ? (
                      <button onClick={() => handleFileClick(value)} className="btn btn-link">
                        View File
                      </button>
                    ) : value}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for displaying file content */}
      {showModal && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">File Content - {selectedFile}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <pre>{fileContent}</pre>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CorpusList;
