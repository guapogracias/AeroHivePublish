"use client";

import { useMemo, useState } from "react";

type DemoFormState = {
  name: string;
  email: string;
  phone: string;
  description: string;
};

const DEFAULT_STATE: DemoFormState = {
  name: "",
  email: "",
  phone: "",
  description: "",
};

function buildMailto(state: DemoFormState) {
  const to = "contact@example.com"; // TODO: replace with your preferred inbox
  const subject = `AeroHive demo request — ${state.name || "New lead"}`;
  const body = [
    `Name: ${state.name}`,
    `Email: ${state.email}`,
    `Phone: ${state.phone}`,
    "",
    "What they're looking for:",
    state.description,
  ].join("\n");

  const params = new URLSearchParams({
    subject,
    body,
  });

  return `mailto:${to}?${params.toString()}`;
}

export default function DemoPage() {
  const [state, setState] = useState<DemoFormState>(DEFAULT_STATE);
  const [submitted, setSubmitted] = useState(false);

  const mailtoHref = useMemo(() => buildMailto(state), [state]);

  const onChange =
    (key: keyof DemoFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSubmitted(false);
      setState((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[var(--bg-black)]">
      <section className="container-main py-10 md:py-14">
        <div className="max-w-[720px] mx-auto px-4">
          <h1 className="text-h1 text-[var(--text-primary)]">Get a Demo</h1>
          <p className="text-body-lg text-[var(--text-secondary)] mt-3">
            Tell us a bit about what you’re looking for, and we’ll reach out to schedule a demo.
          </p>

          <div className="mt-10 rounded-2xl border border-[var(--divider)] bg-white/5 p-6 md:p-8">
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-h3 text-[var(--text-primary)]">Name</label>
                  <input
                    value={state.name}
                    onChange={onChange("name")}
                    className="w-full rounded-lg border border-[var(--divider)] bg-black/30 px-4 py-3 text-body text-[var(--text-primary)] outline-none focus:border-white/30"
                    placeholder="Your name"
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-h3 text-[var(--text-primary)]">Email</label>
                  <input
                    value={state.email}
                    onChange={onChange("email")}
                    className="w-full rounded-lg border border-[var(--divider)] bg-black/30 px-4 py-3 text-body text-[var(--text-primary)] outline-none focus:border-white/30"
                    placeholder="you@company.com"
                    autoComplete="email"
                    inputMode="email"
                    type="email"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-h3 text-[var(--text-primary)]">Phone</label>
                <input
                  value={state.phone}
                  onChange={onChange("phone")}
                  className="w-full rounded-lg border border-[var(--divider)] bg-black/30 px-4 py-3 text-body text-[var(--text-primary)] outline-none focus:border-white/30"
                  placeholder="+1 (555) 123-4567"
                  autoComplete="tel"
                  inputMode="tel"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-h3 text-[var(--text-primary)]">What do you want to do?</label>
                <textarea
                  value={state.description}
                  onChange={onChange("description")}
                  className="min-h-[140px] w-full resize-none rounded-lg border border-[var(--divider)] bg-black/30 px-4 py-3 text-body text-[var(--text-primary)] outline-none focus:border-white/30"
                  placeholder="Describe your use case, timeline, and what you want to see in the demo."
                  required
                />
              </div>

              <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between pt-2">
                <button type="submit" className="btn-primary font-semibold w-fit">
                  Submit
                </button>

                {submitted ? (
                  <a href={mailtoHref} className="btn-secondary font-semibold w-fit">
                    Send via email
                  </a>
                ) : (
                  <div />
                )}
              </div>

              {submitted ? (
                <div className="mt-2 rounded-lg border border-[var(--divider)] bg-black/30 p-4">
                  <div className="text-body-sm text-[var(--text-muted)]">
                    This site doesn’t have a backend form handler yet. Click “Send via email” to send a
                    pre-filled message.
                  </div>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}


