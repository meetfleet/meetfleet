import { usePathname } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export function useMobileKeyboard() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const pathname = usePathname();
  const initialHeight = useRef(isWeb && typeof window !== 'undefined' ? window.visualViewport?.height || window.innerHeight : 0);

  // Exception list: Pages that should maintain current behavior
  const isExceptionPage = pathname === '/(tabs)/addcard' || 
                          pathname === '/addcard' || 
                          pathname.includes('addcard') ||
                          pathname.includes('payment/add');

  useEffect(() => {
    if (isExceptionPage) {
      setKeyboardHeight(0);
      return;
    }

    if (isWeb && typeof window !== 'undefined') {
      const handleResize = () => {
        if (!window.visualViewport) return;
        
        const currentHeight = window.visualViewport.height;
        // Use window.innerHeight as fallback baseline, but prefer the initial captured height
        // to avoid issues with address bar appearing/disappearing
        const baseHeight = initialHeight.current || window.innerHeight;
        
        const diff = baseHeight - currentHeight;
        
        // Threshold to consider it a keyboard (address bar is usually smaller)
        if (diff > 150) {
          setKeyboardHeight(diff);
        } else {
          setKeyboardHeight(0);
        }
      };

      const handleFocus = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
          // Auto-scroll logic: 1/3 from top
          setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        }
      };

      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleResize);
        // Update initial height if it changes drastically (e.g. orientation change) but not keyboard
        // This is tricky. For now, assume portrait/landscape change updates initialHeight if keyboard is closed.
      }
      window.addEventListener('focusin', handleFocus);

      return () => {
        if (window.visualViewport) {
          window.visualViewport.removeEventListener('resize', handleResize);
        }
        window.removeEventListener('focusin', handleFocus);
      };
    } else {
      // Native implementation
      const onShow = (e: KeyboardEvent) => setKeyboardHeight(e.endCoordinates.height);
      const onHide = () => setKeyboardHeight(0);

      const showSubscription = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', 
        onShow
      );
      const hideSubscription = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', 
        onHide
      );

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }
  }, [isExceptionPage]);

  return {
    keyboardHeight,
    isExceptionPage,
  };
}
