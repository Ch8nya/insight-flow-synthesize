
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import {
  BarChart3, MessageSquare, Ticket, GitCompare, MessagesSquare, Server, AppWindow, 
  X, ChevronDown, ArrowRight
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

import { 
  scenarios, 
  getSourceDataForScenario,
  getSourceAvailabilityForScenario,
  getHypothesisForScenario,
  getSupportingEvidenceForScenario
} from '@/data/scenarioData';

const Index = () => {
  // State management
  const [selectedScenario, setSelectedScenario] = useState('checkout-drop');
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

  // Set initial active sources when scenario changes
  useEffect(() => {
    const defaultSources = getSourceAvailabilityForScenario(selectedScenario);
    setActiveSources({...defaultSources});
    setAnalysisState('idle');
    setProcessedSources([]);
    setCurrentProcessingStep(0);
  }, [selectedScenario]);

  // Simulated analysis process
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (analysisState === 'processing') {
      const relevantSources = Object.entries(activeSources)
        .filter(([_, isActive]) => isActive)
        .map(([source]) => source);
      
      if (currentProcessingStep < relevantSources.length) {
        timer = setTimeout(() => {
          setProcessedSources(prev => [...prev, relevantSources[currentProcessingStep]]);
          setCurrentProcessingStep(prev => prev + 1);
        }, 800);
      } else if (currentProcessingStep === relevantSources.length) {
        timer = setTimeout(() => {
          setAnalysisState('complete');
        }, 1500);
      }
    }
    
    return () => clearTimeout(timer);
  }, [analysisState, currentProcessingStep, activeSources]);

  // Start analysis process
  const handleAnalyze = () => {
    setAnalysisState('processing');
    setProcessedSources([]);
    setCurrentProcessingStep(0);
    toast.info("Starting analysis for " + scenarios[selectedScenario].title);
  };

  // Show evidence dialog
  const handleShowEvidence = (sourceKey: string, evidenceId: number) => {
    const data = getSourceDataForScenario(selectedScenario, sourceKey, evidenceId);
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

  // Determine if a source is required for current scenario
  const isSourceRelevantForScenario = (source: string) => {
    return getSourceAvailabilityForScenario(selectedScenario)[source];
  };

  // Set scenario
  const handleScenarioChange = (value: string) => {
    setSelectedScenario(value);
  };

  // Get hypothesis based on current scenario and active sources
  const getHypothesis = () => {
    return getHypothesisForScenario(selectedScenario, activeSources);
  };

  // Get supporting evidence based on current scenario and active sources
  const getSupportingEvidence = () => {
    return getSupportingEvidenceForScenario(selectedScenario, activeSources);
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
                  } ${
                    isSourceRelevantForScenario(key) ? 'opacity-100' : 'opacity-60'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`${activeSources[key] ? 'text-blue-600' : 'text-gray-500'}`}>
                      {sourceIcons[key]}
                    </div>
                    <span className={`text-sm ${activeSources[key] ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                      {label}
                    </span>
                    {isSourceRelevantForScenario(key) && (
                      <div className="ml-2">
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          Relevant
                        </Badge>
                      </div>
                    )}
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
          {/* Top area with scenario selection */}
          <motion.div 
            className="mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Root Cause Analysis</h1>
              
              <div className="w-full sm:w-64">
                <Select value={selectedScenario} onValueChange={handleScenarioChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checkout-drop">Checkout Completion Drop (May 5th)</SelectItem>
                    <SelectItem value="api-error-spike">API Error Rate Spike (May 6th)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">
              {scenarios[selectedScenario].description}
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <div className="flex-1 text-gray-800 font-medium mb-4 sm:mb-0">
                <span className="text-sm text-gray-500">Query:</span>
                <div className="mt-1">{scenarios[selectedScenario].query}</div>
              </div>
              <Button 
                onClick={handleAnalyze}
                disabled={analysisState === 'processing'}
                className="px-6"
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
                    {selectedScenario === 'checkout-drop' ? 
                      <BarChart3 size={64} strokeWidth={1} /> : 
                      <Server size={64} strokeWidth={1} />
                    }
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Ready to analyze the '{scenarios[selectedScenario].title}' scenario
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
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Query Acknowledged</h3>
                    <p className="text-gray-800">{scenarios[selectedScenario].query}</p>
                  </motion.div>

                  {/* Source checking */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Source Checking</h3>
                    <div className="space-y-3">
                      {Object.entries(activeSources)
                        .filter(([_, isActive]) => isActive)
                        .map(([source, _], index) => {
                          const isProcessed = processedSources.includes(source);
                          const sourceData = getSourceDataForScenario(selectedScenario, source);
                          const isRelevant = isSourceRelevantForScenario(source);
                          
                          return (
                            <motion.div
                              key={source}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ 
                                opacity: isProcessed ? 1 : 0.5, 
                                x: 0,
                              }}
                              transition={{ delay: 0.3 + index * 0.2 }}
                              className={`bg-white p-4 rounded-lg border ${
                                isProcessed 
                                  ? isRelevant 
                                    ? "border-blue-200" 
                                    : "border-gray-200"
                                  : "border-gray-100"
                              } shadow-sm`}
                            >
                              <div className="flex items-start">
                                <div className={`mr-3 mt-1 ${
                                  isProcessed 
                                    ? isRelevant 
                                      ? "text-blue-500" 
                                      : "text-gray-400"
                                    : "text-gray-300"
                                }`}>
                                  {sourceIcons[source]}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center mb-1">
                                    <h4 className={`text-sm font-medium ${
                                      isProcessed
                                        ? isRelevant 
                                          ? "text-blue-700" 
                                          : "text-gray-600"
                                        : "text-gray-400"
                                    }`}>
                                      {sourceLabels[source]}
                                    </h4>
                                    {isProcessed && (
                                      <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                                        Processed
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  {isProcessed && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      {isRelevant ? (
                                        <p className="text-sm text-gray-700 mt-1">
                                          {sourceData?.summary}
                                        </p>
                                      ) : (
                                        <p className="text-sm text-gray-500 italic mt-1">
                                          Source checked but no significant findings for this scenario.
                                        </p>
                                      )}
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                    </div>
                  </div>
                  
                  {/* Synthesizing animation */}
                  {currentProcessingStep >= Object.values(activeSources).filter(Boolean).length && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center py-6"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-blue-200 border-t-blue-500 animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-blue-500">
                          <BarChart3 className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-3">Synthesizing results...</p>
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
                      Analysis complete for: <span className="font-medium">{scenarios[selectedScenario].query}</span>
                    </p>
                  </div>
                  
                  <div className="p-6 bg-white">
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Hypothesis & Confidence</h3>
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="mr-3 mt-0.5 text-blue-500">
                            <ChevronDown className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-blue-800 font-medium">
                              {getHypothesis().conclusion}
                            </p>
                            <div className="mt-2 flex items-center">
                              <span className="text-sm text-blue-600 mr-2">Confidence: {getHypothesis().confidence.level}</span>
                              <div className="bg-blue-200 h-2 rounded-full w-24 overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${getHypothesis().confidence.percent}%` }}
                                  transition={{ duration: 1, delay: 0.2 }}
                                  className="h-full bg-blue-600"
                                />
                              </div>
                              <span className="text-sm text-blue-600 ml-2">
                                {getHypothesis().confidence.percent}%
                              </span>
                            </div>
                            {getHypothesis().note && (
                              <p className="text-xs text-blue-600 italic mt-2">{getHypothesis().note}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
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
                                    See Data ({evidence.evidenceId})
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
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
                    <span>{value}</span>
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
