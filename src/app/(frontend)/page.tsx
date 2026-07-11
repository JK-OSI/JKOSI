"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { LogoCarousel } from "@/components/LogoCarousel";
import LineWaves from "@/components/LineWaves";

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/repositories?limit=3')
      .then(res => res.json())
      .then(data => {
        if (data.docs && data.docs.length > 0) {
          const mapped = data.docs.map((d: any) => {
            const authorName = d.owner && typeof d.owner === 'object' ? (d.owner as any).githubUsername || 'anonymous' : 'anonymous'
            return {
              id: String(d.id),
              name: d.name,
              desc: d.description || '',
              category: d.category || 'Web',
              stars: String(d.stars || 0),
              author: authorName,
              authorImage: `https://github.com/${authorName.replace(/^@/, '')}.png`,
            }
          })
          setFeaturedProjects(mapped);
        } else {
          setFeaturedProjects([]);
        }
      })
      .catch(() => {
        setFeaturedProjects([]);
      });

    fetch('/api/repositories?limit=100')
      .then(res => res.json())
      .then(data => {
        if (data.docs && data.docs.length > 0) {
          setAllProjects(data.docs);
        } else {
          setAllProjects([]);
        }
      })
      .catch(() => {
        setAllProjects([]);
      });
  }, []);

  return (
    <>
      {/* Floating Pill Nav Metaphor matches our premium Atmospheric layout */}
      <Navbar activePage="home" isFixed={true} showSearch="projects" />

      <main className="pt-20">
        {/* Hero Section: Centered display typography on an immersive interactive WebGL background */}
        <section className="relative min-h-[850px] flex items-center overflow-hidden bg-primary-container">
          {/* Immersive WebGL Background Overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-primary-container via-primary-container/90 to-primary-container z-10"></div>
            <div className="absolute inset-0 opacity-20 z-0">
              <LineWaves
                speed={0.4}
                innerLineCount={36}
                outerLineCount={40}
                warpIntensity={1.2}
                rotation={-35}
                edgeFadeWidth={0.2}
                colorCycleSpeed={0.5}
                brightness={0.35}
                color1="#b0f0d6"
                color2="#95d3ba"
                color3="#80bea6"
                enableMouseInteraction={true}
                mouseInfluence={2.5}
              />
            </div>
            {/* Soft structural backdrop pattern */}
            <div
              className="absolute inset-0 opacity-5 z-0"
              style={{
                backgroundImage: "radial-gradient(rgb(176, 240, 214) 0.5px, transparent 0.5px)",
                backgroundSize: "24px 24px"
              }}
            ></div>
          </div>

          <div className="relative z-20 max-w-container-max mx-auto px-lg flex flex-col items-center justify-center w-full">
            {/* Main Split-Grid Row: Logo left, Content right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full mb-12">
              
              {/* Left Column: 3D Rotating Logo */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center relative min-h-[200px]">
                <div className="absolute w-36 h-36 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://img.icons8.com/?size=250&id=g5rLTJhMpDL7&format=png&color=ffffff"
                  alt="Open Source 3D Logo"
                  className="w-32 h-32 md:w-44 md:h-44 object-contain animate-float3d relative z-10 brightness-0 invert"
                />
              </div>

              {/* Right Column: Title, Description, and CTA Buttons */}
              <div className="lg:col-span-8 flex flex-col items-center lg:items-start text-center lg:text-left">
                {/* Small Premium Badge */}
                <div className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full border border-outline bg-surface-container/50 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-on-surface-variant">JKOSI · V1.0.0</span>
                </div>

                <div className="mb-8">
                  <h1 className="font-headline-xl text-5xl md:text-7xl lg:text-[80px] text-on-surface font-black tracking-tighter leading-[0.95] text-glow select-none">
                    JAMMU &amp; KASHMIR
                    <span className="block mt-2 text-primary font-bold">OPEN SOURCE</span>
                  </h1>
                  <p className="font-body-lg text-body-md md:text-lg text-on-surface-variant max-w-[580px] mx-auto lg:mx-0 mt-6 leading-relaxed">
                    Empowering regional developers. Building digital sovereignty. Driving local innovation through global open standards.
                  </p>
                </div>

                {/* Action Buttons (Directly below description) */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-md">
                  <Link
                    href="/projects"
                    className="px-8 py-4 bg-primary text-on-primary font-bold text-label-md rounded-full shadow-lg transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 group"
                  >
                    Browse Directory{" "}
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-sm">
                      arrow_forward
                    </span>
                  </Link>
                  <Link
                    href="/submit"
                    className="px-8 py-4 bg-transparent border border-outline text-on-surface font-bold text-label-md rounded-full hover:bg-surface-container/30 hover:border-primary transition-all duration-200 text-center"
                  >
                    Submit a Project
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Row: Pinned Logo Carousel Area */}
            {allProjects.length > 0 && (
              <div className="w-full max-w-3xl bg-surface-container-low/40 backdrop-blur-sm border border-outline/50 rounded-2xl p-6 shadow-xl shadow-surface-container-lowest/5 mt-4">
                <div className="text-center font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/60 mb-4">
                  Active Showcases
                </div>
                <LogoCarousel projects={allProjects} columnCount={3} />
              </div>
            )}
          </div>
        </section>

        {/* Section 0.5: Ecosystem Domains (Replaces Leaderboard) */}
        <section className="relative py-20 bg-background border-t border-outline/30 overflow-hidden">
          {/* Glowing Blooms */}
          <div className="bloom-overlay bloom-moss opacity-10"></div>
          <div className="bloom-overlay bloom-saffron opacity-10"></div>

          <div className="max-w-container-max mx-auto px-lg relative z-10">
            {/* Section Header */}
            <div className="mb-12 text-center">
              <span className="text-primary font-bold text-label-md tracking-wider uppercase block mb-2 font-mono">
                00 — Focus Domains
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Ecosystem Domains</h2>
              <p className="text-on-surface-variant max-w-[580px] mt-4 text-body-lg mx-auto">
                We catalog open-source repositories from Jammu &amp; Kashmir across all fields of technology—completely open to any language, stack, or scope.
              </p>
            </div>

            {/* Domains Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[960px] mx-auto relative z-10">
              {/* Domain 1: Languages */}
              <div className="bg-surface-container border border-outline/50 rounded-2xl p-6 flex flex-col justify-between hover:border-primary/50 hover:bg-surface-container-high transition-all duration-300 hover:-translate-y-1 shadow-md group min-h-[240px]">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary text-xl">code</span>
                  </div>
                  <h3 className="font-bold text-on-surface text-lg mb-2">Any Stack or Language</h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed">
                    Whether your repository is built in Rust, Python, Go, TypeScript, C++, Flutter, or Solidity—our index is entirely language-agnostic.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-outline/25 flex flex-wrap gap-1.5">
                  <span className="bg-outline/20 text-on-surface-variant text-[10px] font-mono px-2 py-0.5 rounded">Multi-Language</span>
                  <span className="bg-outline/20 text-on-surface-variant text-[10px] font-mono px-2 py-0.5 rounded">All Ecosystems</span>
                </div>
              </div>

              {/* Domain 2: Scope & Size */}
              <div className="bg-surface-container border border-outline/50 rounded-2xl p-6 flex flex-col justify-between hover:border-primary/50 hover:bg-surface-container-high transition-all duration-300 hover:-translate-y-1 shadow-md group min-h-[240px]">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary text-xl">layers</span>
                  </div>
                  <h3 className="font-bold text-on-surface text-lg mb-2">Any Project Scope</h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed">
                    From simple command-line tools and utility packages to full-stack applications, machine learning frameworks, and edge firmware.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-outline/25 flex flex-wrap gap-1.5">
                  <span className="bg-outline/20 text-on-surface-variant text-[10px] font-mono px-2 py-0.5 rounded">Libraries &amp; CLIs</span>
                  <span className="bg-outline/20 text-on-surface-variant text-[10px] font-mono px-2 py-0.5 rounded">Full Architectures</span>
                </div>
              </div>

              {/* Domain 3: Purpose & Utility */}
              <div className="bg-surface-container border border-outline/50 rounded-2xl p-6 flex flex-col justify-between hover:border-primary/50 hover:bg-surface-container-high transition-all duration-300 hover:-translate-y-1 shadow-md group min-h-[240px]">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary text-xl">build</span>
                  </div>
                  <h3 className="font-bold text-on-surface text-lg mb-2">Any Practical Utility</h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed">
                    Regional translation tools, dataset indexes, transit apps, blockchain trackers, or developer toolkits—if it solves a problem, it has a home here.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-outline/25 flex flex-wrap gap-1.5">
                  <span className="bg-outline/20 text-on-surface-variant text-[10px] font-mono px-2 py-0.5 rounded">Public Utilities</span>
                  <span className="bg-outline/20 text-on-surface-variant text-[10px] font-mono px-2 py-0.5 rounded">DevTools</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Bento Ecosystem Grid (01 Bento Grid) */}
        <section className="relative py-28 bg-surface-container-low overflow-hidden">
          {/* Radial glow blooms */}
          <div className="bloom-overlay bloom-moss"></div>
          <div className="bloom-overlay bloom-saffron"></div>

          <div className="max-w-container-max mx-auto px-lg relative z-10">
            <div className="mb-16">
              <span className="text-primary font-bold text-label-md tracking-wider uppercase block mb-2 font-mono">
                01 — The Initiative
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Community Ecosystem</h2>
              <p className="text-on-surface-variant max-w-2xl mt-4 text-body-lg">
                Fostering local tech capacity through global standards. Discover how we collaborate across the region.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              {/* Mission Card (Spans 2 columns on desktop) */}
              <div className="md:col-span-2 bento-card-premium p-10 rounded-2xl flex flex-col justify-between min-h-[360px] bg-surface-container">
                <div>
                  <span className="material-symbols-outlined text-primary text-4xl mb-6">groups</span>
                  <h3 className="font-headline-md text-2xl md:text-3xl text-on-surface mb-4 leading-snug">
                    Driving Regional Innovation Through Open Collaboration
                  </h3>
                  <p className="text-on-surface-variant leading-relaxed text-body-lg">
                    We provide the resources, mentorship, and platform necessary for regional builders to showcase their
                    craft. By bridging the gap between local ideas and global execution, we develop software that addresses
                    the unique challenges of Jammu & Kashmir.
                  </p>
                </div>
                <div className="mt-8 text-primary font-bold text-label-md flex items-center gap-1 cursor-pointer w-fit hover:underline decoration-primary">
                  Learn about our mission{" "}
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </div>
              </div>

              {/* Stats Card (1 column, tabular numbers) */}
              <div className="bento-card-premium p-10 rounded-2xl flex flex-col justify-between bg-surface-container-high">
                <div>
                  <h3 className="font-label-md text-label-md uppercase tracking-wider text-secondary mb-8 font-mono">
                    Ecosystem Pillars
                  </h3>
                  <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                    <div>
                      <span className="block font-headline-xl text-2xl font-bold text-primary font-mono tracking-tight">
                        100%
                      </span>
                      <span className="text-label-sm text-on-surface-variant">Open Source</span>
                    </div>
                    <div>
                      <span className="block font-headline-xl text-xl font-bold text-primary font-mono tracking-tight leading-8">
                        Permissive
                      </span>
                      <span className="text-label-sm text-on-surface-variant">Licensing</span>
                    </div>
                    <div>
                      <span className="block font-headline-xl text-2xl font-bold text-primary font-mono tracking-tight">
                        2-Step
                      </span>
                      <span className="text-label-sm text-on-surface-variant">Code Audit</span>
                    </div>
                    <div>
                      <span className="block font-headline-xl text-2xl font-bold text-primary font-mono tracking-tight">
                        Zero
                      </span>
                      <span className="text-label-sm text-on-surface-variant">Secrets Leak</span>
                    </div>
                  </div>
                </div>
                <div className="mt-8 text-[10px] text-on-surface-variant/50 border-t border-outline/50 pt-4 font-mono tracking-widest">
                  VERIFIED STANDARDS
                </div>
              </div>

              {/* As a Developer Cell */}
              <div className="bento-card-premium p-8 rounded-2xl flex flex-col justify-between min-h-[300px] bg-surface-container">
                <div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                    <span className="material-symbols-outlined text-2xl">code</span>
                  </div>
                  <h4 className="font-headline-md text-xl text-on-surface mb-2 font-bold">As a Developer</h4>
                  <p className="text-on-surface-variant text-body-md">
                    Contribute to regional libraries, build local utilities, or submit your own open-source initiative.
                  </p>
                </div>
                <button className="w-fit mt-4 text-primary font-bold text-label-md flex items-center gap-1 hover:underline group">
                  Start Coding{" "}
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>

              {/* As a Designer Cell */}
              <div className="bento-card-premium p-8 rounded-2xl flex flex-col justify-between min-h-[300px] bg-surface-container">
                <div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                    <span className="material-symbols-outlined text-2xl">brush</span>
                  </div>
                  <h4 className="font-headline-md text-xl text-on-surface mb-2 font-bold">As a Designer</h4>
                  <p className="text-on-surface-variant text-body-md">
                    Improve the accessibility, user interfaces, and local language localization of regional digital portals.
                  </p>
                </div>
                <button className="w-fit mt-4 text-primary font-bold text-label-md flex items-center gap-1 hover:underline group">
                  Improve UX{" "}
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>

              {/* As a Mentor Cell */}
              <div className="bento-card-premium p-8 rounded-2xl flex flex-col justify-between min-h-[300px] bg-surface-container">
                <div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                    <span className="material-symbols-outlined text-2xl">school</span>
                  </div>
                  <h4 className="font-headline-md text-xl text-on-surface mb-2 font-bold">As a Mentor</h4>
                  <p className="text-on-surface-variant text-body-md">
                    Share your technical expertise with local students, run workshops, and help review community submissions.
                  </p>
                </div>
                <button className="w-fit mt-4 text-primary font-bold text-label-md flex items-center gap-1 hover:underline group">
                  Become a Mentor{" "}
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Narrative Workflow (14 Narrative Workflow - Step Sequence) */}
        <section className="py-28 bg-surface overflow-hidden relative">
          <div className="max-w-container-max mx-auto px-lg">
            <div className="text-center mb-20">
              <span className="text-primary font-bold text-label-md tracking-wider uppercase block mb-2 font-mono">
                02 — The Lifecycle
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Submission Workflow</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto mt-4 text-body-lg">
                Our structured approval lifecycle ensures every open-source project adheres to strict community code quality guidelines.
              </p>
            </div>

            <div className="relative max-w-4xl mx-auto pl-8 md:pl-0">
              {/* Timeline Center line */}
              <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-px bg-outline transform md:-translate-x-1/2"></div>

              {/* Step 1 */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-start">
                <div className="md:text-right md:pr-12 md:pt-1">
                  <span className="inline-block font-mono text-label-md text-primary font-bold tracking-wider mb-2">
                    STAGE 1.0
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-3 font-bold">Register Repository</h3>
                  <p className="text-on-surface-variant text-body-md leading-relaxed">
                    Submit your GitHub repository. We welcome developer packages, local data integrations, and regional
                    telemedicine or monitoring utilities.
                  </p>
                </div>
                <div className="hidden md:block"></div>
                {/* Timeline center indicator */}
                <div className="absolute left-[-20px] md:left-1/2 w-10 h-10 rounded-full bg-surface-container border-2 border-primary flex items-center justify-center text-primary font-bold text-sm transform md:-translate-x-1/2 md:translate-y-2 select-none">
                  01
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-start">
                <div className="hidden md:block"></div>
                <div className="md:pl-12 md:pt-1">
                  <span className="inline-block font-mono text-label-md text-primary font-bold tracking-wider mb-2">
                    STAGE 2.0
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-3 font-bold">Community Audit</h3>
                  <p className="text-on-surface-variant text-body-md leading-relaxed">
                    The JKOSI tech council reviews your code quality, dependency health, license correctness, and setup
                    documentation to ensure ease of setup.
                  </p>
                </div>
                {/* Timeline center indicator */}
                <div className="absolute left-[-20px] md:left-1/2 w-10 h-10 rounded-full bg-surface-container border-2 border-primary flex items-center justify-center text-primary font-bold text-sm transform md:-translate-x-1/2 md:translate-y-2 select-none">
                  02
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="md:text-right md:pr-12 md:pt-1">
                  <span className="inline-block font-mono text-label-md text-primary font-bold tracking-wider mb-2">
                    STAGE 3.0
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-3 font-bold">Gallery Promotion</h3>
                  <p className="text-on-surface-variant text-body-md leading-relaxed">
                    Once approved, your project goes live in the public directory with featured badges, inviting feedback,
                    issues, and code updates from global contributors.
                  </p>
                </div>
                <div className="hidden md:block"></div>
                {/* Timeline center indicator */}
                <div className="absolute left-[-20px] md:left-1/2 w-10 h-10 rounded-full bg-surface-container border-2 border-primary flex items-center justify-center text-primary font-bold text-sm transform md:-translate-x-1/2 md:translate-y-2 select-none">
                  03
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Featured Projects (F6 Product Card Grid - with customized hovers and no bouncy/elastic ease) */}
        {featuredProjects.length > 0 && (
          <section className="py-28 bg-surface-container overflow-hidden relative">
            <div className="max-w-container-max mx-auto px-lg">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                <div>
                  <span className="text-primary font-bold text-label-md tracking-wider uppercase block mb-2 font-mono">
                    03 — Showcase
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Featured Repositories</h2>
                  <p className="text-on-surface-variant mt-2 text-body-lg">
                    Top open-source projects driving utility, research, and infrastructure.
                  </p>
                </div>
                <Link
                  href="/projects"
                  className="text-primary font-bold text-label-md border-b-2 border-primary/30 hover:border-primary pb-1 transition-all duration-200 flex items-center gap-1 font-mono tracking-wider"
                >
                  EXPLORE ALL REPOS <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                {featuredProjects.map((project) => (
                  <div key={project.id} className="project-card bento-card-premium rounded-2xl overflow-hidden flex flex-col h-full bg-surface">
                    <div className="p-8 flex flex-col h-full justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-[11px] font-bold uppercase tracking-wider">
                            {project.category}
                          </span>
                          <span className="flex items-center gap-1 text-on-surface-variant font-mono text-label-sm">
                            <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                              star
                            </span>{" "}
                            {project.stars}
                          </span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-on-surface mb-3 font-bold">{project.name}</h3>
                        <p className="text-on-surface-variant text-body-md line-clamp-3 mb-6">
                          {project.desc}
                        </p>
                      </div>
                      <div className="pt-6 border-t border-outline/50 flex items-center justify-between mt-auto">
                        <a
                          href={`https://github.com/${project.author.replace(/^@/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 group"
                        >
                          <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline flex items-center justify-center transition-colors group-hover:border-primary">
                            {project.authorImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                alt={`Lead: ${project.author}`}
                                className="w-full h-full object-cover"
                                src={project.authorImage}
                              />
                            ) : (
                              <span className="font-mono text-[10px] font-bold text-primary">
                                {project.author.replace(/^@/, '').slice(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span className="text-label-sm font-mono text-secondary group-hover:text-primary transition-colors group-hover:underline">{project.author}</span>
                        </a>
                        <Link
                          href={`/projects/${project.id}`}
                          className="text-xs font-mono font-bold text-primary uppercase bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                        >
                          View <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section 4: Security (F3 Tabular Spec Sheet - table styling) */}
        <section className="py-28 bg-surface overflow-hidden relative">
          <div className="max-w-container-max mx-auto px-lg">
            <div className="mb-16">
              <span className="text-primary font-bold text-label-md tracking-wider uppercase block mb-2 font-mono">
                04 — Quality
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Community Quality Standards</h2>
              <p className="text-on-surface-variant max-w-2xl mt-4 text-body-lg">
                We maintain strict code health, dependency audit, and licensing guidelines to protect users and builders.
              </p>
            </div>

            <div className="border border-outline rounded-xl overflow-hidden bg-surface-container-low font-mono overflow-x-auto">
              <table className="w-full text-left border-collapse text-label-md min-w-[700px]">
                <thead>
                  <tr className="border-b border-outline bg-surface-container-high text-primary font-bold">
                    <th className="p-6">Audit Dimension</th>
                    <th className="p-6">Methodology</th>
                    <th className="p-6">Requirement</th>
                    <th className="p-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline">
                  <tr className="hover:bg-surface-container transition-colors duration-150">
                    <td className="p-6 font-bold text-on-surface">Code Quality & CI</td>
                    <td className="p-6 text-on-surface-variant font-sans">
                      Automated syntax, formatting, and unit tests execute on every incoming Pull Request.
                    </td>
                    <td className="p-6 text-on-surface-variant">Mandatory Checks</td>
                    <td className="p-6 text-right text-primary font-bold tracking-wider">✓ ACTIVE</td>
                  </tr>
                  <tr className="hover:bg-surface-container transition-colors duration-150">
                    <td className="p-6 font-bold text-on-surface">Documentation Audit</td>
                    <td className="p-6 text-on-surface-variant font-sans">
                      Review of contributing instructions, environmental setup guides, and readable code comments.
                    </td>
                    <td className="p-6 text-on-surface-variant">Community Ready</td>
                    <td className="p-6 text-right text-primary font-bold tracking-wider">✓ ACTIVE</td>
                  </tr>
                  <tr className="hover:bg-surface-container transition-colors duration-150">
                    <td className="p-6 font-bold text-on-surface">License Compliance</td>
                    <td className="p-6 text-on-surface-variant font-sans">
                      Strict verification of OSI-approved open source licensing to ensure freedom of reuse.
                    </td>
                    <td className="p-6 text-on-surface-variant">Strict Validation</td>
                    <td className="p-6 text-right text-primary font-bold tracking-wider">✓ ACTIVE</td>
                  </tr>
                  <tr className="hover:bg-surface-container transition-colors duration-150">
                    <td className="p-6 font-bold text-on-surface">Vulnerability Scanning</td>
                    <td className="p-6 text-on-surface-variant font-sans">
                      Automated software scanning checks for exposed API keys, memory safety bugs, and outdated packages.
                    </td>
                    <td className="p-6 text-on-surface-variant">Pre-approval Scan</td>
                    <td className="p-6 text-right text-primary font-bold tracking-wider">✓ ACTIVE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 5: Common Questions (FAQ Accordions) */}
        <section className="py-28 bg-surface-container-low overflow-hidden relative">
          <div className="bloom-overlay bloom-moss"></div>
          <div className="bloom-overlay bloom-saffron"></div>

          <div className="max-w-3xl mx-auto px-lg relative z-10">
            <div className="text-center mb-16">
              <span className="text-primary font-bold text-label-md tracking-wider uppercase block mb-2 font-mono">
                05 — Context
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Common Questions</h2>
              <p className="text-on-surface-variant mt-2 text-body-lg">
                Everything you need to know about joining the JKOSI movement.
              </p>
            </div>

            <div className="space-y-4">
              <details className="group bg-surface border border-outline rounded-xl overflow-hidden transition-all duration-300 open:border-primary">
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none select-none hover:bg-surface-container transition-colors duration-150">
                  <h4 className="font-headline-md text-lg text-on-surface font-bold">
                    Who can submit a project to JKOSI?
                  </h4>
                  <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform duration-200">
                    expand_more
                  </span>
                </summary>
                <div className="px-6 pb-6 text-on-surface-variant font-body-md border-t border-outline/50 pt-4 bg-surface-container-low/50">
                  Anyone can submit! We prioritize projects built by developers in Jammu & Kashmir or projects that
                  specifically solve regional challenges. The only hard requirement is that the project must be released
                  under an OSI-approved open-source license.
                </div>
              </details>

              <details className="group bg-surface border border-outline rounded-xl overflow-hidden transition-all duration-300 open:border-primary">
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none select-none hover:bg-surface-container transition-colors duration-150">
                  <h4 className="font-headline-md text-lg text-on-surface font-bold">
                    What happens after I submit my project?
                  </h4>
                  <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform duration-200">
                    expand_more
                  </span>
                </summary>
                <div className="px-6 pb-6 text-on-surface-variant font-body-md border-t border-outline/50 pt-4 bg-surface-container-low/50">
                  Your project enters our evaluation queue. A community council member will review your codebase,
                  documentation, and security standards within 5-7 business days. You'll receive feedback or an approval
                  notification via GitHub.
                </div>
              </details>

              <details className="group bg-surface border border-outline rounded-xl overflow-hidden transition-all duration-300 open:border-primary">
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none select-none hover:bg-surface-container transition-colors duration-150">
                  <h4 className="font-headline-md text-lg text-on-surface font-bold">
                    Is there mentorship available for beginners?
                  </h4>
                  <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform duration-200">
                    expand_more
                  </span>
                </summary>
                <div className="px-6 pb-6 text-on-surface-variant font-body-md border-t border-outline/50 pt-4 bg-surface-container-low/50">
                  Yes! Our &quot;Mentorship Program&quot; pairs experienced developers with students and beginners. We also
                  host monthly virtual office hours and workshops to help new contributors get started with their first pull
                  requests.
                </div>
              </details>

              <details className="group bg-surface border border-outline rounded-xl overflow-hidden transition-all duration-300 open:border-primary">
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none select-none hover:bg-surface-container transition-colors duration-150">
                  <h4 className="font-headline-md text-lg text-on-surface font-bold">
                    Do I need to be in J&K to contribute?
                  </h4>
                  <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform duration-200">
                    expand_more
                  </span>
                </summary>
                <div className="px-6 pb-6 text-on-surface-variant font-body-md border-t border-outline/50 pt-4 bg-surface-container-low/50">
                  While our primary focus is regional talent, we welcome contributors from all over the world. Many of our
                  mentors and key contributors are J&K diaspora or global open-source enthusiasts who want to support the
                  region's growth.
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* Section 6: final CTA strip (C2 Inline form as CTA) */}
        <section className="py-28 bg-surface-container-high text-on-surface relative overflow-hidden border-t border-outline">
          <div className="max-w-container-max mx-auto px-lg relative z-10 text-center">
            <h2 className="font-headline-xl text-3xl md:text-5xl font-black mb-6 tracking-tight leading-none">
              Ready to contribute to the region's future?
            </h2>
            <p className="font-body-lg text-on-surface-variant mb-10 max-w-[620px] mx-auto text-lg leading-relaxed">
              Join a network of over 1,500 builders creating the foundations of Jammu & Kashmir's digital sovereignty.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-sm max-w-[480px] mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-6 py-4 bg-surface border border-outline rounded-full text-label-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans"
              />
              <button className="w-full sm:w-auto px-8 py-4 bg-primary text-on-primary font-bold text-label-md rounded-full hover:opacity-90 transition-opacity whitespace-nowrap">
                Join Community
              </button>
            </div>
            <p className="text-[10px] text-on-surface-variant/50 mt-6 font-mono tracking-wider uppercase">
              NO SPAM · BI-WEEKLY NEWSLETTER ONLY
            </p>
          </div>
        </section>
      </main>

      <Footer variant="home" />
    </>
  );
}
