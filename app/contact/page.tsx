import Image from "next/image";

type TeamContact = {
  name: string;
  bio: string;
  email: string;
  imageSrc: string;
};

const TEAM_CONTACTS: TeamContact[] = [
  {
    name: "Oscar de Castro",
    bio: "Add a short bio here. Replace this placeholder with role, focus areas, and how to reach out.",
    email: "odcastro@umich.edu",
    imageSrc: "/images/headshots/Oscar.png",
  },
  {
    name: "Jina Patel",
    bio: "Add a short bio here. Replace this placeholder with role, focus areas, and how to reach out.",
    email: "pjina@umich.edu",
    imageSrc: "/images/headshots/Jina.png",
  },
  {
    name: "Sam Hartt",
    bio: "Add a short bio here. Replace this placeholder with role, focus areas, and how to reach out.",
    email: "samhartt@umich.edu",
    imageSrc: "/images/headshots/Sam.png",
  },
];

export default function ContactPage() {
  return (
    <main className="flex flex-col min-h-[calc(100vh-64px)] bg-[var(--bg-black)]">
      {/* Main Contact Section */}
      <section className="relative flex-1 flex items-center border-b border-[var(--divider)]">
        <div className="container-main relative w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 md:py-8">
            {/* Contact section - Mobile: full width, Desktop: spans columns 1-2 */}
            <div className="col-span-2 md:col-span-2 px-4">
              <h1 className="text-[40px] leading-[48px] tracking-[-1.8px] md:text-[48px] md:leading-[56px] md:tracking-[-2.2px] font-medium text-[var(--text-primary)] mb-3">
                Contact Us
              </h1>

              {/* Team description (replaces placeholder email block) */}
              <div className="mt-6">
                <p className="text-h2 text-[var(--text-primary)] mb-4">
                  Aerospace engineers, computer scientists, and business strategists.
                </p>
                <p className="text-body-md text-[var(--text-secondary)] mb-5 max-w-[420px]">
                  Our team combines aerospace engineers who design our modular drone platforms, computer
                  science engineers who built the swarm autonomy, and business strategy from Michigan Ross.
                </p>
                <p className="text-body-md text-[var(--text-primary)] font-medium">
                  We are AeroHive.
                </p>

                {/* Team photo removed */}
              </div>
            </div>

            {/* Right side - Desktop: spans columns 3-4 */}
            <div className="col-span-2 md:col-span-2 px-4 mt-8 md:mt-0">
              <h2 className="text-h2 text-[var(--text-primary)] mb-4">
                Meet the team
              </h2>

              <div className="flex flex-col gap-3">
                {TEAM_CONTACTS.map((person) => (
                  <div
                    key={person.email}
                    className="w-full rounded-xl border border-[var(--divider)] bg-white/5 overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Image (left) */}
                      <div className="relative w-full sm:w-[132px] h-[160px] sm:h-auto shrink-0">
                        <Image
                          src={person.imageSrc}
                          alt={person.name}
                          fill
                          sizes="(min-width: 640px) 132px, 100vw"
                          className="object-cover"
                          priority={false}
                        />
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5 flex flex-col gap-2">
                        <div className="text-[20px] leading-[28px] font-medium text-[var(--text-primary)]">
                          {person.name}
                        </div>

                        <div className="text-body-sm text-[var(--text-secondary)]">
                          {person.bio}
                        </div>

                        <div className="pt-1">
                          <a
                            href={`mailto:${person.email}`}
                            className="text-body-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                          >
                            {person.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

