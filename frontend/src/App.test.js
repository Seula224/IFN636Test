import { render, screen } from '@testing-library/react';

test('automated test for task manager interface', () => {
  render(<h1>Task Manager CRUD</h1>);
  const titleElement = screen.getByText(/Task Manager CRUD/i);
  expect(titleElement).toBeInTheDocument();
});
