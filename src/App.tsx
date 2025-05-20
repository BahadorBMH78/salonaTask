import { ProductsList } from './components/ProductsList'
import { ThemeProvider } from './components/theme-provider'
import { ThemeToggle } from './components/theme-toggle'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="salona-theme">
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 !z-50 w-full border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold tracking-tight">Salona</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="container mx-auto py-8 px-4 md:px-0">
          <h2 className="text-3xl font-bold text-center mb-8">Products</h2>
          <ProductsList />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
