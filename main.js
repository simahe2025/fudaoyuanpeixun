/**
 * ====================================
 * 主脚本文件 - main.js
 * 智慧党建引领 网络思政赋能 - 辅导员培训班网站
 * ====================================
 */

/**
 * 主应用类
 */
class TrainingWebsiteApp {
    constructor() {
        this.initialized = false;
        this.scrollPosition = 0;
        this.isScrolling = false;
        
        // 绑定this上下文
        this.handleScroll = this.handleScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.toggleBackToTop = this.toggleBackToTop.bind(this);
    }
    
    /**
     * 初始化应用
     */
    init() {
        if (this.initialized) return;
        
        console.log('初始化培训网站应用...');
        
        // 检查必要的DOM元素
        if (!this.checkRequiredElements()) {
            console.warn('缺少必要的DOM元素，延迟初始化');
            setTimeout(() => this.init(), 100);
            return;
        }
        
        // 初始化各个模块
        this.initScrollEffects();
        this.initBackToTop();
        this.initImageLazyLoading();
        this.initScrollAnimations();
        this.initStatAnimations();
        this.initResponsiveFeatures();
        this.initAccessibility();
        this.initPerformanceOptimizations();
        
        // 绑定全局事件
        this.bindGlobalEvents();
        
        // 页面加载完成后的处理
        this.handlePageLoad();
        
        this.initialized = true;
        console.log('培训网站应用初始化完成');
    }
    
    /**
     * 检查必要的DOM元素
     */
    checkRequiredElements() {
        const requiredSelectors = [
            '.header',
            '.tabs-container',
            '.content-container'
        ];
        
        return requiredSelectors.every(selector => {
            const element = document.querySelector(selector);
            if (!element) {
                console.warn(`未找到必要元素: ${selector}`);
                return false;
            }
            return true;
        });
    }
    
    /**
     * 初始化滚动效果
     */
    initScrollEffects() {
        const header = document.querySelector('.header');
        if (!header) return;
        
        // 滚动时的头部效果
        this.handleScroll = Utils.throttle(() => {
            const scrollY = window.pageYOffset;
            this.scrollPosition = scrollY;
            
            // 头部阴影效果
            if (scrollY > 100) {
                header.style.boxShadow = 'var(--shadow-lg)';
            } else {
                header.style.boxShadow = 'none';
            }
            
            // 更新返回顶部按钮
            this.toggleBackToTop();
            
            // 更新滚动进度（如果有进度条）
            this.updateScrollProgress();
            
        }, 16); // 约60fps
        
        window.addEventListener('scroll', this.handleScroll, { passive: true });
    }
    
    /**
     * 初始化返回顶部按钮
     */
    initBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) {
            console.warn('未找到返回顶部按钮');
            return;
        }
        
        // 点击事件
        backToTopBtn.addEventListener('click', () => {
            Utils.smoothScrollTo(document.body, 0, 800);
            
            // 发送分析事件
            this.trackEvent('interaction', 'back_to_top_click');
        });
        
        // 键盘事件
        backToTopBtn.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                backToTopBtn.click();
            }
        });
    }
    
    /**
     * 切换返回顶部按钮显示状态
     */
    toggleBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;
        
        if (this.scrollPosition > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    /**
     * 更新滚动进度
     */
    updateScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) return;
        
        const percentage = Utils.getScrollPercentage();
        progressBar.style.width = `${percentage}%`;
    }
    
    /**
     * 初始化图片懒加载
     */
    initImageLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"], img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // 降级处理：直接加载所有图片
            images.forEach(img => this.loadImage(img));
        }
    }
    
    /**
     * 加载图片
     */
    loadImage(img) {
        const src = img.dataset.src || img.src;
        if (!src) return;
        
        // 创建新的图片对象预加载
        const newImg = new Image();
        
        newImg.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            
            // 添加淡入动画
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            requestAnimationFrame(() => {
                img.style.opacity = '1';
            });
        };
        
        newImg.onerror = () => {
            img.classList.add('error');
            console.warn('图片加载失败:', src);
        };
        
        newImg.src = src;
    }
    
    /**
     * 初始化滚动动画
     */
    initScrollAnimations() {
        const animateElements = document.querySelectorAll('.scroll-animate, .report-card, .group-card, .info-item');
        
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        
                        // 添加延迟动画
                        const delay = entry.target.dataset.delay || 0;
                        if (delay > 0) {
                            entry.target.style.animationDelay = `${delay}ms`;
                        }
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '-10% 0px'
            });
            
            animateElements.forEach(el => {
                el.classList.add('scroll-animate');
                animationObserver.observe(el);
            });
        }
    }
    
    /**
     * 初始化统计数字动画
     */
    initStatAnimations() {
        const statNumbers = document.querySelectorAll('.stat-number');
        let animated = false;
        
        const animateStats = () => {
            if (animated) return;
            animated = true;
            
            statNumbers.forEach((stat, index) => {
                const targetValue = parseInt(stat.textContent) || 0;
                
                setTimeout(() => {
                    Utils.animateNumber(stat, 0, targetValue, 2000, () => {
                        stat.classList.add('animate');
                    });
                }, index * 200);
            });
        };
        
        // 当统计区域进入视窗时启动动画
        const statsSection = document.querySelector('.header-stats');
        if (statsSection && 'IntersectionObserver' in window) {
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateStats();
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            statsObserver.observe(statsSection);
        } else {
            // 降级处理：页面加载后延迟启动动画
            setTimeout(animateStats, 1000);
        }
    }
    
    /**
     * 初始化响应式功能
     */
    initResponsiveFeatures() {
        this.handleResize = Utils.debounce(() => {
            const screenSize = Utils.Device.getScreenSize();
            
            // 更新body类名
            document.body.className = document.body.className.replace(/screen-\w+/g, '');
            document.body.classList.add(`screen-${screenSize}`);
            
            // 移动设备特殊处理
            if (Utils.Device.isMobile()) {
                document.body.classList.add('is-mobile');
                this.handleMobileOptimizations();
            } else {
                document.body.classList.remove('is-mobile');
            }
            
            // 触摸设备处理
            if (Utils.Device.isTouchDevice()) {
                document.body.classList.add('is-touch');
            }
            
        }, 250);
        
        window.addEventListener('resize', this.handleResize);
        this.handleResize(); // 初始执行
    }
    
    /**
     * 移动设备优化
     */
    handleMobileOptimizations() {
        // 禁用悬停效果
        const hoverElements = document.querySelectorAll('.report-card, .group-card, .info-item');
        hoverElements.forEach(el => {
            el.classList.add('no-hover');
        });
        
        // 优化触摸体验
        const touchElements = document.querySelectorAll('.tab, button, .info-item');
        touchElements.forEach(el => {
            el.style.webkitTapHighlightColor = 'rgba(193, 44, 32, 0.2)';
        });
    }
    
    /**
     * 初始化无障碍性功能
     */
    initAccessibility() {
        // 焦点管理
        this.initFocusManagement();
        
        // 键盘导航
        this.initKeyboardNavigation();
        
        // 屏幕阅读器支持
        this.initScreenReaderSupport();
        
        // 高对比度模式检测
        this.detectHighContrast();
    }
    
    /**
     * 初始化焦点管理
     */
    initFocusManagement() {
        // 跳过链接
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (event) => {
                event.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
        
        // 键盘导航指示器
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
    
    /**
     * 初始化键盘导航
     */
    initKeyboardNavigation() {
        // ESC键关闭模态框等
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.handleEscapeKey();
            }
        });
    }
    
    /**
     * 处理ESC键
     */
    handleEscapeKey() {
        // 关闭可能打开的模态框、下拉菜单等
        const modals = document.querySelectorAll('.modal.active, .dropdown.open');
        modals.forEach(modal => {
            modal.classList.remove('active', 'open');
        });
    }
    
    /**
     * 初始化屏幕阅读器支持
     */
    initScreenReaderSupport() {
        // 动态更新aria-live区域
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
        
        // 标签页切换时的屏幕阅读器提示
        document.addEventListener('tabAfterChange', (event) => {
            const { activeTab } = event.detail;
            const tabText = activeTab.textContent.trim();
            this.announceToScreenReader(`已切换到${tabText}标签页`);
        });
    }
    
    /**
     * 向屏幕阅读器播报信息
     */
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }
    
    /**
     * 检测高对比度模式
     */
    detectHighContrast() {
        if (window.matchMedia) {
            const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
            
            const handleHighContrast = (event) => {
                if (event.matches) {
                    document.body.classList.add('high-contrast');
                } else {
                    document.body.classList.remove('high-contrast');
                }
            };
            
            highContrastQuery.addListener(handleHighContrast);
            handleHighContrast(highContrastQuery);
        }
    }
    
    /**
     * 初始化性能优化
     */
    initPerformanceOptimizations() {
        // 预加载关键资源
        this.preloadCriticalResources();
        
        // 内存优化
        this.setupMemoryOptimizations();
        
        // 性能监控
        this.setupPerformanceMonitoring();
    }
    
    /**
     * 预加载关键资源
     */
    preloadCriticalResources() {
        const criticalImages = [
            'https://via.placeholder.com/80x80/c12c20/ffffff?text=GDEI'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
    
    /**
     * 设置内存优化
     */
    setupMemoryOptimizations() {
        // 页面隐藏时暂停动画
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.body.classList.add('page-hidden');
            } else {
                document.body.classList.remove('page-hidden');
            }
        });
        
        // 清理未使用的事件监听器
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }
    
    /**
     * 设置性能监控
     */
    setupPerformanceMonitoring() {
        // 监控页面加载性能
        window.addEventListener('load', () => {
            setTimeout(() => {
                const performance = Utils.Performance.getPagePerformance();
                if (performance) {
                    console.log('页面性能数据:', performance);
                    this.trackEvent('performance', 'page_load', performance);
                }
            }, 1000);
        });
        
        // 监控长任务
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const longTasks = list.getEntries();
                    longTasks.forEach(task => {
                        if (task.duration > 50) {
                            console.warn('检测到长任务:', task);
                        }
                    });
                });
                observer.observe({ entryTypes: ['longtask'] });
            } catch (error) {
                // 某些浏览器可能不支持longtask
                console.log('长任务监控不支持');
            }
        }
    }
    
    /**
     * 绑定全局事件
     */
    bindGlobalEvents() {
        // 页面加载事件
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.handleDOMLoaded.bind(this));
        } else {
            this.handleDOMLoaded();
        }
        
        window.addEventListener('load', this.handleWindowLoad.bind(this));
        
        // 错误处理
        window.addEventListener('error', this.handleError.bind(this));
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
        
        // 在线/离线状态
        window.addEventListener('online', this.handleOnline.bind(this));
        window.addEventListener('offline', this.handleOffline.bind(this));
    }
    
    /**
     * 处理DOM加载完成
     */
    handleDOMLoaded() {
        console.log('DOM加载完成');
        document.body.classList.add('dom-loaded');
    }
    
    /**
     * 处理页面完全加载
     */
    handleWindowLoad() {
        console.log('页面完全加载');
        document.body.classList.add('page-loaded');
        
        // 移除加载指示器
        const loader = document.querySelector('.loader, .loading');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        }
    }
    
    /**
     * 处理页面加载
     */
    handlePageLoad() {
        // 添加页面淡入动画
        document.body.classList.add('page-fade-in');
        
        // 设置初始动画延迟
        const animateElements = document.querySelectorAll('.info-item');
        animateElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 100}ms`;
        });
    }
    
    /**
     * 处理JavaScript错误
     */
    handleError(event) {
        console.error('JavaScript错误:', event.error);
        this.trackEvent('error', 'javascript_error', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno
        });
    }
    
    /**
     * 处理未捕获的Promise拒绝
     */
    handleUnhandledRejection(event) {
        console.error('未处理的Promise拒绝:', event.reason);
        this.trackEvent('error', 'promise_rejection', {
            reason: event.reason
        });
    }
    
    /**
     * 处理在线状态
     */
    handleOnline() {
        document.body.classList.remove('offline');
        this.announceToScreenReader('网络连接已恢复');
    }
    
    /**
     * 处理离线状态
     */
    handleOffline() {
        document.body.classList.add('offline');
        this.announceToScreenReader('网络连接已断开');
    }
    
    /**
     * 事件追踪
     */
    trackEvent(category, action, data = {}) {
        // 这里可以集成Google Analytics、百度统计等
        console.log('事件追踪:', { category, action, data });
        
        // 示例：发送到分析服务
        if (window.gtag) {
            window.gtag('event', action, {
                event_category: category,
                custom_parameter: data
            });
        }
    }
    
    /**
     * 清理资源
     */
    cleanup() {
        // 移除事件监听器
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        
        console.log('应用资源已清理');
    }
    
    /**
     * 获取应用状态
     */
    getState() {
        return {
            initialized: this.initialized,
            scrollPosition: this.scrollPosition,
            activeTab: window.tabManager ? window.tabManager.getActiveTab() : null,
            screenSize: Utils.Device.getScreenSize(),
            isMobile: Utils.Device.isMobile()
        };
    }
}

// 创建应用实例
const app = new TrainingWebsiteApp();

// DOM加载完成后初始化应用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app.init();
    });
} else {
    app.init();
}

// 导出到全局
window.TrainingWebsiteApp = TrainingWebsiteApp;
window.app = app;