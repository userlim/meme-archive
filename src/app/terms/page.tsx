import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Terms of Service' }

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#191F28] mb-8">Terms of Service</h1>
      <div className="prose prose-invert prose-sm max-w-none text-[#8B95A1] space-y-4">
        <p>Last updated: March 30, 2026</p>
        <h2 className="text-xl font-semibold text-[#191F28] mt-6">Acceptance of Terms</h2>
        <p>By accessing and using Meme Archive, you agree to be bound by these Terms of Service.</p>
        <h2 className="text-xl font-semibold text-[#191F28] mt-6">Service Description</h2>
        <p>Meme Archive is a free tool that aggregates and displays meme-related YouTube videos. We do not host any video content; all videos are embedded from YouTube.</p>
        <h2 className="text-xl font-semibold text-[#191F28] mt-6">Third-Party Content</h2>
        <p>All videos displayed on this site are owned by their respective creators and hosted on YouTube. We do not claim ownership of any video content. If you believe any content infringes your rights, please contact the video owner through YouTube.</p>
        <h2 className="text-xl font-semibold text-[#191F28] mt-6">Disclaimer</h2>
        <p>This service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee the accuracy, completeness, or availability of the content displayed.</p>
        <h2 className="text-xl font-semibold text-[#191F28] mt-6">Changes</h2>
        <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.</p>
        <h2 className="text-xl font-semibold text-[#191F28] mt-6">Contact</h2>
        <p>For questions about these terms, contact us at lth1283910@gmail.com.</p>
      </div>
    </div>
  )
}
