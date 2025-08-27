export default function TestSimplePage() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Test Tailwind CSS
        </h1>
        <p className="text-gray-700 mb-4">
          Dacă vezi această pagină cu stilizare, Tailwind CSS funcționează!
        </p>
        <div className="space-y-2">
          <div className="w-20 h-20 bg-red-500 rounded"></div>
          <div className="w-20 h-20 bg-green-500 rounded"></div>
          <div className="w-20 h-20 bg-yellow-500 rounded"></div>
        </div>
      </div>
    </div>
  );
}
