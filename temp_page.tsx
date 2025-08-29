export default function HomePage() {
  return (
    <div className="max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-6">Welcome to Taylor Arndt</h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Personal website of Taylor Arndt. Explore insights, resources, and connect.
        </p>
        <div className="mt-8">
          <a 
            href="/about" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Learn More About Taylor
          </a>
        </div>
      </div>
    </div>
  )
}
