import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami — LACAK",
  description:
    "Mengenal LACAK — Sistem pelacakan barang temuan dan kehilangan berbasis digital di lingkungan SMK TI BAZMA.",
};

/* ── Dummy team data (will be replaced later) ── */
const TEAM_MEMBERS = [
  {
    name: "Muhammad Nafis",
    role: "Lead Developer",
    description:
      "Bertanggung jawab atas arsitektur sistem dan pengembangan fitur inti matching engine LACAK.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop&crop=face&q=80",
    profile: "#",
  },
  {
    name: "Muhammad Akbar",
    role: "Full-Stack Developer",
    description:
      "Mengembangkan antarmuka pengguna dan sistem backend yang menjadi fondasi platform LACAK.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=750&fit=crop&crop=face&q=80",
    profile: "#",
  },
  {
    name: "Ahmad Rizki",
    role: "UI/UX Designer",
    description:
      "Merancang pengalaman pengguna yang intuitif dan desain visual yang konsisten di seluruh platform.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=750&fit=crop&crop=face&q=80",
    profile: "#",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Lapor Kehilangan",
    description:
      "Pengguna melaporkan barang yang hilang dengan detail lengkap — jenis, warna, merek, dan lokasi terakhir.",
  },
  {
    number: "02",
    title: "Catat Temuan",
    description:
      "Barang yang ditemukan dicatat ke dalam sistem dengan informasi yang sama untuk memudahkan pencocokan.",
  },
  {
    number: "03",
    title: "Matching Otomatis",
    description:
      "Sistem mencocokkan secara otomatis antara laporan kehilangan dan barang temuan berdasarkan atribut.",
  },
  {
    number: "04",
    title: "Klaim & Ambil",
    description:
      "Pemilik mendapat notifikasi, melakukan verifikasi, dan mengambil barang miliknya kembali.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* ═══════════════════════════════════════════════
          SECTION 1 — HERO
          ═══════════════════════════════════════════════ */}
      <section className="about-section relative overflow-hidden bg-gradient-to-br from-[#0d3b2e] via-[#14503d] to-[#1a5c44]">
        {/* Subtle pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-6 py-28 text-center md:py-36 lg:py-44">
          {/* Small label */}
          <span className="mb-5 inline-block rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
            SMK TI BAZMA
          </span>

          {/* Main heading */}
          <h1 className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
            LACAK
          </h1>

          {/* Subheading */}
          <p className="mx-auto mb-8 max-w-2xl text-lg font-light leading-relaxed text-white/80 md:text-xl">
            Sistem pelacakan barang temuan &amp; kehilangan berbasis digital
            untuk lingkungan SMK TI BAZMA.
          </p>

          {/* Decorative line */}
          <div className="mx-auto h-px w-16 bg-[#3dbd84]/60" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — INTRODUCTION (Editorial Two-Column)
          ═══════════════════════════════════════════════ */}
      <section className="about-section bg-[#faf9f6]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-16">
            {/* Left — Label + Heading */}
            <div>
              <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-[#3dbd84]">
                Tentang Aplikasi
              </span>
              <h2 className="text-3xl font-extrabold leading-snug tracking-tight text-[#0d3b2e] md:text-4xl lg:text-[2.75rem]">
                Mengenal Lebih Dekat
                <br />
                Platform LACAK
              </h2>
            </div>

            {/* Right — Body text */}
            <div className="flex flex-col justify-center">
              <p className="text-base leading-[1.85] text-gray-600 md:text-lg">
                LACAK adalah sistem inovatif pengelolaan barang temuan dan
                kehilangan yang dirancang khusus untuk lingkungan SMK TI BAZMA.
                Dengan pendekatan digital dan matching otomatis, LACAK
                mempercepat proses pengembalian barang kepada pemiliknya secara
                transparan dan efisien.
              </p>
              <p className="mt-5 text-base leading-[1.85] text-gray-500 md:text-lg">
                Platform ini menggabungkan pencatatan terpusat, pencocokan
                cerdas, dan notifikasi real-time untuk menghadirkan solusi
                kehilangan barang yang modern di lingkungan pendidikan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3 — CARA KERJA (How It Works)
          ═══════════════════════════════════════════════ */}
      <section className="about-section bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          {/* Section header */}
          <div className="mb-16 text-center md:mb-20">
            <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-[#3dbd84]">
              Proses
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0d3b2e] md:text-4xl">
              Bagaimana LACAK Bekerja
            </h2>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {STEPS.map((step) => (
              <div key={step.number} className="group text-left">
                {/* Step number */}
                <span className="about-step-number">{step.number}</span>

                {/* Step title */}
                <h3 className="mt-3 text-lg font-bold text-[#0d3b2e]">
                  {step.title}
                </h3>

                {/* Accent line */}
                <div className="my-3 h-0.5 w-8 bg-[#3dbd84]/40 transition-all duration-300 group-hover:w-12 group-hover:bg-[#3dbd84]" />

                {/* Step description */}
                <p className="text-sm leading-relaxed text-gray-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 4 — NILAI / PURPOSE (Editorial Quote)
          ═══════════════════════════════════════════════ */}
      <section className="about-section bg-[#0d3b2e]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          {/* Decorative mark */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-5 w-5 text-[#3dbd84]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
                />
              </svg>
            </div>
          </div>

          {/* Quote */}
          <blockquote className="text-2xl font-semibold leading-snug text-white md:text-3xl lg:text-[2rem] lg:leading-[1.4]">
            &ldquo;Transparansi dan kecepatan dalam setiap proses pengembalian
            barang — karena setiap barang memiliki pemilik yang menunggu.&rdquo;
          </blockquote>

          <p className="mt-6 text-sm font-medium uppercase tracking-[0.15em] text-white/50">
            Visi LACAK
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 5 — TIM PENGEMBANG (Harvard-Style)
          ═══════════════════════════════════════════════ */}
      <section className="about-section bg-[#faf9f6]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          {/* Section heading — editorial style */}
          <div className="mb-14 md:mb-20">
            <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-[#3dbd84]">
              Di Balik Layar
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0d3b2e] md:text-4xl lg:text-5xl">
              Tim Pengembang
            </h2>
          </div>

          {/* Team grid */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {TEAM_MEMBERS.map((member) => (
              <article
                key={member.name}
                className="about-team-card flex flex-col"
              >
                {/* Portrait image — large, 4:5 aspect ratio */}
                <div className="relative mb-6 overflow-hidden rounded-lg bg-gray-200">
                  <div className="aspect-[4/5]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold leading-tight text-[#0d3b2e] md:text-2xl">
                  {member.name}
                </h3>

                {/* Role */}
                <p className="mt-1.5 text-sm font-medium text-[#3dbd84]">
                  {member.role}
                </p>

                {/* Description */}
                <p className="mt-3 flex-grow text-sm leading-[1.75] text-gray-500">
                  {member.description}
                </p>

                {/* CTA — subtle arrow link */}
                <div className="mt-5">
                  <Link
                    href={member.profile}
                    className="group/link inline-flex items-center gap-2 text-sm font-medium text-[#0d3b2e] transition-colors hover:text-[#3dbd84]"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#0d3b2e]/20 transition-all group-hover/link:border-[#3dbd84] group-hover/link:bg-[#3dbd84]/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    Lihat profil
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 6 — PENUTUP / CTA
          ═══════════════════════════════════════════════ */}
      <section className="about-section bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#0d3b2e] md:text-3xl">
            Siap Menemukan Barangmu?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-gray-500">
            Jelajahi platform LACAK dan manfaatkan sistem pelacakan barang yang
            cepat, transparan, dan efisien.
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0d3b2e] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#1a5c44] hover:shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                  clipRule="evenodd"
                />
              </svg>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}