/**
 * ====================================
 * 标签页功能文件 - tabs.js
 * 智慧党建引领 网络思政赋能 - 辅导员培训班网站
 * ====================================
 */

/**
 * 标签页管理类
 */
class TabManager {
    constructor() {
        this.activeTab = null;
        this.tabs = [];
        this.tabContents = [];
        this.initialized = false;
        
        // 绑定this上下文
        this.openTab = this.openTab.bind(this);
        this.handleKeyNavigation = this.handleKeyNavigation.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }
    
    /**
     * 初始化标签页系统
     */
    init() {
        if (this.initialized) return;
        
        // 获取所有标签页和内容
        this.tabs = Array.from(document.querySelectorAll('.tab'));
        this.tabContents = Array.from(document.querySelectorAll('.tab-content'));
        
        if (this.tabs.length === 0 || this.tabContents.length === 0) {
            console.warn('未找到标签页元素');
            return;
        }
        
        // 设置初始状态
        this.setupInitialState();
        
        // 绑定事件
        this.bindEvents();
        
        // 从URL获取初始标签页
        this.loadFromURL();
        
        this.initialized = true;
        console.log('标签页系统已初始化');
    }
    
    /**
     * 设置初始状态
     */
    setupInitialState() {
        // 设置ARIA属性
        this.tabs.forEach((tab, index) => {
            const tabId = tab.getAttribute('aria-controls') || `tab-content-${index}`;
            const content = document.getElementById(tabId);
            
            if (content) {
                // 设置标签页属性
                tab.setAttribute('role', 'tab');
                tab.setAttribute('aria-controls', tabId);
                tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
                
                // 设置内容属性
                content.setAttribute('role', 'tabpanel');
                content.setAttribute('aria-labelledby', tab.id || `tab-${index}`);
                
                if (!tab.id) {
                    tab.id = `tab-${index}`;
                }
            }
        });
        
        // 确保有一个活动标签页
        const activeTab = this.tabs.find(tab => tab.classList.contains('active'));
        if (!activeTab && this.tabs.length > 0) {
            this.setActiveTab(this.tabs[0], false);
        } else if (activeTab) {
            this.activeTab = activeTab;
        }
    }
    
    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 标签页点击事件
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = tab.getAttribute('aria-controls');
                this.openTab(event, targetId);
            });
            
            // 键盘事件
            tab.addEventListener('keydown', this.handleKeyNavigation);
        });
        
        // 窗口大小变化事件
        window.addEventListener('resize', Utils.debounce(this.handleResize, 250));
        
        // 浏览器前进/后退事件
        window.addEventListener('popstate', () => {
            this.loadFromURL();
        });
    }
    
    /**
     * 打开指定标签页
     * @param {Event} event - 事件对象
     * @param {string} tabId - 标签页ID
     */
    openTab(event, tabId) {
        const targetContent = document.getElementById(tabId);
        const targetTab = event ? event.currentTarget : 
                          this.tabs.find(tab => tab.getAttribute('aria-controls') === tabId);
        
        if (!targetContent || !targetTab) {
            console.warn('未找到目标标签页或内容:', tabId);
            return;
        }
        
        // 检查是否已经是活动标签页
        if (targetTab === this.activeTab) {
            return;
        }
        
        // 触发切换前事件
        const beforeEvent = new CustomEvent('tabBeforeChange', {
            detail: {
                previousTab: this.activeTab,
                nextTab: targetTab,
                previousContent: this.activeTab ? document.getElementById(this.activeTab.getAttribute('aria-controls')) : null,
                nextContent: targetContent
            },
            cancelable: true
        });
        
        if (!document.dispatchEvent(beforeEvent)) {
            return; // 事件被取消
        }
        
        // 执行切换
        this.setActiveTab(targetTab, true);
        
        // 更新URL
        this.updateURL(tabId);
        
        // 触发切换后事件
        const afterEvent = new CustomEvent('tabAfterChange', {
            detail: {
                activeTab: targetTab,
                activeContent: targetContent,
                tabId: tabId
            }
        });
        document.dispatchEvent(afterEvent);
    }
    
    /**
     * 设置活动标签页
     * @param {Element} targetTab - 目标标签页
     * @param {boolean} animate - 是否启用动画
     */
    setActiveTab(targetTab, animate = true) {
        const targetId = targetTab.getAttribute('aria-controls');
        const targetContent = document.getElementById(targetId);
        
        if (!targetContent) return;
        
        // 移除所有活动状态
        this.tabs.forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
            tab.setAttribute('tabindex', '-1');
        });
        
        this.tabContents.forEach(content => {
            content.classList.remove('active');
            if (animate) {
                content.style.opacity = '0';
                content.style.transform = 'translateY(20px)';
            }
        });
        
        // 设置新的活动状态
        targetTab.classList.add('active');
        targetTab.setAttribute('aria-selected', 'true');
        targetTab.setAttribute('tabindex', '0');
        
        // 显示目标内容
        if (animate) {
            // 使用动画
            targetContent.classList.add('active');
            requestAnimationFrame(() => {
                targetContent.style.opacity = '1';
                targetContent.style.transform = 'translateY(0)';
            });
        } else {
            // 直接显示
            targetContent.classList.add('active');
            targetContent.style.opacity = '1';
            targetContent.style.transform = 'translateY(0)';
        }
        
        this.activeTab = targetTab;
        
        // 滚动到标签页容器
        this.scrollToTab(targetTab);
        
        // 保存状态
        Utils.Storage.set('activeTab', targetId, 24 * 60 * 60 * 1000); // 24小时
    }
    
    /**
     * 处理键盘导航
     * @param {KeyboardEvent} event - 键盘事件
     */
    handleKeyNavigation(event) {
        const currentIndex = this.tabs.indexOf(event.currentTarget);
        let targetIndex = -1;
        
        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                event.preventDefault();
                targetIndex = currentIndex > 0 ? currentIndex - 1 : this.tabs.length - 1;
                break;
                
            case 'ArrowRight':
            case 'ArrowDown':
                event.preventDefault();
                targetIndex = currentIndex < this.tabs.length - 1 ? currentIndex + 1 : 0;
                break;
                
            case 'Home':
                event.preventDefault();
                targetIndex = 0;
                break;
                
            case 'End':
                event.preventDefault();
                targetIndex = this.tabs.length - 1;
                break;
                
            case 'Enter':
            case ' ':
                event.preventDefault();
                const tabId = event.currentTarget.getAttribute('aria-controls');
                this.openTab(event, tabId);
                return;
        }
        
        if (targetIndex >= 0 && targetIndex < this.tabs.length) {
            this.tabs[targetIndex].focus();
        }
    }
    
    /**
     * 滚动到标签页
     * @param {Element} tab - 标签页元素
     */
    scrollToTab(tab) {
        const tabsContainer = tab.closest('.tabs');
        if (!tabsContainer) return;
        
        const containerRect = tabsContainer.getBoundingClientRect();
        const tabRect = tab.getBoundingClientRect();
        
        if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
            tab.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }
    
    /**
     * 处理窗口大小变化
     */
    handleResize() {
        // 重新计算布局
        const screenSize = Utils.Device.getScreenSize();
        
        // 在移动设备上调整标签页显示
        if (screenSize === 'xs' || screenSize === 'sm') {
            this.tabs.forEach(tab => {
                const span = tab.querySelector('span');
                if (span && window.innerWidth < 400) {
                    span.style.display = 'none';
                } else if (span) {
                    span.style.display = '';
                }
            });
        }
    }
    
    /**
     * 更新URL
     * @param {string} tabId - 标签页ID
     */
    updateURL(tabId) {
        if (!tabId) return;
        
        // 使用replaceState避免影响浏览器历史
        Utils.URL.setParam('tab', tabId, true);
    }
    
    /**
     * 从URL加载标签页
     */
    loadFromURL() {
        const tabId = Utils.URL.getParam('tab') || Utils.Storage.get('activeTab');
        
        if (tabId) {
            const targetTab = this.tabs.find(tab => tab.getAttribute('aria-controls') === tabId);
            if (targetTab) {
                this.setActiveTab(targetTab, false);
                return;
            }
        }
        
        // 如果没有找到，确保有一个默认活动标签页
        if (this.tabs.length > 0 && !this.activeTab) {
            this.setActiveTab(this.tabs[0], false);
        }
    }
    
    /**
     * 获取当前活动标签页
     * @returns {Element} 活动标签页元素
     */
    getActiveTab() {
        return this.activeTab;
    }
    
    /**
     * 获取当前活动内容
     * @returns {Element} 活动内容元素
     */
    getActiveContent() {
        if (!this.activeTab) return null;
        const tabId = this.activeTab.getAttribute('aria-controls');
        return document.getElementById(tabId);
    }
    
    /**
     * 编程式切换到指定标签页
     * @param {string} tabId - 标签页ID
     */
    switchTo(tabId) {
        const targetTab = this.tabs.find(tab => tab.getAttribute('aria-controls') === tabId);
        if (targetTab) {
            this.openTab(null, tabId);
        }
    }
    
    /**
     * 销毁标签页管理器
     */
    destroy() {
        // 移除事件监听器
        this.tabs.forEach(tab => {
            tab.removeEventListener('click', this.openTab);
            tab.removeEventListener('keydown', this.handleKeyNavigation);
        });
        
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('popstate', this.loadFromURL);
        
        // 重置状态
        this.activeTab = null;
        this.tabs = [];
        this.tabContents = [];
        this.initialized = false;
    }
}

// 创建全局实例
const tabManager = new TabManager();

/**
 * 全局openTab函数，保持向后兼容性
 * @param {Event} event - 事件对象
 * @param {string} tabName - 标签页名称
 */
function openTab(event, tabName) {
    tabManager.openTab(event, tabName);
}

// DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        tabManager.init();
    });
} else {
    tabManager.init();
}

// 导出到全局
window.TabManager = TabManager;
window.tabManager = tabManager;