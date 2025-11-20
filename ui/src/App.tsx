import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { NotificationProvider } from '@/hooks/useNotification'
import { OffersManagementView } from './views/OffersManagementView'
import './App.css'

/**
 * Main App component
 * Sets up providers and main layout structure
 * Requirements: All
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <div className="app">
          <header className="app-header">
            <h1>Offers Management</h1>
          </header>
          <main className="app-main">
            <OffersManagementView />
          </main>
        </div>
      </NotificationProvider>
    </QueryClientProvider>
  )
}

export default App
