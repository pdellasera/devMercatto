import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useTheme, ThemeProvider } from '../ThemeProvider';

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(ThemeProvider, { children });
};

describe('useTheme Hook', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should provide default theme', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('dark');
  });

  it('should toggle theme', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.theme).toBe('light');
  });

  it('should set specific theme', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    act(() => {
      result.current.setTheme('light');
    });
    
    expect(result.current.theme).toBe('light');
  });

  it('should persist theme in localStorage', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    act(() => {
      result.current.setTheme('light');
    });
    
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('should load theme from localStorage on mount', () => {
    localStorage.setItem('theme', 'light');
    
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    expect(result.current.theme).toBe('light');
  });

  it('should set data-theme attribute on document', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    act(() => {
      result.current.setTheme('light');
    });
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should update data-theme attribute when theme changes', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
