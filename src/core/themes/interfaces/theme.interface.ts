// Theme System Interfaces

export interface ThemeManifest {
  id: string;
  name: string;
  version: string;
  author?: string;
  authorUrl?: string;
  description?: string;
  previewImage?: string;
  screenshots?: string[];
  
  // Features
  features: ThemeFeature[];
  templates: ThemeTemplate[];
  regions: ThemeRegion[];
  
  // Customization
  customizer?: ThemeCustomizerSchema;
  
  // Requirements
  minCoreVersion?: string;
  requiredModules?: string[];
}

export type ThemeFeature = 
  | 'articles'
  | 'pages'
  | 'categories'
  | 'tags'
  | 'menus'
  | 'widgets'
  | 'breaking-news'
  | 'search'
  | 'comments'
  | 'newsletter'
  | 'dark-mode'
  | 'rtl';

export interface ThemeTemplate {
  id: string;
  name: string;
  description?: string;
  file: string;
  type: 'home' | 'article' | 'category' | 'tag' | 'page' | 'search' | 'error' | 'archive';
  isDefault?: boolean;
}

export interface ThemeRegion {
  id: string;
  name: string;
  description?: string;
  type: 'header' | 'footer' | 'sidebar' | 'content' | 'widget-area';
  maxWidgets?: number;
}

export interface ThemeCustomizerSchema {
  sections: ThemeCustomizerSection[];
}

export interface ThemeCustomizerSection {
  id: string;
  title: string;
  description?: string;
  fields: ThemeCustomizerField[];
}

export interface ThemeCustomizerField {
  id: string;
  type: 'color' | 'font' | 'number' | 'text' | 'textarea' | 'image' | 'select' | 'toggle' | 'range';
  label: string;
  description?: string;
  default?: any;
  options?: { value: string; label: string }[]; // For select type
  min?: number; // For number/range
  max?: number; // For number/range
  step?: number; // For range
}

export interface ThemeSettings {
  [key: string]: any;
}

export interface ActiveTheme {
  id: string;
  slug: string;
  name: string;
  version: string;
  path: string;
  manifest: ThemeManifest;
  settings: ThemeSettings;
}

export interface ThemeInstallResult {
  success: boolean;
  theme?: {
    id: string;
    slug: string;
    name: string;
  };
  error?: string;
}

export interface ThemeValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
