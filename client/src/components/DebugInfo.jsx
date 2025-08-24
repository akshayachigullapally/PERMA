import React from 'react';

const DebugInfo = () => {
  const envVars = {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing',
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✓ Set' : '✗ Missing',
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Missing',
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID ? '✓ Set' : '✗ Missing',
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h4 className="font-bold mb-2">Debug Info</h4>
      {Object.entries(envVars).map(([key, value]) => (
        <div key={key} className="flex justify-between mb-1">
          <span className="truncate mr-2">{key}:</span>
          <span className={value.includes('✗') ? 'text-red-400' : 'text-green-400'}>
            {value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default DebugInfo;
