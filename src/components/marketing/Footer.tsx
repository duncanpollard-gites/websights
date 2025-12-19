import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 relative">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="16" stroke="#3b82f6" strokeWidth="2.5" fill="none"/>
                  <circle cx="20" cy="20" r="6" fill="#3b82f6"/>
                  <ellipse cx="20" cy="20" rx="16" ry="8" stroke="#3b82f6" strokeWidth="1.5" fill="none"/>
                  <line x1="20" y1="4" x2="20" y2="36" stroke="#3b82f6" strokeWidth="1.5"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-white">WebSights</span>
            </Link>
            <p className="text-sm text-gray-400">
              Professional websites for tradespeople, built in minutes. Since 1997.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/examples" className="hover:text-white transition-colors">
                  Examples
                </Link>
              </li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="font-semibold text-white mb-4">Industries</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/industries/plumbers" className="hover:text-white transition-colors">
                  Plumbers
                </Link>
              </li>
              <li>
                <Link href="/industries/electricians" className="hover:text-white transition-colors">
                  Electricians
                </Link>
              </li>
              <li>
                <Link href="/industries/builders" className="hover:text-white transition-colors">
                  Builders
                </Link>
              </li>
              <li>
                <Link href="/industries/roofers" className="hover:text-white transition-colors">
                  Roofers
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} WebSights. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
