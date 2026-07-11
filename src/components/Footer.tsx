import Link from 'next/link';

interface FooterProps {
  variant?: 'home' | 'projects';
}

export default function Footer({ variant = 'home' }: FooterProps) {
  if (variant === 'home') {
    return (
      <footer className="w-full py-xl px-lg mt-auto border-t border-outline-variant dark:border-outline bg-surface-container dark:bg-surface-container-high">
        <div className="max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim block mb-4 font-headline-lg flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://img.icons8.com/?size=100&id=g5rLTJhMpDL7&format=png&color=ffffff"
                  alt="Open Source Logo"
                  className="w-5 h-5 object-contain brightness-0 invert"
                />
                JKOSI
              </span>
              <p className="text-on-secondary-container dark:text-on-secondary-fixed-variant max-w-[380px] mb-6 font-body-md">
                Jammu &amp; Kashmir Open Source Initiative is a community-led non-profit focused on building local tech capacity through global standards.
              </p>
              <div className="flex gap-4">
                <a className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all" href="#">
                  <span className="material-symbols-outlined">hub</span>
                </a>
                <a className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all" href="#">
                  <span className="material-symbols-outlined">forum</span>
                </a>
                <a className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all" href="https://github.com/JK-OSI/JKOSI" target="_blank" rel="noreferrer">
                  <span className="material-symbols-outlined">code</span>
                </a>
              </div>
            </div>
            <div>
              <h5 className="text-primary font-bold mb-4 font-label-md">Navigation</h5>
              <ul className="space-y-3">
                <li><Link className="text-on-secondary-container font-label-md hover:underline decoration-primary transition-all" href="/about">About Us</Link></li>
                <li><Link className="text-on-secondary-container font-label-md hover:underline decoration-primary transition-all" href="/guidelines">Guidelines</Link></li>
                <li><Link className="text-on-secondary-container font-label-md hover:underline decoration-primary transition-all" href="/privacy">Privacy Policy</Link></li>
                <li><Link className="text-on-secondary-container font-label-md hover:underline decoration-primary transition-all" href="/support">Contact Support</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-primary font-bold mb-4 font-label-md">Ecosystem</h5>
              <ul className="space-y-3">
                <li><a className="text-on-secondary-container font-label-md hover:underline decoration-primary transition-all" href="https://github.com/JK-OSI/JKOSI" target="_blank" rel="noreferrer">GitHub</a></li>
                <li><a className="text-on-secondary-container font-label-md hover:underline decoration-primary transition-all" href="#">Discord</a></li>
                <li><a className="text-on-secondary-container font-label-md hover:underline decoration-primary transition-all" href="#">Newsletter</a></li>
                <li><a className="text-on-secondary-container font-label-md hover:underline decoration-primary transition-all" href="#">Mentorship</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-label-sm text-label-sm text-on-secondary-container">
              © 2024 Jammu &amp; Kashmir Open Source Initiative. Empowering regional innovation through open collaboration.
            </p>
            <div className="flex gap-6">
              <span className="font-label-sm text-label-sm text-on-secondary-container cursor-pointer hover:text-primary">Terms</span>
              <span className="font-label-sm text-label-sm text-on-secondary-container cursor-pointer hover:text-primary">Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-surface-container dark:bg-surface-container-high w-full py-xl px-lg mt-auto border-t border-outline-variant dark:border-outline">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between gap-xl">
          <div className="max-w-[480px]">
            <div className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim mb-md flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://img.icons8.com/?size=100&id=g5rLTJhMpDL7&format=png&color=ffffff"
                alt="Open Source Logo"
                className="w-5 h-5 object-contain brightness-0 invert"
              />
              JKOSI
            </div>
            <p className="font-body-md text-body-md text-on-secondary-container dark:text-on-secondary-fixed-variant mb-lg">
              © 2024 Jammu &amp; Kashmir Open Source Initiative. Empowering regional innovation through open collaboration.
            </p>
            <div className="flex gap-md">
              <a className="text-on-secondary-container hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">language</span></a>
              <a className="text-on-secondary-container hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">hub</span></a>
              <a className="text-on-secondary-container hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">groups</span></a>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-xl">
            <div className="flex flex-col gap-sm">
              <span className="font-label-md text-label-md font-bold text-primary dark:text-primary-fixed-dim mb-sm">Explore</span>
              <Link className="font-label-sm text-label-sm text-on-secondary-container hover:underline decoration-primary" href="/about">About Us</Link>
              <Link className="font-label-sm text-label-sm text-on-secondary-container hover:underline decoration-primary" href="/guidelines">Guidelines</Link>
            </div>
            <div className="flex flex-col gap-sm">
              <span className="font-label-md text-label-md font-bold text-primary dark:text-primary-fixed-dim mb-sm">Support</span>
              <Link className="font-label-sm text-label-sm text-on-secondary-container hover:underline decoration-primary" href="/privacy">Privacy Policy</Link>
              <Link className="font-label-sm text-label-sm text-on-secondary-container hover:underline decoration-primary" href="/support">Contact Support</Link>
            </div>
            <div className="flex flex-col gap-sm">
              <span className="font-label-md text-label-md font-bold text-primary dark:text-primary-fixed-dim mb-sm">Community</span>
              <a className="font-label-sm text-label-sm text-on-secondary-container hover:underline decoration-primary" href="https://github.com/JK-OSI/JKOSI" target="_blank" rel="noreferrer">GitHub</a>
              <a className="font-label-sm text-label-sm text-on-secondary-container hover:underline decoration-primary" href="#">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    );
  }

