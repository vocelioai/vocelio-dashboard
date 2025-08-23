/**
 * Performance Optimization System
 * Caching strategies, load balancing, auto-scaling, and performance monitoring
 */

// Advanced caching system with multiple strategies
export class CacheManager {
  constructor() {
    this.caches = new Map();
    this.strategies = new Map();
    this.metrics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      totalRequests: 0
    };
    
    this.setupDefaultStrategies();
    this.startCleanupInterval();
  }

  setupDefaultStrategies() {
    // LRU (Least Recently Used) strategy
    this.strategies.set('lru', {
      shouldEvict: (cache, key) => {
        const entries = Array.from(cache.entries());
        entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
        return entries.slice(0, Math.floor(cache.size * 0.2)).map(([k]) => k);
      },
      maxSize: 1000
    });

    // TTL (Time To Live) strategy
    this.strategies.set('ttl', {
      shouldEvict: (cache) => {
        const now = Date.now();
        const expired = [];
        cache.forEach((value, key) => {
          if (value.expiresAt && value.expiresAt < now) {
            expired.push(key);
          }
        });
        return expired;
      },
      maxSize: 500
    });

    // Size-based strategy
    this.strategies.set('size', {
      shouldEvict: (cache) => {
        if (cache.size <= 100) return [];
        const entries = Array.from(cache.entries());
        return entries.slice(0, cache.size - 100).map(([k]) => k);
      },
      maxSize: 100
    });
  }

  createCache(name, strategy = 'lru', options = {}) {
    const cache = new Map();
    this.caches.set(name, {
      cache,
      strategy,
      options: {
        maxSize: this.strategies.get(strategy)?.maxSize || 1000,
        ttl: options.ttl || 3600000, // 1 hour default
        ...options
      }
    });
    return cache;
  }

  get(cacheName, key) {
    const cacheData = this.caches.get(cacheName);
    if (!cacheData) return null;

    const { cache } = cacheData;
    const entry = cache.get(key);
    
    this.metrics.totalRequests++;

    if (!entry) {
      this.metrics.misses++;
      return null;
    }

    // Check TTL
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      cache.delete(key);
      this.metrics.misses++;
      return null;
    }

    // Update access time for LRU
    entry.lastAccessed = Date.now();
    entry.accessCount = (entry.accessCount || 0) + 1;
    
    this.metrics.hits++;
    return entry.value;
  }

  set(cacheName, key, value, options = {}) {
    const cacheData = this.caches.get(cacheName);
    if (!cacheData) return false;

    const { cache, options: cacheOptions } = cacheData;
    const ttl = options.ttl || cacheOptions.ttl;
    
    const entry = {
      value,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      expiresAt: ttl ? Date.now() + ttl : null,
      accessCount: 0,
      size: this.calculateSize(value)
    };

    cache.set(key, entry);
    
    // Check if eviction is needed
    this.performEviction(cacheName);
    
    return true;
  }

  delete(cacheName, key) {
    const cacheData = this.caches.get(cacheName);
    if (!cacheData) return false;
    
    return cacheData.cache.delete(key);
  }

  clear(cacheName) {
    const cacheData = this.caches.get(cacheName);
    if (!cacheData) return false;
    
    cacheData.cache.clear();
    return true;
  }

  performEviction(cacheName) {
    const cacheData = this.caches.get(cacheName);
    if (!cacheData) return;

    const { cache, strategy, options } = cacheData;
    const strategyConfig = this.strategies.get(strategy);
    
    if (cache.size <= options.maxSize) return;

    const keysToEvict = strategyConfig.shouldEvict(cache);
    keysToEvict.forEach(key => {
      cache.delete(key);
      this.metrics.evictions++;
    });
  }

  calculateSize(value) {
    try {
      return JSON.stringify(value).length;
    } catch {
      return 1000; // Fallback size estimation
    }
  }

  startCleanupInterval() {
    setInterval(() => {
      this.caches.forEach((cacheData, cacheName) => {
        const { strategy } = cacheData;
        if (strategy === 'ttl') {
          this.performEviction(cacheName);
        }
      });
    }, 60000); // Cleanup every minute
  }

  getMetrics() {
    const hitRate = this.metrics.totalRequests > 0 
      ? (this.metrics.hits / this.metrics.totalRequests) * 100 
      : 0;
    
    return {
      ...this.metrics,
      hitRate: Math.round(hitRate * 100) / 100,
      cacheCount: this.caches.size,
      totalCachedItems: Array.from(this.caches.values())
        .reduce((total, { cache }) => total + cache.size, 0)
    };
  }
}

// Load balancing and request distribution
export class LoadBalancer {
  constructor() {
    this.servers = [];
    this.strategies = new Map();
    this.healthChecks = new Map();
    this.currentIndex = 0;
    
    this.setupStrategies();
    this.startHealthChecks();
  }

  setupStrategies() {
    // Round Robin
    this.strategies.set('round_robin', () => {
      const availableServers = this.getHealthyServers();
      if (availableServers.length === 0) return null;
      
      const server = availableServers[this.currentIndex % availableServers.length];
      this.currentIndex++;
      return server;
    });

    // Least Connections
    this.strategies.set('least_connections', () => {
      const availableServers = this.getHealthyServers();
      if (availableServers.length === 0) return null;
      
      return availableServers.reduce((least, current) => 
        current.activeConnections < least.activeConnections ? current : least
      );
    });

    // Weighted Round Robin
    this.strategies.set('weighted_round_robin', () => {
      const availableServers = this.getHealthyServers();
      if (availableServers.length === 0) return null;
      
      const totalWeight = availableServers.reduce((sum, server) => sum + server.weight, 0);
      let randomWeight = Math.random() * totalWeight;
      
      for (const server of availableServers) {
        randomWeight -= server.weight;
        if (randomWeight <= 0) {
          return server;
        }
      }
      
      return availableServers[0]; // Fallback
    });

    // Response Time Based
    this.strategies.set('response_time', () => {
      const availableServers = this.getHealthyServers();
      if (availableServers.length === 0) return null;
      
      return availableServers.reduce((fastest, current) => 
        current.averageResponseTime < fastest.averageResponseTime ? current : fastest
      );
    });
  }

  addServer(server) {
    const serverConfig = {
      id: server.id || `server_${Date.now()}`,
      url: server.url,
      weight: server.weight || 1,
      maxConnections: server.maxConnections || 100,
      activeConnections: 0,
      isHealthy: true,
      lastHealthCheck: Date.now(),
      averageResponseTime: 0,
      totalRequests: 0,
      failedRequests: 0,
      ...server
    };
    
    this.servers.push(serverConfig);
    return serverConfig.id;
  }

  removeServer(serverId) {
    const index = this.servers.findIndex(s => s.id === serverId);
    if (index > -1) {
      this.servers.splice(index, 1);
      return true;
    }
    return false;
  }

  getServer(strategy = 'round_robin') {
    const strategyFn = this.strategies.get(strategy);
    return strategyFn ? strategyFn() : null;
  }

  getHealthyServers() {
    return this.servers.filter(server => 
      server.isHealthy && 
      server.activeConnections < server.maxConnections
    );
  }

  startHealthChecks() {
    setInterval(async () => {
      for (const server of this.servers) {
        try {
          const startTime = Date.now();
          const response = await fetch(`${server.url}/health`, {
            method: 'GET',
            timeout: 5000
          });
          
          const responseTime = Date.now() - startTime;
          
          if (response.ok) {
            server.isHealthy = true;
            server.lastHealthCheck = Date.now();
            
            // Update average response time (moving average)
            if (server.averageResponseTime === 0) {
              server.averageResponseTime = responseTime;
            } else {
              server.averageResponseTime = 
                (server.averageResponseTime * 0.7) + (responseTime * 0.3);
            }
          } else {
            server.isHealthy = false;
          }
        } catch (error) {
          server.isHealthy = false;
          server.failedRequests++;
        }
      }
    }, 30000); // Health check every 30 seconds
  }

  recordRequest(serverId, responseTime, success = true) {
    const server = this.servers.find(s => s.id === serverId);
    if (server) {
      server.totalRequests++;
      if (!success) {
        server.failedRequests++;
      }
      
      // Update response time
      if (server.averageResponseTime === 0) {
        server.averageResponseTime = responseTime;
      } else {
        server.averageResponseTime = 
          (server.averageResponseTime * 0.9) + (responseTime * 0.1);
      }
    }
  }

  getStats() {
    return {
      totalServers: this.servers.length,
      healthyServers: this.getHealthyServers().length,
      totalRequests: this.servers.reduce((sum, s) => sum + s.totalRequests, 0),
      totalFailures: this.servers.reduce((sum, s) => sum + s.failedRequests, 0),
      servers: this.servers.map(s => ({
        id: s.id,
        url: s.url,
        isHealthy: s.isHealthy,
        activeConnections: s.activeConnections,
        averageResponseTime: Math.round(s.averageResponseTime),
        totalRequests: s.totalRequests,
        failedRequests: s.failedRequests
      }))
    };
  }
}

// Auto-scaling system
export class AutoScaler {
  constructor() {
    this.metrics = {
      cpu: 0,
      memory: 0,
      activeConnections: 0,
      responseTime: 0,
      errorRate: 0
    };
    
    this.thresholds = {
      scaleUp: {
        cpu: 70,
        memory: 80,
        responseTime: 1000,
        errorRate: 5
      },
      scaleDown: {
        cpu: 30,
        memory: 40,
        responseTime: 200,
        errorRate: 1
      }
    };
    
    this.scaling = {
      minInstances: 1,
      maxInstances: 10,
      currentInstances: 1,
      scalingInProgress: false,
      lastScaleAction: null
    };
    
    this.startMonitoring();
  }

  startMonitoring() {
    setInterval(() => {
      this.collectMetrics();
      this.evaluateScaling();
    }, 10000); // Check every 10 seconds
  }

  async collectMetrics() {
    try {
      // CPU Usage (simulated)
      this.metrics.cpu = Math.random() * 100;
      
      // Memory Usage (simulated)
      if (performance.memory) {
        const memInfo = performance.memory;
        this.metrics.memory = (memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit) * 100;
      } else {
        this.metrics.memory = Math.random() * 100;
      }
      
      // Active connections (would come from load balancer)
      this.metrics.activeConnections = Math.floor(Math.random() * 100);
      
      // Average response time
      this.metrics.responseTime = Math.random() * 2000;
      
      // Error rate
      this.metrics.errorRate = Math.random() * 10;
      
    } catch (error) {
      console.error('Failed to collect metrics:', error);
    }
  }

  evaluateScaling() {
    if (this.scaling.scalingInProgress) {
      return; // Already scaling
    }
    
    const shouldScaleUp = this.shouldScaleUp();
    const shouldScaleDown = this.shouldScaleDown();
    
    if (shouldScaleUp && this.scaling.currentInstances < this.scaling.maxInstances) {
      this.scaleUp();
    } else if (shouldScaleDown && this.scaling.currentInstances > this.scaling.minInstances) {
      this.scaleDown();
    }
  }

  shouldScaleUp() {
    const { scaleUp } = this.thresholds;
    const { metrics } = this;
    
    return (
      metrics.cpu > scaleUp.cpu ||
      metrics.memory > scaleUp.memory ||
      metrics.responseTime > scaleUp.responseTime ||
      metrics.errorRate > scaleUp.errorRate
    );
  }

  shouldScaleDown() {
    const { scaleDown } = this.thresholds;
    const { metrics } = this;
    
    return (
      metrics.cpu < scaleDown.cpu &&
      metrics.memory < scaleDown.memory &&
      metrics.responseTime < scaleDown.responseTime &&
      metrics.errorRate < scaleDown.errorRate
    );
  }

  async scaleUp() {
    console.log(`Scaling up from ${this.scaling.currentInstances} to ${this.scaling.currentInstances + 1} instances`);
    
    this.scaling.scalingInProgress = true;
    
    try {
      // Simulate instance creation
      await this.createInstance();
      
      this.scaling.currentInstances++;
      this.scaling.lastScaleAction = {
        action: 'scale_up',
        timestamp: Date.now(),
        fromInstances: this.scaling.currentInstances - 1,
        toInstances: this.scaling.currentInstances
      };
      
    } catch (error) {
      console.error('Failed to scale up:', error);
    } finally {
      this.scaling.scalingInProgress = false;
    }
  }

  async scaleDown() {
    console.log(`Scaling down from ${this.scaling.currentInstances} to ${this.scaling.currentInstances - 1} instances`);
    
    this.scaling.scalingInProgress = true;
    
    try {
      // Simulate instance removal
      await this.removeInstance();
      
      this.scaling.currentInstances--;
      this.scaling.lastScaleAction = {
        action: 'scale_down',
        timestamp: Date.now(),
        fromInstances: this.scaling.currentInstances + 1,
        toInstances: this.scaling.currentInstances
      };
      
    } catch (error) {
      console.error('Failed to scale down:', error);
    } finally {
      this.scaling.scalingInProgress = false;
    }
  }

  async createInstance() {
    // Simulate instance creation delay
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('New instance created and ready');
  }

  async removeInstance() {
    // Simulate graceful instance shutdown
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('Instance removed gracefully');
  }

  getScalingStatus() {
    return {
      currentInstances: this.scaling.currentInstances,
      minInstances: this.scaling.minInstances,
      maxInstances: this.scaling.maxInstances,
      scalingInProgress: this.scaling.scalingInProgress,
      lastScaleAction: this.scaling.lastScaleAction,
      currentMetrics: this.metrics,
      thresholds: this.thresholds
    };
  }

  updateThresholds(newThresholds) {
    this.thresholds = {
      ...this.thresholds,
      ...newThresholds
    };
  }

  updateScalingLimits(minInstances, maxInstances) {
    this.scaling.minInstances = minInstances;
    this.scaling.maxInstances = maxInstances;
  }
}

// Performance monitoring and analytics
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = [];
    this.thresholds = new Map();
    
    this.startPerformanceObservation();
    this.startCustomMetrics();
  }

  startPerformanceObservation() {
    // Performance Observer for various metrics
    if ('PerformanceObserver' in window) {
      // Navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('navigation', {
            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            loadComplete: entry.loadEventEnd - entry.loadEventStart,
            domProcessing: entry.domComplete - entry.domInteractive,
            networkTime: entry.responseEnd - entry.requestStart
          });
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });

      // Paint timing
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('paint', {
            [entry.name]: entry.startTime
          });
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });

      // Long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('long_task', {
            duration: entry.duration,
            startTime: entry.startTime
          });
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    }
  }

  startCustomMetrics() {
    // Memory usage tracking
    setInterval(() => {
      if (performance.memory) {
        this.recordMetric('memory', {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          usage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
        });
      }
    }, 5000);

    // FPS tracking
    let frames = 0;
    let lastTime = performance.now();
    
    const trackFPS = (currentTime) => {
      frames++;
      
      if (currentTime >= lastTime + 1000) {
        this.recordMetric('fps', {
          fps: Math.round((frames * 1000) / (currentTime - lastTime)),
          timestamp: currentTime
        });
        
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(trackFPS);
    };
    requestAnimationFrame(trackFPS);
  }

  recordMetric(category, data) {
    if (!this.metrics.has(category)) {
      this.metrics.set(category, []);
    }
    
    const entry = {
      timestamp: Date.now(),
      data
    };
    
    const entries = this.metrics.get(category);
    entries.push(entry);
    
    // Keep only last 1000 entries
    if (entries.length > 1000) {
      entries.splice(0, entries.length - 1000);
    }
    
    // Check thresholds
    this.checkThresholds(category, data);
  }

  checkThresholds(category, data) {
    const threshold = this.thresholds.get(category);
    if (!threshold) return;
    
    for (const [key, limit] of Object.entries(threshold)) {
      if (data[key] !== undefined && data[key] > limit.value) {
        this.triggerAlert(category, key, data[key], limit);
      }
    }
  }

  triggerAlert(category, metric, value, threshold) {
    const alert = {
      timestamp: Date.now(),
      category,
      metric,
      value,
      threshold: threshold.value,
      severity: threshold.severity || 'warning'
    };
    
    console.warn(`Performance Alert: ${category}.${metric} = ${value} exceeds threshold ${threshold.value}`);
    
    // Emit event for external handling
    this.emit('performance_alert', alert);
  }

  setThreshold(category, metric, value, severity = 'warning') {
    if (!this.thresholds.has(category)) {
      this.thresholds.set(category, {});
    }
    
    this.thresholds.get(category)[metric] = { value, severity };
  }

  getMetrics(category, timeRange = 3600000) { // Last hour by default
    if (!this.metrics.has(category)) return [];
    
    const cutoff = Date.now() - timeRange;
    return this.metrics.get(category).filter(entry => entry.timestamp >= cutoff);
  }

  getAverageMetric(category, metric, timeRange = 3600000) {
    const entries = this.getMetrics(category, timeRange);
    if (entries.length === 0) return 0;
    
    const values = entries
      .map(entry => entry.data[metric])
      .filter(value => value !== undefined);
    
    if (values.length === 0) return 0;
    
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  getPerformanceSummary() {
    return {
      navigation: {
        avgLoadTime: this.getAverageMetric('navigation', 'loadComplete'),
        avgDOMContentLoaded: this.getAverageMetric('navigation', 'domContentLoaded')
      },
      paint: {
        firstPaint: this.getAverageMetric('paint', 'first-paint'),
        firstContentfulPaint: this.getAverageMetric('paint', 'first-contentful-paint')
      },
      memory: {
        avgUsage: this.getAverageMetric('memory', 'usage'),
        currentUsage: this.getCurrentMemoryUsage()
      },
      fps: {
        averageFPS: this.getAverageMetric('fps', 'fps')
      }
    };
  }

  getCurrentMemoryUsage() {
    if (performance.memory) {
      return (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100;
    }
    return 0;
  }

  emit(event, data) {
    // Simple event emitter for performance alerts
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
}

// Resource optimization utilities
export const ResourceOptimizer = {
  // Image lazy loading
  lazyLoadImages: (container = document) => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      container.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  },

  // Preload critical resources
  preloadResources: (resources) => {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.url;
      link.as = resource.type;
      if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
      document.head.appendChild(link);
    });
  },

  // Bundle splitting and dynamic imports
  loadModuleWhenNeeded: async (moduleName, condition) => {
    if (condition()) {
      try {
        const module = await import(`../modules/${moduleName}`);
        return module.default || module;
      } catch (error) {
        console.error(`Failed to load module ${moduleName}:`, error);
        return null;
      }
    }
    return null;
  },

  // Service Worker for caching
  registerServiceWorker: async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
      }
    }
    return null;
  }
};

export default {
  CacheManager,
  LoadBalancer,
  AutoScaler,
  PerformanceMonitor,
  ResourceOptimizer
};
