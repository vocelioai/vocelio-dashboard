// Smart Campaigns API Client
// Integrates with the enhanced smart campaigns backend service

class SmartCampaignsClient {
  constructor() {
    this.baseUrl = 'http://localhost:8000/api/v1';
    this.retryCount = 3;
    this.retryDelay = 1000;
  }

  // Utility method for making API requests with retry logic
  async makeRequest(url, options = {}) {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    for (let attempt = 1; attempt <= this.retryCount; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}${url}`, defaultOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
      } catch (error) {
        console.warn(`API request attempt ${attempt} failed:`, error.message);
        
        if (attempt === this.retryCount) {
          console.error(`Failed to fetch from ${url} after ${this.retryCount} attempts`);
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
      }
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.makeRequest('/enhanced-campaigns/health');
      return response.status === 'healthy';
    } catch (error) {
      console.error('Smart Campaigns health check failed:', error);
      return false;
    }
  }

  // Enhanced Campaigns Management
  async createCampaign(campaignData) {
    try {
      return await this.makeRequest('/enhanced-campaigns/', {
        method: 'POST',
        body: JSON.stringify(campaignData),
      });
    } catch (error) {
      console.error('Failed to create campaign:', error);
      throw error;
    }
  }

  async getCampaigns(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination params
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      if (params.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params.sort_order) queryParams.append('sort_order', params.sort_order);
      
      // Add filter params
      if (params.status) params.status.forEach(s => queryParams.append('status', s));
      if (params.priority) params.priority.forEach(p => queryParams.append('priority', p));
      if (params.industry) params.industry.forEach(i => queryParams.append('industry', i));
      if (params.campaign_type) params.campaign_type.forEach(t => queryParams.append('campaign_type', t));
      if (params.agent_id) queryParams.append('agent_id', params.agent_id);
      if (params.is_ai_optimized !== undefined) queryParams.append('is_ai_optimized', params.is_ai_optimized);
      
      const url = queryParams.toString() ? `/enhanced-campaigns/?${queryParams}` : '/enhanced-campaigns/';
      return await this.makeRequest(url);
    } catch (error) {
      console.error('Failed to get campaigns:', error);
      throw error;
    }
  }

  async getCampaign(campaignId) {
    try {
      return await this.makeRequest(`/enhanced-campaigns/${campaignId}`);
    } catch (error) {
      console.error(`Failed to get campaign ${campaignId}:`, error);
      throw error;
    }
  }

  async updateCampaign(campaignId, campaignData) {
    try {
      return await this.makeRequest(`/enhanced-campaigns/${campaignId}`, {
        method: 'PUT',
        body: JSON.stringify(campaignData),
      });
    } catch (error) {
      console.error(`Failed to update campaign ${campaignId}:`, error);
      throw error;
    }
  }

  async deleteCampaign(campaignId) {
    try {
      return await this.makeRequest(`/enhanced-campaigns/${campaignId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to delete campaign ${campaignId}:`, error);
      throw error;
    }
  }

  // AI Optimization
  async optimizeCampaign(campaignId) {
    try {
      return await this.makeRequest(`/enhanced-campaigns/${campaignId}/optimize`, {
        method: 'POST',
      });
    } catch (error) {
      console.error(`Failed to optimize campaign ${campaignId}:`, error);
      throw error;
    }
  }

  // A/B Testing
  async createABTest(campaignId, abTestData) {
    try {
      return await this.makeRequest(`/enhanced-campaigns/${campaignId}/ab-test`, {
        method: 'POST',
        body: JSON.stringify(abTestData),
      });
    } catch (error) {
      console.error(`Failed to create A/B test for campaign ${campaignId}:`, error);
      throw error;
    }
  }

  // Performance Analytics
  async getCampaignPerformance(campaignId) {
    try {
      return await this.makeRequest(`/enhanced-campaigns/${campaignId}/performance`);
    } catch (error) {
      console.error(`Failed to get performance for campaign ${campaignId}:`, error);
      throw error;
    }
  }

  async getAnalyticsOverview() {
    try {
      return await this.makeRequest('/enhanced-campaigns/analytics/overview');
    } catch (error) {
      console.error('Failed to get analytics overview:', error);
      throw error;
    }
  }

  // Industry and Type Management
  async getIndustries() {
    try {
      return await this.makeRequest('/enhanced-campaigns/industries');
    } catch (error) {
      console.error('Failed to get industries:', error);
      throw error;
    }
  }

  async getIndustryCampaigns(industry) {
    try {
      return await this.makeRequest(`/enhanced-campaigns/industries/${industry}/campaigns`);
    } catch (error) {
      console.error(`Failed to get campaigns for industry ${industry}:`, error);
      throw error;
    }
  }

  async getCampaignTypes() {
    try {
      return await this.makeRequest('/enhanced-campaigns/types');
    } catch (error) {
      console.error('Failed to get campaign types:', error);
      throw error;
    }
  }

  async getTypeCampaigns(campaignType) {
    try {
      return await this.makeRequest(`/enhanced-campaigns/types/${campaignType}/campaigns`);
    } catch (error) {
      console.error(`Failed to get campaigns for type ${campaignType}:`, error);
      throw error;
    }
  }

  // Campaign Templates
  async getCampaignTemplates(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.industry) queryParams.append('industry', params.industry);
      if (params.campaign_type) queryParams.append('campaign_type', params.campaign_type);
      
      const url = queryParams.toString() ? `/enhanced-campaigns/templates?${queryParams}` : '/enhanced-campaigns/templates';
      return await this.makeRequest(url);
    } catch (error) {
      console.error('Failed to get campaign templates:', error);
      throw error;
    }
  }

  async getCampaignTemplate(templateId) {
    try {
      return await this.makeRequest(`/enhanced-campaigns/templates/${templateId}`);
    } catch (error) {
      console.error(`Failed to get campaign template ${templateId}:`, error);
      throw error;
    }
  }

  // Bulk Operations
  async batchStartCampaigns(campaignIds) {
    try {
      return await this.makeRequest('/enhanced-campaigns/batch/start', {
        method: 'POST',
        body: JSON.stringify({ campaign_ids: campaignIds }),
      });
    } catch (error) {
      console.error('Failed to batch start campaigns:', error);
      throw error;
    }
  }

  async batchPauseCampaigns(campaignIds) {
    try {
      return await this.makeRequest('/enhanced-campaigns/batch/pause', {
        method: 'POST',
        body: JSON.stringify({ campaign_ids: campaignIds }),
      });
    } catch (error) {
      console.error('Failed to batch pause campaigns:', error);
      throw error;
    }
  }

  async batchDeleteCampaigns(campaignIds) {
    try {
      return await this.makeRequest('/enhanced-campaigns/batch/delete', {
        method: 'POST',
        body: JSON.stringify({ campaign_ids: campaignIds }),
      });
    } catch (error) {
      console.error('Failed to batch delete campaigns:', error);
      throw error;
    }
  }

  // Prospects Management
  async createProspect(prospectData) {
    try {
      return await this.makeRequest('/prospects/', {
        method: 'POST',
        body: JSON.stringify(prospectData),
      });
    } catch (error) {
      console.error('Failed to create prospect:', error);
      throw error;
    }
  }

  async getProspects(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      if (params.campaign_id) queryParams.append('campaign_id', params.campaign_id);
      if (params.status) queryParams.append('status', params.status);
      
      const url = queryParams.toString() ? `/prospects/?${queryParams}` : '/prospects/';
      return await this.makeRequest(url);
    } catch (error) {
      console.error('Failed to get prospects:', error);
      throw error;
    }
  }

  async updateProspect(prospectId, prospectData) {
    try {
      return await this.makeRequest(`/prospects/${prospectId}`, {
        method: 'PUT',
        body: JSON.stringify(prospectData),
      });
    } catch (error) {
      console.error(`Failed to update prospect ${prospectId}:`, error);
      throw error;
    }
  }

  async deleteProspect(prospectId) {
    try {
      return await this.makeRequest(`/prospects/${prospectId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to delete prospect ${prospectId}:`, error);
      throw error;
    }
  }

  // Mock data fallback for development/testing
  getMockAnalyticsOverview() {
    return {
      data: {
        total_campaigns: 89,
        active_campaigns: 67,
        total_calls_today: 47200,
        total_revenue: 2400000,
        avg_success_rate: 24.5,
        ai_optimization_score: 94.7,
        campaigns_by_industry: {
          'solar_energy': 23,
          'insurance': 18,
          'real_estate': 15,
          'healthcare': 12,
          'finance': 10,
          'education': 8,
          'automotive': 3
        },
        campaigns_by_status: {
          'active': 67,
          'paused': 15,
          'draft': 7
        },
        campaigns_by_channel: {
          'voice': 45,
          'sms': 28,
          'email': 35,
          'smart': 23
        },
        channel_analytics: {
          voice: {
            calls: 47200,
            answered: 28320,
            duration: 142560,
            cost: 4720.00,
            answer_rate: 60.0,
            avg_duration: 5.03
          },
          sms: {
            sent: 125847,
            delivered: 122340,
            clicked: 15678,
            cost: 1258.47,
            delivery_rate: 97.2,
            click_rate: 12.8
          },
          email: {
            sent: 234567,
            delivered: 228901,
            opened: 114450,
            clicked: 22890,
            cost: 234.56,
            delivery_rate: 97.6,
            open_rate: 50.0,
            click_rate: 20.0
          }
        },
        performance_trends: {
          today: { calls: 47200, conversions: 11568, revenue: 2400000 },
          yesterday: { calls: 45100, conversions: 10875, revenue: 2250000 },
          week_ago: { calls: 43800, conversions: 9855, revenue: 2100000 }
        }
      },
      message: "Analytics overview retrieved successfully",
      status_code: 200
    };
  }

  // Mock multi-channel campaigns data
  getMockMultiChannelCampaigns() {
    return {
      data: {
        campaigns: [
          {
            id: 'mc_001',
            name: 'Q4 Product Launch - Multi-Channel Blast',
            description: 'Comprehensive product launch campaign across all channels',
            channels: ['voice', 'sms', 'email'],
            channel_priority: ['voice', 'sms', 'email'],
            industry: 'solar_energy',
            campaign_type: 'product_launch',
            campaign_goal: 'lead_generation',
            status: 'running',
            priority: 'high',
            is_ai_optimized: true,
            optimization_score: 94.7,
            total_sent: 15847,
            total_delivered: 15234,
            total_clicked: 3456,
            total_converted: 1234,
            conversion_rate: 8.1,
            total_cost: 1584.70,
            revenue_generated: 89456.78,
            roi: 5545.2,
            voice_metrics: {
              calls_made: 5847,
              answered: 3508,
              total_duration: 17540,
              transfers: 234,
              cost: 584.70
            },
            sms_metrics: {
              sent: 5000,
              delivered: 4850,
              clicked: 970,
              responded: 485,
              cost: 500.00
            },
            email_metrics: {
              sent: 5000,
              delivered: 4884,
              opened: 2442,
              clicked: 1221,
              cost: 500.00
            },
            tags: ['product', 'launch', 'q4', 'multi-channel'],
            created_at: '2024-08-10T10:00:00Z',
            started_at: '2024-08-15T09:00:00Z'
          },
          {
            id: 'mc_002',
            name: 'Insurance Warm Leads - Voice + SMS',
            description: 'High-conversion insurance campaign with voice-first approach',
            channels: ['voice', 'sms'],
            channel_priority: ['voice', 'sms'],
            industry: 'insurance',
            campaign_type: 'warm_leads',
            campaign_goal: 'sales_promotion',
            status: 'active',
            priority: 'high',
            is_ai_optimized: true,
            optimization_score: 87.3,
            total_sent: 8456,
            total_delivered: 8123,
            total_clicked: 1625,
            total_converted: 812,
            conversion_rate: 10.0,
            total_cost: 845.60,
            revenue_generated: 48720.00,
            roi: 5661.8,
            voice_metrics: {
              calls_made: 4456,
              answered: 2674,
              total_duration: 13370,
              transfers: 156,
              cost: 445.60
            },
            sms_metrics: {
              sent: 4000,
              delivered: 3880,
              clicked: 776,
              responded: 388,
              cost: 400.00
            },
            email_metrics: null,
            tags: ['insurance', 'warm-leads', 'high-conversion'],
            created_at: '2024-08-12T14:30:00Z',
            started_at: '2024-08-13T08:00:00Z'
          },
          {
            id: 'mc_003',
            name: 'Weekly Newsletter + SMS Alerts',
            description: 'Combined email newsletter with SMS notification system',
            channels: ['email', 'sms'],
            channel_priority: ['email', 'sms'],
            industry: 'technology',
            campaign_type: 'newsletter',
            campaign_goal: 'brand_awareness',
            status: 'scheduled',
            priority: 'normal',
            is_ai_optimized: true,
            optimization_score: 76.8,
            total_sent: 0,
            total_delivered: 0,
            total_clicked: 0,
            total_converted: 0,
            conversion_rate: 0,
            total_cost: 234.56,
            revenue_generated: 0,
            roi: 0,
            voice_metrics: null,
            sms_metrics: {
              sent: 0,
              delivered: 0,
              clicked: 0,
              responded: 0,
              cost: 150.00
            },
            email_metrics: {
              sent: 0,
              delivered: 0,
              opened: 0,
              clicked: 0,
              cost: 84.56
            },
            tags: ['newsletter', 'weekly', 'automation'],
            created_at: '2024-08-14T16:00:00Z',
            started_at: null
          },
          {
            id: 'mc_004',
            name: 'Real Estate Smart Campaign',
            description: 'AI-powered real estate campaign with intelligent channel selection',
            channels: ['smart'],
            channel_priority: ['voice', 'sms', 'email'],
            industry: 'real_estate',
            campaign_type: 'smart_outreach',
            campaign_goal: 'appointment_booking',
            status: 'running',
            priority: 'urgent',
            is_ai_optimized: true,
            optimization_score: 91.2,
            total_sent: 12847,
            total_delivered: 12234,
            total_clicked: 2447,
            total_converted: 978,
            conversion_rate: 8.0,
            total_cost: 1284.70,
            revenue_generated: 156780.00,
            roi: 12103.5,
            voice_metrics: {
              calls_made: 4282,
              answered: 2569,
              total_duration: 12845,
              transfers: 128,
              cost: 428.20
            },
            sms_metrics: {
              sent: 4283,
              delivered: 4154,
              clicked: 831,
              responded: 415,
              cost: 428.30
            },
            email_metrics: {
              sent: 4282,
              delivered: 4168,
              opened: 2084,
              clicked: 625,
              cost: 428.20
            },
            tags: ['real-estate', 'smart', 'ai-powered', 'appointments'],
            created_at: '2024-08-11T11:15:00Z',
            started_at: '2024-08-12T09:30:00Z'
          }
        ],
        total: 4,
        page: 1,
        per_page: 20,
        total_pages: 1
      },
      message: "Multi-channel campaigns retrieved successfully",
      status_code: 200
    };
  }

  // Mock campaign templates with multi-channel support
  getMockCampaignTemplates() {
    return {
      data: [
        {
          id: 'template_001',
          name: 'Solar Lead Generation Pro',
          description: 'High-converting solar lead generation template with voice + SMS follow-up',
          channels: ['voice', 'sms'],
          industry: 'solar_energy',
          campaign_type: 'lead_generation',
          campaign_goal: 'lead_generation',
          voice_script: 'Hi, this is [AGENT_NAME] calling about solar energy savings for your home...',
          sms_template: 'Hi [FIRST_NAME]! We just called about solar savings. Get a free quote: [LINK]',
          email_template: null,
          email_subject: null,
          is_premium: false,
          usage_count: 234,
          success_rate: 34.2
        },
        {
          id: 'template_002',
          name: 'Insurance Multi-Channel Outreach',
          description: 'Complete insurance campaign with voice, SMS, and email sequences',
          channels: ['voice', 'sms', 'email'],
          industry: 'insurance',
          campaign_type: 'warm_leads',
          campaign_goal: 'sales_promotion',
          voice_script: 'Hello [FIRST_NAME], this is [AGENT_NAME] from [COMPANY] about your insurance inquiry...',
          sms_template: 'Hi [FIRST_NAME]! Thanks for your interest in insurance. Let us help you save: [LINK]',
          email_template: '<h2>Your Insurance Quote is Ready</h2><p>Dear [FIRST_NAME],</p><p>Thank you for your interest...</p>',
          email_subject: 'Your Personalized Insurance Quote - Save up to 40%',
          is_premium: true,
          usage_count: 189,
          success_rate: 28.7
        },
        {
          id: 'template_003',
          name: 'Real Estate Smart Campaign',
          description: 'AI-powered real estate template that optimally selects channels based on lead profile',
          channels: ['smart'],
          industry: 'real_estate',
          campaign_type: 'smart_outreach',
          campaign_goal: 'appointment_booking',
          voice_script: 'Hi [FIRST_NAME], this is [AGENT_NAME] with [COMPANY]. I understand you\'re looking for...',
          sms_template: 'Hi [FIRST_NAME]! Saw you\'re interested in real estate. Book a free consultation: [LINK]',
          email_template: '<h2>Your Real Estate Journey Starts Here</h2><p>Hi [FIRST_NAME],</p><p>Ready to find your dream home?</p>',
          email_subject: 'Find Your Dream Home - Schedule Free Consultation',
          is_premium: true,
          usage_count: 156,
          success_rate: 42.1
        }
      ],
      message: "Campaign templates retrieved successfully",
      status_code: 200
    };
  }
}

const smartCampaignsClient = new SmartCampaignsClient();
export default smartCampaignsClient;

export { SmartCampaignsClient };
