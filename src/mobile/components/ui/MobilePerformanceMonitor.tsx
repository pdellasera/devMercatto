import React, { useState, useEffect } from 'react';
import { Activity, Zap, Wifi, HardDrive, TrendingUp, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';
import useMobilePerformanceMetrics from '../../hooks/useMobilePerformanceMetrics';

interface MobilePerformanceMonitorProps {
  className?: string;
  showDetails?: boolean;
  autoStart?: boolean;
  onScoreChange?: (score: number) => void;
}

const MobilePerformanceMonitor: React.FC<MobilePerformanceMonitorProps> = ({
  className,
  showDetails = false,
  autoStart = true,
  onScoreChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lighthouseScore, setLighthouseScore] = useState<number | null>(null);

  const {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    resetMetrics,
    getLighthouseScore,
  } = useMobilePerformanceMetrics({
    enableMemoryMonitoring: true,
    enableNetworkMonitoring: true,
    enableWebVitals: true,
    onMetricsUpdate: async (metrics) => {
      // Calcular Lighthouse score cuando las métricas cambien
      const score = await getLighthouseScore();
      setLighthouseScore(score);
      onScoreChange?.(score);
    },
  });

  // Auto-start monitoring
  useEffect(() => {
    if (autoStart && !isMonitoring) {
      startMonitoring();
    }
  }, [autoStart, isMonitoring, startMonitoring]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-500/20';
    if (score >= 70) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  const formatMetric = (value: number | null, unit: string = 'ms') => {
    if (value === null) return 'N/A';
    return `${value.toFixed(0)}${unit}`;
  };

  const formatMemory = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)}MB`;
  };

  return (
    <div className={cn(
      'bg-neutral-900/90 backdrop-blur-sm border border-white/10 rounded-mobile-lg p-mobile-md',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-mobile-md">
        <div className="flex items-center gap-mobile-sm">
          <Activity className="w-5 h-5 text-primary-500" />
          <h3 className="text-mobile-base font-semibold">Performance</h3>
        </div>
        
        <div className="flex items-center gap-mobile-sm">
          {/* Lighthouse Score */}
          {lighthouseScore !== null && (
            <div className={cn(
              'px-mobile-sm py-mobile-xs rounded-mobile-sm text-mobile-sm font-bold',
              getScoreBgColor(lighthouseScore),
              getScoreColor(lighthouseScore)
            )}>
              {lighthouseScore}
            </div>
          )}
          
          {/* Toggle monitoring */}
          <button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            className={cn(
              'p-mobile-xs rounded-mobile-sm transition-colors',
              isMonitoring ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            )}
          >
            <div className={cn(
              'w-3 h-3 rounded-full',
              isMonitoring ? 'bg-red-400' : 'bg-green-400'
            )} />
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-mobile-xs rounded-mobile-sm bg-neutral-800 hover:bg-neutral-700 transition-colors"
          >
            <span className="text-mobile-xs">
              {isExpanded ? '▼' : '▶'}
            </span>
          </button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 gap-mobile-sm mb-mobile-md">
        <div className="bg-neutral-800/50 rounded-mobile-sm p-mobile-sm">
          <div className="flex items-center gap-mobile-xs mb-mobile-xs">
            <Zap className="w-3 h-3 text-blue-400" />
            <span className="text-mobile-xs text-neutral-400">FCP</span>
          </div>
          <div className="text-mobile-sm font-medium">
            {formatMetric(metrics.fcp)}
          </div>
        </div>

        <div className="bg-neutral-800/50 rounded-mobile-sm p-mobile-sm">
          <div className="flex items-center gap-mobile-xs mb-mobile-xs">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span className="text-mobile-xs text-neutral-400">LCP</span>
          </div>
          <div className="text-mobile-sm font-medium">
            {formatMetric(metrics.lcp)}
          </div>
        </div>
      </div>

      {/* Detalles expandidos */}
      {isExpanded && (
        <div className="space-y-mobile-sm pt-mobile-md border-t border-white/10">
          {/* Web Vitals */}
          <div className="space-y-mobile-xs">
            <h4 className="text-mobile-sm font-medium text-neutral-300">Web Vitals</h4>
            <div className="grid grid-cols-2 gap-mobile-sm">
              <div className="bg-neutral-800/30 rounded-mobile-sm p-mobile-sm">
                <div className="text-mobile-xs text-neutral-400">FID</div>
                <div className="text-mobile-sm">{formatMetric(metrics.fid)}</div>
              </div>
              <div className="bg-neutral-800/30 rounded-mobile-sm p-mobile-sm">
                <div className="text-mobile-xs text-neutral-400">CLS</div>
                <div className="text-mobile-sm">{formatMetric(metrics.cls, '')}</div>
              </div>
              <div className="bg-neutral-800/30 rounded-mobile-sm p-mobile-sm">
                <div className="text-mobile-xs text-neutral-400">TTFB</div>
                <div className="text-mobile-sm">{formatMetric(metrics.ttfb)}</div>
              </div>
              <div className="bg-neutral-800/30 rounded-mobile-sm p-mobile-sm">
                <div className="text-mobile-xs text-neutral-400">DOM Load</div>
                <div className="text-mobile-sm">{formatMetric(metrics.domLoad)}</div>
              </div>
            </div>
          </div>

          {/* Memoria */}
          {metrics.memoryUsage && (
            <div className="space-y-mobile-xs">
              <h4 className="text-mobile-sm font-medium text-neutral-300">Memoria</h4>
              <div className="bg-neutral-800/30 rounded-mobile-sm p-mobile-sm">
                <div className="flex items-center gap-mobile-xs mb-mobile-xs">
                  <HardDrive className="w-3 h-3 text-purple-400" />
                  <span className="text-mobile-xs text-neutral-400">Uso</span>
                </div>
                <div className="text-mobile-sm">
                  {formatMemory(metrics.memoryUsage.usedJSHeapSize)} / {formatMemory(metrics.memoryUsage.jsHeapSizeLimit)}
                </div>
                <div className="w-full bg-neutral-700 rounded-full h-1 mt-mobile-xs">
                  <div
                    className="bg-purple-500 h-1 rounded-full transition-all duration-300"
                    style={{
                      width: `${(metrics.memoryUsage.usedJSHeapSize / metrics.memoryUsage.jsHeapSizeLimit) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Red */}
          {metrics.networkInfo && (
            <div className="space-y-mobile-xs">
              <h4 className="text-mobile-sm font-medium text-neutral-300">Red</h4>
              <div className="grid grid-cols-2 gap-mobile-sm">
                <div className="bg-neutral-800/30 rounded-mobile-sm p-mobile-sm">
                  <div className="flex items-center gap-mobile-xs mb-mobile-xs">
                    <Wifi className="w-3 h-3 text-green-400" />
                    <span className="text-mobile-xs text-neutral-400">Tipo</span>
                  </div>
                  <div className="text-mobile-sm capitalize">{metrics.networkInfo.effectiveType}</div>
                </div>
                <div className="bg-neutral-800/30 rounded-mobile-sm p-mobile-sm">
                  <div className="text-mobile-xs text-neutral-400">Velocidad</div>
                  <div className="text-mobile-sm">{metrics.networkInfo.downlink.toFixed(1)} Mbps</div>
                </div>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="pt-mobile-sm border-t border-white/10">
            <div className="flex items-center gap-mobile-sm">
              <button
                onClick={resetMetrics}
                className="flex-1 px-mobile-sm py-mobile-xs bg-neutral-800 hover:bg-neutral-700 rounded-mobile-sm transition-colors text-mobile-xs"
              >
                <RefreshCw className="w-3 h-3 mr-mobile-xs inline" />
                Resetear
              </button>
              <button
                onClick={async () => {
                  const score = await getLighthouseScore();
                  setLighthouseScore(score);
                }}
                className="flex-1 px-mobile-sm py-mobile-xs bg-primary-600 hover:bg-primary-700 rounded-mobile-sm transition-colors text-mobile-xs"
              >
                Calcular Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobilePerformanceMonitor;
