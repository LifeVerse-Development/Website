import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../src/pages/Home';

test('renders learn react link', () => {
  render(<Home />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});