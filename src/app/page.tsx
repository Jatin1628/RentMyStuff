import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-20 pb-24 sm:pt-32 sm:pb-32">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-50 to-transparent rounded-full opacity-40" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-purple-50 to-transparent rounded-full opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="flex justify-center">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                ✨ Peer-to-peer rental marketplace
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900">
              Rent. Share. Earn.
            </h1>

            {/* Subheading */}
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-600 leading-relaxed">
              Turn your unused items into cash. Rent out what you have, discover what you need.
              A smarter way to consume.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/items"
                className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Browse Items
                <span className="ml-2">→</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center px-8 py-4 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-200"
              >
                Start Earning
              </Link>
            </div>

            {/* Stats */}
            <div className="pt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-md mx-auto">
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">1000+</p>
                <p className="text-xs sm:text-sm text-gray-600">Active Items</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">500+</p>
                <p className="text-xs sm:text-sm text-gray-600">Happy Users</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">₹50K+</p>
                <p className="text-xs sm:text-sm text-gray-600">Earned</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Why RentMyStuff?
            </h2>
            <p className="text-lg text-gray-600">
              The easiest way to monetize your stuff
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📸</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Easy Listing
              </h3>
              <p className="text-gray-600">
                List your items in minutes with photos and pricing. Get discovered by thousands.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Secure Payments
              </h3>
              <p className="text-gray-600">
                Built-in Stripe checkout. Money lands in your account after each rental.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Community Trust
              </h3>
              <p className="text-gray-600">
                Verified users. Ratings and reviews. Build your reputation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Your stuff. Your income.
          </h2>
          <p className="text-lg text-gray-300">
            Join thousands of people earning money by renting out items they already own.
          </p>
          <Link
            href="/items"
            className="inline-block px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
          >
            Explore the Marketplace
          </Link>
        </div>
      </section>
    </main>
  );
}
