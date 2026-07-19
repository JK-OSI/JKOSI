import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SupportPage() {
  return (
    <div className="bg-background text-on-background min-h-screen relative overflow-x-hidden">
      <Navbar activePage="support" isFixed={true} />

      <main className="flex-grow w-full max-w-container-max mx-auto px-lg py-xl mt-16 relative min-h-[800px] flex flex-col justify-center items-center">
        {/* Soft atmospheric blooms */}
        <div className="bloom-overlay bloom-moss opacity-15"></div>
        <div className="bloom-overlay bloom-saffron opacity-15"></div>

        {/* Header Section */}
        <section className="mb-12 text-center relative z-10 max-w-[620px]">
          <span className="text-primary font-bold text-label-md tracking-wider uppercase block mb-2 font-mono">
            04 — Support
          </span>
          <h1 className="font-headline-xl text-4xl md:text-5xl text-on-surface font-black tracking-tight leading-none text-glow mb-4">
            Contact Support
          </h1>
          <p className="text-on-surface-variant font-body-lg text-sm">
            Need help submitting a repository, reporting an issue, or claiming project ownership? Get in touch with our team.
          </p>
        </section>

        {/* Content Card */}
        <div className="w-full max-w-[800px] relative z-10">
          <div className="bento-card-premium p-8 md:p-12 rounded-3xl bg-surface-container border border-outline/50 shadow-xl space-y-6">
            <h2 className="font-bold text-2xl text-primary font-mono tracking-wide">Common Support Requests</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md text-sm text-on-surface-variant">
              <div className="p-4 bg-surface-container-low rounded-xl border border-outline/30 space-y-1">
                <h4 className="font-bold text-on-surface font-mono">Claim Repository Ownership</h4>
                <p className="text-xs leading-relaxed">
                  If your project was submitted by another contributor and you want to link it to your GitHub profile, email us with your repository link and your GitHub username.
                </p>
              </div>

              <div className="p-4 bg-surface-container-low rounded-xl border border-outline/30 space-y-1">
                <h4 className="font-bold text-on-surface font-mono">Remove a Repository</h4>
                <p className="text-xs leading-relaxed">
                  If you want your repository removed from the public registry index, submit a request from the email associated with the project or open a GitHub issue.
                </p>
              </div>

              <div className="p-4 bg-surface-container-low rounded-xl border border-outline/30 space-y-1">
                <h4 className="font-bold text-on-surface font-mono">Report Security Risks</h4>
                <p className="text-xs leading-relaxed">
                  To report hardcoded API credentials, security vulnerabilities, or code violations, email us immediately with the subject line <strong>[SECURITY]</strong>.
                </p>
              </div>

              <div className="p-4 bg-surface-container-low rounded-xl border border-outline/30 space-y-1">
                <h4 className="font-bold text-on-surface font-mono">General Queries</h4>
                <p className="text-xs leading-relaxed">
                  For suggestions, partnership requests, or inquiries regarding mentorship programs, reach out to our community coordinators.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-outline/50 space-y-4">
              <h2 className="font-bold text-2xl text-primary font-mono tracking-wide">Contact Information</h2>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-md text-sm text-on-surface-variant font-mono">
                <div>
                  <span className="block text-xs text-secondary uppercase font-black">Support Email</span>
                  <a href="mailto:jkosi.admin@gmail.com" className="text-primary hover:underline text-base font-bold">jkosi.admin@gmail.com</a>
                </div>
                <div>
                  <span className="block text-xs text-secondary uppercase font-black">Contact Number</span>
                  <a href="tel:+919972588966" className="text-primary hover:underline text-base font-bold">+91 99725 88966</a>
                </div>
                <div>
                  <span className="block text-xs text-secondary uppercase font-black">GitHub Repository</span>
                  <a href="https://github.com/JK-OSI/JKOSI" className="text-primary hover:underline text-base font-bold">JK-OSI/JKOSI</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer variant="home" />
    </div>
  );
}
