# Product

## Register

product

## Users
* **Operators (Shift Workers)**: Work on the cleanroom factory floor. They use touch screen tablets or terminal monitors to load, unload, swap, and change (UNLOAD & LOAD) FPCs. They often wear gloves, work under bright fluorescent lights, and require quick, unambiguous status updates with large, easy-to-tap interactive elements.
* **Store Personnel (Support)**: Provide backend support for production, handling process data updates, and resolving FPC mismatches and manual location overrides.
* **Admins (Managers)**: Manage user roles, passwords, view comprehensive audit logs, and approve exception operations.

## Product Purpose
The NXP WT FPC Management System is an operator user interface designed for requesting, returning, swapping, and changing (UNLOAD & LOAD) Front Opening Pod Carriers (FPCs) between Smart Storage and factory workstations/machines via Automated Guided Vehicles (AGVs). It serves to coordinate automated transport workflows, trace carrier locations, minimize manual errors, and provide real-time task status telemetry to ensure manufacturing safety and efficiency.

## Brand Personality
* **Keywords**: Precise, Industrial, High-Reliability, Cleanroom, Safety-Critical.
* **Voice & Tone**: Calm, expert, highly functional, and authoritative. It behaves like a professional control console that values utility and speed over visual decoration.

## Anti-references
* **SaaS Cream/Sand/Paper styling**: Warm beige/off-white templates that feel relaxed and lifestyle-oriented.
* **Low-Contrast Elements**: Muted gray text on colored backgrounds, soft shadows, or low-contrast borders.
* **Small touch targets**: Tiny buttons, inputs, and tabs that are difficult to press.
* **AI Tropes**: Floating orbs, sparkle icons, gradient borders, and decorative purple-to-blue gradients.
* **Emoji inside critical labels**: Emojis in primary headings, navigation labels, or primary actions.
* **Inspirational imagery**: Stock cleanroom photos or generic corporate graphics.

## Design Principles
1. **Safety First through Action Control**: The interface must physically and visually separate screen commands from real-world physical confirmations (e.g. cover head confirmation is physical-only on the AGV; no screen bypass buttons).
2. **Gloved Touch-First Layouts**: Every clickable area must accommodate cleanroom operators wearing gloves, ensuring high spacing and touch target clearance.
3. **No Decorative Ambiguity**: Every visual state, status color, or transition must serve a direct information-delivery purpose. Statuses are never conveyed by color alone.
4. **Restrained Semantic Accents**: Use clean, neutral surfaces (white/zinc) punctuated only by strict semantic indicators for active, warning, action, error, and success states.

## Accessibility & Inclusion
* **WCAG AA Compliance**: Ensure a minimum contrast ratio of 4.5:1 for all primary body text, and 3:1 for large display elements.
* **Multilingual First**: Core language is Thai, with secondary English for common shop-floor technical terms. Text layout must accommodate longer Thai word structures without clipping or wrapping inappropriately.
* **No Motion-Gated States**: Transitions during physical AGV execution moments must be disabled or simplified (`@media (prefers-reduced-motion: reduce)`) to prevent operator distraction.
