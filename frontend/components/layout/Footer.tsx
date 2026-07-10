export default function Footer() {
  return (
    <footer className="w-full bg-[var(--background)] text-[var(--text-secondary)] py-16 border-t border-[var(--border-soft)] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <span className="text-sm font-semibold tracking-[0.2em] uppercase text-[var(--foreground)]">
              RetailPilot
            </span>
            <p className="text-xs font-light text-[var(--text-secondary)] max-w-xs leading-relaxed">
              An intelligent, design-first fashion catalog platform powered by Google ADK. Discover your aesthetic, build curated looks, and express your style statement.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-[var(--foreground)] uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <a href="#categories" className="hover:text-[var(--foreground)] transition-colors">
                  Styles
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-[var(--foreground)] transition-colors">
                  Product Catalog
                </a>
              </li>
              <li>
                <a href="#stylist" className="hover:text-[var(--foreground)] transition-colors">
                  AI Stylist
                </a>
              </li>
              <li>
                <a href="#character" className="hover:text-[var(--foreground)] transition-colors">
                  Virtual Model
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-[var(--foreground)] uppercase mb-4">
              Legal &amp; Support
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <a href="#" className="hover:text-[var(--foreground)] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--foreground)] transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--foreground)] transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-wider text-[var(--foreground)] uppercase">
              Newsletter
            </h4>
            <p className="text-xs font-light text-[var(--text-secondary)]">
              Subscribe to receive updates on collections, aesthetics, and styling tips.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="bg-[var(--bg-secondary)] border border-[var(--border-soft)] text-xs px-3 py-2 text-[var(--foreground)] focus:outline-none focus:border-[var(--text-secondary)] w-full"
                aria-label="Email address for newsletter"
              />
              <button className="bg-[var(--accent-gold)] text-[var(--background)] text-xs px-4 py-2 hover:bg-[var(--accent-gold-hover)] transition-colors uppercase tracking-wider font-bold cursor-pointer rounded-sm">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--border-soft)] pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] font-light text-[var(--text-muted)] gap-4">
          <p>&copy; {new Date().getFullYear()} RetailPilot. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-[var(--text-secondary)]">Instagram</a>
            <a href="#" className="hover:text-[var(--text-secondary)]">Pinterest</a>
            <a href="#" className="hover:text-[var(--text-secondary)]">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
