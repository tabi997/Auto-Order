export default function TestTailwindPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          Test Tailwind CSS
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Test Card 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Card 1
            </h2>
            <p className="text-gray-600 mb-4">
              This is a test card to verify Tailwind CSS is working.
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
              Test Button
            </button>
          </div>

          {/* Test Card 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Card 2
            </h2>
            <p className="text-gray-600 mb-4">
              Another test card with different styling.
            </p>
            <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
              Green Button
            </button>
          </div>

          {/* Test Card 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Card 3
            </h2>
            <p className="text-gray-600 mb-4">
              Third test card for comprehensive testing.
            </p>
            <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
              Red Button
            </button>
          </div>
        </div>

        {/* Test Utilities */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Tailwind Utilities Test
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-500 w-24">Colors:</span>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded"></div>
                <div className="w-8 h-8 bg-blue-500 rounded"></div>
                <div className="w-8 h-8 bg-green-500 rounded"></div>
                <div className="w-8 h-8 bg-yellow-500 rounded"></div>
                <div className="w-8 h-8 bg-purple-500 rounded"></div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-500 w-24">Spacing:</span>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded"></div>
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                <div className="w-6 h-6 bg-gray-400 rounded"></div>
                <div className="w-8 h-8 bg-gray-400 rounded"></div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-500 w-24">Typography:</span>
              <div className="space-y-1">
                <p className="text-xs text-gray-600">Extra Small Text</p>
                <p className="text-sm text-gray-600">Small Text</p>
                <p className="text-base text-gray-600">Base Text</p>
                <p className="text-lg text-gray-600">Large Text</p>
                <p className="text-xl text-gray-600">Extra Large Text</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
