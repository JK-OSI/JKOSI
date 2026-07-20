"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface MemberDoc {
  id: string;
  fullName: string | null;
  githubUsername: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
}

export default function JoinCommunity() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<"Volunteer" | "Mentor" | "">("");

  // Form inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");
  const [publicConsent, setPublicConsent] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Dynamic public members fetched from database
  const [members, setMembers] = useState<MemberDoc[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    fetch("/api/members")
      .then((res) => res.json())
      .then((data) => {
        if (data.docs) {
          setMembers(data.docs);
        }
      })
      .catch((err) => console.error("Failed to fetch members:", err))
      .finally(() => setLoadingMembers(false));
  }, []);

  const goToStep = (stepNumber: number) => {
    // Validate step transition when going forward
    if (stepNumber > currentStep) {
      const stepErrors: Record<string, string> = {};
      if (currentStep === 1 && !selectedRole) {
        stepErrors.role = "Please select a contribution path to proceed.";
      }
      if (currentStep === 2) {
        if (!fullName.trim() || fullName.trim().length < 2) {
          stepErrors.fullName = "Please enter your full name.";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailRegex.test(email.trim())) {
          stepErrors.email = "Please enter a valid email address.";
        }
      }
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
    }

    setErrors({});
    setCurrentStep(stepNumber);
  };

  const handleRoleSelect = (role: "Volunteer" | "Mentor") => {
    setSelectedRole(role);
    setErrors((prev) => ({ ...prev, role: "" }));
    // Auto advance smoothly after brief feedback delay
    setTimeout(() => {
      setCurrentStep(2);
    }, 350);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalErrors: Record<string, string> = {};

    if (!selectedRole) {
      finalErrors.role = "Please select a role.";
    }
    if (!fullName.trim() || fullName.trim().length < 2) {
      finalErrors.fullName = "Full name is required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      finalErrors.email = "Valid email address is required.";
    }
    if (!skills.trim()) {
      finalErrors.skills = "Please list at least one skill or technology.";
    }
    if (!bio.trim() || bio.trim().length < 10) {
      finalErrors.bio = "Please write a brief bio (at least 10 characters).";
    }

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Save application into D1 database via /api/join endpoint
      const response = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
          fullName,
          email,
          githubUsername: githubUsername.trim() || undefined,
          location: locationInput.trim() || undefined,
          skills,
          bio,
        }),
      });

      if (!response.ok) {
        console.warn("Join submission API response:", response.status);
      }
      setIsSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen relative overflow-x-hidden flex flex-col justify-between">
      <Navbar activePage="join" isFixed={true} />

      <main className="flex-grow w-full max-w-container-max mx-auto px-lg py-xl mt-16 relative">
        {/* Atmosphere Blooms */}
        <div className="bloom-overlay bloom-moss"></div>
        <div className="bloom-overlay bloom-saffron"></div>

        {/* Hero Section */}
        <section className="py-xl text-center relative z-10">
          <div className="max-w-container-max mx-auto px-lg text-center">
            <span className="text-primary font-bold text-label-md tracking-wider uppercase block mb-2 font-mono">
              04 — Interactive Journey
            </span>
            <h1 className="font-headline-xl text-4xl md:text-5xl text-primary font-bold tracking-tight mb-md text-glow">
              Shape the Future of J&K Technology
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-2xl mx-auto">
              Join a community of builders, innovators, and mentors dedicated to advancing open source in the region.
            </p>
          </div>
        </section>

        {/* Multi-Step Application Journey */}
        <section className="pb-xl relative z-10">
          <div className="max-w-4xl mx-auto px-lg">
            {!isSubmitted ? (
              <>
                {/* Stepper Header */}
                <div className="flex items-center justify-between mb-xl border-b border-outline-variant">
                  <div
                    className={`flex-1 text-center pb-md transition-all cursor-pointer font-label-md ${
                      currentStep === 1
                        ? "text-primary font-bold border-b-2 border-primary"
                        : "text-on-surface-variant hover:text-primary"
                    }`}
                    id="step-tab-1"
                    onClick={() => goToStep(1)}
                  >
                    <span className="font-label-md text-label-md">Step 1: Choose Role</span>
                  </div>
                  <div
                    className={`flex-1 text-center pb-md transition-all cursor-pointer font-label-md ${
                      currentStep === 2
                        ? "text-primary font-bold border-b-2 border-primary"
                        : "text-on-surface-variant hover:text-primary"
                    }`}
                    id="step-tab-2"
                    onClick={() => goToStep(2)}
                  >
                    <span className="font-label-md text-label-md">Step 2: Your Info</span>
                  </div>
                  <div
                    className={`flex-1 text-center pb-md transition-all cursor-pointer font-label-md ${
                      currentStep === 3
                        ? "text-primary font-bold border-b-2 border-primary"
                        : "text-on-surface-variant hover:text-primary"
                    }`}
                    id="step-tab-3"
                    onClick={() => goToStep(3)}
                  >
                    <span className="font-label-md text-label-md">Step 3: Bio & Skills</span>
                  </div>
                </div>

                {errors.role && (
                  <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error text-error text-center font-bold text-sm">
                    {errors.role}
                  </div>
                )}

                {/* Step 1: Choose Role */}
                {currentStep === 1 && (
                  <div className="space-y-xl" id="step-1">
                    <div className="text-center mb-lg">
                      <h2 className="font-headline-lg text-headline-lg text-primary mb-sm font-bold">
                        How would you like to contribute?
                      </h2>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Choose the path that best fits your experience.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                      {/* Volunteer Card */}
                      <div
                        className={`group role-card p-xl bg-surface border-2 rounded-2xl cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center ${
                          selectedRole === "Volunteer"
                            ? "border-primary bg-surface-container-high ring-2 ring-primary"
                            : "border-outline-variant hover:border-primary/50"
                        }`}
                        id="card-volunteer"
                        onClick={() => handleRoleSelect("Volunteer")}
                      >
                        <div className="w-20 h-20 bg-primary-fixed/20 rounded-full flex items-center justify-center mb-lg group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-4xl text-primary">volunteer_activism</span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-primary mb-md font-bold">
                          Apply as Volunteer
                        </h3>
                        <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
                          Contribute skills to local projects and grow your professional portfolio while helping the community scale.
                        </p>
                        <ul className="text-left text-sm space-y-sm text-on-surface-variant mb-xl">
                          <li className="flex items-center gap-xs">
                            <span className="material-symbols-outlined text-primary text-lg">check_circle</span> Gain real-world experience
                          </li>
                          <li className="flex items-center gap-xs">
                            <span className="material-symbols-outlined text-primary text-lg">check_circle</span> Network with industry leaders
                          </li>
                        </ul>
                        <button
                          type="button"
                          className={`w-full py-md font-bold rounded-xl transition-colors ${
                            selectedRole === "Volunteer"
                              ? "bg-primary text-on-primary"
                              : "bg-surface-container-high text-on-surface group-hover:bg-primary group-hover:text-on-primary"
                          }`}
                        >
                          {selectedRole === "Volunteer" ? "Selected Path" : "Select Path"}
                        </button>
                      </div>

                      {/* Mentor Card */}
                      <div
                        className={`group role-card p-xl bg-surface border-2 rounded-2xl cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center ${
                          selectedRole === "Mentor"
                            ? "border-primary bg-surface-container-high ring-2 ring-primary"
                            : "border-outline-variant hover:border-primary/50"
                        }`}
                        id="card-mentor"
                        onClick={() => handleRoleSelect("Mentor")}
                      >
                        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-lg group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-4xl text-primary">school</span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-primary mb-md font-bold">
                          Apply as Mentor
                        </h3>
                        <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
                          Guide talent and share industry expertise. Shape the next generation of engineers in Jammu & Kashmir.
                        </p>
                        <ul className="text-left text-sm space-y-sm text-on-surface-variant mb-xl">
                          <li className="flex items-center gap-xs">
                            <span className="material-symbols-outlined text-primary text-lg">verified</span> Establish leadership status
                          </li>
                          <li className="flex items-center gap-xs">
                            <span className="material-symbols-outlined text-primary text-lg">verified</span> Impact the regional ecosystem
                          </li>
                        </ul>
                        <button
                          type="button"
                          className={`w-full py-md font-bold rounded-xl transition-colors ${
                            selectedRole === "Mentor"
                              ? "bg-primary text-on-primary"
                              : "bg-surface-container-high text-on-surface group-hover:bg-primary group-hover:text-on-primary"
                          }`}
                        >
                          {selectedRole === "Mentor" ? "Selected Path" : "Select Path"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Your Info */}
                {currentStep === 2 && (
                  <div className="space-y-xl" id="step-2">
                    <div className="text-center mb-lg">
                      <h2 className="font-headline-lg text-headline-lg text-primary mb-sm font-bold">
                        Tell us who you are
                      </h2>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Let's start with some basic details for your public profile.
                      </p>
                    </div>

                    <div className="bg-surface p-xl rounded-2xl border border-outline-variant shadow-sm space-y-lg">
                      <div className="space-y-xs">
                        <label className="font-label-md text-label-md text-on-surface-variant block">Full Name</label>
                        <input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className={`w-full px-md py-md bg-surface border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                            errors.fullName ? "border-error" : "border-outline-variant"
                          }`}
                          placeholder="John Doe"
                          type="text"
                        />
                        {errors.fullName && <p className="text-xs text-error mt-1">{errors.fullName}</p>}
                      </div>

                      <div className="space-y-xs">
                        <label className="font-label-md text-label-md text-on-surface-variant block">Email Address</label>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full px-md py-md bg-surface border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                            errors.email ? "border-error" : "border-outline-variant"
                          }`}
                          placeholder="john@example.com"
                          type="email"
                        />
                        {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                        <div className="space-y-xs">
                          <label className="font-label-md text-label-md text-on-surface-variant block">
                            GitHub Username (Optional)
                          </label>
                          <input
                            value={githubUsername}
                            onChange={(e) => setGithubUsername(e.target.value)}
                            className="w-full px-md py-md bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="e.g. johndoe"
                            type="text"
                          />
                        </div>

                        <div className="space-y-xs">
                          <label className="font-label-md text-label-md text-on-surface-variant block">
                            Location / City (Optional)
                          </label>
                          <input
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                            className="w-full px-md py-md bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="e.g. Srinagar, J&K"
                            type="text"
                          />
                        </div>
                      </div>

                      <div className="pt-md flex justify-between gap-md">
                        <button
                          type="button"
                          className="px-xl py-md border border-outline-variant rounded-xl font-bold hover:bg-surface-container-low transition-colors"
                          onClick={() => goToStep(1)}
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          className="flex-1 py-md bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-opacity cursor-pointer"
                          onClick={() => goToStep(3)}
                        >
                          Continue to Skills
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Bio & Skills */}
                {currentStep === 3 && (
                  <form onSubmit={handleSubmit} className="space-y-xl" id="step-3">
                    <div className="text-center mb-lg">
                      <h2 className="font-headline-lg text-headline-lg text-primary mb-sm font-bold">
                        Showcase your expertise
                      </h2>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Highlight your skills and what you bring to the community.
                      </p>
                    </div>

                    <div className="bg-surface p-xl rounded-2xl border border-outline-variant shadow-sm space-y-lg">
                      <div className="space-y-xs">
                        <label className="font-label-md text-label-md text-on-surface-variant block">
                          Skills (Comma separated)
                        </label>
                        <input
                          value={skills}
                          onChange={(e) => setSkills(e.target.value)}
                          className={`w-full px-md py-md bg-surface border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                            errors.skills ? "border-error" : "border-outline-variant"
                          }`}
                          placeholder="React, Python, Open Source Governance, Content Writing"
                          type="text"
                        />
                        {errors.skills && <p className="text-xs text-error mt-1">{errors.skills}</p>}
                      </div>

                      <div className="space-y-xs">
                        <label className="font-label-md text-label-md text-on-surface-variant block">Bio</label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className={`w-full px-md py-md bg-surface border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                            errors.bio ? "border-error" : "border-outline-variant"
                          }`}
                          placeholder="Tell us about your journey and why you want to join JKOSI..."
                          rows={4}
                        ></textarea>
                        {errors.bio && <p className="text-xs text-error mt-1">{errors.bio}</p>}
                      </div>

                      <div className="flex items-start gap-md p-md bg-primary-fixed/10 rounded-xl border border-primary/20">
                        <input
                          checked={publicConsent}
                          onChange={(e) => setPublicConsent(e.target.checked)}
                          className="mt-1 w-5 h-5 text-primary border-outline-variant rounded focus:ring-primary cursor-pointer"
                          type="checkbox"
                          id="publicConsent"
                        />
                        <div className="space-y-xs">
                          <label htmlFor="publicConsent" className="font-label-md text-label-md font-bold text-primary cursor-pointer">
                            Public Consent
                          </label>
                          <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                            I consent to displaying my profile information on the JKOSI public directory.
                          </p>
                        </div>
                      </div>

                      <div className="pt-md flex justify-between gap-md">
                        <button
                          type="button"
                          className="px-xl py-md border border-outline-variant rounded-xl font-bold hover:bg-surface-container-low transition-colors"
                          onClick={() => goToStep(2)}
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 py-md bg-primary text-on-primary rounded-xl font-headline-md text-headline-md font-bold hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
                        >
                          {isSubmitting ? "Submitting..." : "Submit Application"}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </>
            ) : (
              /* Success State */
              <div className="bg-surface border border-outline-variant rounded-2xl p-xl text-center flex flex-col items-center justify-center min-h-[400px] shadow-lg">
                <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-md">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-primary font-bold mb-sm">
                  Welcome to JKOSI!
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-md">
                  Your application as a <strong className="text-primary">{selectedRole}</strong> has been received.
                  Our community team will reach out to you shortly.
                </p>
                <div className="flex gap-md">
                  <Link
                    href="/projects"
                    className="px-xl py-md bg-primary text-on-primary font-bold rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Explore Directory
                  </Link>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setCurrentStep(1);
                      setSelectedRole("");
                    }}
                    className="px-xl py-md border border-outline-variant font-bold rounded-xl hover:bg-surface-container-low transition-colors"
                  >
                    Submit Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Community Directory Section */}
        <section className="bg-surface-container-low py-xl border-t border-outline-variant rounded-3xl mt-xl relative z-10">
          <div className="max-w-container-max mx-auto px-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
              <div className="text-left">
                <h2 className="font-headline-lg text-headline-lg text-primary font-bold">Meet the Community</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Join these experts and contributors building our regional ecosystem.
                </p>
              </div>
              <Link
                href="/projects"
                className="font-label-md text-label-md text-primary font-bold px-lg py-sm border border-primary rounded-lg hover:bg-primary/10 transition-colors"
              >
                View Full Directory
              </Link>
            </div>

            {loadingMembers ? (
              <div className="text-center py-12">
                <p className="font-mono text-on-surface-variant text-sm">Loading community members...</p>
              </div>
            ) : members.length > 0 ? (
              <div className="masonry">
                {members.map((member) => {
                  let roleTag: "VOLUNTEER" | "MENTOR" | "MEMBER" = "MEMBER";
                  let cleanBio = member.bio || "";

                  if (cleanBio.startsWith("[VOLUNTEER]")) {
                    roleTag = "VOLUNTEER";
                    cleanBio = cleanBio.replace("[VOLUNTEER]", "").trim();
                  } else if (cleanBio.startsWith("[MENTOR]")) {
                    roleTag = "MENTOR";
                    cleanBio = cleanBio.replace("[MENTOR]", "").trim();
                  }

                  const displayName = member.fullName || (member.githubUsername ? `@${member.githubUsername}` : "Community Member");
                  const avatar = member.avatarUrl || (member.githubUsername && !member.githubUsername.startsWith('user-') ? `https://github.com/${member.githubUsername}.png` : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=003527&color=ffffff&bold=true`);

                  return (
                    <div
                      key={member.id}
                      className="masonry-item bg-surface rounded-2xl p-6 shadow-md border border-outline/50 hover:border-primary/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Header: Avatar, Name & Styled Badge */}
                        <div className="flex items-center gap-4 mb-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className="w-14 h-14 rounded-full object-cover border-2 border-primary/40 shadow-sm shrink-0"
                            src={avatar}
                            alt={displayName}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=003527&color=ffffff&bold=true`;
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-headline-md text-lg text-primary font-bold truncate">
                              {displayName}
                            </h4>
                            {roleTag === "VOLUNTEER" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-1 text-[11px] font-bold font-mono tracking-wider rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                <span className="material-symbols-outlined text-xs">volunteer_activism</span>
                                VOLUNTEER
                              </span>
                            )}
                            {roleTag === "MENTOR" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-1 text-[11px] font-bold font-mono tracking-wider rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                                <span className="material-symbols-outlined text-xs">school</span>
                                MENTOR
                              </span>
                            )}
                            {roleTag === "MEMBER" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-1 text-[11px] font-bold font-mono tracking-wider rounded-full bg-primary/15 text-primary border border-primary/30">
                                <span className="material-symbols-outlined text-xs">verified</span>
                                MEMBER
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bio Text */}
                        {cleanBio && (
                          <p className="font-body-md text-on-surface-variant text-sm leading-relaxed mb-4">
                            {cleanBio}
                          </p>
                        )}
                      </div>

                      {/* Footer Info: GitHub & Location */}
                      <div className="pt-3 border-t border-outline/30 flex items-center justify-between gap-2 text-xs font-mono text-on-surface-variant">
                        {member.location ? (
                          <span className="flex items-center gap-1 text-on-surface-variant truncate">
                            <span className="material-symbols-outlined text-primary text-sm shrink-0">location_on</span>
                            <span className="truncate">{member.location}</span>
                          </span>
                        ) : (
                          <span className="opacity-50">JKOSI Ecosystem</span>
                        )}

                        {member.githubUsername && !member.githubUsername.startsWith('user-') && (
                          <a
                            href={`https://github.com/${member.githubUsername}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline shrink-0"
                          >
                            <span>@{member.githubUsername}</span>
                            <span className="material-symbols-outlined text-xs">open_in_new</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-surface rounded-2xl border border-outline-variant p-xl">
                <span className="material-symbols-outlined text-4xl text-primary opacity-60 mb-2">groups</span>
                <h3 className="font-headline-md text-lg text-primary font-bold mb-1">No Public Members Listed Yet</h3>
                <p className="font-body-md text-on-surface-variant text-sm max-w-md mx-auto">
                  Be the first to join! Submit your application above to be featured in the JKOSI public directory once approved.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer variant="home" />
    </div>
  );
}
