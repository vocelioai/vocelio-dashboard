import React, { useState, useEffect } from 'react';

const TwilioDebugger = () => {
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const checkTwilioConfig = () => {
      const info = {
        accountSid: process.env.REACT_APP_TWILIO_ACCOUNT_SID,
        hasAuthToken: !!process.env.REACT_APP_TWILIO_AUTH_TOKEN,
        apiUrl: process.env.REACT_APP_API_URL,
        hasRailwayToken: !!process.env.REACT_APP_AUTH_TOKEN,
        timestamp: new Date().toISOString(),
        credentials: {
          isFullyConfigured: !!(process.env.REACT_APP_TWILIO_ACCOUNT_SID && process.env.REACT_APP_TWILIO_AUTH_TOKEN),
          hasBackendAccess: !!(process.env.REACT_APP_API_URL),
        }
      };
      setDebugInfo(info);
    };

    checkTwilioConfig();
  }, []);

  if (!debugInfo) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h4 className="font-bold mb-2">🔍 Twilio Debug Info</h4>
      <div className="space-y-1">
        <div>Account SID: {debugInfo.accountSid ? `${debugInfo.accountSid.substring(0, 10)}...` : '❌ Missing'}</div>
        <div>Auth Token: {debugInfo.hasAuthToken ? '✅ Present' : '❌ Missing'}</div>
        <div>Backend URL: {debugInfo.apiUrl || '❌ Missing'}</div>
        <div>Railway Token: {debugInfo.hasRailwayToken ? '✅ Present' : '❌ Missing'}</div>
        <div>Fully Configured: {debugInfo.credentials.isFullyConfigured ? '✅ Yes' : '❌ No'}</div>
        <div>Backend Access: {debugInfo.credentials.hasBackendAccess ? '✅ Yes' : '❌ No'}</div>
        <div className="text-gray-400 mt-2">{debugInfo.timestamp.substring(11, 19)}</div>
      </div>
    </div>
  );
};

export default TwilioDebugger;
