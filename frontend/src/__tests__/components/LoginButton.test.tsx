import { LoginButton } from '@/components/LoginButton';
import { fireEvent, render, screen } from '@testing-library/react';

describe('LoginButton', () => {
  it('renders button with correct text', () => {
    render(<LoginButton />);
    expect(screen.getByRole('button')).toHaveTextContent('Login with Spotify');
  });

  it('calls window.location.assign on click', () => {
    const assignMock = jest.fn();
    // Podmieniamy assign w window.location
    Object.defineProperty(window, 'location', {
      value: { assign: assignMock },
      writable: true,
    });

    render(<LoginButton />);
    fireEvent.click(screen.getByRole('button'));

    expect(assignMock).toHaveBeenCalledWith('http://localhost:8000/spotify/login');
  });

  it('disables button when loading or disabled prop is true', () => {
    const { rerender } = render(<LoginButton loading />);
    expect(screen.getByRole('button')).toBeDisabled();

    rerender(<LoginButton disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
