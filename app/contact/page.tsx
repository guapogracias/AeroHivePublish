import Image from "next/image";
import Team from "@/components/Team";

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 md:py-12">
            {/* Contact section - Mobile: full width, Desktop: spans columns 1-2 */}
            <div className="col-span-2 md:col-span-2 px-4">
              <h1 className="text-h1 text-[var(--text-primary)] mb-4">
                Contact Us
              </h1>
              <p className="text-body-lg text-[var(--text-secondary)] mb-6 max-w-[480px]">
                Get in touch with our team to schedule a demo or learn more about our solutions.
              </p>

              {/* Contact Information */}
              {/* 
                TO ADD YOUR CONTACT DETAILS:
                1. Replace the placeholder email below with your actual email address
                2. Add or remove contact methods as needed (phone, address, etc.)
                3. Update the href attributes to use mailto:, tel:, or external links
                4. You can add more contact items by copying the structure below
              */}
              <div className="space-y-4">
                {/* Email - Replace with your email */}
                <div>
                  <h3 className="text-h3 text-[var(--text-primary)] mb-1">
                    Email
                  </h3>
                  <a
                    href="mailto:contact@example.com"
                    className="text-body-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {/* Replace 'contact@example.com' with your actual email */}
                    contact@example.com
                  </a>
                </div>

                {/* Phone - Uncomment and add your phone number */}
                {/* 
                <div>
                  <h3 className="text-h3 text-[var(--text-primary)] mb-1">
                    Phone
                  </h3>
                  <a
                    href="tel:+1234567890"
                    className="text-body-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    +1 (234) 567-8900
                  </a>
                </div>
                */}

                {/* Address - Uncomment and add your address */}
                {/* 
                <div>
                  <h3 className="text-h3 text-[var(--text-primary)] mb-1">
                    Address
                  </h3>
                  <p className="text-body-md text-[var(--text-secondary)]">
                    123 Main Street<br />
                    City, State 12345<br />
                    Country
                  </p>
                </div>
                */}

                {/* Social Links - Uncomment and add your social media links */}
                {/* 
                <div>
                  <h3 className="text-h3 text-[var(--text-primary)] mb-1">
                    Follow Us
                  </h3>
                  <div className="flex gap-4">
                    <a
                      href="https://linkedin.com/company/yourcompany"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="https://twitter.com/yourcompany"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      Twitter
                    </a>
                  </div>
                </div>
                */}
              </div>
            </div>

            {/* Right side - Desktop: spans columns 3-4 */}
            <div className="col-span-2 md:col-span-2 px-4 mt-8 md:mt-0">
              <h2 className="text-h2 text-[var(--text-primary)] mb-4">
                Meet the team
              </h2>

              <div className="flex flex-col gap-4">
                {TEAM_CONTACTS.map((person) => (
                  <div
                    key={person.email}
                    className="w-full rounded-xl border border-[var(--divider)] bg-white/5 overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Image (left) */}
                      <div className="relative w-full sm:w-[160px] h-[180px] sm:h-auto shrink-0">
                        <Image
                          src={person.imageSrc}
                          alt={person.name}
                          fill
                          sizes="(min-width: 640px) 160px, 100vw"
                          className="object-cover"
                          priority={false}
                        />
                      </div>

                      {/* Content */}
                      <div className="p-5 sm:p-6 flex flex-col gap-3">
                        <div className="text-h2 text-[var(--text-primary)]">
                          {person.name}
                        </div>

                        <div className="text-body text-[var(--text-secondary)]">
                          {person.bio}
                        </div>

                        <div className="pt-1">
                          <a
                            href={`mailto:${person.email}`}
                            className="text-body-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
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

      {/* Team Section (moved from Overview) */}
      <Team />
    </main>
  );
}

