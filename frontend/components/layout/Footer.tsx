export default function Footer() {
  return (
    <footer className="w-full bg-neutral-950 text-neutral-400 py-16 border-t border-neutral-900 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <span className="text-sm font-semibold tracking-[0.2em] uppercase text-white">
              RetailPilot
            </span>
            <p className="text-xs font-light text-neutral-500 max-w-xs leading-relaxed">
              An intelligent, design-first fashion catalog platform powered by Google ADK. Discover your aesthetic, build curated looks, and express your style statement.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-white uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <a href="#categories" className="hover:text-white transition-colors">
                  Styles
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors">
                  Product Catalog
                </a>
              </li>
              <li>
                <a href="#stylist" className="hover:text-white transition-colors">
                  AI Stylist
                </a>
              </li>
              <li>
                <a href="#character" className="hover:text-white transition-colors">
                  Virtual Model
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-white uppercase mb-4">
              Legal & Support
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-wider text-white uppercase">
              Newsletter
            </h4>
            <p className="text-xs font-light text-neutral-500">
              Subscribe to receive updates on collections, aesthetics, and styling tips.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="bg-neutral-900 border border-neutral-800 text-xs px-3 py-2 text-white focus:outline-none focus:border-neutral-500 w-full"
                aria-label="Email address for newsletter"
              />
              <button className="bg-white text-neutral-950 text-xs px-4 py-2 hover:bg-neutral-100 transition-colors uppercase tracking-wider font-semibold">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-900 pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] font-light text-neutral-600 gap-4">
          <p>&copy; {new Date().getFullYear()} RetailPilot. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-neutral-400">Instagram</a>
            <a href="#" className="hover:text-neutral-400">Pinterest</a>
            <a href="#" className="hover:text-neutral-400">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
