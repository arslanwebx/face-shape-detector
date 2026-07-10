# Face Shape Detector

A production-ready Next.js website that estimates a visitor's closest face-shape pattern from a front-facing photograph. The photograph is processed in the browser with MediaPipe Face Landmarker and project-owned proportion logic. It is not uploaded or stored. The website also contains complete guides to the seven common face shapes, manual identification, hairstyles, glasses, comparisons, privacy, and editorial standards.

## Technology

- Next.js 16 App Router with React Server Components
- React 19 and strict TypeScript
- Tailwind CSS 4 plus a small custom design system
- `@mediapipe/tasks-vision` loaded only after the visitor starts analysis
- Browser Canvas APIs for resizing, quality checks, and privacy-safe result cards
- Next.js Metadata API, sitemap, robots, manifest, JSON-LD, and static generation
- Node.js 22.x

No database, user account, paid API, cloud image storage, or required environment variable is used.

## Folder structure

```text
src/
  app/                 Routes, metadata files, global styles, and 404 page
  components/          Detector, navigation, footer, content renderer, and form
  config/site.ts       Central brand, domain, contact, analytics, and ad settings
  content/             Complete page copy, blog articles, and shared face-shape data
  lib/                 Landmark measurement, documented thresholds, and scoring
public/
  faces/               Seven original SVG face-shape illustrations
  images/blog/         Ten optimized 1200 × 675 article images
  og/                  Branded social images
```

## Local installation

Use Node.js 22:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production checks and server:

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

## Change the brand, domain, and contact details

Edit `src/config/site.ts`. The central configuration controls:

- Brand and short brand names
- Final domain and full site URL
- Contact email
- Owner or publisher name
- Logo and default social image paths
- Website description and social profiles
- Search Console verification
- Analytics and AdSense IDs
- Analytics and advertising enabled states

Before launch, replace the temporary brand/domain/contact/publisher values. Do not enable analytics or advertising until the correct IDs, consent behaviour, and policies are ready.

To replace the logo, add the new asset under `public/`, keep explicit dimensions, and update `logoPath`. Replace the matching branding in `public/og/` social images as well.

## Edit content or add a future article

Core inner-page content is in `src/content/pages.ts`, and the six expanded blog additions are in `src/content/newArticles.ts`. Shared face-shape card data is in `src/content/shared.ts`. Each content entry contains a canonical path, unique title and description, fixed dates, sections, FAQs, and related links.

For a future blog post:

1. Add one complete `ContentPage` entry to `src/content/pages.ts` or the dedicated article module.
2. Use a unique path under `/blog/` and a distinct search intent.
3. Add meaningful internal links from the blog page and relevant guides.
4. Add or select an original Open Graph image.
5. Set a real publication date and change the modified date only after a meaningful revision.
6. Run lint, type checking, and the production build.

The catch-all App Router page statically generates registered content entries, and the sitemap reads the same source.

## Detector and privacy architecture

1. The visitor selects a JPEG, PNG, or WebP file no larger than 8 MB.
2. The browser creates a temporary object URL for preview. It is released when the image is removed or replaced.
3. The image is decoded and resized in a browser-created canvas. No upload request is made.
4. Brightness and severe blur are checked locally.
5. MediaPipe Face Landmarker is dynamically imported after Analyze is selected. Runtime and model assets load from the official-compatible public paths configured in `Detector.tsx`.
6. Landmarks are checked for face count, face size, approximate front-facing pose, and severe head tilt.
7. Project-owned logic in `src/lib/classifier.ts` compares dimensionless visible proportion proxies with documented reference patterns. MediaPipe does not classify face shape.
8. Only in-memory scores and explanations are shown. The photo, landmarks, and measurements are not sent to analytics, placed in a URL, saved to storage, or used for training by this website.
9. The downloadable card contains only the brand, estimate, and scores. It never includes the selected photograph.

The current implementation downloads MediaPipe runtime and model assets after analysis begins. The visitor's browser therefore needs network access on first use. For tighter supply-chain control, the owner may download the official compatible WASM and model assets into `public/models/`, update the two paths in `Detector.tsx`, and verify the model licence and update process.

## Contact form

The default contact form validates fields and opens the visitor's email application with a `mailto:` link. It does not claim that a message was delivered. To connect a provider later, add a server-side route or provider endpoint, keep credentials in server-only environment variables, update the form behaviour and privacy policy, and test both success and failure states. Never expose a secret in `NEXT_PUBLIC_*` code.

## Analytics

Analytics are disabled in `src/config/site.ts`. Before enabling analytics:

1. Add the correct analytics ID.
2. Implement the provider script with the appropriate consent state for the launch jurisdictions.
3. Confirm no photo, filename, landmark, facial measurement, or detector result is sent.
4. Update the privacy and cookie policies with the provider and retention details.
5. Set `analyticsEnabled` to `true` only after testing.

## AdSense after approval

The reusable `AdUnit` returns nothing while advertising is disabled or no publisher ID exists. After actual approval:

1. Add the valid publisher ID in `src/config/site.ts`.
2. Add the official AdSense loader through the root layout.
3. Implement consent where required.
4. Confirm ads are labelled `Advertisement` and remain away from the uploader, Analyze button, active photo, and analysis state.
5. Update privacy and cookie disclosures.
6. Set `advertisingEnabled` to `true`.

Do not claim approval or add a made-up publisher ID.

## GitHub upload

1. Download `face-shape-detector.zip`.
2. Extract the ZIP.
3. Open the GitHub repository.
4. Upload the project files to the repository root.
5. Confirm `package.json` appears at the root.
6. Do not upload `node_modules`, `.next`, or `.env`.
7. Commit the files to the `main` branch.

## Hostinger deployment

1. Open the GitHub import screen in Hostinger.
2. Refresh the repository list.
3. Select the face-shape-detector repository.
4. Click Deploy.
5. Select the `main` branch.
6. Select Node.js `22.x`.
7. Use `npm install`.
8. Use `npm run build`.
9. Use `npm start`.
10. Confirm the root directory is `/`.
11. Deploy to a temporary domain.
12. Test every page and the detector.
13. Connect the final domain.
14. Enable HTTPS.
15. Update the site URL in `src/config/site.ts`.
16. Push the update to GitHub.
17. Redeploy the application.

## Future update workflow

1. Make a focused content or code change.
2. Update a page's modified date only if its visible content changed meaningfully.
3. Run `npm run lint`, `npm run typecheck`, and `npm run build`.
4. Test the detector with permitted test images at desktop and mobile sizes.
5. Check the privacy promise in browser network tools after any detector change.
6. Commit and push to `main`.
7. Confirm the Hostinger deployment and sample canonical URLs.

## Launch review

The legal and policy pages are complete working drafts, not jurisdiction-specific legal advice. The owner must review them for the laws, privacy rules, cookie-consent requirements, advertising requirements, and business details that apply in the owner's and visitors' jurisdictions before launch. The owner should also complete the human editorial review described on the Editorial and Corrections Policy page.
