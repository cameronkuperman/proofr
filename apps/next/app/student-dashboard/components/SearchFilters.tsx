'use client'

interface SearchFiltersProps {
  filters: {
    school: string
    service: string
    minPrice: number
    maxPrice: number
    availability: string
  }
  setFilters: (filters: any) => void
  consultants: any[]
}

export default function SearchFilters({ filters, setFilters, consultants }: SearchFiltersProps) {
  // Extract unique schools and services
  const schools = [...new Set(consultants.map(c => c.school).filter(Boolean))].sort()
  const services = [...new Set(
    consultants.flatMap(c => c.services?.map((s: any) => s.service_type) || [])
  )].sort()

  const updateFilter = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Filters</h3>
        
        {/* Clear Filters */}
        {(filters.school || filters.service || filters.minPrice > 0 || filters.maxPrice < 1000) && (
          <button
            onClick={() => setFilters({
              school: '',
              service: '',
              minPrice: 0,
              maxPrice: 1000,
              availability: 'all'
            })}
            className="text-sm text-cyan-600 hover:text-cyan-700 font-medium mb-4"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* School Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          University
        </label>
        <select
          value={filters.school}
          onChange={(e) => updateFilter('school', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">All Universities</option>
          {schools.map(school => (
            <option key={school} value={school}>{school}</option>
          ))}
        </select>
      </div>

      {/* Service Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Type
        </label>
        <select
          value={filters.service}
          onChange={(e) => updateFilter('service', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">All Services</option>
          <option value="essay_review">Essay Review</option>
          <option value="interview_prep">Interview Prep</option>
          <option value="sat_tutoring">SAT Tutoring</option>
          <option value="act_tutoring">ACT Tutoring</option>
          <option value="strategy_session">Strategy Session</option>
          <option value="school_selection">School Selection</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 w-12">Min:</span>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => updateFilter('minPrice', parseInt(e.target.value) || 0)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              min="0"
              max="1000"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 w-12">Max:</span>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => updateFilter('maxPrice', parseInt(e.target.value) || 1000)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              min="0"
              max="1000"
            />
          </div>
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Availability
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="availability"
              value="all"
              checked={filters.availability === 'all'}
              onChange={(e) => updateFilter('availability', e.target.value)}
              className="mr-2 text-cyan-600 focus:ring-cyan-500"
            />
            <span className="text-sm text-gray-700">All consultants</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="availability"
              value="now"
              checked={filters.availability === 'now'}
              onChange={(e) => updateFilter('availability', e.target.value)}
              className="mr-2 text-cyan-600 focus:ring-cyan-500"
            />
            <span className="text-sm text-gray-700">Available now</span>
          </label>
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Filters
        </label>
        <div className="space-y-2">
          <button
            onClick={() => {
              setFilters({
                ...filters,
                school: '',
                service: '',
                minPrice: 0,
                maxPrice: 50
              })
            }}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Budget-friendly (Under $50)
          </button>
          <button
            onClick={() => {
              setFilters({
                ...filters,
                school: '',
                service: 'essay_review',
                minPrice: 0,
                maxPrice: 1000
              })
            }}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Essay Help
          </button>
          <button
            onClick={() => {
              setFilters({
                ...filters,
                school: '',
                service: 'interview_prep',
                minPrice: 0,
                maxPrice: 1000
              })
            }}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Interview Prep
          </button>
        </div>
      </div>
    </div>
  )
}