# Webtoon AI Lab V3

Vercel/Next.js production workflow.

## Added
- Multi-episode selector and new episode/CUT creation
- Project + Story Bible working pages
- Generated result save/hold/approve system (IndexedDB)
- Production board with statuses and thumbnails
- Assemble page for approved cuts + long image export
- STRICT MASTER LOCK with stronger character/background/prop identity constraints
- OpenAI image generation through server-side API

Environment variable: `OPENAI_API_KEY`


## V6 updates
- EPISODE STORY screen: per-episode story brief, GPT draft generation, save/approve flow.
- Approved episode story -> automatic SCENE/CUT production specification generation.
- Global Story Bible is applied to story/spec planning for every episode.
- Generate CUT now receives the current episode story as continuity context.
- STRICT COMPOSITION LOCK added: literal pose/action/blocking/camera enforcement.
- BACKGROUND MASTER is treated as the same physical set; geometry and furniture positions are locked.
- Image generation no longer sends the entire lore bible as undifferentiated context; only visual/character canon + current episode context are used at render time to reduce irrelevant poses and location drift.


## V7 — Dual MASTER workflow
- Existing imported images are treated as SOURCE MASTER assets.
- Each SOURCE MASTER can be converted to a WEBTOON PRODUCTION MASTER through OpenAI image generation.
- Conversion locks identity/geometry/pose/composition and changes only the rendering language.
- Background conversion locks architecture, door/window/furniture positions and perspective.
- Character conversion locks identity, age, hair, proportions, costume, pose and framing.
- CUT automatic MASTER linking prioritizes approved WEBTOON PRODUCTION MASTER assets over SOURCE MASTER assets.


## V8 — Scene Visual Lock
- Each SCENE stores one locked visual profile: time, weather, color temperature, palette, lighting and background/set continuity.
- All CUT image requests inherit the same Scene Look Profile.
- The nearest previous APPROVED CUT from the same SCENE is automatically attached as a continuity reference for grade, white balance, lighting, skin tone, costume colors and background exposure only.
- Previous CUT pose/camera/action are explicitly forbidden from overriding the current CUT specification.
- Scene Look can be edited from each SCENE header or CUT inspector.

## V9 — V2 Story Directing Production Spec
- EP.01 124 CUT production data now exposes V2 STORY / ACTING fields in the CUT inspector.
- CUT generation sends storyBeat, previousContext, character knowledge state, intention, primary/secondary emotion, intensity, facial acting, body acting, gaze target, avoid acting, and next beat to the image orchestrator.
- Story/acting is higher priority than action, Scene Look, MASTER identity, and general lore context.
- SCENE V2 directing provides purpose, emotion arc, and locked look values. Important recurring scenes use explicit Notion V2 look values.
- Future episode SCENE/CUT auto-generation now requests the same V2 schema, so EP.02+ uses the same directing system automatically.
