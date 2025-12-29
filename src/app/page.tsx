import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white pt-24 pb-32 sm:pt-40 sm:pb-48">
        {/* Premium background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/40 to-transparent rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-slate-100/40 to-transparent rounded-full blur-3xl opacity-60" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-br from-blue-50/30 to-transparent rounded-full blur-3xl opacity-40 transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 animate-fade-in-up">
            {/* Premium Badge */}
            <div className="flex justify-center">
              <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-900 text-sm font-semibold rounded-full border border-gray-200/50 shadow-sm">
                ✨ Peer-to-peer rental marketplace
              </span>
            </div>

            {/* Main Heading - Enhanced Typography */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-gray-900 leading-tight">
              Rent.
              <br />
              Share.
              <br />
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">Earn.</span>
            </h1>

            {/* Subheading - Premium text */}
            <p className="mx-auto max-w-3xl text-xl sm:text-2xl text-gray-700 leading-relaxed font-light">
              Turn your unused items into cash. Rent out what you have, discover what you need.
              <span className="block text-gray-600 mt-2">A smarter way to consume.</span>
            </p>

            {/* Premium CTA Buttons with glow */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                <Link
                  href="/items"
                  className="relative inline-flex items-center px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 active:scale-95 shadow-lg hover:shadow-2xl"
                >
                  Browse Items
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-bold rounded-xl border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 shadow-sm hover:shadow-md"
              >
                Start Earning
              </Link>
            </div>

            {/* Premium Stats Grid */}
            <div className="pt-20 grid grid-cols-3 gap-8 sm:gap-12 max-w-2xl mx-auto">
              <div className="space-y-2 text-center">
                <p className="text-4xl sm:text-5xl font-bold text-gray-900">1000+</p>
                <p className="text-sm sm:text-base text-gray-600 font-medium">Active Items</p>
              </div>
              <div className="space-y-2 text-center border-l border-r border-gray-200">
                <p className="text-4xl sm:text-5xl font-bold text-gray-900">500+</p>
                <p className="text-sm sm:text-base text-gray-600 font-medium">Happy Users</p>
              </div>
              <div className="space-y-2 text-center">
                <p className="text-4xl sm:text-5xl font-bold text-gray-900">₹50K+</p>
                <p className="text-sm sm:text-base text-gray-600 font-medium">Earned</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Why RentMyStuff?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The easiest way to monetize your stuff
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 - with glow */}
            <div className="group relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-100/30 to-blue-50/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-8 sm:p-10 rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm hover:bg-white hover:border-gray-300 hover:shadow-2xl transition-all duration-400 transform hover:-translate-y-2 card-hover">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-120 transition-transform duration-400">
                  <span className="text-3xl">📸</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Easy Listing
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  List your items in minutes with photos and pricing. Get discovered by thousands.
                </p>
              </div>
            </div>

            {/* Feature Card 2 - with glow */}
            <div className="group relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-emerald-100/30 to-emerald-50/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-8 sm:p-10 rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm hover:bg-white hover:border-gray-300 hover:shadow-2xl transition-all duration-400 transform hover:-translate-y-2 card-hover">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-120 transition-transform duration-400">
                  <span className="text-3xl">💳</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Secure Payments
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Built-in Stripe checkout. Money lands in your account after each rental.
                </p>
              </div>
            </div>

            {/* Feature Card 3 - with glow */}
            <div className="group relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-purple-100/30 to-purple-50/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-8 sm:p-10 rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm hover:bg-white hover:border-gray-300 hover:shadow-2xl transition-all duration-400 transform hover:-translate-y-2 card-hover">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-120 transition-transform duration-400">
                  <span className="text-3xl">🤝</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Community Trust
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Verified users. Ratings and reviews. Build your reputation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10 animate-fade-in-up">
          <h2 className="text-5xl sm:text-6xl font-bold leading-tight">
            Your stuff.
            <br />
            Your income.
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Join thousands of people earning money by renting out items they already own.
          </p>
          <Link
            href="/items"
            className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 shadow-lg hover:shadow-2xl"
          >
            Explore the Marketplace
            <span className="ml-2">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
