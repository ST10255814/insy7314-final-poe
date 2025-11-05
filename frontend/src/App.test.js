import { render } from '@testing-library/react';

// Simple test component for default React testing
function TestComponent() {
  return <div>React App Test</div>;
}

test('renders test component', () => {
  const { getByText } = render(<TestComponent />);
  const element = getByText(/React App Test/i);
  expect(element).toBeInTheDocument();
});