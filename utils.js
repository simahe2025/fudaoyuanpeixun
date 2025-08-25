/**
 * ====================================
 * 工具函数文件 - utils.js
 * 智慧党建引领 网络思政赋能 - 辅导员培训班网站
 * ====================================
 */

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} delay - 延迟时间(毫秒)
 * @returns {Function} 防抖后的函数
 */
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} delay - 节流间隔(毫秒)
 * @returns {Function} 节流后的函数
 */
function throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) return;
        lastCall = now;
        return func.apply(this, args);
    };
}

/**
 * 检查元素是否在视窗中
 * @param {Element} element - 要检查的元素
 * @param {number} threshold - 阈值 (0-1)
 * @returns {boolean} 是否在视窗中
 */
function isElementInViewport(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    const vertInView = (rect.top <= windowHeight * (1 - threshold)) && 
                      ((rect.top + rect.height) >= windowHeight * threshold);
    const horInView = (rect.left <= windowWidth * (1 - threshold)) && 
                     ((rect.left + rect.width) >= windowWidth * threshold);
    
    return vertInView && horInView;
}

/**
 * 平滑滚动到指定元素
 * @param {string|Element} target - 目标元素或选择器
 * @param {number} offset - 偏移量
 * @param {number} duration - 动画持续时间(毫秒)
 */
function smoothScrollTo(target, offset = 0, duration = 800) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;
    
    const targetPosition = element.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    // 缓动函数
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

/**
 * 获取滚动百分比
 * @returns {number} 滚动百分比 (0-100)
 */
function getScrollPercentage() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
}

/**
 * 格式化日期
 * @param {Date|string} date - 日期对象或字符串
 * @param {string} format - 格式 ('YYYY-MM-DD', 'MM/DD/YYYY', 'relative')
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    if (format === 'relative') {
        const now = new Date();
        const diffTime = Math.abs(now - d);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return '今天';
        if (diffDays === 1) return '昨天';
        if (diffDays < 7) return `${diffDays}天前`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)}周前`;
        if (diffDays < 365) return `${Math.ceil(diffDays / 30)}个月前`;
        return `${Math.ceil(diffDays / 365)}年前`;
    }
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    switch (format) {
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
        case 'MM/DD/YYYY':
            return `${month}/${day}/${year}`;
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`;
        default:
            return d.toLocaleDateString();
    }
}

/**
 * 数字动画计数器
 * @param {Element} element - 目标元素
 * @param {number} start - 起始数字
 * @param {number} end - 结束数字
 * @param {number} duration - 持续时间(毫秒)
 * @param {Function} callback - 完成回调
 */
function animateNumber(element, start, end, duration = 2000, callback = null) {
    let startTime = null;
    const difference = end - start;
    
    function step(currentTime) {
        if (startTime === null) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const current = start + (difference * progress);
        
        element.textContent = Math.floor(current);
        
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            element.textContent = end;
            if (callback) callback();
        }
    }
    
    requestAnimationFrame(step);
}

/**
 * 本地存储工具
 */
const StorageUtil = {
    /**
     * 设置本地存储
     * @param {string} key - 键名
     * @param {any} value - 值
     * @param {number} expire - 过期时间(毫秒)
     */
    set(key, value, expire = null) {
        const item = {
            value: value,
            timestamp: Date.now(),
            expire: expire ? Date.now() + expire : null
        };
        try {
            localStorage.setItem(key, JSON.stringify(item));
        } catch (error) {
            console.warn('LocalStorage设置失败:', error);
        }
    },
    
    /**
     * 获取本地存储
     * @param {string} key - 键名
     * @param {any} defaultValue - 默认值
     * @returns {any} 存储的值
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return defaultValue;
            
            const parsed = JSON.parse(item);
            
            // 检查是否过期
            if (parsed.expire && Date.now() > parsed.expire) {
                localStorage.removeItem(key);
                return defaultValue;
            }
            
            return parsed.value;
        } catch (error) {
            console.warn('LocalStorage获取失败:', error);
            return defaultValue;
        }
    },
    
    /**
     * 删除本地存储
     * @param {string} key - 键名
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('LocalStorage删除失败:', error);
        }
    },
    
    /**
     * 清空本地存储
     */
    clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.warn('LocalStorage清空失败:', error);
        }
    }
};

/**
 * 设备检测工具
 */
const DeviceUtil = {
    /**
     * 检测是否为移动设备
     * @returns {boolean}
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    /**
     * 检测是否为平板设备
     * @returns {boolean}
     */
    isTablet() {
        return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(navigator.userAgent);
    },
    
    /**
     * 检测是否为桌面设备
     * @returns {boolean}
     */
    isDesktop() {
        return !this.isMobile() && !this.isTablet();
    },
    
    /**
     * 获取屏幕尺寸分类
     * @returns {string} 'xs' | 'sm' | 'md' | 'lg' | 'xl'
     */
    getScreenSize() {
        const width = window.innerWidth;
        if (width < 576) return 'xs';
        if (width < 768) return 'sm';
        if (width < 992) return 'md';
        if (width < 1200) return 'lg';
        return 'xl';
    },
    
    /**
     * 检测是否支持触摸
     * @returns {boolean}
     */
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }
};

/**
 * URL工具
 */
const URLUtil = {
    /**
     * 获取URL参数
     * @param {string} name - 参数名
     * @returns {string|null} 参数值
     */
    getParam(name) {
        const url = new URL(window.location);
        return url.searchParams.get(name);
    },
    
    /**
     * 设置URL参数
     * @param {string} name - 参数名
     * @param {string} value - 参数值
     * @param {boolean} replace - 是否替换历史记录
     */
    setParam(name, value, replace = true) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        
        if (replace) {
            window.history.replaceState({}, '', url);
        } else {
            window.history.pushState({}, '', url);
        }
    },
    
    /**
     * 删除URL参数
     * @param {string} name - 参数名
     * @param {boolean} replace - 是否替换历史记录
     */
    removeParam(name, replace = true) {
        const url = new URL(window.location);
        url.searchParams.delete(name);
        
        if (replace) {
            window.history.replaceState({}, '', url);
        } else {
            window.history.pushState({}, '', url);
        }
    }
};

/**
 * 性能监控工具
 */
const PerformanceUtil = {
    /**
     * 测量函数执行时间
     * @param {Function} func - 要测量的函数
     * @param {string} label - 标签
     * @returns {any} 函数返回值
     */
    measure(func, label = 'Function') {
        const start = performance.now();
        const result = func();
        const end = performance.now();
        console.log(`${label} 执行时间: ${(end - start).toFixed(2)}ms`);
        return result;
    },
    
    /**
     * 获取页面加载性能
     * @returns {Object} 性能数据
     */
    getPagePerformance() {
        if (!window.performance || !window.performance.timing) {
            return null;
        }
        
        const timing = window.performance.timing;
        return {
            dns: timing.domainLookupEnd - timing.domainLookupStart,
            connect: timing.connectEnd - timing.connectStart,
            request: timing.responseStart - timing.requestStart,
            response: timing.responseEnd - timing.responseStart,
            dom: timing.domContentLoadedEventEnd - timing.navigationStart,
            load: timing.loadEventEnd - timing.navigationStart
        };
    }
};

/**
 * 错误处理工具
 */
const ErrorUtil = {
    /**
     * 全局错误处理
     */
    setupGlobalErrorHandler() {
        window.addEventListener('error', (event) => {
            console.error('JavaScript错误:', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('未处理的Promise拒绝:', event.reason);
        });
    },
    
    /**
     * 安全执行函数
     * @param {Function} func - 要执行的函数
     * @param {any} fallback - 失败时的fallback值
     * @returns {any} 执行结果或fallback值
     */
    safeExecute(func, fallback = null) {
        try {
            return func();
        } catch (error) {
            console.warn('函数执行失败:', error);
            return fallback;
        }
    }
};

/**
 * 导出工具对象到全局
 */
window.Utils = {
    debounce,
    throttle,
    isElementInViewport,
    smoothScrollTo,
    getScrollPercentage,
    formatDate,
    animateNumber,
    Storage: StorageUtil,
    Device: DeviceUtil,
    URL: URLUtil,
    Performance: PerformanceUtil,
    Error: ErrorUtil
};

// 初始化错误处理
ErrorUtil.setupGlobalErrorHandler();