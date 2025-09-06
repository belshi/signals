/**
 * DOM utility functions for common DOM operations
 */

/**
 * Selects an element by selector
 */
export const $ = <T extends Element = Element>(selector: string, parent: Document | Element = document): T | null => {
  return parent.querySelector<T>(selector);
};

/**
 * Selects all elements by selector
 */
export const $$ = <T extends Element = Element>(selector: string, parent: Document | Element = document): NodeListOf<T> => {
  return parent.querySelectorAll<T>(selector);
};

/**
 * Creates an element with attributes and children
 */
export const createElement = <T extends keyof HTMLElementTagNameMap>(
  tagName: T,
  attributes: Record<string, any> = {},
  children: (string | Node)[] = []
): HTMLElementTagNameMap[T] => {
  const element = document.createElement(tagName);
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className' || key === 'class') {
      element.className = value;
    } else if (key === 'innerHTML') {
      element.innerHTML = value;
    } else if (key === 'textContent') {
      element.textContent = value;
    } else if (key.startsWith('data-')) {
      element.setAttribute(key, value);
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else {
      (element as any)[key] = value;
    }
  });
  
  // Add children
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
  
  return element;
};

/**
 * Adds a class to an element
 */
export const addClass = (element: Element, className: string): void => {
  element.classList.add(className);
};

/**
 * Removes a class from an element
 */
export const removeClass = (element: Element, className: string): void => {
  element.classList.remove(className);
};

/**
 * Toggles a class on an element
 */
export const toggleClass = (element: Element, className: string): void => {
  element.classList.toggle(className);
};

/**
 * Checks if an element has a class
 */
export const hasClass = (element: Element, className: string): boolean => {
  return element.classList.contains(className);
};

/**
 * Sets multiple classes on an element
 */
export const setClasses = (element: Element, classes: string[]): void => {
  element.className = classes.join(' ');
};

/**
 * Gets the computed style of an element
 */
export const getComputedStyle = (element: Element, property?: string): CSSStyleDeclaration | string => {
  const styles = window.getComputedStyle(element);
  return property ? styles.getPropertyValue(property) : styles;
};

/**
 * Sets the style of an element
 */
export const setStyle = (element: HTMLElement, styles: Record<string, string>): void => {
  Object.assign(element.style, styles);
};

/**
 * Gets the position of an element relative to the viewport
 */
export const getElementPosition = (element: Element): {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
} => {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  };
};

/**
 * Checks if an element is in the viewport
 */
export const isInViewport = (element: Element): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Scrolls an element into view
 */
export const scrollIntoView = (element: Element, options: ScrollIntoViewOptions = {}): void => {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest',
    ...options,
  });
};

/**
 * Gets the scroll position of an element
 */
export const getScrollPosition = (element: Element | Window = window): { x: number; y: number } => {
  if (element === window) {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop,
    };
  }
  
  return {
    x: (element as Element).scrollLeft,
    y: (element as Element).scrollTop,
  };
};

/**
 * Sets the scroll position of an element
 */
export const setScrollPosition = (element: Element | Window, x: number, y: number): void => {
  if (element === window) {
    window.scrollTo(x, y);
  } else {
    (element as Element).scrollLeft = x;
    (element as Element).scrollTop = y;
  }
};

/**
 * Gets the dimensions of an element
 */
export const getElementDimensions = (element: Element): {
  width: number;
  height: number;
  offsetWidth: number;
  offsetHeight: number;
  clientWidth: number;
  clientHeight: number;
  scrollWidth: number;
  scrollHeight: number;
} => {
  const rect = element.getBoundingClientRect();
  const htmlElement = element as HTMLElement;
  
  return {
    width: rect.width,
    height: rect.height,
    offsetWidth: htmlElement.offsetWidth,
    offsetHeight: htmlElement.offsetHeight,
    clientWidth: htmlElement.clientWidth,
    clientHeight: htmlElement.clientHeight,
    scrollWidth: htmlElement.scrollWidth,
    scrollHeight: htmlElement.scrollHeight,
  };
};

/**
 * Adds an event listener with automatic cleanup
 */
export const addEventListener = <K extends keyof HTMLElementEventMap>(
  element: Element,
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): () => void => {
  element.addEventListener(event, handler as EventListener, options);
  
  // Return cleanup function
  return () => {
    element.removeEventListener(event, handler as EventListener, options);
  };
};

/**
 * Adds a delegated event listener
 */
export const addDelegatedEventListener = <K extends keyof HTMLElementEventMap>(
  parent: Element,
  selector: string,
  event: K,
  handler: (event: HTMLElementEventMap[K], target: Element) => void,
  options?: boolean | AddEventListenerOptions
): () => void => {
  const delegatedHandler = (e: Event) => {
    const target = e.target as Element;
    if (target.matches(selector)) {
      handler(e as HTMLElementEventMap[K], target);
    }
  };
  
  parent.addEventListener(event, delegatedHandler, options);
  
  // Return cleanup function
  return () => {
    parent.removeEventListener(event, delegatedHandler, options);
  };
};

/**
 * Waits for an element to appear in the DOM
 */
export const waitForElement = (selector: string, timeout: number = 5000): Promise<Element> => {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }
    
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    
    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
};

/**
 * Clones an element with all its attributes and children
 */
export const cloneElement = (element: Element, deep: boolean = true): Element => {
  return element.cloneNode(deep) as Element;
};

/**
 * Removes an element from the DOM
 */
export const removeElement = (element: Element): void => {
  element.remove();
};

/**
 * Replaces an element with another element
 */
export const replaceElement = (oldElement: Element, newElement: Element): void => {
  oldElement.parentNode?.replaceChild(newElement, oldElement);
};

/**
 * Inserts an element after another element
 */
export const insertAfter = (newElement: Element, referenceElement: Element): void => {
  referenceElement.parentNode?.insertBefore(newElement, referenceElement.nextSibling);
};

/**
 * Inserts an element before another element
 */
export const insertBefore = (newElement: Element, referenceElement: Element): void => {
  referenceElement.parentNode?.insertBefore(newElement, referenceElement);
};

/**
 * Gets the parent element that matches a selector
 */
export const getClosest = (element: Element, selector: string): Element | null => {
  return element.closest(selector);
};

/**
 * Gets all parent elements
 */
export const getParents = (element: Element): Element[] => {
  const parents: Element[] = [];
  let parent = element.parentElement;
  
  while (parent) {
    parents.push(parent);
    parent = parent.parentElement;
  }
  
  return parents;
};

/**
 * Gets the next sibling element
 */
export const getNextSibling = (element: Element): Element | null => {
  let sibling = element.nextSibling;
  while (sibling && sibling.nodeType !== Node.ELEMENT_NODE) {
    sibling = sibling.nextSibling;
  }
  return sibling as Element | null;
};

/**
 * Gets the previous sibling element
 */
export const getPreviousSibling = (element: Element): Element | null => {
  let sibling = element.previousSibling;
  while (sibling && sibling.nodeType !== Node.ELEMENT_NODE) {
    sibling = sibling.previousSibling;
  }
  return sibling as Element | null;
};

/**
 * Gets all sibling elements
 */
export const getSiblings = (element: Element): Element[] => {
  const siblings: Element[] = [];
  let sibling = element.parentElement?.firstChild;
  
  while (sibling) {
    if (sibling.nodeType === Node.ELEMENT_NODE && sibling !== element) {
      siblings.push(sibling as Element);
    }
    sibling = sibling.nextSibling;
  }
  
  return siblings;
};

/**
 * Checks if an element is visible
 */
export const isVisible = (element: Element): boolean => {
  const style = getComputedStyle(element) as CSSStyleDeclaration;
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
};

/**
 * Checks if an element is hidden
 */
export const isHidden = (element: Element): boolean => {
  return !isVisible(element);
};

/**
 * Focuses an element
 */
export const focus = (element: HTMLElement): void => {
  element.focus();
};

/**
 * Blurs an element
 */
export const blur = (element: HTMLElement): void => {
  element.blur();
};

/**
 * Selects all text in an element
 */
export const selectAllText = (element: HTMLElement): void => {
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    element.select();
  } else {
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
};
