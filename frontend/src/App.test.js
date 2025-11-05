import { render, screen } from '@testing-library/react';
import App from './App';

test('renders PayFlow application', () => {
  render(<App />);
  const titleElement = screen.getByText(/Welcome to PayFlow/i);
  expect(titleElement).toBeInTheDocument();
});
