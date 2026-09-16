import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve([]) }));
});

test('показывает каталог BookingKG', async () => {
  const { getByText, findByText } = render(<App />);
  expect(getByText(/Откройте Кыргызстан/i)).toBeInTheDocument();
  expect(getByText(/Куда отправимся/i)).toBeInTheDocument();
  expect(await findByText(/Найдено направлений/i)).toBeInTheDocument();
});
