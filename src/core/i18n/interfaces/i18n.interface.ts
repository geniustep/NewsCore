// i18n System Interfaces

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag?: string;
  isActive: boolean;
  isDefault: boolean;
  isFallback: boolean;
  
  // Locale settings
  dateFormat?: string;
  timeFormat?: string;
  timezone?: string;
  numberFormat?: NumberFormat;
  currency?: string;
  
  // SEO
  locale?: string;
  hreflang?: string;
}

export interface NumberFormat {
  decimal: string;
  thousand: string;
  precision?: number;
}

export interface TranslationNamespaceConfig {
  name: string;
  description?: string;
  isSystem: boolean;
  moduleSlug?: string;
  themeSlug?: string;
}

export interface TranslationEntry {
  key: string;
  value: string;
  language: string;
  namespace: string;
  isReviewed?: boolean;
  isAuto?: boolean;
  context?: string;
  pluralForms?: PluralForms;
}

export interface PluralForms {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

export interface TranslationBundle {
  language: string;
  namespace: string;
  translations: Record<string, string | PluralForms>;
}

export interface TranslationImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
}

export interface TranslationExportOptions {
  language?: string;
  namespace?: string;
  format: 'json' | 'csv' | 'po';
  includeMetadata?: boolean;
}

export interface AITranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  context?: string;
}

export interface AITranslationResult {
  translatedText: string;
  confidence: number;
  alternatives?: string[];
}

export interface TranslationStats {
  totalKeys: number;
  translatedKeys: number;
  reviewedKeys: number;
  autoTranslatedKeys: number;
  completionPercentage: number;
}

export interface LanguageStats {
  code: string;
  name: string;
  totalKeys: number;
  translatedKeys: number;
  reviewedKeys: number;
  completionPercentage: number;
}
