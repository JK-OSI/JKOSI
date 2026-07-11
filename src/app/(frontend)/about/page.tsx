import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="bg-background text-on-background min-h-screen relative overflow-x-hidden">
      <Navbar activePage="about" isFixed={true} />

      <main className="flex-grow w-full max-w-container-max mx-auto px-lg py-xl mt-16 relative min-h-[800px] flex flex-col justify-center items-center">
        {/* Soft atmospheric blooms */}
        <div className="bloom-overlay bloom-moss opacity-15"></div>
        <div className="bloom-overlay bloom-saffron opacity-15"></div>

        {/* Header Section */}
        <section className="mb-12 text-center relative z-10 max-w-[620px]">
          <span className="text-primary font-bold text-label-md tracking-wider uppercase block mb-2 font-mono">
            01 — Platform
          </span>
          <h1 className="font-headline-xl text-4xl md:text-5xl text-on-surface font-black tracking-tight leading-none text-glow mb-4">
            About JKOSI
          </h1>
          <p className="text-on-surface-variant font-body-lg text-sm">
            Jammu & Kashmir Open Source Initiative is a community-led non-profit dedicated to cataloging and vetting regional software assets.
          </p>
        </section>

        {/* Content Card */}
        <div className="w-full max-w-[800px] relative z-10">
          <div className="bento-card-premium p-8 md:p-12 rounded-3xl bg-surface-container border border-outline/50 shadow-xl space-y-6">
            <h2 className="font-bold text-2xl text-primary font-mono tracking-wide">Our Mission</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              JKOSI is established to build regional tech capacity through international engineering standards. We provide developers, students, and researchers in Jammu & Kashmir with a structured directory to showcase their work, submit it for community reviews, and get feedback from peer developers.
            </p>

            <h2 className="font-bold text-2xl text-primary font-mono tracking-wide">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md pt-2 text-sm text-on-surface-variant">
              <div className="space-y-sm">
                <h4 className="font-bold text-on-surface font-mono">1. Vetted Repository Directory</h4>
                <p className="text-xs leading-relaxed">
                  We host a community index of software projects originating in the region, sorted by domains like AI/NLP, Web, Mobile, IoT, Systems, and Blockchain.
                </p>
              </div>
              <div className="space-y-sm">
                <h4 className="font-bold text-on-surface font-mono">2. Peer Review Audits</h4>
                <p className="text-xs leading-relaxed">
                  Submitted projects are reviewed by community members to ensure proper licensing (e.g. MIT, Apache), structural readme files, clean configuration, and zero committed secrets.
                </p>
              </div>
            </div>

            <h2 className="font-bold text-2xl text-primary font-mono tracking-wide">Our Core Values</h2>
            <ul className="list-disc pl-6 text-sm text-on-surface-variant space-y-2">
              <li><strong>Open Source First:</strong> All indexed projects must be public repositories with verified permissive licenses.</li>
              <li><strong>Ecosystem Transparency:</strong> Free of charge and non-commercial. We focus purely on regional capacity building.</li>
              <li><strong>Regional Pride & Global Standards:</strong> Aligning local innovations with global industry engineering practices.</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer variant="home" />
    </div>
  );
}
