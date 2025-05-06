
import { LineChart } from 'recharts';

// Types for scenario data
export type ScenarioKey = 'checkout-drop' | 'api-error-spike';

export interface Scenario {
  title: string;
  query: string;
  description: string;
}

export interface SourceAvailability {
  [key: string]: boolean;
}

export interface Hypothesis {
  conclusion: string;
  confidence: {
    level: string;
    percent: number;
  };
  note?: string;
}

export interface Evidence {
  source: string;
  text: string;
  hasData: boolean;
  evidenceId: number;
}

export interface SourceData {
  summary: string;
  title: string;
  description: string;
  type: 'chart' | 'text' | 'list';
  content?: string;
  chartData?: any[];
  items?: string[];
  metadata?: {
    [key: string]: string;
  };
}

// Scenarios
export const scenarios: Record<ScenarioKey, Scenario> = {
  'checkout-drop': {
    title: 'Checkout Completion Drop (May 5th)',
    query: 'Why did checkout completion drop on May 5th?',
    description: 'Investigate the sudden decrease in checkout completion rate that started on May 5th.'
  },
  'api-error-spike': {
    title: 'API Error Rate Spike (May 6th)',
    query: 'What caused the API error spike on May 6th?',
    description: 'Analyze the sudden increase in API error rates that occurred on May 6th.'
  }
};

// Default source availability per scenario
export const getSourceAvailabilityForScenario = (scenarioKey: string): SourceAvailability => {
  switch (scenarioKey) {
    case 'checkout-drop':
      return {
        analytics: true,
        support: true,
        releases: true,
        internal: false,
        infrastructure: false,
        appstore: false
      };
    case 'api-error-spike':
      return {
        analytics: true,
        support: false,
        releases: false,
        internal: true,
        infrastructure: true,
        appstore: false
      };
    default:
      return {
        analytics: true,
        support: false,
        releases: false,
        internal: false,
        infrastructure: false,
        appstore: false
      };
  }
};

// Source data for checkout-drop scenario
const checkoutDropSourceData: Record<string, SourceData[]> = {
  analytics: [
    {
      summary: "Checkout completion dropped 15% starting at 14:00 on May 5th.",
      title: "Analytics Data - Checkout Completion Rate",
      description: "Daily checkout completion rate from May 3rd to May 7th",
      type: "chart",
      chartData: [
        { date: "May 3", value: 84 },
        { date: "May 4", value: 86 },
        { date: "May 5 (AM)", value: 85 },
        { date: "May 5 (PM)", value: 70 },
        { date: "May 6", value: 71 },
        { date: "May 7", value: 72 }
      ],
      metadata: {
        "Time Period": "May 3 - May 7, 2025",
        "Data Source": "Product Analytics",
        "Total Users Affected": "~2,400 users",
        "Average Drop": "15%"
      }
    }
  ],
  support: [
    {
      summary: "15 support tickets reported checkout button not working on mobile.",
      title: "Support Ticket Details",
      description: "Support tickets related to checkout issues on May 5-6",
      type: "list",
      items: [
        "Ticket #4582: 'Unable to complete checkout on iPhone 13, button doesn't do anything' (May 5, 14:23)",
        "Ticket #4583: 'Checkout broken on mobile app' (May 5, 14:45)",
        "Ticket #4587: 'Can't check out on my Android phone, tapping button does nothing' (May 5, 15:12)",
        "Ticket #4590: 'The checkout button stopped working on my phone' (May 5, 15:38)",
        "Ticket #4591: 'Unable to complete purchase on mobile' (May 5, 15:40)"
      ],
      metadata: {
        "Ticket Volume": "15 related tickets",
        "First Reported": "May 5, 14:23",
        "Affected Platforms": "Primarily mobile devices",
        "Common Issue": "Unresponsive checkout button"
      }
    }
  ],
  releases: [
    {
      summary: "Release v2.5.1 deployed at 13:45 on May 5th included mobile checkout UI changes.",
      title: "Release Log Details",
      description: "Details of deployment v2.5.1 on May 5th",
      type: "text",
      content: `# Release v2.5.1
Deployed: May 5, 2025 13:45 UTC
Changes:
- Updated checkout button rendering on mobile devices
- Improved loading time for product catalog
- Fixed search functionality on category pages
- Added new payment provider integration
- Refactored checkout process code for mobile devices

Deployment Notes:
- Progressive rollout started at 13:45
- 100% rollout completed by 14:00
- No deployment errors reported
- No immediate alerts triggered`,
      metadata: {
        "Release Version": "v2.5.1",
        "Deployment Time": "May 5, 13:45 UTC",
        "Deployment Type": "Progressive rollout",
        "Related Changes": "Mobile checkout UI updates"
      }
    }
  ],
  internal: [
    {
      summary: "Mobile team discussed potential issues with new checkout button implementation.",
      title: "Internal Communication Log",
      description: "Slack conversation between development team members on May 5th",
      type: "text",
      content: `[13:52] @sarah_dev: v2.5.1 is fully deployed now, everything looks good on the monitoring dashboard
[14:15] @mike_mobile: did we test the new checkout button implementation on older Android devices?
[14:18] @sarah_dev: I tested on the devices we have in the office, seemed fine
[14:23] @mike_mobile: @alex_qa did you run the checkout test scenario on Android 10?
[14:30] @alex_qa: I focused on iOS and newer Android versions since that's most of our user base
[14:42] @mike_mobile: seeing some early reports of checkout issues on mobile
[14:45] @sarah_dev: checking now, might be related to the event handler change
[15:01] @alex_qa: confirmed issue on older Android. The button appears but doesn't trigger the event
[15:05] @mike_mobile: working on a hotfix now`,
      metadata: {
        "Conversation Time": "May 5, 13:52 - 15:05",
        "Team": "Mobile Development",
        "Key Participants": "Sarah, Mike, Alex",
        "Identified Issue": "Event handler for older Android devices"
      }
    }
  ]
};

// Source data for api-error-spike scenario
const apiErrorSpikeSourceData: Record<string, SourceData[]> = {
  analytics: [
    {
      summary: "API error rate jumped from 0.5% to 15% at 09:30 on May 6th.",
      title: "Analytics Data - API Error Rate",
      description: "API error rate from May 5th to May 7th",
      type: "chart",
      chartData: [
        { date: "May 5 (AM)", value: 0.4 },
        { date: "May 5 (PM)", value: 0.5 },
        { date: "May 6 (09:00)", value: 0.5 },
        { date: "May 6 (09:30)", value: 15 },
        { date: "May 6 (10:00)", value: 14.8 },
        { date: "May 6 (10:30)", value: 5.2 },
        { date: "May 6 (11:00)", value: 0.6 },
        { date: "May 7", value: 0.5 }
      ],
      metadata: {
        "Time Period": "May 5 - May 7, 2025",
        "Data Source": "API Monitoring",
        "Peak Error Rate": "15%",
        "Duration": "Approximately 90 minutes"
      }
    }
  ],
  internal: [
    {
      summary: "Backend team identified database connection pool saturation as the cause.",
      title: "Internal Communication Log",
      description: "Slack conversation between backend team members on May 6th",
      type: "text",
      content: `[09:32] @alertbot: 🚨 ALERT: API error rate above 10% threshold
[09:33] @jenny_backend: looking into it now
[09:35] @dave_ops: seeing a lot of timeout errors, checking server logs
[09:38] @jenny_backend: database connection pool is maxed out
[09:42] @dave_ops: seeing unusual query patterns, looks like someone deployed something?
[09:45] @carlos_data: oh no, my bad - I just deployed a new analytics job that queries the production DB
[09:47] @jenny_backend: @carlos_data that's definitely causing the issue, can you roll it back?
[09:50] @carlos_data: rolling back now
[10:05] @dave_ops: still seeing high connection usage but it's starting to drop
[10:15] @jenny_backend: should we increase the connection pool size anyway?
[10:18] @dave_ops: let's do that as a precaution, PR coming
[10:35] @alertbot: ✅ RESOLVED: API error rate back below threshold`,
      metadata: {
        "Conversation Time": "May 6, 09:32 - 10:35",
        "Team": "Backend & Operations",
        "Key Participants": "Jenny, Dave, Carlos",
        "Root Cause": "Analytics job consuming database connections"
      }
    }
  ],
  infrastructure: [
    {
      summary: "Database connection pool saturated at 09:30, resolved by 10:30.",
      title: "Infrastructure Status Details",
      description: "Database and server metrics from May 6th incident",
      type: "chart",
      chartData: [
        { date: "09:00", value: 45 },
        { date: "09:15", value: 48 },
        { date: "09:30", value: 98 },
        { date: "09:45", value: 100 },
        { date: "10:00", value: 100 },
        { date: "10:15", value: 95 },
        { date: "10:30", value: 60 },
        { date: "10:45", value: 42 }
      ],
      metadata: {
        "Metric": "Database Connection Pool Usage (%)",
        "Time Period": "May 6, 09:00 - 10:45",
        "Peak Usage": "100% (saturated)",
        "Normal Range": "30-50%"
      }
    }
  ]
};

// Get source data for a specific scenario and source
export const getSourceDataForScenario = (
  scenarioKey: string, 
  sourceKey: string,
  evidenceId: number = 0
): SourceData | null => {
  if (scenarioKey === 'checkout-drop') {
    return checkoutDropSourceData[sourceKey]?.[evidenceId] || null;
  }
  
  if (scenarioKey === 'api-error-spike') {
    return apiErrorSpikeSourceData[sourceKey]?.[evidenceId] || null;
  }
  
  return null;
};

// Get hypothesis based on scenario and active sources
export const getHypothesisForScenario = (
  scenarioKey: string, 
  activeSources: SourceAvailability
): Hypothesis => {
  if (scenarioKey === 'checkout-drop') {
    // Full hypothesis with all relevant sources
    if (activeSources.analytics && activeSources.support && activeSources.releases) {
      return {
        conclusion: "Release v2.5.1 caused checkout button failure on mobile devices due to event handler changes.",
        confidence: {
          level: "High",
          percent: 90
        }
      };
    }
    
    // Missing release logs
    if (activeSources.analytics && activeSources.support && !activeSources.releases) {
      return {
        conclusion: "A recent code change likely caused checkout button failures on mobile devices.",
        confidence: {
          level: "Medium",
          percent: 65
        },
        note: "Release data missing for confirmation."
      };
    }
    
    // Missing support tickets
    if (activeSources.analytics && !activeSources.support && activeSources.releases) {
      return {
        conclusion: "Release v2.5.1 coincides with checkout completion drop.",
        confidence: {
          level: "Medium",
          percent: 60
        },
        note: "Support ticket data missing for user impact details."
      };
    }
    
    // Only analytics available
    if (activeSources.analytics && !activeSources.support && !activeSources.releases) {
      return {
        conclusion: "Checkout completion dropped 15% on May 5th afternoon due to unknown causes.",
        confidence: {
          level: "Low",
          percent: 30
        },
        note: "Insufficient data to determine root cause."
      };
    }
    
    // Fallback
    return {
      conclusion: "Insufficient data to determine root cause of checkout completion drop.",
      confidence: {
        level: "Very Low",
        percent: 20
      },
      note: "Critical data sources are missing from analysis."
    };
  }
  
  if (scenarioKey === 'api-error-spike') {
    // Full hypothesis with all relevant sources
    if (activeSources.analytics && activeSources.internal && activeSources.infrastructure) {
      return {
        conclusion: "Database connection pool saturation caused by unauthorized analytics job deployment.",
        confidence: {
          level: "High",
          percent: 95
        }
      };
    }
    
    // Missing internal comms
    if (activeSources.analytics && !activeSources.internal && activeSources.infrastructure) {
      return {
        conclusion: "Database connection pool saturation caused API errors.",
        confidence: {
          level: "Medium",
          percent: 70
        },
        note: "Internal communication data missing for attribution."
      };
    }
    
    // Missing infrastructure data
    if (activeSources.analytics && activeSources.internal && !activeSources.infrastructure) {
      return {
        conclusion: "Analytics job deployment likely caused API errors.",
        confidence: {
          level: "Medium",
          percent: 65
        },
        note: "Infrastructure metrics missing for confirmation."
      };
    }
    
    // Only analytics available
    if (activeSources.analytics && !activeSources.internal && !activeSources.infrastructure) {
      return {
        conclusion: "API error rate spiked to 15% for approximately 90 minutes on May 6th.",
        confidence: {
          level: "Low",
          percent: 25
        },
        note: "Insufficient data to determine root cause."
      };
    }
    
    // Fallback
    return {
      conclusion: "Insufficient data to determine root cause of API error spike.",
      confidence: {
        level: "Very Low",
        percent: 15
      },
      note: "Critical data sources are missing from analysis."
    };
  }
  
  return {
    conclusion: "Unable to analyze this scenario with available data.",
    confidence: {
      level: "None",
      percent: 0
    }
  };
};

// Get supporting evidence based on scenario and active sources
export const getSupportingEvidenceForScenario = (
  scenarioKey: string,
  activeSources: SourceAvailability
): Evidence[] => {
  const evidence: Evidence[] = [];
  
  if (scenarioKey === 'checkout-drop') {
    if (activeSources.analytics) {
      evidence.push({
        source: 'analytics',
        text: "Checkout completion rate dropped from 85% to 70% at 14:00 on May 5th.",
        hasData: true,
        evidenceId: 0
      });
    }
    
    if (activeSources.support) {
      evidence.push({
        source: 'support',
        text: "Multiple support tickets reported checkout button not responding on mobile devices.",
        hasData: true,
        evidenceId: 0
      });
    }
    
    if (activeSources.releases) {
      evidence.push({
        source: 'releases',
        text: "Release v2.5.1 deployed at 13:45 on May 5th included changes to mobile checkout UI.",
        hasData: true,
        evidenceId: 0
      });
    }
    
    if (activeSources.internal) {
      evidence.push({
        source: 'internal',
        text: "Mobile team discussed checkout button implementation issues in Slack.",
        hasData: true,
        evidenceId: 0
      });
    }
  }
  
  if (scenarioKey === 'api-error-spike') {
    if (activeSources.analytics) {
      evidence.push({
        source: 'analytics',
        text: "API error rate jumped from 0.5% to 15% at 09:30 on May 6th and recovered by 11:00.",
        hasData: true,
        evidenceId: 0
      });
    }
    
    if (activeSources.internal) {
      evidence.push({
        source: 'internal',
        text: "Backend team identified an unauthorized analytics job was causing database connection pool saturation.",
        hasData: true,
        evidenceId: 0
      });
    }
    
    if (activeSources.infrastructure) {
      evidence.push({
        source: 'infrastructure',
        text: "Database connection pool reached 100% utilization during the incident period.",
        hasData: true,
        evidenceId: 0
      });
    }
  }
  
  return evidence;
};
