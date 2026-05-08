import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusMessage } from '../components/common/StatusMessage';

describe('StatusMessage', () => {
  it('renders visible production UX feedback', () => {
    render(<StatusMessage type="success">Saved through API</StatusMessage>);

    expect(screen.getByText('Saved through API')).toBeInTheDocument();
  });
});
