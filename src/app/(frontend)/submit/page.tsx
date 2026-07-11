"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SubmitProject() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form states
  const [projectName, setProjectName] = useState("");
  const [repoLink, setRepoLink] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [otherTech, setOtherTech] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [collaboration, setCollaboration] = useState("yes");
  const [githubUsername, setGithubUsername] = useState("");
  const [bio, setBio] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 3;

  const handleTechChange = (techName: string) => {
    if (selectedTech.includes(techName)) {
      setSelectedTech(selectedTech.filter((t) => t !== techName));
    } else {
      setSelectedTech([...selectedTech, techName]);
    }
  };

  const handleNext = () => {
    const stepErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!projectName.trim() || projectName.trim().length < 3) {
        stepErrors.projectName = "Project name must be at least 3 characters.";
      }
      const githubUrlRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/;
      if (!repoLink.trim()) {
        stepErrors.repoLink = "Repository URL is required.";
      } else if (!githubUrlRegex.test(repoLink.trim())) {
        stepErrors.repoLink = "Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo).";
      }
      if (!description.trim() || description.trim().length < 15) {
        stepErrors.description = "Please provide a detailed description (at least 15 characters).";
      }
    }
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setErrors({});
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStepClick = (stepNum: number) => {
    if (stepNum > currentStep) {
      const stepErrors: Record<string, string> = {};
      if (currentStep === 1) {
        if (!projectName.trim() || projectName.trim().length < 3) {
          stepErrors.projectName = "Project name must be at least 3 characters.";
        }
        const githubUrlRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/;
        if (!repoLink.trim()) {
          stepErrors.repoLink = "Repository URL is required.";
        } else if (!githubUrlRegex.test(repoLink.trim())) {
          stepErrors.repoLink = "Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo).";
        }
        if (!description.trim() || description.trim().length < 15) {
          stepErrors.description = "Please provide a detailed description (at least 15 characters).";
        }
      }
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
    }

    setErrors({});
    if (stepNum <= currentStep + 1) {
      setCurrentStep(stepNum);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentStep < totalSteps) {
      e.preventDefault()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalErrors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      finalErrors.fullName = "Please enter a valid lead developer name (at least 2 characters).";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      finalErrors.email = "Please enter a valid email address.";
    }
    const usernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
    if (!githubUsername.trim()) {
      finalErrors.githubUsername = "GitHub username is required.";
    } else if (!usernameRegex.test(githubUsername.trim())) {
      finalErrors.githubUsername = "Please enter a valid GitHub username (alphanumeric and single hyphens only).";
    }
    if (!bio.trim() || bio.trim().length < 10) {
      finalErrors.bio = "Please write a short biography (at least 10 characters).";
    }
    if (!terms) {
      finalErrors.terms = "You must agree to the community standards to proceed.";
    }

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    
    try {
      const allTech = [...selectedTech]
      if (otherTech.trim()) {
        otherTech.split(',').map(t => t.trim()).filter(Boolean).forEach(t => {
          if (!allTech.includes(t)) allTech.push(t)
        })
      }
      const effectiveDescription = description || `Developer: ${fullName} (${email}). Stack: ${allTech.join(", ")}`;

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName,
          repoUrl: repoLink,
          description: effectiveDescription,
          status: "pending",
          fullName,
          email,
          githubUsername,
          bio,
          techStack: allTech.map((t) => ({ tech: t })),
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong while submitting your project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen relative overflow-x-hidden">
      <Navbar activePage="submit" isFixed={true} />

      <main className="flex-grow w-full max-w-container-max mx-auto px-lg py-xl mt-16 relative min-h-[900px] flex flex-col justify-center items-center">
        {/* Soft atmospheric blooms */}
        <div className="bloom-overlay bloom-moss"></div>
        <div className="bloom-overlay bloom-saffron"></div>

        {/* Header Section */}
        <section className="mb-12 text-center relative z-10 max-w-[620px]">
          <span className="text-primary font-bold text-label-md tracking-wider uppercase block mb-2 font-mono">
            03 — Directory
          </span>
          <h1 className="font-headline-xl text-4xl md:text-5xl text-on-surface font-black tracking-tight leading-none text-glow mb-4">
            Submit Your Project
          </h1>
          <p className="text-on-surface-variant font-body-lg text-sm">
            Launch your project onto our open registry, connect with collaborators, and audit your code with community reviewers.
          </p>
        </section>

        <div className="w-full max-w-[960px] relative z-10">
          {!isSubmitted ? (
            <>
              {/* Horizontal Wizard Stepper */}
              <div className="flex items-center justify-between mb-10 px-6 relative">
                {/* Background connector line */}
                <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-[2px] bg-outline/20 -z-10"></div>
                {/* Foreground active connector line */}
                <div
                  className="absolute left-10 top-1/2 -translate-y-1/2 h-[2px] bg-primary transition-all duration-300 -z-10"
                  style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 82}%` }}
                ></div>

                {[1, 2, 3].map((stepNum) => {
                  const isActive = currentStep === stepNum;
                  const isCompleted = currentStep > stepNum;
                  const stepNames = ["Core Details", "Tech Stack", "Finalize"];

                  return (
                    <button
                      key={stepNum}
                      type="button"
                      onClick={() => handleStepClick(stepNum)}
                      disabled={stepNum > currentStep + 1}
                      className="flex flex-col items-center gap-2 focus:outline-none disabled:cursor-not-allowed group"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold border transition-all duration-200 shadow-md ${
                          isActive
                            ? "bg-primary text-on-primary border-primary scale-110 shadow-primary/20"
                            : isCompleted
                            ? "bg-surface text-primary border-primary"
                            : "bg-surface-container text-on-surface-variant border-outline/30"
                        }`}
                      >
                        {isCompleted ? (
                          <span className="material-symbols-outlined text-sm font-bold">check</span>
                        ) : (
                          stepNum
                        )}
                      </div>
                      <span
                        className={`font-mono text-[9px] uppercase tracking-wider transition-colors duration-150 ${
                          isActive ? "text-primary font-bold" : "text-on-surface-variant group-hover:text-primary"
                        }`}
                      >
                        {stepNames[stepNum - 1]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Form Wizard Card (Widescreen 2-column setup) */}
              <form
                className="bg-surface-container border border-outline/50 rounded-3xl p-8 md:p-12 shadow-xl shadow-surface-container-lowest/15 flex flex-col justify-between min-h-[480px]"
                onSubmit={handleSubmit}
                onKeyDown={handleKeyDown}
              >
                {/* Step 1: Core Details */}
                {currentStep === 1 && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
                    {/* Left Column: Instructions */}
                    <div className="lg:col-span-4 space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">info</span>
                      </div>
                      <h3 className="font-headline-md text-xl text-on-surface font-bold">Project Details</h3>
                      <p className="text-on-surface-variant text-xs leading-relaxed">
                        Provide the core details of your repository. Ensure your project has a distinct name and an active repository link so community reviewers can audit your code.
                      </p>
                      <div className="bg-surface-container-high/40 p-4 rounded-xl border border-primary/20 flex gap-md items-start mt-2">
                        <span className="material-symbols-outlined text-primary text-lg">lightbulb</span>
                        <p className="text-label-sm text-on-surface-variant text-[11px] leading-relaxed">
                          Providing a detailed README with setup commands helps other developers understand and contribute to your project 3x faster.
                        </p>
                      </div>
                    </div>

                    {/* Right Column: Inputs */}
                    <div className="lg:col-span-8 space-y-6">
                      <div className="flex flex-col gap-sm">
                        <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant" htmlFor="project_name">
                          Project Name
                        </label>
                        <input
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          className={`w-full bg-surface border rounded-xl px-4 py-3 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent outline-none transition-all ${
                            errors.projectName ? "border-red-500/80" : "border-outline/50"
                          }`}
                          id="project_name"
                          placeholder="e.g. Pashmina Ledger"
                          type="text"
                          required
                        />
                        {errors.projectName && (
                          <span className="text-[11px] text-red-500 font-mono mt-1 block">
                            {errors.projectName}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-sm">
                        <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant" htmlFor="repo_link">
                          Repository Link
                        </label>
                        <div className="relative">
                          <input
                            value={repoLink}
                            onChange={(e) => setRepoLink(e.target.value)}
                            className={`w-full bg-surface border rounded-xl pl-4 pr-11 py-3 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent outline-none transition-all ${
                              errors.repoLink ? "border-red-500/80" : "border-outline/50"
                            }`}
                            id="repo_link"
                            placeholder="https://github.com/user/project"
                            type="url"
                            required
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">
                            link
                          </span>
                        </div>
                        {errors.repoLink && (
                          <span className="text-[11px] text-red-500 font-mono mt-1 block">
                            {errors.repoLink}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-sm">
                        <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant" htmlFor="description">
                          Project Description
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className={`w-full bg-surface border rounded-xl p-4 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent outline-none transition-all min-h-[140px] ${
                            errors.description ? "border-red-500/80" : "border-outline/50"
                          }`}
                          id="description"
                          placeholder="Describe what your project does, the problem it solves, and the stack utilized..."
                          required
                        ></textarea>
                        {errors.description && (
                          <span className="text-[11px] text-red-500 font-mono mt-1 block">
                            {errors.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Technical Stack */}
                {currentStep === 2 && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
                    {/* Left Column: Instructions */}
                    <div className="lg:col-span-4 space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">code_blocks</span>
                      </div>
                      <h3 className="font-headline-md text-xl text-on-surface font-bold">Technology Stack</h3>
                      <p className="text-on-surface-variant text-xs leading-relaxed">
                        Specify the primary tools, languages, and frameworks powering your code. Selecting accurate tags helps developers search and find your project easily in our directory.
                      </p>
                    </div>

                    {/* Right Column: Inputs */}
                    <div className="lg:col-span-8 space-y-6">
                      <div className="flex flex-col gap-sm">
                        <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                          Primary Technologies
                        </label>
                        <div className="flex flex-wrap gap-sm mt-2">
                          {["React", "Python", "Node.js", "Rust", "Flutter", "Go"].map((tech) => {
                            const isChecked = selectedTech.includes(tech);
                            return (
                              <label key={tech} className="cursor-pointer group">
                                <input
                                  className="hidden"
                                  name="tech"
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleTechChange(tech)}
                                />
                                <span
                                  className={`px-4 py-2.5 rounded-xl border font-mono text-xs uppercase tracking-wider transition-all duration-150 block ${
                                    isChecked
                                      ? "bg-primary text-on-primary border-primary font-bold shadow shadow-primary/25"
                                      : "bg-surface border-outline/50 text-on-surface-variant hover:border-primary/50 hover:text-on-surface"
                                  }`}
                                >
                                  {tech}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex flex-col gap-sm">
                        <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant" htmlFor="other_tech">
                          Other Tools / Stacks
                        </label>
                        <input
                          value={otherTech}
                          onChange={(e) => setOtherTech(e.target.value)}
                          className="w-full bg-surface border border-outline/50 rounded-xl px-4 py-3 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent outline-none transition-all"
                          id="other_tech"
                          placeholder="e.g. Solidity, GraphQL, Docker, PyTorch"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact & Finalize */}
                {currentStep === 3 && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
                    {/* Left Column: Instructions */}
                    <div className="lg:col-span-4 space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">verified</span>
                      </div>
                      <h3 className="font-headline-md text-xl text-on-surface font-bold">Launch Project</h3>
                      <p className="text-on-surface-variant text-xs leading-relaxed">
                        Enter your contact details so collaborators can connect with you. Review and confirm the community standards checkbox to complete your launch.
                      </p>
                    </div>

                    {/* Right Column: Inputs */}
                    <div className="lg:col-span-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                        <div className="flex flex-col gap-sm">
                          <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant" htmlFor="full_name">
                            Lead Developer Name
                          </label>
                          <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className={`w-full bg-surface border rounded-xl px-4 py-3 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent outline-none transition-all ${
                              errors.fullName ? "border-red-500/80" : "border-outline/50"
                            }`}
                            id="full_name"
                            placeholder="Your full name"
                            type="text"
                            required
                          />
                          {errors.fullName && (
                            <span className="text-[11px] text-red-500 font-mono mt-1 block">
                              {errors.fullName}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-sm">
                          <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant" htmlFor="email">
                            Contact Email
                          </label>
                          <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full bg-surface border rounded-xl px-4 py-3 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent outline-none transition-all ${
                              errors.email ? "border-red-500/80" : "border-outline/50"
                            }`}
                            id="email"
                            placeholder="your@email.com"
                            type="email"
                            required
                          />
                          {errors.email && (
                            <span className="text-[11px] text-red-500 font-mono mt-1 block">
                              {errors.email}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-sm">
                        <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant" htmlFor="github_username">
                          GitHub Username
                        </label>
                        <input
                          value={githubUsername}
                          onChange={(e) => setGithubUsername(e.target.value)}
                          className={`w-full bg-surface border rounded-xl px-4 py-3 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent outline-none transition-all ${
                            errors.githubUsername ? "border-red-500/80" : "border-outline/50"
                          }`}
                          id="github_username"
                          placeholder="e.g. Suhar121"
                          type="text"
                          required
                        />
                        {errors.githubUsername && (
                          <span className="text-[11px] text-red-500 font-mono mt-1 block">
                            {errors.githubUsername}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-sm">
                        <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant" htmlFor="bio">
                          Maintainer Biography / About You
                        </label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className={`w-full bg-surface border rounded-xl p-4 font-sans text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent outline-none transition-all min-h-[100px] ${
                            errors.bio ? "border-red-500/80" : "border-outline/50"
                          }`}
                          id="bio"
                          placeholder="Brief description of who you are, your role, or what you work on..."
                          required
                        ></textarea>
                        {errors.bio && (
                          <span className="text-[11px] text-red-500 font-mono mt-1 block">
                            {errors.bio}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-sm">
                        <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant" htmlFor="collaboration">
                          Collaboration Status
                        </label>
                        <select
                          value={collaboration}
                          onChange={(e) => setCollaboration(e.target.value)}
                          className="w-full bg-surface border border-outline/50 rounded-xl p-4 font-mono text-xs uppercase tracking-wider text-on-surface focus:outline-none focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
                          id="collaboration"
                        >
                          <option value="yes">Actively looking for contributors</option>
                          <option value="no">Sharing for visibility only</option>
                          <option value="mentors">Looking for architectural guidance</option>
                        </select>
                      </div>
                      <div className={`bg-surface border p-5 rounded-2xl flex items-start gap-md mt-4 ${
                        errors.terms ? "border-red-500/80 bg-red-500/5" : "border-outline/45"
                      }`}>
                        <input
                          checked={terms}
                          onChange={(e) => setTerms(e.target.checked)}
                          className="mt-1.5 w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant cursor-pointer animate-none"
                          id="terms"
                          type="checkbox"
                          required
                        />
                        <div className="flex-grow">
                          <label className="text-label-md text-on-surface-variant leading-relaxed cursor-pointer" htmlFor="terms">
                            I verify this is an open-source project and I adhere to the JKOSI community standards of transparency, review, and collaboration.
                          </label>
                          {errors.terms && (
                            <span className="text-[11px] text-red-500 font-mono mt-1 block font-bold">
                              {errors.terms}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Controls Row */}
                <div className="flex items-center justify-between pt-8 border-t border-outline/50 mt-8">
                  <button
                    className={`px-5 py-3 font-mono text-xs uppercase tracking-wider text-primary hover:bg-surface rounded-full border border-primary/20 transition-colors flex items-center gap-2 ${
                      currentStep === 1 ? "invisible" : ""
                    }`}
                    id="prev-btn"
                    type="button"
                    onClick={handlePrev}
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back
                  </button>

                  {currentStep < totalSteps ? (
                    <button
                      className="px-6 py-3 bg-primary text-on-primary font-mono text-xs uppercase tracking-widest font-bold rounded-full shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
                      id="next-btn"
                      type="button"
                      onClick={handleNext}
                    >
                      Continue
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  ) : (
                    <button
                      className="px-6 py-3 bg-primary text-on-primary font-mono text-xs uppercase tracking-widest font-bold rounded-full shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity flex items-center justify-center min-w-[160px] disabled:opacity-50 cursor-pointer"
                      id="submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="material-symbols-outlined animate-spin mr-2 text-sm">sync</span>
                          Submitting...
                        </>
                      ) : (
                        "Launch Project"
                      )}
                    </button>
                  )}
                </div>
              </form>
            </>
          ) : (
            <div className="bento-card-premium bg-surface-container border border-outline/50 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[460px] shadow-xl">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 shadow shadow-primary/15">
                <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  stars
                </span>
              </div>
              <h2 className="font-headline-xl text-3xl font-black text-primary mb-3">Submission Successful!</h2>
              <p className="text-body-lg text-on-surface-variant mb-8 max-w-[480px]">
                Thank you for contributing to the ecosystem. Your project is being reviewed and will be live in the registry shortly.
              </p>
              <div className="flex gap-md">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-primary text-on-primary px-8 py-3 rounded-full font-mono text-xs uppercase tracking-widest font-bold shadow-md shadow-primary/25 hover:opacity-90 transition-all"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )}

          {/* Bottom Trust Badges */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-md relative z-10">
            <div className="bg-surface-container-low border border-outline/40 rounded-xl p-5 flex items-center gap-md shadow-sm">
              <span className="material-symbols-outlined text-primary text-2xl">verified</span>
              <span className="text-on-surface font-mono text-xs uppercase tracking-wider font-bold">Vetted Directory</span>
            </div>
            <div className="bg-surface-container-low border border-outline/40 rounded-xl p-5 flex items-center gap-md shadow-sm">
              <span className="material-symbols-outlined text-primary text-2xl">rocket_launch</span>
              <span className="text-on-surface font-mono text-xs uppercase tracking-wider font-bold">Cloud Credits</span>
            </div>
            <div className="bg-surface-container-low border border-outline/40 rounded-xl p-5 flex items-center gap-md shadow-sm">
              <span className="material-symbols-outlined text-primary text-2xl">hub</span>
              <span className="text-on-surface font-mono text-xs uppercase tracking-wider font-bold">Peer Review</span>
            </div>
          </div>
        </div>
      </main>

      <Footer variant="home" />
    </div>
  );
}
