import CoverageHero from '@/components/CoverageHero';
import CoverageBlock from '@/components/CoverageBlock';

const coverageBlocks = [
  {
    caption: "Use Case 01",
    title: "Precision Agriculture",
    content: "Optimize crop yields and reduce resource waste with high-resolution multispectral imaging. Identify stress, pests, and nutrient deficiencies before they impact your bottom line.",
    imageSrc: "/images/image.png", // Using placeholder
    imageAlt: "Drone surveying agricultural field"
  },
  {
    caption: "Use Case 02",
    title: "Forestry Management",
    content: "Conduct rapid biomass estimation and disease tracking across vast forest lands. Our autonomous swarms map thousands of acres to monitor health and growth metrics.",
    imageSrc: "/images/image.png",
    imageAlt: "Forest canopy from above"
  },
  {
    caption: "Use Case 03",
    title: "Infrastructure Inspection",
    content: "Safely inspect bridges, towers, and pipelines with centimeter-level precision. Detect structural anomalies and corrosion without risking human lives or shutting down operations.",
    imageSrc: "/images/image.png",
    imageAlt: "Bridge inspection visualization"
  },
  {
    caption: "Use Case 04",
    title: "Renewable Energy",
    content: "Maximize energy output by identifying defective solar panels and inspecting wind turbine blades. Automated thermal analysis pinpoints inefficiencies instantly.",
    imageSrc: "/images/image.png",
    imageAlt: "Solar farm inspection"
  },
  {
    caption: "Use Case 05",
    title: "Construction Monitoring",
    content: "Track progress against digital twins in real-time. Calculate volumetric stockpiles and ensure site safety with daily automated flyovers.",
    imageSrc: "/images/image.png",
    imageAlt: "Construction site 3D model"
  },
  {
    caption: "Use Case 06",
    title: "Disaster Response",
    content: "Deploy immediately after natural disasters to assess damage and identify safe routes. Provide first responders with critical situational awareness when seconds count.",
    imageSrc: "/images/image.png",
    imageAlt: "Flood assessment map"
  },
  {
    caption: "Use Case 07",
    title: "Insurance Verification",
    content: "Accelerate claims processing with irrefutable aerial evidence. Document property conditions before and after events to reduce fraud and speed up settlements.",
    imageSrc: "/images/image.png",
    imageAlt: "Roof inspection data"
  },
  {
    caption: "Use Case 08",
    title: "Environmental Monitoring",
    content: "Track erosion, water quality, and habitat changes over time. Our repeatable flight paths ensure consistent data for long-term ecological studies.",
    imageSrc: "/images/image.png",
    imageAlt: "Coastline erosion monitoring"
  },
  {
    caption: "Use Case 09",
    title: "Mining & Aggregates",
    content: "Automate inventory management with precise volumetric calculations of stockpiles. Monitor pit stability and haul road conditions to maintain operational efficiency.",
    imageSrc: "/images/image.png",
    imageAlt: "Open pit mine survey"
  },
  {
    caption: "Use Case 10",
    title: "Security & Surveillance",
    content: "Maintain persistent perimeter security for sensitive facilities. Autonomous patrols and rapid response capabilities detect and track unauthorized activity.",
    imageSrc: "/images/image.png",
    imageAlt: "Perimeter security drone view"
  }
];

export default function CoveragePage() {
  return (
    <main className="flex flex-col min-h-screen bg-[var(--bg-black)]">
      <CoverageHero />
      
      {coverageBlocks.map((block, index) => (
        <CoverageBlock
          key={index}
          caption={block.caption}
          title={block.title}
          content={block.content}
          imageSrc={block.imageSrc}
          imageAlt={block.imageAlt}
          reversed={index % 2 !== 0} // Alternate layout
        />
      ))}
    </main>
  );
}
