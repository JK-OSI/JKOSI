import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="bg-background text-on-background min-h-screen relative overflow-x-hidden">
      <Navbar activePage="privacy" isFixed={true} />

      <main className="flex-grow w-full max-w-container-max mx-auto px-lg py-xl mt-16 relative min-h-[800px] flex flex-col justify-center items-center">
        {/* Soft atmospheric blooms */}
        <div className="bloom-overlay bloom-moss opacity-15"></div>
        <div className="bloom-overlay bloom-saffron opacity-15"></div>

        {/* Header Section */}
        <section className="mb-12 text-center relative z-10 max-w-[620px]">
          <span className="text-primary font-bold text-label-md tracking-wider uppercase block mb-2 font-mono">
            03 — Legal
          </span>
          <h1 className="font-headline-xl text-4xl md:text-5xl text-on-surface font-black tracking-tight leading-none text-glow mb-4">
            Privacy Policy
          </h1>
          <p className="text-on-surface-variant font-body-lg text-sm">
            Review how data and telemetry are processed inside the J&amp;K Open Source Initiative.
          </p>
        </section>

        {/* Content Card */}
        <div className="w-full max-w-[800px] relative z-10">
          <div className="bento-card-premium p-8 md:p-12 rounded-3xl bg-surface-container border border-outline/50 shadow-xl space-y-6">
            <h2 className="font-bold text-2xl text-primary font-mono tracking-wide">Data Transparency</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              JKOSI is committed to maintaining privacy and transparency. We are a non-commercial community initiative, meaning we do not sell, rent, or trade your personal data.
            </p>

            <h3 className="font-bold text-lg text-on-surface font-mono">1. Information We Collect</h3>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              When you submit a repository to the directory, we collect the details you provide (including Project Name, GitHub Repository Link, Technology Tags, Lead Developer Name, and Contact Email). We also cache public GitHub API data (such as stars, repository description, and weekly commits) to render the directory.
            </p>

            <h3 className="font-bold text-lg text-on-surface font-mono">2. How We Use Your Data</h3>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              Contact emails and developer names are collected solely for repository moderation updates, security disclosures, and verified badge mappings. We display your public GitHub profile username and profile avatar image in the directory for project attribution.
            </p>

            <h3 className="font-bold text-lg text-on-surface font-mono">3. Cookies & Local Storage</h3>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              Our website uses local browser storage solely to save user theme preferences (e.g. Shalimar Rose, Spruce Moss, Gulmarg Ice) to ensure visual consistency when navigating between pages. No third-party tracking pixels or commercial ad cookies are used.
            </p>

            <h3 className="font-bold text-lg text-on-surface font-mono">4. Third-Party Links</h3>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              Our directory contains links to external platforms like GitHub. We are not responsible for the privacy practices or content of external websites. We encourage you to review GitHub's terms of service when linking repositories.
            </p>
          </div>
        </div>
      </main>

      <Footer variant="home" />
    </div>
  );
}
