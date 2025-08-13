"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Type definition for the data structure
interface DataWithS {
  S?: string | number | boolean
  id?: string
  name?: string
  metadata?: {
    [key: string]: any
  }
}

// Props interface for reusable components
interface SafeDataDisplayProps {
  data?: DataWithS | null
  loading?: boolean
  error?: string | null
}

// Safe data fetching hook
function useSafeData() {
  const [data, setData] = useState<DataWithS | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call with potential undefined data
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Simulate different data scenarios
        const scenarios = [
          null, // No data
          undefined, // Undefined data
          {}, // Empty object
          { S: "Success!" }, // Data with S property
          { S: 42, name: "Test Item" }, // Data with S as number
          { id: "123", name: "No S Property" }, // Data without S property
          { S: "", name: "Empty S" }, // Data with empty S
        ]

        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)]
        setData(randomScenario as DataWithS)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error, refetch: () => window.location.reload() }
}

// Safe property access component
function SafePropertyDisplay({ data }: { data?: DataWithS | null }) {
  // Multiple safe access patterns
  const sValue = data?.S
  const sValueWithFallback = data?.S ?? "Not provided"
  const sValueAsString = String(data?.S || "")
  const hasS = data && "S" in data
  const sExists = data?.S !== undefined && data?.S !== null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white/90 mb-2">Direct Access</h3>
          <p className="text-white/70 text-sm">
            data?.S: <span className="font-mono text-green-400">{JSON.stringify(sValue)}</span>
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white/90 mb-2">With Fallback</h3>
          <p className="text-white/70 text-sm">
            data?.S ?? "Not provided": <span className="font-mono text-blue-400">{sValueWithFallback}</span>
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white/90 mb-2">As String</h3>
          <p className="text-white/70 text-sm">
            String(data?.S || ""): <span className="font-mono text-purple-400">"{sValueAsString}"</span>
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white/90 mb-2">Property Check</h3>
          <p className="text-white/70 text-sm">
            "S" in data: <span className="font-mono text-yellow-400">{String(hasS)}</span>
          </p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <h3 className="text-sm font-medium text-white/90 mb-2">Conditional Rendering</h3>
        {sExists ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-green-400 text-sm">S property exists with value: {JSON.stringify(sValue)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-red-400 text-sm">S property is missing or null/undefined</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-white/20 border-t-purple-400 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-400 rounded-full animate-spin animate-reverse"></div>
      </div>
    </div>
  )
}

// Error component
function ErrorDisplay({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-600/20 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-white mb-2">Something went wrong</h3>
      <p className="text-white/70 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
      >
        Try Again
      </button>
    </motion.div>
  )
}

// Main data display component
function SafeDataDisplay({ data, loading, error }: SafeDataDisplayProps) {
  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />
  }

  if (!data) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-yellow-600/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No Data Available</h3>
        <p className="text-white/70 mb-4">The data prop is undefined or null</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Reload Data
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-medium text-white mb-4">Raw Data</h2>
        <pre className="bg-black/30 border border-white/10 rounded p-4 text-sm text-white/80 overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-medium text-white mb-4">Safe Property Access</h2>
        <SafePropertyDisplay data={data} />
      </div>
    </motion.div>
  )
}

// Main page component
export default function SafeDataPage() {
  const { data, loading, error, refetch } = useSafeData()

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Safe Data Handling</h1>
          <p className="text-white/70 mb-4">Demonstrating safe access to optional properties in TypeScript</p>
          <button
            onClick={refetch}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Refresh Data"}
          </button>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <SafeDataDisplay data={data} loading={loading} error={error} />
          </AnimatePresence>
        </div>

        {/* Code examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-medium text-white mb-4">Safe Access Patterns</h2>
            <div className="space-y-4">
              <div className="bg-black/30 border border-white/10 rounded p-4">
                <h3 className="text-sm font-medium text-green-400 mb-2">✅ Safe</h3>
                <pre className="text-sm text-white/80">
                  {`// Optional chaining
const value = data?.S

// With nullish coalescing
const valueWithFallback = data?.S ?? "default"

// Type guard
if (data && "S" in data) {
  console.log(data.S) // Safe to access
}

// Existence check
if (data?.S !== undefined) {
  console.log(data.S) // Safe to access
}`}
                </pre>
              </div>

              <div className="bg-black/30 border border-red-600/20 rounded p-4">
                <h3 className="text-sm font-medium text-red-400 mb-2">❌ Unsafe</h3>
                <pre className="text-sm text-white/80">
                  {`// Direct access without checking
const value = data.S // TypeError if data is undefined

// Assuming property exists
console.log(data.S.toString()) // Error if S is undefined`}
                </pre>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
