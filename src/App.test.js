import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Vocelio.ai dashboard', () => {
  render(<App />);
  const logoElement = screen.getByText(/Vocelio\.ai/i);
  expect(logoElement).toBeInTheDocument();
});
