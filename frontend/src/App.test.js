import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve([]) }));
});

test('показывает каталог BookingKG', () => {
  const { getByText } = render(<App />);
  expect(getByText(/Откройте места/i)).toBeInTheDocument();
  expect(getByText(/Куда отправимся/i)).toBeInTheDocument();
});
