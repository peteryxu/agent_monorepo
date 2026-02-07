import Image from "next/image";

// =============================================================================
// Navbar
// =============================================================================

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-20 h-[72px]">
      <div className="flex items-center gap-6">
        <span className="font-[Outfit] text-2xl font-extrabold tracking-tight text-white">
          ACME
        </span>
        <div className="flex items-center gap-8">
          {["Features", "Pricing", "About", "Blog"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <a
          href="#"
          className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          Sign in
        </a>
        <a
          href="#"
          className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#09090B] hover:bg-zinc-200 transition-colors"
        >
          Get Started
        </a>
      </div>
    </nav>
  );
}

// =============================================================================
// Hero
// =============================================================================

function Hero() {
  return (
    <section className="flex flex-col items-center px-20 pt-[120px] pb-[100px] gap-10">
      {/* Badge */}
      <div className="flex items-center gap-2 rounded-full border border-zinc-800 px-4 py-2">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <span className="text-[13px] font-medium text-zinc-400">
          Now in Public Beta
        </span>
      </div>

      {/* Headline */}
      <h1 className="font-[Outfit] text-[80px] font-black leading-[1] tracking-[-3px] text-white text-center">
        Build products
        <br />
        that matter.
      </h1>

      {/* Subheadline */}
      <p className="max-w-[600px] text-xl text-zinc-500 text-center leading-relaxed">
        The modern platform for teams who ship fast.
        <br />
        From idea to production in minutes, not months.
      </p>

      {/* CTA Buttons */}
      <div className="flex items-center gap-4">
        <a
          href="#"
          className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#09090B] hover:bg-zinc-200 transition-colors"
        >
          Start Building Free
          <span aria-hidden="true">&rarr;</span>
        </a>
        <a
          href="#"
          className="rounded-xl border border-zinc-800 px-8 py-4 text-base font-medium text-zinc-400 hover:border-zinc-600 hover:text-white transition-colors"
        >
          Watch Demo
        </a>
      </div>

      {/* Trust Logos */}
      <div className="flex items-center gap-12 pt-10">
        <span className="text-[11px] font-semibold tracking-[2px] text-zinc-700">
          TRUSTED BY
        </span>
        <div className="h-5 w-px bg-zinc-800" />
        {["Vercel", "Stripe", "Linear", "Figma", "Notion"].map((name) => (
          <span
            key={name}
            className="text-base font-semibold text-zinc-600"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}

// =============================================================================
// Product Mockup
// =============================================================================

function ProductMockup() {
  return (
    <section className="flex justify-center px-20 pb-20">
      <div className="w-[1100px] overflow-hidden rounded-2xl border border-zinc-800 bg-[#18181B]">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 h-11 bg-[#18181B]">
          <span className="h-3 w-3 rounded-full bg-red-500 opacity-80" />
          <span className="h-3 w-3 rounded-full bg-amber-500 opacity-80" />
          <span className="h-3 w-3 rounded-full bg-green-500 opacity-80" />
        </div>
        {/* Screen */}
        <div className="relative w-full aspect-[1100/606] bg-[#111111]">
          <Image
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1100&h=606&fit=crop"
            alt="Product dashboard"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Features
// =============================================================================

const features = [
  {
    icon: "⚡",
    title: "Lightning Fast",
    description:
      "Sub-second builds and instant hot reload. Your changes go live the moment you save.",
  },
  {
    icon: "🔒",
    title: "Secure by Default",
    description:
      "Enterprise-grade security baked in. SOC2, GDPR, and HIPAA compliant out of the box.",
  },
  {
    icon: "🤝",
    title: "Team Collaboration",
    description:
      "Real-time multiplayer editing. See your team's changes as they happen, no conflicts.",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="flex flex-col items-center px-20 py-[100px] gap-16"
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-4">
        <span className="text-xs font-semibold tracking-[3px] text-zinc-400">
          FEATURES
        </span>
        <h2 className="font-[Outfit] text-5xl font-extrabold leading-tight tracking-[-1.5px] text-white text-center">
          Everything you need
          <br />
          to ship faster.
        </h2>
        <p className="max-w-[500px] text-lg text-zinc-500 text-center leading-relaxed">
          Powerful tools designed for modern teams.
          <br />
          Simplify your workflow from day one.
        </p>
      </div>

      {/* Grid */}
      <div className="grid w-full grid-cols-3 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-[#18181B] p-8"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-2xl">
              {f.icon}
            </div>
            <h3 className="font-[Outfit] text-xl font-bold text-white">
              {f.title}
            </h3>
            <p className="text-[15px] leading-relaxed text-zinc-500">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// =============================================================================
// Bottom CTA
// =============================================================================

function BottomCTA() {
  return (
    <section className="flex flex-col items-center bg-[#0F0F11] px-20 py-[100px] gap-8">
      <h2 className="font-[Outfit] text-[56px] font-extrabold leading-[1.1] tracking-[-2px] text-white text-center">
        Ready to ship
        <br />
        something great?
      </h2>
      <p className="text-lg text-zinc-500 text-center leading-relaxed">
        Join thousands of teams building the future.
        <br />
        Start free — no credit card required.
      </p>
      <div className="flex items-center gap-4">
        <a
          href="#"
          className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#09090B] hover:bg-zinc-200 transition-colors"
        >
          Get Started Free
          <span aria-hidden="true">&rarr;</span>
        </a>
        <a
          href="#"
          className="rounded-xl border border-zinc-800 px-8 py-4 text-base font-medium text-zinc-400 hover:border-zinc-600 hover:text-white transition-colors"
        >
          Talk to Sales
        </a>
      </div>
    </section>
  );
}

// =============================================================================
// Footer
// =============================================================================

function Footer() {
  return (
    <footer className="px-20 pt-12 pb-12">
      <div className="mb-8 h-px w-full bg-zinc-900" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-[Outfit] text-lg font-extrabold text-white">
            ACME
          </span>
          <span className="text-[13px] text-zinc-600">
            &copy; 2025 Acme Inc. All rights reserved.
          </span>
        </div>
        <div className="flex items-center gap-8">
          {["Privacy", "Terms", "Twitter", "GitHub"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[13px] font-medium text-zinc-500 hover:text-white transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// =============================================================================
// Page
// =============================================================================

export default function Home() {
  return (
    <div className="mx-auto max-w-[1440px]">
      <Navbar />
      <div className="h-px w-full bg-zinc-900" />
      <Hero />
      <ProductMockup />
      <Features />
      <BottomCTA />
      <Footer />
    </div>
  );
}
