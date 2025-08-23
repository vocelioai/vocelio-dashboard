/**
 * Compliance Monitoring System
 * TCPA, DNC, GDPR/CCPA compliance tracking and quality assurance
 */

// TCPA (Telephone Consumer Protection Act) compliance
export const TCPACompliance = {
  // TCPA consent types
  CONSENT_TYPES: {
    EXPRESS_WRITTEN: 'express_written',
    EXPRESS_VERBAL: 'express_verbal',
    IMPLIED: 'implied',
    ESTABLISHED_BUSINESS: 'established_business'
  },

  // TCPA call time restrictions
  CALL_TIME_RESTRICTIONS: {
    START_TIME: '08:00', // 8 AM local time
    END_TIME: '21:00',   // 9 PM local time
    TIMEZONE_REQUIRED: true
  },

  // Validate TCPA compliance for a call
  validateTCPACompliance: (contact, campaign) => {
    const compliance = {
      isCompliant: true,
      violations: [],
      warnings: [],
      consentStatus: 'unknown'
    };

    // Check consent
    if (!contact.consent || !contact.consent.type) {
      compliance.isCompliant = false;
      compliance.violations.push('NO_CONSENT_RECORDED');
    } else {
      compliance.consentStatus = contact.consent.type;
      
      // Validate consent expiration
      if (contact.consent.expiresAt && new Date(contact.consent.expiresAt) < new Date()) {
        compliance.isCompliant = false;
        compliance.violations.push('CONSENT_EXPIRED');
      }
    }

    // Check call time restrictions
    const contactTimezone = contact.timezone || 'America/New_York';
    const localTime = new Date().toLocaleTimeString('en-US', { 
      timeZone: contactTimezone, 
      hour12: false 
    });
    
    if (localTime < TCPACompliance.CALL_TIME_RESTRICTIONS.START_TIME || 
        localTime > TCPACompliance.CALL_TIME_RESTRICTIONS.END_TIME) {
      compliance.isCompliant = false;
      compliance.violations.push('OUTSIDE_CALLING_HOURS');
    }

    // Check for wireless/mobile numbers requiring express consent
    if (contact.phoneType === 'mobile' && 
        contact.consent?.type !== TCPACompliance.CONSENT_TYPES.EXPRESS_WRITTEN &&
        contact.consent?.type !== TCPACompliance.CONSENT_TYPES.EXPRESS_VERBAL) {
      compliance.violations.push('MOBILE_REQUIRES_EXPRESS_CONSENT');
      compliance.isCompliant = false;
    }

    return compliance;
  },

  // Record consent for TCPA compliance
  recordConsent: (contact, consentData) => {
    return {
      contactId: contact.id,
      consentType: consentData.type,
      consentDate: new Date().toISOString(),
      consentMethod: consentData.method, // 'web_form', 'verbal', 'sms_opt_in', etc.
      ipAddress: consentData.ipAddress,
      userAgent: consentData.userAgent,
      campaignId: consentData.campaignId,
      consentText: consentData.consentText,
      expiresAt: consentData.expiresAt,
      recordedBy: consentData.recordedBy,
      isActive: true
    };
  }
};

// Do Not Call (DNC) list management
export const DNCCompliance = {
  // DNC list types
  DNC_TYPES: {
    NATIONAL: 'national_dnc',
    INTERNAL: 'internal_dnc',
    STATE: 'state_dnc',
    WIRELESS: 'wireless_dnc'
  },

  // Check if number is on DNC list
  checkDNCStatus: async (phoneNumber, dncLists = ['national', 'internal']) => {
    const dncStatus = {
      isOnDNC: false,
      dncLists: [],
      exemptions: [],
      complianceStatus: 'allowed'
    };

    try {
      // Check each DNC list
      for (const listType of dncLists) {
        const isListed = await DNCCompliance.queryDNCList(phoneNumber, listType);
        if (isListed) {
          dncStatus.isOnDNC = true;
          dncStatus.dncLists.push(listType);
        }
      }

      // Check for exemptions
      const exemptions = await DNCCompliance.checkExemptions(phoneNumber);
      dncStatus.exemptions = exemptions;

      // Determine final compliance status
      if (dncStatus.isOnDNC && exemptions.length === 0) {
        dncStatus.complianceStatus = 'blocked';
      } else if (dncStatus.isOnDNC && exemptions.length > 0) {
        dncStatus.complianceStatus = 'allowed_with_exemption';
      }

      return dncStatus;

    } catch (error) {
      return {
        isOnDNC: null,
        error: error.message,
        complianceStatus: 'error'
      };
    }
  },

  // Mock DNC list query (replace with actual DNC service)
  queryDNCList: async (phoneNumber, listType) => {
    // Simulate API call to DNC service
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock logic - in reality, this would query actual DNC databases
    const mockDNCNumbers = ['5551234567', '5559876543'];
    return mockDNCNumbers.includes(phoneNumber.replace(/\D/g, ''));
  },

  // Check for DNC exemptions
  checkExemptions: async (phoneNumber) => {
    const exemptions = [];
    
    // Check for established business relationship
    const hasEBR = await DNCCompliance.hasEstablishedBusinessRelationship(phoneNumber);
    if (hasEBR) {
      exemptions.push({
        type: 'established_business_relationship',
        validUntil: hasEBR.validUntil
      });
    }

    // Check for prior express consent
    const hasConsent = await DNCCompliance.hasExpressConsent(phoneNumber);
    if (hasConsent) {
      exemptions.push({
        type: 'express_consent',
        validUntil: hasConsent.validUntil
      });
    }

    return exemptions;
  },

  hasEstablishedBusinessRelationship: async (phoneNumber) => {
    // Mock EBR check - 18 months from last transaction
    const mockEBR = false; // Replace with actual EBR lookup
    if (mockEBR) {
      return {
        validUntil: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000).toISOString()
      };
    }
    return null;
  },

  hasExpressConsent: async (phoneNumber) => {
    // Mock consent check
    const mockConsent = false; // Replace with actual consent lookup
    if (mockConsent) {
      return {
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      };
    }
    return null;
  }
};

// GDPR/CCPA data privacy compliance
export const PrivacyCompliance = {
  // Data processing lawful bases (GDPR)
  LAWFUL_BASES: {
    CONSENT: 'consent',
    CONTRACT: 'contract',
    LEGAL_OBLIGATION: 'legal_obligation',
    VITAL_INTERESTS: 'vital_interests',
    PUBLIC_TASK: 'public_task',
    LEGITIMATE_INTERESTS: 'legitimate_interests'
  },

  // Data subject rights
  DATA_SUBJECT_RIGHTS: {
    ACCESS: 'right_of_access',
    RECTIFICATION: 'right_to_rectification',
    ERASURE: 'right_to_erasure',
    RESTRICT_PROCESSING: 'right_to_restrict_processing',
    DATA_PORTABILITY: 'right_to_data_portability',
    OBJECT: 'right_to_object',
    AUTOMATED_DECISION_MAKING: 'rights_related_to_automated_decision_making'
  },

  // Check GDPR compliance for contact
  checkGDPRCompliance: (contact, processingPurpose) => {
    const compliance = {
      isCompliant: true,
      lawfulBasis: null,
      violations: [],
      warnings: [],
      dataRetentionStatus: 'compliant'
    };

    // Check for lawful basis
    if (!contact.gdpr || !contact.gdpr.lawfulBasis) {
      compliance.isCompliant = false;
      compliance.violations.push('NO_LAWFUL_BASIS');
    } else {
      compliance.lawfulBasis = contact.gdpr.lawfulBasis;
    }

    // Check consent validity (if consent is the lawful basis)
    if (contact.gdpr?.lawfulBasis === PrivacyCompliance.LAWFUL_BASES.CONSENT) {
      if (!contact.gdpr.consentDate) {
        compliance.violations.push('NO_CONSENT_DATE');
        compliance.isCompliant = false;
      }
      
      if (!contact.gdpr.consentSpecific || !contact.gdpr.consentInformed) {
        compliance.violations.push('INVALID_CONSENT_QUALITY');
        compliance.isCompliant = false;
      }
    }

    // Check data retention periods
    if (contact.gdpr?.dataRetentionPeriod) {
      const retentionExpiry = new Date(contact.createdAt);
      retentionExpiry.setMonths(retentionExpiry.getMonth() + contact.gdpr.dataRetentionPeriod);
      
      if (new Date() > retentionExpiry) {
        compliance.violations.push('DATA_RETENTION_EXPIRED');
        compliance.dataRetentionStatus = 'expired';
        compliance.isCompliant = false;
      }
    }

    return compliance;
  },

  // Process data subject request
  processDataSubjectRequest: async (request) => {
    const {
      contactId,
      requestType,
      requestDate = new Date().toISOString(),
      requestData = {}
    } = request;

    const response = {
      requestId: `dsr_${Date.now()}`,
      contactId,
      requestType,
      requestDate,
      status: 'received',
      completionDeadline: null,
      actions: []
    };

    // Set completion deadline (30 days for GDPR)
    const deadline = new Date(requestDate);
    deadline.setDate(deadline.getDate() + 30);
    response.completionDeadline = deadline.toISOString();

    // Process based on request type
    switch (requestType) {
      case PrivacyCompliance.DATA_SUBJECT_RIGHTS.ACCESS:
        response.actions.push('COMPILE_PERSONAL_DATA');
        response.actions.push('GENERATE_DATA_EXPORT');
        break;
        
      case PrivacyCompliance.DATA_SUBJECT_RIGHTS.ERASURE:
        response.actions.push('VERIFY_ERASURE_CONDITIONS');
        response.actions.push('DELETE_PERSONAL_DATA');
        response.actions.push('NOTIFY_THIRD_PARTIES');
        break;
        
      case PrivacyCompliance.DATA_SUBJECT_RIGHTS.RECTIFICATION:
        response.actions.push('VERIFY_RECTIFICATION_REQUEST');
        response.actions.push('UPDATE_PERSONAL_DATA');
        response.actions.push('NOTIFY_THIRD_PARTIES');
        break;
        
      default:
        response.actions.push('MANUAL_REVIEW_REQUIRED');
    }

    return response;
  }
};

// Call recording consent management
export const RecordingConsent = {
  // Recording consent types
  CONSENT_TYPES: {
    ONE_PARTY: 'one_party', // One party consent states
    TWO_PARTY: 'two_party', // Two party consent states
    EXPLICIT: 'explicit'     // Explicit consent required
  },

  // State-specific recording laws
  STATE_RECORDING_LAWS: {
    'CA': 'two_party', 'CT': 'two_party', 'FL': 'two_party',
    'IL': 'two_party', 'MA': 'two_party', 'MD': 'two_party',
    'MI': 'two_party', 'MT': 'two_party', 'NH': 'two_party',
    'PA': 'two_party', 'WA': 'two_party',
    // All other states default to one_party
  },

  // Check recording consent requirements
  checkRecordingConsent: (contact, campaign) => {
    const state = contact.state || campaign.defaultState || 'NY';
    const recordingLaw = RecordingConsent.STATE_RECORDING_LAWS[state] || 'one_party';
    
    const consent = {
      required: recordingLaw === 'two_party',
      obtained: false,
      compliant: true,
      recordingLaw,
      state
    };

    if (consent.required) {
      consent.obtained = contact.recordingConsent?.given || false;
      consent.compliant = consent.obtained;
      
      if (!consent.compliant) {
        consent.violation = 'TWO_PARTY_CONSENT_REQUIRED';
      }
    }

    return consent;
  },

  // Generate recording consent disclosure
  generateConsentDisclosure: (state, language = 'en') => {
    const recordingLaw = RecordingConsent.STATE_RECORDING_LAWS[state] || 'one_party';
    
    const disclosures = {
      en: {
        one_party: "This call may be recorded for quality assurance purposes.",
        two_party: "This call may be recorded for quality assurance purposes. Do you consent to recording?",
        explicit: "We would like to record this call for quality assurance. May we have your permission to record?"
      },
      es: {
        one_party: "Esta llamada puede ser grabada con fines de control de calidad.",
        two_party: "Esta llamada puede ser grabada con fines de control de calidad. ¿Consiente la grabación?",
        explicit: "Nos gustaría grabar esta llamada para control de calidad. ¿Podemos tener su permiso para grabar?"
      }
    };

    return disclosures[language]?.[recordingLaw] || disclosures.en[recordingLaw];
  }
};

// Quality assurance and audit trail
export const QualityAssurance = {
  // Compliance score calculation
  calculateComplianceScore: (contact, campaign, callData) => {
    let totalChecks = 0;
    let passedChecks = 0;
    const violations = [];
    const warnings = [];

    // TCPA compliance check
    totalChecks++;
    const tcpaCompliance = TCPACompliance.validateTCPACompliance(contact, campaign);
    if (tcpaCompliance.isCompliant) {
      passedChecks++;
    } else {
      violations.push(...tcpaCompliance.violations);
    }

    // GDPR compliance check (if applicable)
    if (contact.gdpr) {
      totalChecks++;
      const gdprCompliance = PrivacyCompliance.checkGDPRCompliance(contact, campaign.processingPurpose);
      if (gdprCompliance.isCompliant) {
        passedChecks++;
      } else {
        violations.push(...gdprCompliance.violations);
      }
    }

    // Recording consent check
    totalChecks++;
    const recordingConsent = RecordingConsent.checkRecordingConsent(contact, campaign);
    if (recordingConsent.compliant) {
      passedChecks++;
    } else {
      violations.push(recordingConsent.violation);
    }

    const score = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0;
    
    return {
      score: Math.round(score),
      totalChecks,
      passedChecks,
      violations,
      warnings,
      level: score >= 90 ? 'excellent' : score >= 75 ? 'good' : score >= 50 ? 'fair' : 'poor'
    };
  },

  // Generate audit trail entry
  generateAuditEntry: (action, details) => {
    return {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      user: details.userId || 'system',
      ipAddress: details.ipAddress,
      userAgent: details.userAgent,
      sessionId: details.sessionId
    };
  },

  // Automated compliance checks
  runAutomatedComplianceChecks: async (contact, campaign) => {
    const checks = {
      timestamp: new Date().toISOString(),
      contactId: contact.id,
      campaignId: campaign.id,
      results: {}
    };

    try {
      // Run all compliance checks
      checks.results.tcpa = TCPACompliance.validateTCPACompliance(contact, campaign);
      checks.results.dnc = await DNCCompliance.checkDNCStatus(contact.phone);
      
      if (contact.gdpr) {
        checks.results.gdpr = PrivacyCompliance.checkGDPRCompliance(contact, campaign.processingPurpose);
      }
      
      checks.results.recording = RecordingConsent.checkRecordingConsent(contact, campaign);
      
      // Calculate overall compliance
      checks.overallCompliance = QualityAssurance.calculateComplianceScore(contact, campaign);
      
      // Generate recommendations
      checks.recommendations = QualityAssurance.generateRecommendations(checks.results);
      
    } catch (error) {
      checks.error = error.message;
    }

    return checks;
  },

  // Generate compliance recommendations
  generateRecommendations: (results) => {
    const recommendations = [];

    if (results.tcpa && !results.tcpa.isCompliant) {
      recommendations.push({
        type: 'tcpa',
        priority: 'high',
        message: 'TCPA violations detected. Review consent records and calling hours.',
        actions: ['update_consent', 'adjust_calling_schedule']
      });
    }

    if (results.dnc && results.dnc.complianceStatus === 'blocked') {
      recommendations.push({
        type: 'dnc',
        priority: 'critical',
        message: 'Contact is on DNC list. Do not call unless exemption applies.',
        actions: ['remove_from_campaign', 'verify_exemptions']
      });
    }

    if (results.gdpr && !results.gdpr.isCompliant) {
      recommendations.push({
        type: 'gdpr',
        priority: 'high',
        message: 'GDPR compliance issues detected. Review lawful basis and retention periods.',
        actions: ['update_lawful_basis', 'review_retention_policy']
      });
    }

    return recommendations;
  }
};

export default {
  TCPACompliance,
  DNCCompliance,
  PrivacyCompliance,
  RecordingConsent,
  QualityAssurance
};
