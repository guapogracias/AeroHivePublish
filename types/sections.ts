export type SectionType = 'content' | 'component';

export interface CameraConfig {
  position: [number, number, number];  // Camera position offset from layer center
  lookAtOffset: [number, number, number];  // Offset from layer center for lookAt
  distance?: number;  // Distance multiplier from layer
}

export type SectionMedia =
  | {
      type: "video";
      src: string;
      poster?: string;
    }
  | {
      type: "image";
      src: string;
      alt?: string;
    };

export interface BaseSection {
  id: string;
  caption: string;
  title: string;
  content: string;
  type: SectionType;
}

export interface ContentSection extends BaseSection {
  type: 'content';
}

export interface ComponentSection extends BaseSection {
  type: 'component';
  layerName: string;  // Maps to GLB object name
  cameraConfig: CameraConfig;
  media?: SectionMedia;
}

export type Section = ContentSection | ComponentSection;

// Type guard to check if section is a component section
export function isComponentSection(section: Section): section is ComponentSection {
  return section.type === 'component';
}

