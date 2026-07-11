'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  memo
} from "react";
import { AnimatePresence, motion } from "motion/react";

interface ProjectLogo {
  id: string;
  name: string;
  category: string;
  stars: number;
  originalIndex: number;
}

const PALETTES = [
  { fillStart: "#001e14", fillEnd: "#003527", stroke: "#95d3ba", text: "#ffffff", desc: "#95d3ba" }, // Pashmina Moss
  { fillStart: "#051f18", fillEnd: "#0b3c2e", stroke: "#b0f0d6", text: "#ffffff", desc: "#b0f0d6" }, // Agri Emerald
  { fillStart: "#0c0a21", fillEnd: "#1d1947", stroke: "#818cf8", text: "#ffffff", desc: "#a5b4fc" }, // Kashur Indigo
  { fillStart: "#1a0803", fillEnd: "#3c180e", stroke: "#ff7d54", text: "#ffffff", desc: "#ffab91" }, // Ladakh Rust/Orange
  { fillStart: "#111827", fillEnd: "#1f2937", stroke: "#9ca3af", text: "#ffffff", desc: "#d1d5db" }, // Gurez Slate
  { fillStart: "#1c1917", fillEnd: "#292524", stroke: "#a8a29e", text: "#ffffff", desc: "#d6d3d1" }, // Stone Charcoal
];

export function DynamicProjectLogo({ name, category, stars, index }: { name: string; category: string; stars: number; index: number }) {
  const palette = PALETTES[index % PALETTES.length];
  const cat = (category || 'Web').toLowerCase().trim();
  
  // Choose category-specific SVG icon content
  let iconContent = null;
  if (cat.includes('web') || cat.includes('frontend')) {
    iconContent = (
      <>
        <rect x="6" y="8" width="20" height="16" rx="3" fill="none" stroke={palette.stroke} strokeWidth="1.5" />
        <line x1="6" y1="12" x2="26" y2="12" stroke={palette.stroke} strokeWidth="1.2" />
        <circle cx="9" cy="10" r="0.8" fill={palette.stroke} />
        <circle cx="12" cy="10" r="0.8" fill={palette.stroke} />
      </>
    );
  } else if (cat.includes('mobile') || cat.includes('app') || cat.includes('ios') || cat.includes('android')) {
    iconContent = (
      <>
        <rect x="9" y="6" width="14" height="20" rx="3" fill="none" stroke={palette.stroke} strokeWidth="1.5" />
        <circle cx="16" cy="22" r="1" fill={palette.stroke} />
      </>
    );
  } else if (cat.includes('ai') || cat.includes('ml') || cat.includes('nlp') || cat.includes('model') || cat.includes('intelligence')) {
    iconContent = (
      <>
        <circle cx="11" cy="16" r="2.5" fill="none" stroke={palette.stroke} strokeWidth="1.5" />
        <circle cx="21" cy="10" r="2.5" fill="none" stroke={palette.stroke} strokeWidth="1.5" />
        <circle cx="21" cy="22" r="2.5" fill="none" stroke={palette.stroke} strokeWidth="1.5" />
        <line x1="13.5" y1="14.5" x2="18.5" y2="11.5" stroke={palette.stroke} strokeWidth="1.2" />
        <line x1="13.5" y1="17.5" x2="18.5" y2="20.5" stroke={palette.stroke} strokeWidth="1.2" />
      </>
    );
  } else if (cat.includes('iot') || cat.includes('hardware') || cat.includes('embedded') || cat.includes('network')) {
    iconContent = (
      <>
        <circle cx="16" cy="19" r="1.5" fill={palette.stroke} />
        <path d="M11 15a7 7 0 0 1 10 0" fill="none" stroke={palette.stroke} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 12a11 11 0 0 1 16 0" fill="none" stroke={palette.stroke} strokeWidth="1.5" strokeLinecap="round" />
      </>
    );
  } else if (cat.includes('blockchain') || cat.includes('crypto') || cat.includes('dapp') || cat.includes('ledger')) {
    iconContent = (
      <>
        <path d="M16 6l7 4v8l-7 4-7-4v-8z" fill="none" stroke={palette.stroke} strokeWidth="1.5" />
        <path d="M9 10l7 4 7-4M16 14v8" fill="none" stroke={palette.stroke} strokeWidth="1.2" />
      </>
    );
  } else {
    // Default CLI / Dev Terminal icon
    iconContent = (
      <>
        <path d="M10 11l4 4-4 4" fill="none" stroke={palette.stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="15" y1="19" x2="20" y2="19" stroke={palette.stroke} strokeWidth="1.8" strokeLinecap="round" />
      </>
    );
  }

  return (
    <svg viewBox="0 0 240 80" className="w-full h-full">
      {/* Definitions for gradient overlays & volumetric drop shadow glow */}
      <defs>
        <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.fillStart} />
          <stop offset="100%" stopColor={palette.fillEnd} />
        </linearGradient>
        <filter id={`glow-${index}`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor={palette.stroke} floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Main card body with premium gradient, border, and glow */}
      <rect width="240" height="80" rx="16" fill={`url(#grad-${index})`} stroke={palette.stroke} strokeWidth="1.5" filter={`url(#glow-${index})`} />
      
      {/* Decorative Grid Lines to match high-tech bento aesthetic */}
      <line x1="0" y1="20" x2="240" y2="20" stroke={palette.stroke} strokeWidth="0.5" opacity="0.04" />
      <line x1="0" y1="40" x2="240" y2="40" stroke={palette.stroke} strokeWidth="0.5" opacity="0.04" />
      <line x1="0" y1="60" x2="240" y2="60" stroke={palette.stroke} strokeWidth="0.5" opacity="0.04" />
      <line x1="80" y1="0" x2="80" y2="80" stroke={palette.stroke} strokeWidth="0.5" opacity="0.04" />
      <line x1="160" y1="0" x2="160" y2="80" stroke={palette.stroke} strokeWidth="0.5" opacity="0.04" />

      {/* Decorative abstract wave pattern in background */}
      <path d="M 60,50 C 100,20 140,80 190,30" fill="none" stroke={palette.stroke} strokeWidth="1.2" opacity="0.08" strokeLinecap="round" />
      <path d="M 60,55 C 100,25 140,85 190,35" fill="none" stroke={palette.stroke} strokeWidth="0.6" opacity="0.04" strokeLinecap="round" />

      {/* Category Icon Container */}
      <g transform="translate(16, 24)">
        <rect width="32" height="32" rx="8" fill={palette.stroke} opacity="0.15" />
        <g>
          {iconContent}
        </g>
      </g>

      {/* Project Name and Category Info */}
      <text x="60" y="36" fill={palette.text} fontSize="14" fontWeight="700" fontFamily="var(--font-plus-jakarta-sans)">
        {name.length > 13 ? name.slice(0, 12) + "..." : name}
      </text>
      <text x="60" y="52" fill={palette.desc} fontSize="10" fontWeight="600" fontFamily="var(--font-mono)" letterSpacing="0.5">
        {category.toUpperCase()}
      </text>

      {/* Stars Counter Pill (Top-Right) */}
      <g transform="translate(176, 12)">
        <rect width="48" height="18" rx="6" fill={palette.stroke} opacity="0.1" />
        {/* SVG Star Path */}
        <path d="M8 3.5l1.1 2.4 2.6.2-1.9 1.7.5 2.6-2.3-1.4-2.3 1.4.5-2.6-1.9-1.7 2.6-.2z" fill={palette.stroke} transform="translate(2, 1)" />
        <text x="23" y="12" fill={palette.stroke} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {stars}
        </text>
      </g>

      {/* Verified Live Badge (Bottom-Right) */}
      <g transform="translate(176, 50)">
        <rect width="48" height="18" rx="6" fill={palette.stroke} opacity="0.08" />
        <circle cx="10" cy="9" r="4.5" fill="none" stroke={palette.stroke} strokeWidth="1" />
        <path d="M8.5 9l1 1 2-2" fill="none" stroke={palette.stroke} strokeWidth="1" strokeLinecap="round" />
        <text x="18" y="12" fill={palette.stroke} fontSize="8" fontWeight="bold" fontFamily="monospace">LIVE</text>
      </g>
    </svg>
  );
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const distributeProjects = (allProjects: ProjectLogo[], columnCount: number): ProjectLogo[][] => {
  const shuffled = shuffleArray(allProjects);
  const columns: ProjectLogo[][] = Array.from({ length: columnCount }, () => []);

  shuffled.forEach((project, index) => {
    columns[index % columnCount].push(project);
  });

  const maxLength = Math.max(...columns.map((col) => col.length));
  columns.forEach((col) => {
    while (col.length < maxLength) {
      col.push(shuffled[Math.floor(Math.random() * shuffled.length)]);
    }
  });

  return columns;
};

interface LogoColumnProps {
  projects: ProjectLogo[];
  index: number;
  currentTime: number;
}

const LogoColumn = memo(({ projects, index, currentTime }: LogoColumnProps) => {
  const cycleInterval = 2500; // time logo is displayed
  const columnDelay = index * 400; // staggered delay
  const adjustedTime = (currentTime + columnDelay) % (cycleInterval * projects.length);
  const currentIndex = Math.floor(adjustedTime / cycleInterval);
  const currentProject = projects[currentIndex];

  if (!currentProject) return null;

  return (
    <motion.div
      className="w-56 h-20 md:w-64 md:h-24 overflow-hidden relative rounded-2xl shadow-lg border border-outline-variant/20 bg-surface-container/10 backdrop-blur-md"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.15,
        duration: 0.6,
        ease: "easeOut",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentProject.id}-${currentIndex}`}
          className="absolute inset-0 flex items-center justify-center p-1"
          initial={{ y: "15%", opacity: 0, filter: "blur(6px)" }}
          animate={{
            y: "0%",
            opacity: 1,
            filter: "blur(0px)",
            transition: {
              type: "spring",
              stiffness: 260,
              damping: 22,
              mass: 1.1,
              bounce: 0.15,
              duration: 0.6,
            },
          }}
          exit={{
            y: "-15%",
            opacity: 0,
            filter: "blur(4px)",
            transition: {
              type: "tween",
              ease: "easeIn",
              duration: 0.35,
            },
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <DynamicProjectLogo
              name={currentProject.name}
              category={currentProject.category}
              stars={currentProject.stars}
              index={currentProject.originalIndex}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
});
LogoColumn.displayName = 'LogoColumn';

export function LogoCarousel({ projects = [], columnCount = 3 }: { projects?: any[]; columnCount?: number }) {
  const [logoSets, setLogoSets] = useState<ProjectLogo[][]>([]);
  const [currentTime, setCurrentTime] = useState(0);

  const normalizedProjects = useMemo(() => {
    return projects.map((p, idx) => ({
      id: String(p.id),
      name: p.name,
      category: p.category || 'Web',
      stars: p.stars || 0,
      originalIndex: idx
    }));
  }, [projects]);

  useEffect(() => {
    if (normalizedProjects.length === 0) return;
    const distributed = distributeProjects(normalizedProjects, Math.min(columnCount, normalizedProjects.length));
    setLogoSets(distributed);
  }, [normalizedProjects, columnCount]);

  const updateTime = useCallback(() => {
    setCurrentTime((prevTime) => prevTime + 100);
  }, []);

  useEffect(() => {
    if (normalizedProjects.length === 0) return;
    const intervalId = setInterval(updateTime, 100);
    return () => clearInterval(intervalId);
  }, [updateTime, normalizedProjects]);

  if (normalizedProjects.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {logoSets.map((logos, index) => (
        <LogoColumn
          key={index}
          projects={logos}
          index={index}
          currentTime={currentTime}
        />
      ))}
    </div>
  );
}
