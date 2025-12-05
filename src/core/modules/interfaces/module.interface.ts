// Module System Interfaces

export interface ModuleManifest {
  id: string;
  name: string;
  version: string;
  author?: string;
  authorUrl?: string;
  description?: string;
  icon?: string;
  previewImage?: string;
  
  // Type
  type: ModuleTypeEnum;
  
  // Features provided
  provides: ModuleProvides;
  
  // Requirements
  dependencies?: string[];
  minCoreVersion?: string;
  
  // Configuration
  settings?: ModuleSettingSchema[];
  
  // Hooks
  hooks?: ModuleHook[];
}

export type ModuleTypeEnum = 'CORE' | 'EXTENSION' | 'WIDGET' | 'INTEGRATION';

export interface ModuleProvides {
  routes?: ModuleRoute[];
  adminPages?: ModuleAdminPage[];
  frontendComponents?: ModuleFrontendComponent[];
  permissions?: ModulePermission[];
  widgets?: ModuleWidget[];
}

export interface ModuleRoute {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  handler: string;
  auth?: boolean;
  permissions?: string[];
}

export interface ModuleAdminPage {
  id: string;
  title: string;
  path: string;
  icon?: string;
  component: string;
  parent?: string;
  order?: number;
  permissions?: string[];
}

export interface ModuleFrontendComponent {
  id: string;
  name: string;
  component: string;
  region?: string;
}

export interface ModulePermission {
  name: string;
  displayName: string;
  description?: string;
  module: string;
  action: string;
}

export interface ModuleWidget {
  id: string;
  name: string;
  description?: string;
  component: string;
  defaultSettings?: Record<string, any>;
}

export interface ModuleSettingSchema {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'textarea' | 'password';
  label: string;
  description?: string;
  default?: any;
  required?: boolean;
  options?: { value: string; label: string }[];
  group?: string;
  isSecret?: boolean;
}

export interface ModuleHook {
  name: string;
  handler: string;
  priority?: number;
}

export interface ModuleSettings {
  [key: string]: any;
}

export interface LoadedModule {
  id: string;
  slug: string;
  name: string;
  version: string;
  type: ModuleTypeEnum;
  path: string;
  manifest: ModuleManifest;
  settings: ModuleSettings;
  isEnabled: boolean;
}

export interface ModuleInstallResult {
  success: boolean;
  module?: {
    id: string;
    slug: string;
    name: string;
  };
  error?: string;
}

export interface ModuleValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  missingDependencies?: string[];
}

export interface ModuleHookContext {
  module: string;
  data: any;
  user?: any;
}

export type HookHandler = (context: ModuleHookContext) => Promise<any>;
