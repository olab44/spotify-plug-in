import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useAuth } from '../../hooks/useAuth';

// Mock the localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock useNavigate
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('useAuth hook', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
  });

  it('initializes with null user when no token exists', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('spotify_access_token');
  });

  it('initializes with user data when token exists', () => {
    const mockToken = 'mock-token';
    const mockUser = {
      id: '123',
      display_name: 'Test User',
      email: 'test@example.com',
    };

    mockLocalStorage.getItem.mockReturnValue(mockToken);

    // Mock the API call
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUser),
      }),
    ) as any;

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it('handles login successfully', async () => {
    const mockCode = 'mock-auth-code';
    const mockTokenResponse = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
    };

    // Mock the token exchange API call
    global.fetch = vi
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTokenResponse),
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: '123', display_name: 'Test User' }),
        }),
      );

    const { result } = renderHook(() => useAuth());

    await result.current.login(mockCode);

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'spotify_access_token',
      mockTokenResponse.access_token,
    );
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'spotify_refresh_token',
      mockTokenResponse.refresh_token,
    );
  });

  it('handles logout correctly', () => {
    const { result } = renderHook(() => useAuth());

    result.current.logout();

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('spotify_access_token');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('spotify_refresh_token');
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('handles failed API calls', async () => {
    mockLocalStorage.getItem.mockReturnValue('invalid-token');

    // Mock failed API call
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
      }),
    ) as any;

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('handles token refresh', async () => {
    const mockRefreshToken = 'mock-refresh-token';
    const mockNewToken = 'new-access-token';

    mockLocalStorage.getItem
      .mockReturnValueOnce('expired-token')
      .mockReturnValueOnce(mockRefreshToken);

    // Mock token refresh API call
    global.fetch = vi
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ access_token: mockNewToken }),
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: '123', display_name: 'Test User' }),
        }),
      );

    const { result } = renderHook(() => useAuth());

    // Trigger a refresh (implementation specific)
    await result.current.refreshToken();

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('spotify_access_token', mockNewToken);
  });
});
