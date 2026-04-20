import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
      <div className="prose prose-invert prose-sm max-w-none text-[var(--text-muted)] space-y-4">
        <p>Last updated: March 30, 2026</p>
        <h2 className="text-xl font-semibold text-white mt-6">Information We Collect</h2>
        <p>Meme Archive does not collect personal information directly. We use third-party services that may collect information:</p>
        <p><strong>Google Analytics:</strong> We use Google Analytics to understand how visitors interact with our website. This service may collect information such as your IP address, browser type, pages visited, and time spent on pages.</p>
        <p><strong>Google AdSense:</strong> We display advertisements through Google AdSense, which may use cookies to serve personalized ads based on your browsing history.</p>
        <p><strong>YouTube:</strong> We embed YouTube videos. When you watch a video, YouTube may collect data according to its own privacy policy.</p>
        <h2 className="text-xl font-semibold text-white mt-6">Cookies</h2>
        <p>Third-party services (Google Analytics, AdSense, YouTube) may place cookies on your device. You can control cookie preferences through your browser settings.</p>
        <h2 className="text-xl font-semibold text-white mt-6">Data Retention</h2>
        <p>We do not store any personal data on our servers. All data collection is handled by third-party services according to their respective policies.</p>
        <h2 className="text-xl font-semibold text-white mt-6">Contact</h2>
        <p>If you have questions about this Privacy Policy, please contact us at lth1283910@gmail.com.</p>
      </div>
    </div>
  )
}
