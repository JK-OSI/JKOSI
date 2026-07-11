import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function GuidelinesPage() {
  return (
    <div className="bg-background text-on-background min-h-screen relative overflow-x-hidden">
      <Navbar activePage="guidelines" isFixed={true} />

      <main className="flex-grow w-full max-w-container-max mx-auto px-lg py-xl mt-16 relative min-h-[800px] flex flex-col justify-center items-center">
        {/* Soft atmospheric blooms */}
        <div className="bloom-overlay bloom-moss opacity-15"></div>
        <div className="bloom-overlay bloom-saffron opacity-15"></div>

        {/* Header Section */}
        <section className="mb-12 text-center relative z-10 max-w-[620px]">
          <span className="text-primary font-bold text-label-md tracking-wider uppercase block mb-2 font-mono">
            02 — Guidelines
          </span>
          <h1 className="font-headline-xl text-4xl md:text-5xl text-on-surface font-black tracking-tight leading-none text-glow mb-4">
            Ecosystem Standards
          </h1>
          <p className="text-on-surface-variant font-body-lg text-sm">
            Read the submission criteria and code health rules required to be cataloged in the J&amp;K Open Source Initiative.
          </p>
        </section>

        {/* Content Card */}
        <div className="w-full max-w-[800px] relative z-10">
          <div className="bento-card-premium p-8 md:p-12 rounded-3xl bg-surface-container border border-outline/50 shadow-xl space-y-6">
            <h2 className="font-bold text-2xl text-primary font-mono tracking-wide">Repository Submission Criteria</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              To keep our directory high-quality and safe, all submitted repositories undergo a structural vetting check by admins and community maintainers. Make sure your repository meets the following four standards before submitting:
            </p>

            <div className="space-y-4 text-sm text-on-surface-variant">
              <div className="p-4 bg-surface-container-low rounded-xl border border-outline/30 space-y-1">
                <h4 className="font-bold text-on-surface font-mono text-primary">1. Valid Open Source License</h4>
                <p className="text-xs leading-relaxed">
                  Your project must include a standard open-source license (such as MIT, Apache 2.0, GPL v3, or BSD) located in a root-level <code>LICENSE</code> file. Closed-source or proprietary code is not accepted.
                </p>
              </div>

              <div className="p-4 bg-surface-container-low rounded-xl border border-outline/30 space-y-1">
                <h4 className="font-bold text-on-surface font-mono text-primary">2. Comprehensive README.md</h4>
                <p className="text-xs leading-relaxed">
                  The repository must contain a <code>README.md</code> in the root directory detailing what the project does, installation commands, dependency configuration, and usage examples.
                </p>
              </div>

              <div className="p-4 bg-surface-container-low rounded-xl border border-outline/30 space-y-1">
                <h4 className="font-bold text-on-surface font-mono text-primary">3. No Hardcoded Secrets</h4>
                <p className="text-xs leading-relaxed">
                  Repositories must be free of committed API keys, passwords, database credentials, or secret tokens. Use environment variables (e.g. <code>.env.template</code>) for configuration settings.
                </p>
              </div>

              <div className="p-4 bg-surface-container-low rounded-xl border border-outline/30 space-y-1">
                <h4 className="font-bold text-on-surface font-mono text-primary">4. Originality & Functional Utility</h4>
                <p className="text-xs leading-relaxed">
                  Simple boilerplate projects, default tutorial copies, or forks without new commits are not accepted. The project should have functional code solving a real-world utility or contributing to a framework.
                </p>
              </div>
            </div>

            <h2 className="font-bold text-2xl text-primary font-mono tracking-wide pt-4">Community Code of Conduct</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              We strive to build a healthy, welcoming environment for regional technology growth. We expect contributors to respect different viewpoints, offer constructives critiques on reviews, maintain a collaborative attitude, and prioritize clean code and regional mentorship.
            </p>
          </div>
        </div>
      </main>

      <Footer variant="home" />
    </div>
  );
}
