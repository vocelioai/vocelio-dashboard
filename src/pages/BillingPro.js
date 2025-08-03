import React, { useState, useEffect } from 'react';
import { 
  CreditCard, DollarSign, TrendingUp, BarChart3, PieChart,
  Calendar, Clock, Phone, Zap, Award, Crown, Star,
  AlertTriangle, CheckCircle, XCircle, Download, Settings, 
  Edit, Eye, MoreHorizontal, Plus, RefreshCw, Receipt, 
  Shield, Package, Activity, Network, ArrowUpRight, 
  ArrowDownRight, Mail, Bell, Calculator, Timer, 
  Brain, AlertCircle, Trash2, PhoneCall, Wallet, 
  Loader, FileText
} from 'lucide-react';

const BillingProCenter = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeCalls, setActiveCalls] = useState(0);
  const [liveCallCost, setLiveCallCost] = useState(0);
  const [topUpAmount, setTopUpAmount] = useState(100);
  const [autoRecharge, setAutoRecharge] = useState(true);
  
  const [billingData, setBillingData] = useState({
    balance: 847.32,
    monthlySpend: 1284.76,
    totalMinutes: 14728,
    totalCalls: 8947,
    avgCostPerCall: 2.34,
    avgDurationPerCall: 4.8,
    projectedSpend: 1492.68,
    savingsThisMonth: 284.92,
    costPerMinute: 0.08
  });

  const [limits, setLimits] = useState({
    hourlyLimit: 100,
    dailyLimit: 500,
    concurrencyLimit: 10,
    voiceClones: 1,
    currentHourly: 23,
    currentDaily: 156,
    currentConcurrency: 3,
    currentVoiceClones: 1
  });

  const [callHistory] = useState([
    {
      id: 'CALL-001',
      date: '2024-02-14 15:23:45',
      callerNumber: '+1 (555) 123-4567',
      duration: 3.5,
      cost: 0.28,
      status: 'completed',
      balanceAfter: 847.32
    },
    {
      id: 'CALL-002', 
      date: '2024-02-14 15:18:12',
      callerNumber: '+1 (555) 987-6543',
      duration: 7.2,
      cost: 0.58,
      status: 'completed',
      balanceAfter: 847.60
    },
    {
      id: 'CALL-003',
      date: '2024-02-14 15:12:33',
      callerNumber: '+1 (555) 456-7890',
      duration: 2.1,
      cost: 0.17,
      status: 'completed',
      balanceAfter: 848.18
    },
    {
      id: 'CALL-004',
      date: '2024-02-14 15:08:55',
      callerNumber: '+1 (555) 321-0987',
      duration: 12.3,
      cost: 0.98,
      status: 'completed',
      balanceAfter: 848.35
    }
  ]);

  const [aiInsights] = useState([
    {
      title: 'Cost Optimization',
      value: '$284.92',
      description: 'You saved this month with AI optimization',
      color: 'green',
      icon: Zap
    },
    {
      title: 'Conversion Boost',
      value: '12%',
      description: 'Shorter calls under 3 mins increased conversion',
      color: 'blue',
      icon: TrendingUp
    },
    {
      title: 'Call Efficiency',
      value: '23%',
      description: 'Faster call routing reduced connection time',
      color: 'purple',
      icon: Timer
    },
    {
      title: 'Smart Scheduling',
      value: '847',
      description: 'Calls automatically optimized for peak hours',
      color: 'orange',
      icon: Calendar
    }
  ]);

  const minutesAvailable = Math.floor(billingData.balance / billingData.costPerMinute);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCalls(prev => {
        const newValue = Math.max(0, prev + (Math.random() > 0.7 ? 1 : -1));
        return Math.min(newValue, limits.concurrencyLimit);
      });

      if (activeCalls > 0) {
        setLiveCallCost(prev => prev + (activeCalls * billingData.costPerMinute / 60));
        setBillingData(prev => ({
          ...prev,
          balance: Math.max(0, prev.balance - (activeCalls * billingData.costPerMinute / 60))
        }));
      }

      setBillingData(prev => ({
        ...prev,
        monthlySpend: prev.monthlySpend + Math.random() * 0.1,
        totalCalls: prev.totalCalls + (Math.random() > 0.8 ? 1 : 0)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCalls, billingData.costPerMinute]);

  const MetricCard = ({ icon: Icon, title, value, subtitle, color, trend, percentage, isLive = false }) => {
    const getColorClasses = (colorName) => {
      const colorMap = {
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', gradient: 'from-blue-500 to-cyan-500' },
        green: { bg: 'bg-green-500/10', text: 'text-green-500', gradient: 'from-green-500 to-emerald-500' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', gradient: 'from-purple-500 to-pink-500' },
        orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', gradient: 'from-orange-500 to-red-500' },
        red: { bg: 'bg-red-500/10', text: 'text-red-500', gradient: 'from-red-500 to-pink-500' }
      };
      return colorMap[colorName] || colorMap.blue;
    };

    const colors = getColorClasses(color);

    return (
      <div className={`${darkMode ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'} 
        backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 group cursor-pointer relative overflow-hidden ${
          isLive ? 'ring-2 ring-green-500/50 animate-pulse' : ''
        }`}>
        
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${colors.bg} group-hover:scale-110 transition-transform duration-300 ${
              isLive ? 'animate-pulse' : ''
            }`}>
              <Icon className={`w-6 h-6 ${colors.text}`} />
            </div>
            {isLive && (
              <div className="flex items-center text-sm text-green-500 animate-pulse">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="font-medium">LIVE</span>
              </div>
            )}
            {trend !== undefined && !isLive && (
              <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend > 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                <span className="font-medium">{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <p className={`text-3xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-1`}>
              {value}
            </p>
            <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{title}</p>
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
          
          {percentage && (
            <div className="mt-4">
              <div className={`w-full bg-gray-200 rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${colors.gradient}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{percentage}% of limit used</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const LiveCallMeter = () => (
    <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} 
      rounded-2xl border p-6 backdrop-blur-sm ${activeCalls > 0 ? 'ring-2 ring-green-500/50 animate-pulse' : ''}`}>
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center space-x-2">
          <PhoneCall className={`w-6 h-6 ${activeCalls > 0 ? 'text-green-500 animate-pulse' : 'text-gray-500'}`} />
          <span>📞 Live Call Meter</span>
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          activeCalls > 0 ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
        }`}>
          {activeCalls} Active Calls
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30">
          <div className="text-4xl font-bold text-green-400 mb-2">
            ${liveCallCost.toFixed(4)}
          </div>
          <div className="text-sm font-medium text-green-300">Live Cost</div>
          <div className="text-xs text-green-400 mt-1">Ticking per second</div>
        </div>
        
        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30">
          <div className="text-4xl font-bold text-blue-400 mb-2">
            {activeCalls}
          </div>
          <div className="text-sm font-medium text-blue-300">Concurrent</div>
          <div className="text-xs text-blue-400 mt-1">of {limits.concurrencyLimit} max</div>
        </div>
        
        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30">
          <div className="text-4xl font-bold text-purple-400 mb-2">
            $0.08
          </div>
          <div className="text-sm font-medium text-purple-300">Per Minute</div>
          <div className="text-xs text-purple-400 mt-1">Pro-rated to the second</div>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-gray-500/10">
        <p className="text-sm text-gray-400 text-center">
          $0.08/min — Pro-rated to the exact second (dial time excluded)
        </p>
      </div>
    </div>
  );

  const TopUpWidget = () => (
    <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} 
      rounded-2xl border p-6 backdrop-blur-sm`}>
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center space-x-2">
          <Wallet className="w-6 h-6 text-green-500" />
          <span>💰 Top-Up Funds</span>
        </h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Top-up Amount (USD)</label>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(Number(e.target.value))}
                className={`w-full pl-8 pr-4 py-3 rounded-xl border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                min="10"
                max="1000"
                step="10"
              />
            </div>
            <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105">
              Pay with Stripe
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            = {Math.floor(topUpAmount / billingData.costPerMinute)} additional minutes
          </p>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <div>
            <h4 className="font-semibold text-blue-500">Auto-Top-Up (when balance &lt; $50)</h4>
            <p className="text-sm text-blue-400">Automatically add $100 when balance runs low</p>
          </div>
          <div className="relative">
            <input 
              type="checkbox" 
              checked={autoRecharge}
              onChange={(e) => setAutoRecharge(e.target.checked)}
              className="sr-only" 
            />
            <div className={`w-12 h-6 rounded-full shadow-inner transition-colors ${
              autoRecharge ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              <div className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
                autoRecharge ? 'translate-x-6' : 'translate-x-0'
              }`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const LimitsWidget = () => (
    <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} 
      rounded-2xl border p-6 backdrop-blur-sm`}>
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center space-x-2">
          <Shield className="w-6 h-6 text-purple-500" />
          <span>🛡️ Plan Limits</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Hourly Limit</span>
              <span>{limits.currentHourly}/{limits.hourlyLimit} calls</span>
            </div>
            <div className={`w-full bg-gray-200 rounded-full h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                style={{ width: `${(limits.currentHourly / limits.hourlyLimit) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Daily Limit</span>
              <span>{limits.currentDaily}/{limits.dailyLimit} calls</span>
            </div>
            <div className={`w-full bg-gray-200 rounded-full h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                style={{ width: `${(limits.currentDaily / limits.dailyLimit) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Concurrency</span>
              <span>{limits.currentConcurrency}/{limits.concurrencyLimit} calls</span>
            </div>
            <div className={`w-full bg-gray-200 rounded-full h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${(limits.currentConcurrency / limits.concurrencyLimit) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Voice Clones</span>
              <span>{limits.currentVoiceClones}/{limits.voiceClones} voices</span>
            </div>
            <div className={`w-full bg-gray-200 rounded-full h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                style={{ width: `${(limits.currentVoiceClones / limits.voiceClones) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CallHistoryRow = ({ call }) => (
    <div className={`${darkMode ? 'bg-gray-800/30 hover:bg-gray-800/50' : 'bg-white/30 hover:bg-white/50'} 
      rounded-xl p-4 transition-all duration-300 flex items-center justify-between`}>
      
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${
          call.status === 'completed' ? 'bg-green-500/10 text-green-500' :
          call.status === 'failed' ? 'bg-red-500/10 text-red-500' :
          'bg-yellow-500/10 text-yellow-500'
        }`}>
          <PhoneCall className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold">{call.callerNumber}</h4>
          <p className="text-sm text-gray-500">{call.date}</p>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-center">
          <p className="font-bold text-lg">{call.duration} min</p>
          <p className="text-sm text-gray-500">Duration</p>
        </div>
        
        <div className="text-center">
          <p className="font-bold text-lg">${call.cost}</p>
          <p className="text-sm text-gray-500">Cost</p>
        </div>

        <div className="text-center">
          <p className="font-bold text-lg">${call.balanceAfter}</p>
          <p className="text-sm text-gray-500">Balance After</p>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          call.status === 'completed' ? 'bg-green-500/10 text-green-500' :
          call.status === 'failed' ? 'bg-red-500/10 text-red-500' :
          'bg-yellow-500/10 text-yellow-500'
        }`}>
          {call.status}
        </div>
      </div>
    </div>
  );

  const AIInsightCard = ({ insight }) => {
    const getColorClasses = (colorName) => {
      const colorMap = {
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', gradient: 'from-blue-500 to-cyan-500' },
        green: { bg: 'bg-green-500/10', text: 'text-green-500', gradient: 'from-green-500 to-emerald-500' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', gradient: 'from-purple-500 to-pink-500' },
        orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', gradient: 'from-orange-500 to-red-500' }
      };
      return colorMap[colorName] || colorMap.blue;
    };

    const colors = getColorClasses(insight.color);

    return (
      <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} 
        backdrop-blur-sm rounded-xl border p-6 hover:shadow-lg transition-all duration-300`}>
        
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${colors.bg}`}>
            <insight.icon className={`w-6 h-6 ${colors.text}`} />
          </div>
          <div className={`text-3xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
            {insight.value}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-2">{insight.title}</h4>
          <p className="text-sm text-gray-500">{insight.description}</p>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <MetricCard 
                icon={Wallet} 
                title="Current Balance" 
                value={`$${billingData.balance.toFixed(2)}`}
                subtitle={`${minutesAvailable} minutes available`}
                color="green"
                trend={12.3}
              />
              <MetricCard 
                icon={Timer} 
                title="Total Talk Time" 
                value={`${billingData.totalMinutes.toLocaleString()} min`}
                subtitle={`${billingData.totalCalls.toLocaleString()} total calls`}
                color="blue"
                trend={8.7}
              />
              <MetricCard 
                icon={DollarSign} 
                title="Monthly Spend" 
                value={`$${billingData.monthlySpend.toFixed(2)}`}
                subtitle="Current month usage"
                color="purple"
                trend={5.2}
              />
              <MetricCard 
                icon={PhoneCall} 
                title="Avg Cost/Call" 
                value={`$${billingData.avgCostPerCall.toFixed(2)}`}
                subtitle={`${billingData.avgDurationPerCall} min avg duration`}
                color="orange"
                trend={-3.1}
              />
            </div>

            <LiveCallMeter />
            <LimitsWidget />

            <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-sm`}>
              <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <Brain className="w-6 h-6 text-purple-500" />
                <span>🤖 AI-Powered Insights</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {aiInsights.map((insight, index) => (
                  <AIInsightCard key={index} insight={insight} />
                ))}
              </div>
            </div>
          </div>
        );

      case 'usage':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <MetricCard 
                icon={PhoneCall} 
                title="Live Calls" 
                value={activeCalls.toString()}
                subtitle="Currently active"
                color="green"
                isLive={activeCalls > 0}
              />
              <MetricCard 
                icon={Timer} 
                title="Live Cost" 
                value={`$${liveCallCost.toFixed(4)}`}
                subtitle="Ticking per second"
                color="red"
                isLive={activeCalls > 0}
              />
              <MetricCard 
                icon={DollarSign} 
                title="Rate" 
                value="$0.08/min"
                subtitle="Pro-rated to second"
                color="blue"
              />
            </div>

            <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-sm`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center space-x-2">
                  <PhoneCall className="w-6 h-6 text-blue-500" />
                  <span>📞 Call Usage History</span>
                </h3>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-colors">
                    Today
                  </button>
                  <button className="px-4 py-2 bg-gray-500/10 text-gray-500 rounded-lg text-sm font-medium hover:bg-gray-500/20 transition-colors">
                    This Week
                  </button>
                  <button className="px-4 py-2 bg-gray-500/10 text-gray-500 rounded-lg text-sm font-medium hover:bg-gray-500/20 transition-colors">
                    This Month
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {callHistory.map((call) => (
                  <CallHistoryRow key={call.id} call={call} />
                ))}
              </div>
            </div>
          </div>
        );

      case 'topup':
        return (
          <div className="space-y-8">
            <TopUpWidget />
            
            <div className={`${darkMode ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-700/50' : 'bg-gradient-to-r from-yellow-50/80 to-orange-50/80 border-yellow-200/50'} 
              rounded-2xl border p-8 backdrop-blur-xl`}>
              
              <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-yellow-500" />
                <span>🔮 AI Cost Forecasting</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                  <h4 className="font-bold mb-4 flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <span>Balance Depletion Forecast</span>
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Current Balance:</span>
                      <span className="font-bold text-green-500">${billingData.balance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Daily Burn Rate:</span>
                      <span className="font-bold text-orange-500">${(billingData.monthlySpend / new Date().getDate()).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Estimated Depletion:</span>
                      <span className="font-bold text-red-500">
                        {Math.floor(billingData.balance / (billingData.monthlySpend / new Date().getDate()))} days
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Recommended Top-up:</span>
                      <span className="font-bold text-blue-500">${Math.ceil((billingData.monthlySpend / new Date().getDate()) * 30)}</span>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                  <h4 className="font-bold mb-4 flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-blue-500" />
                    <span>Smart Alerts</span>
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Low Balance Alert ($50)</div>
                        <div className="text-sm text-gray-500">Email + SMS notification</div>
                      </div>
                      <div className="relative">
                        <input type="checkbox" defaultChecked className="sr-only" />
                        <div className="w-12 h-6 bg-green-500 rounded-full shadow-inner"></div>
                        <div className="absolute inset-y-0 right-0 w-6 h-6 bg-white rounded-full shadow transform transition-transform translate-x-0"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Critical Balance Alert ($20)</div>
                        <div className="text-sm text-gray-500">Immediate notification</div>
                      </div>
                      <div className="relative">
                        <input type="checkbox" defaultChecked className="sr-only" />
                        <div className="w-12 h-6 bg-green-500 rounded-full shadow-inner"></div>
                        <div className="absolute inset-y-0 right-0 w-6 h-6 bg-white rounded-full shadow transform transition-transform translate-x-0"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-sm`}>
              <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <CreditCard className="w-6 h-6 text-green-500" />
                <span>💳 Recent Top-ups</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="font-semibold">Stripe Payment</div>
                      <div className="text-sm text-gray-500">Feb 14, 2024 3:45 PM</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-500">+$100.00</div>
                    <div className="text-sm text-gray-500">Success</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <RefreshCw className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="font-semibold">Auto Top-up</div>
                      <div className="text-sm text-gray-500">Feb 12, 2024 8:30 AM</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-500">+$100.00</div>
                    <div className="text-sm text-gray-500">Auto</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'invoices':
        return (
          <div className="space-y-8">
            <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-6 backdrop-blur-sm`}>
              <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <Receipt className="w-6 h-6 text-green-500" />
                <span>📄 Usage-Based Invoices</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30">
                  <div className="text-4xl font-bold text-green-400 mb-2">${billingData.monthlySpend.toFixed(0)}</div>
                  <div className="text-sm font-medium text-green-300">This Month</div>
                  <div className="text-xs text-green-400 mt-1">{billingData.totalMinutes} minutes</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30">
                  <div className="text-4xl font-bold text-blue-400 mb-2">${(billingData.monthlySpend * 12).toFixed(0)}</div>
                  <div className="text-sm font-medium text-blue-300">Projected Annual</div>
                  <div className="text-xs text-blue-400 mt-1">Based on current usage</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30">
                  <div className="text-4xl font-bold text-purple-400 mb-2">$0.08</div>
                  <div className="text-sm font-medium text-purple-300">Rate per Minute</div>
                  <div className="text-xs text-purple-400 mt-1">Pay-as-you-go</div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} border border-gray-600/30`}>
                <h4 className="font-bold mb-4 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span>Current Month Invoice Preview</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>AI Calls: {billingData.totalMinutes} minutes</span>
                    <span>${(billingData.totalMinutes * billingData.costPerMinute).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Optimization Discount</span>
                    <span className="text-green-500">-${billingData.savingsThisMonth.toFixed(2)}</span>
                  </div>
                  <hr className={`${darkMode ? 'border-gray-600' : 'border-gray-300'}`} />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Cost</span>
                    <span>${billingData.monthlySpend.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-8 text-center backdrop-blur-sm`}>
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-10 h-10 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-4">
              ⚙️ {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings
            </h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-2xl mx-auto text-lg`}>
              Advanced billing feature coming soon with enterprise-grade management.
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105">
              🚀 Coming Soon
            </button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className={`${darkMode ? 'bg-gradient-to-r from-gray-800/90 via-green-800/90 to-gray-800/90' : 'bg-gradient-to-r from-green-50/90 via-emerald-50/90 to-green-50/90'} 
        rounded-3xl p-8 border ${darkMode ? 'border-green-700/50' : 'border-green-200/50'} relative overflow-hidden backdrop-blur-xl`}>
        
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-blue-500/10 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500 bg-clip-text text-transparent">
                💰 PAY-AS-YOU-GO BILLING
              </h1>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              Per-Minute AI Call Billing • ${billingData.balance.toFixed(2)} Balance • {minutesAvailable} Minutes Available
            </p>
            <p className="text-sm text-green-500 font-medium">
              💡 $0.08/min Pro-rated to the Second • AI Cost Optimization • Real-time Usage Tracking
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`text-center p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 ${
              billingData.balance < 50 ? 'ring-2 ring-red-500/50 animate-pulse' : ''
            }`}>
              <div className="text-5xl font-bold text-green-400 mb-2">
                ${billingData.balance.toFixed(2)}
              </div>
              <div className="text-sm font-medium text-green-300">💰 Balance</div>
              <div className="text-xs text-green-400 mt-1">{minutesAvailable} minutes left</div>
            </div>
            
            <div className={`text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30 ${
              activeCalls > 0 ? 'ring-2 ring-blue-500/50 animate-pulse' : ''
            }`}>
              <div className="text-5xl font-bold text-blue-400 mb-2">
                {activeCalls}
              </div>
              <div className="text-sm font-medium text-blue-300">📞 Live Calls</div>
              <div className="text-xs text-blue-400 mt-1">of {limits.concurrencyLimit} max</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30">
              <div className="text-5xl font-bold text-purple-400 mb-2">
                {billingData.totalMinutes.toLocaleString()}
              </div>
              <div className="text-sm font-medium text-purple-300">⏱️ Total Minutes</div>
              <div className="text-xs text-purple-400 mt-1">This month</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30">
              <div className="text-5xl font-bold text-orange-400 mb-2">
                $0.08
              </div>
              <div className="text-sm font-medium text-orange-300">💲 Per Minute</div>
              <div className="text-xs text-orange-400 mt-1">Pro-rated to second</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setActiveTab('topup')}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl"
            >
              <Wallet className="w-6 h-6" />
              <span>💰 Top-Up Balance</span>
            </button>
            <button 
              onClick={() => setActiveTab('usage')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl"
            >
              <BarChart3 className="w-6 h-6" />
              <span>📊 Live Usage</span>
            </button>
            <button 
              onClick={() => setActiveTab('overview')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl"
            >
              <Activity className="w-6 h-6" />
              <span>🤖 AI Insights</span>
            </button>
          </div>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/50 border-gray-200/50'} rounded-2xl border p-2 backdrop-blur-sm`}>
        <nav className="flex space-x-2 overflow-x-auto">
          {[
            { id: 'overview', label: '📊 Overview', icon: BarChart3 },
            { id: 'usage', label: '📞 Live Usage', icon: PhoneCall },
            { id: 'topup', label: '💰 Top-Up', icon: Wallet },
            { id: 'invoices', label: '📄 Invoices', icon: Receipt },
            { id: 'settings', label: '⚙️ Settings', icon: Settings },
            { id: 'limits', label: '🛡️ Limits', icon: Shield }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === id
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105'
                  : darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {renderTabContent()}

      <div className={`${darkMode ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/30 border-gray-200/50'} 
        rounded-xl border p-4 backdrop-blur-sm`}>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full animate-pulse ${
                activeCalls > 0 ? 'bg-green-500' : 'bg-blue-500'
              }`}></div>
              <span className="text-sm font-medium">
                {activeCalls > 0 ? `${activeCalls} Active Calls` : 'System Ready'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-green-500" />
              <span className="text-sm">${billingData.balance.toFixed(2)} available</span>
            </div>
            <div className="flex items-center space-x-2">
              <Timer className="w-4 h-4 text-blue-500" />
              <span className="text-sm">{minutesAvailable} minutes left</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-purple-500" />
              <span className="text-sm">PCI Compliant</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              {activeCalls > 0 ? `Live: ${liveCallCost.toFixed(4)}` : 'Auto-recharge: On'}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              autoRecharge ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
            }`}>
              Auto-Top-Up
            </div>
            <button className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingProCenter;