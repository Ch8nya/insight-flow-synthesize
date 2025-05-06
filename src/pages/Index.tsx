
import React, { useState, useEffect, useRef } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import {
  BarChart3, MessageSquare, Ticket, GitCompare, MessagesSquare, Server, AppWindow, 
  X, ChevronDown, ArrowRight, Brain, Target, Calendar, Search, AlertTriangle, Lightbulb, Link
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";

import { 
  scenarios, 
  getSourceDataForScenario,
  getSourceAvailabilityForScenario,
  getHypothesisForScenario,
  getSupportingEvidenceForScenario,
  ScenarioKey
} from '@/data/scenarioData';

// Agent action types for thought stream
type AgentActionType = 'parse' | 'identify' | 'determine' | 'thought' | 'check' | 'finding' | 'warning' | 'correlate' | 'hypothesis';

interface AgentAction {
  type: AgentActionType;
  icon: React.ReactNode;
  label: string;
  content: string;
  timestamp: Date;
  sourceKey?: string;
}

const Index = () => {
  // State management
  const [queryInput, setQueryInput] = useState("What happened to our checkout conversion yesterday afternoon?");
  const [inferredScenario, setInferredScenario] = useState<ScenarioKey>('checkout-drop');
  const [activeSources, setActiveSources] = useState({
    analytics: true,
    support: true,
    releases: true,
    internal: false,
    infrastructure: false,
    appstore: false
  });
  const [analysisState, setAnalysisState] = useState('idle'); // 'idle', 'processing', 'complete'
  const [currentProcessingStep, setCurrentProcessingStep] = useState(0);
  const [processedSources, setProcessedSources] = useState<string[]>([]);
  const [dialogContent, setDialogContent] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [agentActions, setAgentActions] = useState<AgentAction[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  
  const thoughtStreamRef = useRef<HTMLDivElement>(null);

  // Function to infer scenario from query
  const inferScenarioFromQuery = (query: string): ScenarioKey => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('checkout') || lowerQuery.includes('conversion') || lowerQuery.includes('may 5th')) {
      return 'checkout-drop';
    } else if (lowerQuery.includes('api') || lowerQuery.includes('error') || lowerQuery.includes('may 6th')) {
      return 'api-error-spike';
    }
    // Default to checkout scenario if no match
    return 'checkout-drop';
  };

  // Update inferred scenario when the query changes
  useEffect(() => {
    const newScenario = inferScenarioFromQuery(queryInput);
    if (newScenario !== inferredScenario) {
      setInferredScenario(newScenario);
    }
  }, [queryInput]);

  // Set initial active sources when scenario changes
  useEffect(() => {
    const defaultSources = getSourceAvailabilityForScenario(inferredScenario);
    setActiveSources(prevSources => ({
      analytics: defaultSources.analytics || prevSources.analytics,
      support: defaultSources.support || prevSources.support,
      releases: defaultSources.releases || prevSources.releases,
      internal: defaultSources.internal || prevSources.internal,
      infrastructure: defaultSources.infrastructure || prevSources.infrastructure,
      appstore: defaultSources.appstore || prevSources.appstore
    }));
    setAnalysisState('idle');
    setProcessedSources([]);
    setCurrentProcessingStep(0);
    setAgentActions([]);
    setShowSummary(false);
  }, [inferredScenario]);

  // Scroll thought stream to bottom when new actions are added
  useEffect(() => {
    if (thoughtStreamRef.current && agentActions.length > 0) {
      thoughtStreamRef.current.scrollTop = thoughtStreamRef.current.scrollHeight;
    }
  }, [agentActions]);

  // Prepare agent action content for a specific phase
  const prepareAgentActions = () => {
    const actions: AgentAction[] = [];
    const currentDate = new Date(2025, 4, 6); // May 6, 2025
    let actionDelay = 0;
    
    // Phase 1: Understanding the query & initial hypothesis
    if (inferredScenario === 'checkout-drop') {
      actions.push({
        type: 'parse',
        icon: <Brain className="h-5 w-5" />,
        label: 'Parsing Query',
        content: 'Identified key terms: "checkout conversion", "yesterday afternoon".',
        timestamp: new Date(currentDate.getTime() + actionDelay)
      });
      actionDelay += 1000;

      actions.push({
        type: 'identify',
        icon: <Target className="h-5 w-5" />,
        label: 'Identifying Relevant KPI',
        content: 'Mapping to "Checkout Completion Rate".',
        timestamp: new Date(currentDate.getTime() + actionDelay)
      });
      actionDelay += 1000;

      actions.push({
        type: 'determine',
        icon: <Calendar className="h-5 w-5" />,
        label: 'Determining Time Window',
        content: 'Focus: May 5th (based on "yesterday afternoon" from query and current date).',
        timestamp: new Date(currentDate.getTime() + actionDelay)
      });
      actionDelay += 1000;

      actions.push({
        type: 'thought',
        icon: <ChevronDown className="h-5 w-5" />,
        label: 'Initial thought',
        content: 'A drop in checkout conversion often relates to recent releases, payment issues, or UI bugs. Will prioritize these data sources.',
        timestamp: new Date(currentDate.getTime() + actionDelay)
      });
      actionDelay += 1000;
    } else if (inferredScenario === 'api-error-spike') {
      actions.push({
        type: 'parse',
        icon: <Brain className="h-5 w-5" />,
        label: 'Parsing Query',
        content: 'Identified key terms: "API error spike", "May 6th".',
        timestamp: new Date(currentDate.getTime() + actionDelay)
      });
      actionDelay += 1000;

      actions.push({
        type: 'identify',
        icon: <Target className="h-5 w-5" />,
        label: 'Identifying Relevant KPI',
        content: 'Mapping to "API Error Rate".',
        timestamp: new Date(currentDate.getTime() + actionDelay)
      });
      actionDelay += 1000;

      actions.push({
        type: 'determine',
        icon: <Calendar className="h-5 w-5" />,
        label: 'Determining Time Window',
        content: 'Focus: May 6th (based on query specification).',
        timestamp: new Date(currentDate.getTime() + actionDelay)
      });
      actionDelay += 1000;

      actions.push({
        type: 'thought',
        icon: <ChevronDown className="h-5 w-5" />,
        label: 'Initial thought',
        content: 'API error spikes typically relate to infrastructure issues, load problems, or code deployments. Will check these sources first.',
        timestamp: new Date(currentDate.getTime() + actionDelay)
      });
      actionDelay += 1000;
    }
    
    return { actions, nextDelay: actionDelay };
  };

  // Simulated analysis process
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (analysisState === 'processing') {
      // Initial agent actions
      if (currentProcessingStep === 0) {
        const { actions, nextDelay } = prepareAgentActions();
        
        // Add initial actions with sequential timing
        for (let i = 0; i < actions.length; i++) {
          timer = setTimeout(() => {
            setAgentActions(prev => [...prev, actions[i]]);
          }, i * 800);
        }
        
        timer = setTimeout(() => {
          setCurrentProcessingStep(1);
        }, actions.length * 800 + 500);
        
        return () => clearTimeout(timer);
      }
      
      // Phase 2: Data source querying
      if (currentProcessingStep === 1) {
        const relevantSources = Object.entries(activeSources)
          .filter(([_, isActive]) => isActive)
          .map(([source]) => source);
        
        const sourcesToCheck = relevantSources.filter(source => 
          getSourceAvailabilityForScenario(inferredScenario)[source]
        );

        if (processedSources.length < sourcesToCheck.length) {
          const sourceKey = sourcesToCheck[processedSources.length];
          const isRelevant = getSourceAvailabilityForScenario(inferredScenario)[sourceKey];
          const sourceData = getSourceDataForScenario(inferredScenario, sourceKey);
          
          // Add "checking" action
          timer = setTimeout(() => {
            const checkingAction: AgentAction = {
              type: 'check',
              icon: <Search className="h-5 w-5" />,
              label: `Checking ${sourceLabels[sourceKey]}`,
              content: getCheckingContent(sourceKey, inferredScenario),
              timestamp: new Date(),
              sourceKey
            };
            setAgentActions(prev => [...prev, checkingAction]);
          }, 800);
          
          // Add finding or warning action
          timer = setTimeout(() => {
            const nextAction: AgentAction = isRelevant && sourceData
              ? {
                  type: 'finding',
                  icon: <Lightbulb className="h-5 w-5" />,
                  label: `Finding - ${sourceLabels[sourceKey]}`,
                  content: sourceData.summary,
                  timestamp: new Date(),
                  sourceKey
                }
              : {
                  type: 'warning',
                  icon: <AlertTriangle className="h-5 w-5" />,
                  label: `Log - ${sourceLabels[sourceKey]}`,
                  content: `Source not selected or no relevant data available for analysis.`,
                  timestamp: new Date(),
                  sourceKey
                };
                
            setAgentActions(prev => [...prev, nextAction]);
            
            // Add a thought after relevant findings
            if (isRelevant && sourceData) {
              timer = setTimeout(() => {
                const thoughtAction: AgentAction = {
                  type: 'thought',
                  icon: <ChevronDown className="h-5 w-5" />,
                  label: 'Thought',
                  content: getThoughtContent(sourceKey, inferredScenario),
                  timestamp: new Date(),
                  sourceKey
                };
                setAgentActions(prev => [...prev, thoughtAction]);
              }, 800);
            }

            setProcessedSources(prev => [...prev, sourceKey]);
          }, 1600);
        } else if (processedSources.length === sourcesToCheck.length) {
          // Phase 3: Correlation after all sources processed
          timer = setTimeout(() => {
            const correlationAction: AgentAction = {
              type: 'correlate',
              icon: <Link className="h-5 w-5" />,
              label: 'Correlating Evidence',
              content: getCorrelationContent(inferredScenario, activeSources),
              timestamp: new Date()
            };
            setAgentActions(prev => [...prev, correlationAction]);
            
            timer = setTimeout(() => {
              const hypothesisAction: AgentAction = {
                type: 'hypothesis',
                icon: <Lightbulb className="h-5 w-5" />,
                label: 'Forming Hypothesis',
                content: `Evidence ${getHypothesisConfidenceText(inferredScenario, activeSources)} suggests ${getHypothesisForScenario(inferredScenario, activeSources).conclusion.toLowerCase()}`,
                timestamp: new Date()
              };
              setAgentActions(prev => [...prev, hypothesisAction]);
              
              timer = setTimeout(() => {
                setShowSummary(true);
                timer = setTimeout(() => {
                  setAnalysisState('complete');
                }, 800);
              }, 1000);
            }, 1200);
          }, 1500);
        }
      }
    }
    
    return () => clearTimeout(timer);
  }, [analysisState, currentProcessingStep, activeSources, processedSources, inferredScenario]);

  // Start analysis process
  const handleAnalyze = () => {
    setAnalysisState('processing');
    setProcessedSources([]);
    setCurrentProcessingStep(0);
    setAgentActions([]);
    setShowSummary(false);
    toast.info("Starting analysis for " + scenarios[inferredScenario].title);
  };

  // Show evidence dialog
  const handleShowEvidence = (sourceKey: string, evidenceId: number) => {
    const data = getSourceDataForScenario(inferredScenario, sourceKey, evidenceId);
    setDialogContent(data);
    setShowDialog(true);
  };

  // Toggle data source
  const toggleSource = (source: string) => {
    setActiveSources(prev => ({
      ...prev,
      [source]: !prev[source]
    }));
    
    // Reset analysis if we change sources
    if (analysisState !== 'idle') {
      setAnalysisState('idle');
    }
  };

  // Get hypothesis confidence text
  const getHypothesisConfidenceText = (scenarioKey: string, sources: any): string => {
    const confidence = getHypothesisForScenario(scenarioKey, sources).confidence;
    if (confidence.level === "High") return "strongly";
    if (confidence.level === "Medium") return "moderately";
    if (confidence.level === "Low") return "weakly";
    return "";
  };

  // Get checking content based on source and scenario
  const getCheckingContent = (sourceKey: string, scenarioKey: string): string => {
    if (scenarioKey === 'checkout-drop') {
      switch (sourceKey) {
        case 'analytics':
          return "Looking for anomalies in Checkout Completion Rate around May 5th...";
        case 'support':
          return "Searching for user-reported issues related to checkout around the anomaly time...";
        case 'releases':
          return "Examining deployments around May 5th, 14:00 UTC...";
        case 'internal':
          return "Scanning internal communications for relevant discussions on May 5th...";
        default:
          return `Checking ${sourceLabels[sourceKey]} for relevant data...`;
      }
    } else if (scenarioKey === 'api-error-spike') {
      switch (sourceKey) {
        case 'analytics':
          return "Analyzing API error rate metrics for May 6th...";
        case 'infrastructure':
          return "Examining infrastructure status and metrics around the time of the spike...";
        case 'internal':
          return "Reviewing internal discussions related to API stability on May 6th...";
        default:
          return `Checking ${sourceLabels[sourceKey]} for relevant data...`;
      }
    }
    return `Checking ${sourceLabels[sourceKey]} for relevant data...`;
  };

  // Get thought content based on source and scenario
  const getThoughtContent = (sourceKey: string, scenarioKey: string): string => {
    if (scenarioKey === 'checkout-drop') {
      switch (sourceKey) {
        case 'analytics':
          return "This drop is sharp and significant. Correlates with the query time. What else happened around then?";
        case 'support':
          return "Mobile-specific issues. This narrows it down. Was there a mobile-related deployment?";
        case 'releases':
          return "Release v2.5.1 timing aligns with the analytics drop. Mobile checkout UI changes mentioned - this could be our primary suspect.";
        case 'internal':
          return "Team discussions confirm issues with the mobile checkout button implementation. This strengthens the release hypothesis.";
        default:
          return "Interesting finding. Let me continue gathering more context.";
      }
    } else if (scenarioKey === 'api-error-spike') {
      switch (sourceKey) {
        case 'analytics':
          return "The error rate increased suddenly and significantly. This suggests a single cause rather than gradual degradation.";
        case 'infrastructure':
          return "Database connection pool saturation is a strong indicator. What might have caused this resource constraint?";
        case 'internal':
          return "The team identified a specific analytics job deployment as the cause. This helps pinpoint the exact trigger.";
        default:
          return "Interesting finding. Let me continue gathering more context.";
      }
    }
    return "Interesting finding. Let me continue gathering more context.";
  };

  // Get correlation content based on scenario and available sources
  const getCorrelationContent = (scenarioKey: string, sources: any): string => {
    if (scenarioKey === 'checkout-drop') {
      if (sources.analytics && sources.support && sources.releases) {
        return "Temporal analysis: Analytics drop (14:10) occurred shortly after Release v2.5.1 (13:45). Support tickets (14:23) followed. Semantic link: 'Mobile checkout UI changes' in release notes matches 'Payment Button Unresponsive' from tickets.";
      } else if (sources.analytics && sources.support) {
        return "Temporal analysis: Analytics drop (14:10) followed by support tickets (14:23). Pattern suggests a sudden technical issue affecting mobile users specifically.";
      } else if (sources.analytics && sources.releases) {
        return "Temporal analysis: Analytics drop (14:10) occurred shortly after Release v2.5.1 (13:45). Release notes mention mobile checkout UI changes that coincide with the timing of the drop.";
      } else if (sources.analytics) {
        return "Analytics data shows a clear drop in checkout completion, but without additional sources, specific cause determination is limited.";
      }
    } else if (scenarioKey === 'api-error-spike') {
      if (sources.analytics && sources.internal && sources.infrastructure) {
        return "Database connection pool saturation (100%) matches exactly with API error rate spike (15%). Internal communications identify unauthorized analytics job deployment as the direct cause.";
      } else if (sources.analytics && sources.infrastructure) {
        return "API error rate spike correlates directly with database connection pool saturation. Resource constraint appears to be the technical cause.";
      } else if (sources.analytics && sources.internal) {
        return "Team communications identify an analytics job deployment coinciding with the API error rate spike. Suggests a database-related resource issue.";
      } else if (sources.analytics) {
        return "API error pattern shows a sudden spike and recovery, suggesting a temporary resource constraint or deployment issue.";
      }
    }
    return "Limited correlation possible due to insufficient data sources.";
  };

  // Get supporting evidence based on current scenario and active sources
  const getSupportingEvidence = () => {
    return getSupportingEvidenceForScenario(inferredScenario, activeSources);
  };

  // Source icon mapping
  const sourceIcons = {
    analytics: <BarChart3 className="mr-2 h-5 w-5" />,
    support: <MessageSquare className="mr-2 h-5 w-5" />,
    releases: <GitCompare className="mr-2 h-5 w-5" />,
    internal: <MessagesSquare className="mr-2 h-5 w-5" />,
    infrastructure: <Server className="mr-2 h-5 w-5" />,
    appstore: <AppWindow className="mr-2 h-5 w-5" />,
  };

  // Source label mapping
  const sourceLabels = {
    analytics: "Product Analytics",
    support: "Support Tickets",
    releases: "Release Logs",
    internal: "Internal Comms",
    infrastructure: "Infrastructure Status",
    appstore: "App Store Reviews",
  };

  // Agent action icon mapping
  const getActionIcon = (type: AgentActionType) => {
    switch (type) {
      case 'parse': return <Brain className="h-5 w-5" />;
      case 'identify': return <Target className="h-5 w-5" />;
      case 'determine': return <Calendar className="h-5 w-5" />;
      case 'thought': return <ChevronDown className="h-5 w-5" />;
      case 'check': return <Search className="h-5 w-5" />;
      case 'finding': return <Lightbulb className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      case 'correlate': return <Link className="h-5 w-5" />;
      case 'hypothesis': return <Lightbulb className="h-5 w-5" />;
      default: return <ChevronDown className="h-5 w-5" />;
    }
  };

  // Get color for agent action based on type
  const getActionColor = (type: AgentActionType) => {
    switch (type) {
      case 'parse': return 'text-purple-500';
      case 'identify': return 'text-blue-500';
      case 'determine': return 'text-green-500';
      case 'thought': return 'text-gray-500';
      case 'check': return 'text-blue-500';
      case 'finding': return 'text-green-500';
      case 'warning': return 'text-amber-500';
      case 'correlate': return 'text-indigo-500';
      case 'hypothesis': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  // Get background color for agent action based on type
  const getActionBgColor = (type: AgentActionType) => {
    switch (type) {
      case 'parse': return 'bg-purple-50';
      case 'identify': return 'bg-blue-50';
      case 'determine': return 'bg-green-50';
      case 'thought': return 'bg-gray-50';
      case 'check': return 'bg-blue-50';
      case 'finding': return 'bg-green-50';
      case 'warning': return 'bg-amber-50';
      case 'correlate': return 'bg-indigo-50';
      case 'hypothesis': return 'bg-purple-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Main container */}
      <div className="flex flex-col sm:flex-row min-h-screen w-full max-w-7xl mx-auto">
        {/* Sidebar */}
        <motion.div 
          className="bg-white w-full sm:w-72 border-r border-gray-100 p-6 shadow-sm"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Insight Flow</h2>
            <p className="text-sm text-gray-500">AI Root Cause Analysis</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Data Sources</h3>
            
            <div className="space-y-4">
              {Object.entries(sourceLabels).map(([key, label]) => (
                <div 
                  key={key}
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                    activeSources[key] ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`${activeSources[key] ? 'text-blue-600' : 'text-gray-500'}`}>
                      {sourceIcons[key]}
                    </div>
                    <span className={`text-sm ${activeSources[key] ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                      {label}
                    </span>
                  </div>
                  <Switch 
                    checked={activeSources[key]} 
                    onCheckedChange={() => toggleSource(key)}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              All systems operational
            </div>
          </div>
        </motion.div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col p-6 pb-0">
          {/* Top area with query input */}
          <motion.div 
            className="mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Root Cause Analysis</h1>
            </div>
            
            <p className="text-gray-600 mb-4">
              Ask the AI agent to investigate and diagnose KPI changes by analyzing various data sources.
            </p>
            
            <Separator className="my-4" />
          </motion.div>

          {/* Analysis input area */}
          <motion.div
            className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 p-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <Input
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="What do you want to investigate?"
                  className="w-full"
                />
              </div>
              <Button 
                onClick={handleAnalyze}
                disabled={analysisState === 'processing'}
                className="px-6 whitespace-nowrap"
              >
                {analysisState === 'processing' ? "Analyzing..." : "Analyze"}
                {analysisState !== 'processing' && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </motion.div>

          {/* Main content/results area */}
          <div className="flex-1 overflow-y-auto pb-6">
            <AnimatePresence mode="wait">
              {analysisState === 'idle' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                  key="idle-state"
                >
                  <div className="w-16 h-16 mb-4 text-blue-500 opacity-50">
                    {inferredScenario === 'checkout-drop' ? 
                      <BarChart3 size={64} strokeWidth={1} /> : 
                      <Server size={64} strokeWidth={1} />
                    }
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Ready to analyze
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    Click the Analyze button to start processing data from the selected sources.
                  </p>
                </motion.div>
              )}

              {analysisState === 'processing' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                  key="processing-state"
                >
                  {/* Query acknowledgement */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
                  >
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Query Received</h3>
                    <p className="text-gray-800">{queryInput}</p>
                  </motion.div>

                  {/* Thought stream log */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Agent Reasoning Process</h3>
                    <div 
                      ref={thoughtStreamRef}
                      className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 max-h-[400px] overflow-y-auto"
                    >
                      {agentActions.map((action, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`p-3 rounded-lg mb-3 ${getActionBgColor(action.type)} border border-${getActionBgColor(action.type).replace('bg-', 'border-')}`}
                        >
                          <div className="flex items-start">
                            <div className={`mr-3 mt-1 ${getActionColor(action.type)}`}>
                              {getActionIcon(action.type)}
                            </div>
                            <div className="flex-1">
                              <h4 className={`text-xs font-bold uppercase ${getActionColor(action.type)}`}>
                                Agent {action.label}
                              </h4>
                              <p className="text-sm mt-1 text-gray-700">{action.content}</p>
                              {action.type === 'finding' && action.sourceKey && (
                                <button
                                  onClick={() => handleShowEvidence(action.sourceKey, 0)}
                                  className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800 inline-flex items-center"
                                >
                                  See Data
                                  <ArrowRight className="ml-1 h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Loading indicator when processing */}
                      {currentProcessingStep === 1 && processedSources.length < Object.values(activeSources).filter(Boolean).length && (
                        <div className="flex items-center justify-center py-2">
                          <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse mr-1"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-1" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-blue-700 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Summary area that appears after agent processing */}
                  {showSummary && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                    >
                      <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                          Synthesized Root Cause Analysis
                        </h2>
                        <p className="text-gray-600">
                          Analysis for: <span className="font-medium">{queryInput}</span>
                        </p>
                      </div>
                      
                      <div className="p-6 bg-white">
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Hypothesis & Confidence</h3>
                          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                            <div className="flex items-start">
                              <div className="mr-3 mt-0.5 text-blue-500">
                                <Lightbulb className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-blue-800 font-medium">
                                  {getHypothesisForScenario(inferredScenario, activeSources).conclusion}
                                </p>
                                <div className="mt-2 flex items-center">
                                  <span className="text-sm text-blue-600 mr-2">Confidence: {getHypothesisForScenario(inferredScenario, activeSources).confidence.level}</span>
                                  <div className="bg-blue-200 h-2 rounded-full w-24 overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${getHypothesisForScenario(inferredScenario, activeSources).confidence.percent}%` }}
                                      transition={{ duration: 1, delay: 0.2 }}
                                      className="h-full bg-blue-600"
                                    />
                                  </div>
                                  <span className="text-sm text-blue-600 ml-2">
                                    {getHypothesisForScenario(inferredScenario, activeSources).confidence.percent}%
                                  </span>
                                </div>
                                {getHypothesisForScenario(inferredScenario, activeSources).note && (
                                  <p className="text-xs text-blue-600 italic mt-2">{getHypothesisForScenario(inferredScenario, activeSources).note}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Supporting Evidence</h3>
                          <div className="space-y-3">
                            {getSupportingEvidence().map((evidence, index) => (
                              <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                className="p-4 border border-gray-100 rounded-lg"
                              >
                                <div className="flex items-start">
                                  <div className="mr-3 mt-0.5 text-gray-400">
                                    {sourceIcons[evidence.source]}
                                  </div>
                                  <div>
                                    <div className="flex items-center mb-1">
                                      <h4 className="text-sm font-medium text-gray-700">
                                        {sourceLabels[evidence.source]}
                                      </h4>
                                    </div>
                                    <p className="text-sm text-gray-600">{evidence.text}</p>
                                    {evidence.hasData && (
                                      <button
                                        onClick={() => handleShowEvidence(evidence.source, evidence.evidenceId)}
                                        className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800 inline-flex items-center"
                                      >
                                        See Data
                                        <ArrowRight className="ml-1 h-3 w-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Reasoning Summary</h3>
                          <p className="text-gray-600 text-sm">
                            {inferredScenario === 'checkout-drop' && Object.values(activeSources).filter(Boolean).length >= 2 ? 
                              "The agent identified a significant checkout completion drop in Analytics, correlated it with mobile-specific customer reports from Support, and linked it to the mobile UI changes in Release v2.5.1. The temporal alignment and semantic connections between these data sources led to this conclusion." :
                              inferredScenario === 'api-error-spike' && Object.values(activeSources).filter(Boolean).length >= 2 ?
                              "The agent detected a sharp API error rate spike, identified database connection pool saturation in Infrastructure metrics, and discovered the root cause in Internal communications pointing to an unauthorized analytics job. The exact timing correlation between these events established the causal relationship." :
                              "The agent analyzed the available data sources to form a hypothesis, but additional data sources would strengthen the analysis and provide higher confidence in the conclusion."
                            }
                          </p>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="mt-8 flex justify-end">
                          <Button 
                            variant="outline" 
                            className="mr-3"
                            onClick={() => setAnalysisState('idle')}
                          >
                            Reset Analysis
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {analysisState === 'complete' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                  key="complete-state"
                >
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      Synthesized Root Cause Analysis
                    </h2>
                    <p className="text-gray-600">
                      Analysis for: <span className="font-medium">{queryInput}</span>
                    </p>
                  </div>
                  
                  <div className="p-6 bg-white">
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Hypothesis & Confidence</h3>
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="mr-3 mt-0.5 text-blue-500">
                            <Lightbulb className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-blue-800 font-medium">
                              {getHypothesisForScenario(inferredScenario, activeSources).conclusion}
                            </p>
                            <div className="mt-2 flex items-center">
                              <span className="text-sm text-blue-600 mr-2">Confidence: {getHypothesisForScenario(inferredScenario, activeSources).confidence.level}</span>
                              <div className="bg-blue-200 h-2 rounded-full w-24 overflow-hidden">
                                <div 
                                  style={{ width: `${getHypothesisForScenario(inferredScenario, activeSources).confidence.percent}%` }}
                                  className="h-full bg-blue-600"
                                />
                              </div>
                              <span className="text-sm text-blue-600 ml-2">
                                {getHypothesisForScenario(inferredScenario, activeSources).confidence.percent}%
                              </span>
                            </div>
                            {getHypothesisForScenario(inferredScenario, activeSources).note && (
                              <p className="text-xs text-blue-600 italic mt-2">{getHypothesisForScenario(inferredScenario, activeSources).note}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Supporting Evidence</h3>
                      <div className="space-y-3">
                        {getSupportingEvidence().map((evidence, index) => (
                          <div 
                            key={index}
                            className="p-4 border border-gray-100 rounded-lg"
                          >
                            <div className="flex items-start">
                              <div className="mr-3 mt-0.5 text-gray-400">
                                {sourceIcons[evidence.source]}
                              </div>
                              <div>
                                <div className="flex items-center mb-1">
                                  <h4 className="text-sm font-medium text-gray-700">
                                    {sourceLabels[evidence.source]}
                                  </h4>
                                </div>
                                <p className="text-sm text-gray-600">{evidence.text}</p>
                                {evidence.hasData && (
                                  <button
                                    onClick={() => handleShowEvidence(evidence.source, evidence.evidenceId)}
                                    className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800 inline-flex items-center"
                                  >
                                    See Data
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Reasoning Summary</h3>
                      <p className="text-gray-600 text-sm">
                        {inferredScenario === 'checkout-drop' && Object.values(activeSources).filter(Boolean).length >= 2 ? 
                          "The agent identified a significant checkout completion drop in Analytics, correlated it with mobile-specific customer reports from Support, and linked it to the mobile UI changes in Release v2.5.1. The temporal alignment and semantic connections between these data sources led to this conclusion." :
                          inferredScenario === 'api-error-spike' && Object.values(activeSources).filter(Boolean).length >= 2 ?
                          "The agent detected a sharp API error rate spike, identified database connection pool saturation in Infrastructure metrics, and discovered the root cause in Internal communications pointing to an unauthorized analytics job. The exact timing correlation between these events established the causal relationship." :
                          "The agent analyzed the available data sources to form a hypothesis, but additional data sources would strengthen the analysis and provide higher confidence in the conclusion."
                        }
                      </p>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="mt-8 flex justify-end">
                      <Button 
                        variant="outline" 
                        className="mr-3"
                        onClick={() => setAnalysisState('idle')}
                      >
                        Reset Analysis
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Evidence Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {dialogContent?.title}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {dialogContent?.description}
            </DialogDescription>
          </DialogHeader>
          
          <DialogClose className="absolute right-4 top-4 opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          <div className="mt-2">
            {dialogContent?.type === 'chart' && (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dialogContent.chartData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ r: 3 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {dialogContent?.type === 'text' && (
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                {dialogContent.content}
              </div>
            )}
            
            {dialogContent?.type === 'list' && (
              <ul className="space-y-2">
                {dialogContent.items.map((item, idx) => (
                  <li key={idx} className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
            )}
            
            {dialogContent?.metadata && (
              <div className="mt-4 text-xs text-gray-500">
                {Object.entries(dialogContent.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-t border-gray-100 py-2">
                    <span className="font-medium">{key}:</span>
                    <span>{value as React.ReactNode}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
