// ─────────────────────────────────────────────
// Shared TypeScript types for the entire app
// ─────────────────────────────────────────────

export type Language = 'en' | 'th';

export type OperationMode = 'return' | 'request' | 'swap';

export type Page = 'mode-selection' | 'return' | 'request' | 'swap' | 'queue' | 'fpc-search' | 'admin';

export type Role = 'admin' | 'store' | 'operator';

export interface UserAccount {
  employeeId: string;
  passwordHash: string;
  role: Role;
}


