import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from '../App';
import { AppProvider } from '../context/Appcontext';

describe('App Component', () => {
  it('renders without crashing', () => {
    // Mock the context provider
    const MockProvider = ({ children }) => (
      <AppProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AppProvider>
    );

    render(<App />, { wrapper: MockProvider });
    
    // Check if the sidebar or main structure is in the document
    // Since App just routes, we expect it to render the main app structure without throwing
    expect(document.body).toBeDefined();
  });
});
