import { useState } from 'react'

export function EarningsCalculator() {
  const [hourlyRate, setHourlyRate] = useState('120')
  const [hoursPerWeek, setHoursPerWeek] = useState('10')
  
  const weeklyEarnings = (parseFloat(hourlyRate) || 0) * (parseFloat(hoursPerWeek) || 0) * 0.8
  const monthlyEarnings = weeklyEarnings * 4
  const yearlyEarnings = weeklyEarnings * 52

  return (
    <section id="earnings-calculator" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
          Calculate Your Potential Earnings
        </h2>

        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Your Hourly Rate ($)
              </label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="120"
                className="w-full text-2xl p-4 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Hours Per Week
              </label>
              <input
                type="number"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                placeholder="10"
                className="w-full text-2xl p-4 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-8 pt-8 border-t-2 border-gray-100">
            <p className="text-gray-600 mb-6">
              After Proofr's 20% platform fee:
            </p>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-600">Weekly:</span>
                <span className="text-2xl font-bold text-primary">
                  ${weeklyEarnings.toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-600">Monthly:</span>
                <span className="text-2xl font-bold text-primary">
                  ${monthlyEarnings.toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-xl font-semibold text-gray-900">Yearly:</span>
                <span className="text-3xl font-bold text-primary">
                  ${yearlyEarnings.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}