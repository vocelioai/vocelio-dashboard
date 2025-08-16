// Data Population Service for Vocelio.ai Dashboard
// Generates realistic test data for all services

class DataPopulationService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_GATEWAY || 'https://api.vocelio.ai';
    this.authToken = process.env.REACT_APP_AUTH_TOKEN || 'test-token';
  }

  // Generate realistic agent data
  generateAgentData() {
    const agentTypes = ['Sales', 'Support', 'Lead Qualification', 'Appointment Setting', 'Survey'];
    const personalities = ['Professional', 'Friendly', 'Energetic', 'Calm', 'Persuasive'];
    const voices = ['Rachel', 'Michael', 'Sarah', 'David', 'Emma', 'James'];
    
    return Array.from({ length: 25 }, (_, i) => ({
      id: `agent_${i + 1}`,
      name: `${agentTypes[i % agentTypes.length]} Agent ${i + 1}`,
      type: agentTypes[i % agentTypes.length].toLowerCase().replace(' ', '_'),
      personality: personalities[i % personalities.length],
      voice: voices[i % voices.length],
      status: Math.random() > 0.3 ? 'active' : 'inactive',
      performance: {
        totalCalls: Math.floor(Math.random() * 1000) + 100,
        successRate: (Math.random() * 30 + 70).toFixed(1), // 70-100%
        avgCallDuration: Math.floor(Math.random() * 300 + 120), // 2-7 minutes
        conversions: Math.floor(Math.random() * 50) + 10,
        revenue: Math.floor(Math.random() * 50000) + 5000
      },
      settings: {
        maxConcurrentCalls: Math.floor(Math.random() * 5) + 1,
        workingHours: {
          start: '09:00',
          end: '17:00',
          timezone: 'UTC'
        },
        fallbackBehavior: 'transfer_to_human',
        recordCalls: Math.random() > 0.5
      },
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }

  // Generate campaign data
  generateCampaignData() {
    const campaignTypes = ['Cold Outreach', 'Follow-up', 'Appointment Setting', 'Survey', 'Lead Nurturing'];
    const industries = ['Real Estate', 'Insurance', 'SaaS', 'E-commerce', 'Healthcare', 'Finance'];
    const statuses = ['active', 'paused', 'completed', 'draft'];
    
    return Array.from({ length: 15 }, (_, i) => ({
      id: `campaign_${i + 1}`,
      name: `${industries[i % industries.length]} ${campaignTypes[i % campaignTypes.length]} Q4 2025`,
      type: campaignTypes[i % campaignTypes.length].toLowerCase().replace(' ', '_'),
      industry: industries[i % industries.length],
      status: statuses[i % statuses.length],
      metrics: {
        totalContacts: Math.floor(Math.random() * 5000) + 500,
        contactsReached: Math.floor(Math.random() * 3000) + 200,
        appointments: Math.floor(Math.random() * 200) + 20,
        conversions: Math.floor(Math.random() * 50) + 5,
        revenue: Math.floor(Math.random() * 100000) + 10000,
        costPerLead: (Math.random() * 50 + 10).toFixed(2),
        roi: (Math.random() * 300 + 100).toFixed(1)
      },
      schedule: {
        startDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
        timezone: 'UTC',
        workingHours: ['09:00-17:00']
      },
      settings: {
        maxDailyContacts: Math.floor(Math.random() * 100) + 50,
        retryAttempts: Math.floor(Math.random() * 3) + 1,
        recordCalls: true,
        enableABTesting: Math.random() > 0.5
      }
    }));
  }

  // Generate call center data
  generateCallCenterData() {
    const callTypes = ['inbound', 'outbound'];
    const callStatuses = ['completed', 'abandoned', 'in_progress', 'queued'];
    const dispositions = ['sale', 'no_answer', 'not_interested', 'callback', 'dnc', 'wrong_number'];
    
    return {
      activeCalls: Array.from({ length: Math.floor(Math.random() * 10) + 2 }, (_, i) => ({
        id: `call_${Date.now()}_${i}`,
        phoneNumber: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        agentId: `agent_${Math.floor(Math.random() * 25) + 1}`,
        type: callTypes[Math.floor(Math.random() * callTypes.length)],
        status: 'in_progress',
        duration: Math.floor(Math.random() * 600) + 30, // 30 seconds to 10 minutes
        startTime: new Date(Date.now() - Math.random() * 600000).toISOString()
      })),
      
      recentCalls: Array.from({ length: 100 }, (_, i) => ({
        id: `call_${Date.now() - i * 60000}`,
        phoneNumber: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        agentId: `agent_${Math.floor(Math.random() * 25) + 1}`,
        type: callTypes[Math.floor(Math.random() * callTypes.length)],
        status: callStatuses[Math.floor(Math.random() * callStatuses.length)],
        disposition: dispositions[Math.floor(Math.random() * dispositions.length)],
        duration: Math.floor(Math.random() * 1800) + 15, // 15 seconds to 30 minutes
        startTime: new Date(Date.now() - (i + 1) * 60000).toISOString(),
        endTime: new Date(Date.now() - i * 60000).toISOString(),
        recording: Math.random() > 0.3 ? `https://recordings.vocelio.ai/call_${Date.now() - i * 60000}.mp3` : null
      })),

      metrics: {
        totalCallsToday: Math.floor(Math.random() * 500) + 100,
        averageWaitTime: Math.floor(Math.random() * 60) + 15, // 15-75 seconds
        serviceLevel: (Math.random() * 20 + 80).toFixed(1), // 80-100%
        abandonRate: (Math.random() * 10).toFixed(1), // 0-10%
        averageHandleTime: Math.floor(Math.random() * 300) + 180, // 3-8 minutes
        firstCallResolution: (Math.random() * 20 + 75).toFixed(1) // 75-95%
      }
    };
  }

  // Generate analytics data
  generateAnalyticsData() {
    const now = new Date();
    const days = 30;
    
    return {
      overview: {
        totalCalls: Math.floor(Math.random() * 10000) + 5000,
        totalRevenue: Math.floor(Math.random() * 500000) + 100000,
        activeAgents: Math.floor(Math.random() * 50) + 20,
        avgConversionRate: (Math.random() * 15 + 10).toFixed(1),
        growth: {
          calls: (Math.random() * 20 - 10).toFixed(1),
          revenue: (Math.random() * 30 - 15).toFixed(1),
          agents: (Math.random() * 10 - 5).toFixed(1),
          conversion: (Math.random() * 5 - 2.5).toFixed(1)
        }
      },
      
      dailyMetrics: Array.from({ length: days }, (_, i) => {
        const date = new Date(now.getTime() - (days - i - 1) * 24 * 60 * 60 * 1000);
        return {
          date: date.toISOString().split('T')[0],
          calls: Math.floor(Math.random() * 200) + 50,
          revenue: Math.floor(Math.random() * 15000) + 2000,
          conversions: Math.floor(Math.random() * 20) + 5,
          avgDuration: Math.floor(Math.random() * 180) + 120,
          agents: Math.floor(Math.random() * 10) + 15
        };
      }),
      
      hourlyMetrics: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        calls: Math.floor(Math.random() * 50) + (i >= 9 && i <= 17 ? 20 : 5),
        agents: Math.floor(Math.random() * 5) + (i >= 9 && i <= 17 ? 10 : 2),
        conversions: Math.floor(Math.random() * 8) + (i >= 9 && i <= 17 ? 3 : 1)
      })),

      topPerformers: {
        agents: Array.from({ length: 10 }, (_, i) => ({
          agentId: `agent_${i + 1}`,
          name: `Agent ${i + 1}`,
          calls: Math.floor(Math.random() * 100) + 50,
          conversions: Math.floor(Math.random() * 20) + 10,
          revenue: Math.floor(Math.random() * 25000) + 5000,
          rating: (Math.random() * 2 + 3).toFixed(1) // 3.0-5.0
        })),
        
        campaigns: Array.from({ length: 5 }, (_, i) => ({
          campaignId: `campaign_${i + 1}`,
          name: `Campaign ${i + 1}`,
          contacts: Math.floor(Math.random() * 1000) + 200,
          conversions: Math.floor(Math.random() * 50) + 10,
          revenue: Math.floor(Math.random() * 50000) + 10000,
          roi: (Math.random() * 200 + 100).toFixed(1)
        }))
      }
    };
  }

  // Generate phone numbers data
  generatePhoneNumbersData() {
    const areaCodesUS = ['212', '213', '214', '215', '216', '217', '218', '224', '225', '228'];
    const numberTypes = ['local', 'toll_free', 'mobile'];
    const providers = ['Twilio', 'Bandwidth', 'Telnyx', 'Plivo'];
    
    return {
      ownedNumbers: Array.from({ length: 50 }, (_, i) => {
        const areaCode = areaCodesUS[Math.floor(Math.random() * areaCodesUS.length)];
        const number = Math.floor(Math.random() * 9000000) + 1000000;
        
        return {
          id: `number_${i + 1}`,
          phoneNumber: `+1${areaCode}${number}`,
          type: numberTypes[Math.floor(Math.random() * numberTypes.length)],
          provider: providers[Math.floor(Math.random() * providers.length)],
          status: Math.random() > 0.1 ? 'active' : 'inactive',
          assignedTo: Math.random() > 0.3 ? `agent_${Math.floor(Math.random() * 25) + 1}` : null,
          monthlyCost: (Math.random() * 10 + 1).toFixed(2),
          features: {
            voiceEnabled: true,
            smsEnabled: Math.random() > 0.3,
            callForwarding: Math.random() > 0.5,
            voicemail: Math.random() > 0.2,
            callRecording: Math.random() > 0.4
          },
          metrics: {
            inboundCalls: Math.floor(Math.random() * 100) + 10,
            outboundCalls: Math.floor(Math.random() * 200) + 20,
            smsReceived: Math.floor(Math.random() * 50) + 5,
            smsSent: Math.floor(Math.random() * 80) + 10,
            totalMinutes: Math.floor(Math.random() * 5000) + 500
          },
          createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
        };
      }),
      
      availableNumbers: Array.from({ length: 100 }, (_, i) => {
        const areaCode = areaCodesUS[Math.floor(Math.random() * areaCodesUS.length)];
        const number = Math.floor(Math.random() * 9000000) + 1000000;
        
        return {
          phoneNumber: `+1${areaCode}${number}`,
          type: numberTypes[Math.floor(Math.random() * numberTypes.length)],
          provider: providers[Math.floor(Math.random() * providers.length)],
          monthlyCost: (Math.random() * 10 + 1).toFixed(2),
          setupCost: (Math.random() * 5).toFixed(2),
          features: {
            voiceEnabled: true,
            smsEnabled: Math.random() > 0.3,
            callForwarding: true,
            voicemail: true,
            callRecording: Math.random() > 0.2
          }
        };
      })
    };
  }

  // Generate voice lab data
  generateVoiceLabData() {
    const voiceTypes = ['professional', 'friendly', 'energetic', 'calm', 'authoritative'];
    const languages = ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'it-IT'];
    const genders = ['male', 'female', 'neutral'];
    
    return {
      availableVoices: Array.from({ length: 20 }, (_, i) => ({
        id: `voice_${i + 1}`,
        name: `Voice ${i + 1}`,
        type: voiceTypes[Math.floor(Math.random() * voiceTypes.length)],
        language: languages[Math.floor(Math.random() * languages.length)],
        gender: genders[Math.floor(Math.random() * genders.length)],
        isCustom: Math.random() > 0.7,
        quality: Math.random() > 0.5 ? 'premium' : 'standard',
        usage: Math.floor(Math.random() * 10000) + 100,
        rating: (Math.random() * 2 + 3).toFixed(1),
        costPerMinute: (Math.random() * 0.15 + 0.05).toFixed(3),
        features: {
          emotionControl: Math.random() > 0.5,
          speedControl: Math.random() > 0.3,
          pitchControl: Math.random() > 0.4,
          pauseControl: true,
          ssmlSupport: Math.random() > 0.6
        }
      })),
      
      synthesisHistory: Array.from({ length: 50 }, (_, i) => ({
        id: `synthesis_${i + 1}`,
        voiceId: `voice_${Math.floor(Math.random() * 20) + 1}`,
        text: `Synthesis request ${i + 1}`,
        duration: Math.floor(Math.random() * 120) + 10,
        characters: Math.floor(Math.random() * 500) + 50,
        cost: (Math.random() * 2 + 0.1).toFixed(3),
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        audioUrl: `https://voice.vocelio.ai/synthesis_${i + 1}.mp3`
      })),
      
      voiceClones: Array.from({ length: 8 }, (_, i) => ({
        id: `clone_${i + 1}`,
        name: `Custom Voice ${i + 1}`,
        originalSpeaker: `Speaker ${i + 1}`,
        trainingStatus: Math.random() > 0.8 ? 'training' : 'ready',
        quality: (Math.random() * 2 + 3).toFixed(1),
        trainingDataMinutes: Math.floor(Math.random() * 60) + 10,
        usage: Math.floor(Math.random() * 1000) + 10,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }))
    };
  }

  // Populate all services with data
  async populateAllData() {
    const data = {
      agents: this.generateAgentData(),
      campaigns: this.generateCampaignData(),
      callCenter: this.generateCallCenterData(),
      analytics: this.generateAnalyticsData(),
      phoneNumbers: this.generatePhoneNumbersData(),
      voiceLab: this.generateVoiceLabData(),
      timestamp: new Date().toISOString()
    };

    // Store in localStorage for immediate use
    localStorage.setItem('vocelio_dashboard_data', JSON.stringify(data));
    
    return data;
  }

  // Get populated data
  getPopulatedData() {
    const stored = localStorage.getItem('vocelio_dashboard_data');
    if (stored) {
      return JSON.parse(stored);
    }
    return this.populateAllData();
  }

  // Simulate real-time updates
  simulateRealTimeUpdates(callback) {
    const updateInterval = setInterval(() => {
      const data = this.getPopulatedData();
      
      // Update active calls
      data.callCenter.activeCalls = data.callCenter.activeCalls.map(call => ({
        ...call,
        duration: call.duration + 30 // Add 30 seconds
      }));
      
      // Randomly add/remove active calls
      if (Math.random() > 0.7 && data.callCenter.activeCalls.length < 15) {
        data.callCenter.activeCalls.push({
          id: `call_${Date.now()}`,
          phoneNumber: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          agentId: `agent_${Math.floor(Math.random() * 25) + 1}`,
          type: Math.random() > 0.5 ? 'inbound' : 'outbound',
          status: 'in_progress',
          duration: 0,
          startTime: new Date().toISOString()
        });
      }
      
      if (Math.random() > 0.8 && data.callCenter.activeCalls.length > 1) {
        data.callCenter.activeCalls.pop();
      }
      
      // Update analytics
      data.analytics.overview.totalCalls += Math.floor(Math.random() * 5);
      data.analytics.overview.totalRevenue += Math.floor(Math.random() * 1000);
      
      localStorage.setItem('vocelio_dashboard_data', JSON.stringify(data));
      
      if (callback) callback(data);
    }, 5000); // Update every 5 seconds
    
    return updateInterval;
  }
}

export default DataPopulationService;
