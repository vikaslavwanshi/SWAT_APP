// import React, { useState, useEffect } from 'react';
// import MyNavbar from './component/navbar';
// import ProfileCover from './component/cover';
// import LogDisplay from './component/LogDisplay'; // Assuming you have this
// import 'bootstrap/dist/css/bootstrap.min.css';

// const App = () => {
//   const [isRunning, setIsRunning] = useState(false); // Track button toggle
//   const [logs, setLogs] = useState(''); // To hold the logs data
//   const [error, setError] = useState(null); // To capture any errors

//   const handleToggle = async () => {
//     setIsRunning((prevState) => !prevState); // Toggle button state
  
//     const formData = new FormData();
//     const datasetFile = new Blob(["Your dataset contents here"], { type: 'text/csv' });
//     formData.append('dataset_file', datasetFile, 'modified_SWaT_Dataset.csv'); // Ensure to append the correct dataset file
  
//     try {
//       // API call to backend to trigger Mininet script
//       const response = await fetch('http://localhost:8001/simulate_attack', {
//         method: 'POST',
//         body: formData, // Send FormData object
//       });
  
//       if (response.ok) {
//         const data = await response.json();
//         setLogs((prevLogs) => prevLogs + '\n' + data.message); // Append new log
//       } else {
//         setError('Failed to trigger the attack simulation.');
//       }
//     } catch (error) {
//       setError('Error occurred while connecting to backend.');
//       console.error(error);
//     }
//   };

//   // Fetch logs periodically
//   useEffect(() => {
//     const intervalId = setInterval(async () => {
//       try {
//         const response = await fetch('http://localhost:8001/logs'); // API to get logs
//         const data = await response.json(); // Expecting JSON response
//         setLogs(data.logs.join('\n')); // Combine logs with newlines for better display
//       } catch (error) {
//         setError('Error fetching logs.');
//         console.error(error);
//       }
//     }, 10000); // Fetch logs every 120 seconds

//     return () => clearInterval(intervalId); // Cleanup on component unmount
//   }, []);

//   return (
//     <div>
//       <MyNavbar />
//       <ProfileCover />
//       <div className="container">
//         <h1>Mininet Traffic Simulation</h1>
//         <button
//           onClick={handleToggle}
//           className={`btn ${isRunning ? 'btn-success' : 'btn-primary'}`}
//         >
//           {isRunning ? 'Running...' : 'Start Simulation'}
//         </button>

//         {error && <div className="alert alert-danger mt-3">{error}</div>}

//         <LogDisplay logs={logs} />
//       </div>
//     </div>
//   );
// };

// export default App;


import React, { useState, useEffect } from 'react';
import MyNavbar from './component/navbar';
import ProfileCover from './component/cover';
import LogDisplay from './component/LogDisplay'; // Assuming you have this
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [logs, setLogs] = useState(''); // To hold the logs data
  const [error, setError] = useState(null); // To capture any errors

  const handleAttack = async (attackType) => {
    const formData = new FormData();
    const datasetFile = new Blob(["Your dataset contents here"], { type: 'text/csv' });

    // Append dataset file only if SQL Injection attack is selected
    if (attackType === "SQL Injection") {
      formData.append('dataset_file', datasetFile, 'modified_SWaT_Dataset.csv');
    }
    formData.append('attack_type', attackType);
    formData.append('target_host', 'FIT101'); // Specify your target host

    try {
      // API call to backend to trigger the selected attack
      const response = await fetch('http://localhost:8001/simulate_attack', {
        method: 'POST',
        body: formData, // Send FormData object
      });

      if (response.ok) {
        const data = await response.json();
        setLogs((prevLogs) => prevLogs + '\n' + data.message); // Append new log
      } else {
        setError('Failed to trigger the attack simulation.');
      }
    } catch (error) {
      setError('Error occurred while connecting to backend.');
      console.error(error);
    }
  };

  // Fetch logs periodically
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:8001/logs'); // API to get logs
        const data = await response.json(); // Expecting JSON response
        setLogs(data.logs.join('\n')); // Combine logs with newlines for better display
      } catch (error) {
        setError('Error fetching logs.');
        console.error(error);
      }
    }, 10000); // Fetch logs every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  return (
    <div>
      <MyNavbar />
      <ProfileCover />
      <div className="container">
        <h1>Mininet Traffic Simulation</h1>
        
        <div className="mb-3">
          <button
            onClick={() => handleAttack("SQL Injection")}
            className="btn btn-danger"
          >
            Trigger SQL Injection
          </button>
          <button
            onClick={() => handleAttack("DoS")}
            className="btn btn-warning"
          >
            Trigger DoS Attack
          </button>
          <button
            onClick={() => handleAttack("MITM")}
            className="btn btn-info"
          >
            Trigger MITM Attack
          </button>
        </div>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <LogDisplay logs={logs} />
      </div>
    </div>
  );
};

export default App;