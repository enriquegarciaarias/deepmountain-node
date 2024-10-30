import React from "react";
import ReactDOM from "react-dom/client"; // Note the new import for React 18
import 'bootstrap/dist/css/bootstrap.min.css';
import CorpusList from './components/app';


// Get the root element
const rootElement = document.getElementById("root");

// Create a root and render the component using createRoot
const root = ReactDOM.createRoot(rootElement);

root.render(<CorpusList />);