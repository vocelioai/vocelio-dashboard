// Real-time data hook for Call Center Dashboard
import { useState, useEffect, useCallback, useRef } from 'react';
import callCenterApiService from '../services/CallCenterApiService';

export const useRealTimeData = (options = {}) => {
  const {
    updateInterval = 5000, // 5 seconds
    enableMetrics = true,
    enableActiveCalls = true,
    enableInboundQueue = true,
    autoStart = true
  } = options;

  // State management
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  
  // Real-time data state
  const [metrics, setMetrics] = useState({
    activeCalls: 0,
    queuedCalls: 0,
    avgWaitTime: '0:00',
    successRate: 0,
    totalCallsToday: 0,
    inboundCalls: 0,
    outboundCalls: 0,
    transferRate: 0
  });
  
  const [activeCalls, setActiveCalls] = useState([]);
  const [inboundQueue, setInboundQueue] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  
  // Analytics data
  const [analyticsData, setAnalyticsData] = useState({
    callVolume: [],
    callTypes: [],
    agentPerformance: [],
    transferMetrics: {}
  });

  // Refs for cleanup
  const updateIntervalRef = useRef(null);
  const isActiveRef = useRef(true);

  // Error handling
  const handleError = useCallback((error, context = 'unknown') => {
    console.error(`Real-time data error (${context}):`, error);
    setError({ message: error.message, context, timestamp: new Date() });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Update real-time metrics
  const updateMetrics = useCallback(async () => {
    if (!isActiveRef.current) return;
    
    try {
      const result = await callCenterApiService.getRealtimeMetrics();
      
      if (result.success && result.data) {
        setMetrics(prevMetrics => ({
          ...prevMetrics,
          ...result.data
        }));
        setError(null);
      }
    } catch (error) {
      handleError(error, 'metrics');
    }
  }, [handleError]);

  // Update active calls
  const updateActiveCalls = useCallback(async () => {
    if (!isActiveRef.current) return;
    
    try {
      const result = await callCenterApiService.getActiveCalls();
      
      if (result.success && result.data) {
        setActiveCalls(result.data);
        setError(null);
      }
    } catch (error) {
      handleError(error, 'active-calls');
    }
  }, [handleError]);

  // Update inbound queue
  const updateInboundQueue = useCallback(async () => {
    if (!isActiveRef.current) return;
    
    try {
      const result = await callCenterApiService.getInboundQueue();
      
      if (result.success && result.data) {
        setInboundQueue(result.data);
        setError(null);
      }
    } catch (error) {
      handleError(error, 'inbound-queue');
    }
  }, [handleError]);

  // Update all data
  const updateAllData = useCallback(async () => {
    if (!isActiveRef.current) return;

    setIsConnected(false);
    
    try {
      const promises = [];
      
      if (enableMetrics) promises.push(updateMetrics());
      if (enableActiveCalls) promises.push(updateActiveCalls());
      if (enableInboundQueue) promises.push(updateInboundQueue());

      await Promise.allSettled(promises);
      
      setLastUpdated(new Date());
      setIsConnected(true);
    } catch (error) {
      handleError(error, 'update-all');
      setIsConnected(false);
    }
  }, [enableMetrics, enableActiveCalls, enableInboundQueue, updateMetrics, updateActiveCalls, updateInboundQueue, handleError]);

  // Load analytics data
  const loadAnalyticsData = useCallback(async (dateRange = '7') => {
    try {
      const [callMetrics, agentPerf, callTypes, transferMetrics] = await Promise.allSettled([
        callCenterApiService.getCallMetrics(dateRange),
        callCenterApiService.getAgentPerformance(dateRange),
        callCenterApiService.getCallTypeDistribution(dateRange),
        callCenterApiService.getTransferMetrics(dateRange)
      ]);

      setAnalyticsData({
        callVolume: callMetrics.status === 'fulfilled' && callMetrics.value.success ? 
          callMetrics.value.data : [],
        agentPerformance: agentPerf.status === 'fulfilled' && agentPerf.value.success ? 
          agentPerf.value.data : [],
        callTypes: callTypes.status === 'fulfilled' && callTypes.value.success ? 
          callTypes.value.data : [],
        transferMetrics: transferMetrics.status === 'fulfilled' && transferMetrics.value.success ? 
          transferMetrics.value.data : {}
      });
    } catch (error) {
      handleError(error, 'analytics');
    }
  }, [handleError]);

  // Load call history
  const loadCallHistory = useCallback(async (limit = 50) => {
    try {
      const result = await callCenterApiService.getCallHistory(limit);
      
      if (result.success && result.data) {
        setCallHistory(result.data);
      }
    } catch (error) {
      handleError(error, 'call-history');
    }
  }, [handleError]);

  // Start real-time updates
  const startUpdates = useCallback(() => {
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }

    // Initial update
    updateAllData();

    // Set up interval
    updateIntervalRef.current = setInterval(updateAllData, updateInterval);
  }, [updateAllData, updateInterval]);

  // Stop real-time updates
  const stopUpdates = useCallback(() => {
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }
    setIsConnected(false);
  }, []);

  // Manual refresh
  const refresh = useCallback(async () => {
    await updateAllData();
  }, [updateAllData]);

  // Effect for auto-start
  useEffect(() => {
    isActiveRef.current = true;
    
    if (autoStart) {
      startUpdates();
    }

    return () => {
      isActiveRef.current = false;
      stopUpdates();
    };
  }, [autoStart, startUpdates, stopUpdates]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isActiveRef.current = false;
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, []);

  return {
    // Connection status
    isConnected,
    lastUpdated,
    error,
    clearError,

    // Real-time data
    metrics,
    activeCalls,
    inboundQueue,
    callHistory,
    analyticsData,

    // Data management
    refresh,
    startUpdates,
    stopUpdates,
    loadAnalyticsData,
    loadCallHistory,

    // Helper functions
    updateMetrics,
    updateActiveCalls,
    updateInboundQueue
  };
};

// Hook for managing contacts
export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadContacts = useCallback(async (search = '', filter = 'all') => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await callCenterApiService.getContacts(search, filter);
      
      if (result.success && result.data) {
        setContacts(result.data);
      } else {
        setError('Failed to load contacts');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load contacts on mount
  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const createContact = useCallback(async (contactData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await callCenterApiService.createContact(contactData);
      
      if (result.success) {
        // Reload contacts to get updated list
        await loadContacts();
        return { success: true, data: result.data };
      } else {
        setError('Failed to create contact');
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [loadContacts]);

  const updateContact = useCallback(async (contactId, contactData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await callCenterApiService.updateContact(contactId, contactData);
      
      if (result.success) {
        // Update local state
        setContacts(prev => prev.map(contact => 
          contact.id === contactId ? { ...contact, ...contactData } : contact
        ));
        return { success: true, data: result.data };
      } else {
        setError('Failed to update contact');
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteContact = useCallback(async (contactId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await callCenterApiService.deleteContact(contactId);
      
      if (result.success) {
        // Remove from local state
        setContacts(prev => prev.filter(contact => contact.id !== contactId));
        return { success: true };
      } else {
        setError('Failed to delete contact');
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    contacts,
    loading,
    error,
    loadContacts,
    createContact,
    updateContact,
    deleteContact,
    refetch: loadContacts // Add refetch alias for loadContacts
  };
};

export default useRealTimeData;
