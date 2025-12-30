import Image from 'next/image';

export default function Team() {
  return (
    <div className="relative border-b border-[var(--divider)]">
        <div className="container-main relative py-16 md:py-24">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2 md:col-span-2 px-4 flex flex-col justify-center">
                    <h2 className="text-h3 text-[var(--text-primary)] mb-4">
                        The Team
                    </h2>
                    <p className="text-h2 text-[var(--text-primary)] mb-6">
                        Aerospace engineers, computer scientists, and business strategists.
                    </p>
                    <p className="text-body-md text-[var(--text-secondary)] mb-8 max-w-[384px]">
                        Our team combines aerospace engineers who design our modular drone platforms, computer science engineers who built the swarm autonomy, and business strategy from Michigan Ross.
                    </p>
                    <p className="text-body-md text-[var(--text-primary)] font-medium">
                        We are AeroHive.
                    </p>
                </div>
                <div className="col-span-2 md:col-span-2 px-4 mt-8 md:mt-0 relative w-full">
                    <div className="relative w-full h-auto">
                        <Image 
                            src="/images/image.png" 
                            alt="AeroHive Team" 
                            width={800}
                            height={600}
                            className="w-full h-auto object-contain rounded-lg"
                            style={{ maxHeight: '600px' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

