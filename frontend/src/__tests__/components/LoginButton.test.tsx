import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LoginButton } from '@/components/LoginButton';

describe('LoginButton', () => {
  it('renders button with correct text', () => {
    render(<LoginButton />);
    expect(screen.getByRole('button')).toHaveTextContent('Login with Spotify');
  });
});
