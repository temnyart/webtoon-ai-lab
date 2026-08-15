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

## V11 — LETTERING EDITOR V2
- Balloon presets: basic, vertical, shout, thought, whisper, tremble, narration, borderless monologue, caption.
- SFX presets: IMPACT, HEAVY, SLASH, SPEED, RUMBLE, SMALL, HORROR.
- Automatic preset selection from dialogue/SFX text and CUT emotion context.
- Manual controls for position, size, rotation, weight, tracking, line height, font and tail direction metadata.
- Separate Add Balloon / Add SFX actions.
- Per-CUT scroll gap editing in ASSEMBLE and variable-gap final PNG export.
- Original generated art remains text-free; lettering stays editable until export.

## V12 — Final Platform Export
- Long PNG export from approved CUTs + lettering + scroll gaps.
- NAVER 690px preset, editable KAKAO 720px working preset, archive/custom presets.
- Automatic vertical slicing with configurable width/height.
- JPG/PNG output and JPEG quality control.
- Automatic 001/002/... file numbering and filename prefix.
- One-click ZIP batch export implemented client-side without external ZIP dependency.
- Export settings persist in localStorage.

## V13 — ASSEMBLE 고도화
- 승인 CUT의 ASSEMBLE 순서를 HTML Drag & Drop으로 변경
- CUT별 확대/축소 25–160%
- CUT별 상단/하단 크롭
- 어셈블 전용 CUT 삭제 및 복제
- CUT 뒤 여백을 개별 px 단위로 조절
- 흰 여백 / 검은 여백 선택
- SCENE 전환용 500px 긴 여백 프리셋
- 전체 세로 스크롤 미리보기
- 위 편집 결과가 긴 PNG 및 플랫폼 자동 분할/ZIP Export에 그대로 반영
- 레이아웃 상태는 화별로 localStorage에 저장


## V14 — CUT Partial Edit / Regeneration
- Approved/generated CUTs can open a Partial Edit workflow.
- Modes: expression only, hands only, pose, background, camera, MASTER-difference repair.
- Existing CUT is always the primary image reference; registered MASTER images are continuity references.
- Story/Acting V2 and SCENE LOOK are sent to partial editing so expression/pose corrections respect narrative context.
- Before/After side-by-side comparison.
- Accepting a partial edit replaces the production result while keeping up to 5 prior images in editHistory.
- "MASTER difference only" mode repairs identity/costume/prop/set drift without intentionally changing action, emotion, camera or look.


## V15 — Continuity Auto QC
- Per-CUT automatic continuity inspection and whole-episode sequential QC.
- Compares current CUT with nearby approved CUTs in the same SCENE plus required MASTER assets.
- Checks six categories: color temperature/lighting, character face+hair identity, wardrobe, background structure, prop continuity, injury/blood/torn-clothes state.
- Marks affected CUTs with `⚠ CONTINUITY` in CUT Inspector and Production board.
- Stores a structured QC report locally per episode/CUT.
- Report provides category-level explanation and suggested fix.
- From a failed report, user can jump directly to V14 `MASTER 차이 수정`.
- Camera/pose/expression differences are explicitly not treated as errors when they are intentional by CUT spec.


## V16 — Character State Tracker
- Tracks per-character state at the end of every CUT: condition, injury, blood/dirt, clothing, equipment, hair, persistent body state, emotion residue, and location.
- Previous CUT state automatically carries forward unless the current story beat clearly changes it.
- Manual state editing is available from each CUT inspector.
- Automatic state analysis uses previous state + current CUT V2 Story/Acting + action/dialogue.
- Episode-wide sequential state analysis and timeline viewer.
- Character State is injected into Generate CUT, Partial Edit, and Continuity QC.
- Continuity QC treats mismatched injury/blood/clothing/equipment states as explicit continuity errors.
- Designed for long-running chains such as `normal → torn clothes → left-arm injury → blood → bandage → healed`.


## V17 — Background SPACE MAP / CAMERA System
- BACKGROUND MASTER can store a persistent top-down SPACE MAP.
- Spatial anchors use normalized x/y coordinates (0–100): doors, windows, beds, desks, furniture, props, movement paths.
- AI Space Analysis can derive an initial map from a background MASTER; user can edit anchors manually.
- Each CUT can store a CAMERA PLAN: map-side position, facing direction, camera height, lens, target and 180° axis note.
- SPACE MAP + CAMERA PLAN are injected into Generate CUT, Partial Edit and Continuity QC.
- Fixed architecture/furniture is explicitly forbidden from teleporting or swapping walls just because the camera angle changes.
- Continuity QC now treats spatial contradictions as `background_structure` issues.
- The system is designed so a room can remain the same physical set even across reverse angles, wide shots and close-ups.


## V18 — Automatic Storyboard / CONTE
- New `CONTE` production stage between CUT V2 specs and final image generation.
- Workflow: Episode Story → CUT V2 production specs → rough storyboard → review/approve → final image.
- Generates low-detail monochrome storyboard frames focused on framing, camera, staging, screen direction and blocking.
- Individual CUT generation/regeneration and episode-wide sequential generation.
- Review modal shows storyboard next to SHOT / CAMERA / ACTION / STORY BEAT / BODY / GAZE.
- Director review note can be saved and used for regeneration.
- Approved storyboard is automatically passed into `Generate CUT` as a **composition-only reference**.
- Final renderer must match approved storyboard camera/framing/blocking while retaining WEBTOON MASTER identity, Scene Look and final webtoon style.
- Storyboard images are stored in IndexedDB; lightweight approval/note metadata is stored in localStorage.
- Final image generation still prohibits embedded dialogue/SFX text; lettering remains a later ASSEMBLE stage.


## V19 — Episode Manager
- New `EPISODES` dashboard for multi-episode production management.
- Tracks seven stages per episode: Story, Production Specs, CONTE, Final Images, Lettering, Assemble, Final Output.
- Overall episode progress is calculated from those seven stages.
- Story / specs / storyboard / final-image progress are derived automatically from existing production data.
- Lettering completion is tracked per approved CUT with a new `레터링 완료` control inside Lettering Editor.
- Assemble completion can be explicitly marked per episode.
- Successful Long PNG or platform export automatically marks Final Output complete.
- Episode card shows total CUTs, approved-image count, stage percentages and overall progress.
- Episode duplication copies story + CUT production specs + Scene Look + Camera Plan as a planning template, but intentionally does not copy generated images, approvals, lettering or final output state.
- Episode title can be renamed from the manager.
- Stage Control modal allows manual Assemble/Output completion override.


## V20 — MASTER LIBRARY Advanced
- Master taxonomy expanded into: Character Identity, Costume, Expression, Hair, Weapon, Prop, Background, and Time-of-Day Look.
- Existing CHARACTER / BACKGROUND / PROP API compatibility is preserved via `subtype` metadata.
- Filter/search toolbar by taxonomy and SOURCE/PRODUCTION role.
- Automatic usage tracing scans every episode production spec and shows appearance count by episode / SCENE / CUT.
- Master detail modal exposes name, subtype, version note, time-of-day/look, scene-match hint, notes, and full usage list.
- Master version groups support v1/v2/v3… without deleting previous references.
- `새 버전 등록` creates a new SOURCE revision in the same version group.
- One PRIMARY master can be designated per version group; PRIMARY gets extra priority in automatic CUT master matching.
- Webtoon Production Master conversions inherit taxonomy/time-look metadata and join the same version group.
- Approved Production conversions automatically become PRIMARY.
- Background TIME_LOOK records can describe dawn/day/sunset/night variants while keeping the same background identity.
- Existing SPACE MAP remains available from background master cards/details.


## V21 — Cost / API Usage Manager
- New `COST` dashboard for API call count, success/failure rate, estimated spend, episode cost, and CUT-level regeneration analysis.
- Every major `/api/` production call is logged locally: Episode Story, Episode Specs, Storyboard, Final CUT, Partial Edit, Continuity QC, Character State, Space Map analysis, and Master Transform.
- Per-CUT table shows final-generation attempts, partial-edit attempts, storyboard attempts, failures, estimated cost, and how many successful image attempts occurred before the accepted result.
- High-regeneration CUTs are surfaced near the top of the CUT cost table.
- Per-episode dashboard shows total calls, failures, approved images, and estimated spend.
- Episode projection estimates remaining image-production cost from the observed approved-CUT production average.
- Editable cost settings support USD→KRW rate and per-operation estimated cost.
- Important: estimated cost is not OpenAI billing data. It is the configured per-call estimate multiplied by tracked calls.
- CSV export for API usage log.
- Usage log can be cleared independently without deleting project images or production data.
- Up to 5,000 recent API events are stored in localStorage to avoid unlimited growth.


## V22 — Project Backup / Restore
- New `BACKUP` page.
- One-click `PROJECT BACKUP.zip` exports the complete browser-side project.
- Full backup includes all `wtal_*` localStorage data:
  - Project / Story Bible
  - Episodes / CUT production specs
  - MASTER Library and MASTER images
  - Scene Look / Space Map / Camera plans
  - Character State / Continuity reports
  - Lettering / Assemble / Export progress
  - API Cost logs / Episode progress
- Full backup also exports every `wtal_db/results` IndexedDB record:
  - generated/approved CUT images
  - partial-edit revision history
  - approved/generated CONTE storyboard images
- Backup ZIP contains `manifest.json`, `data/local-storage.json`, `data/indexeddb-results.json`, and a README.
- Restore validates the backup format/version before allowing replacement.
- Restore clears current `wtal_*` localStorage data and IndexedDB results, writes the backup snapshot, then reloads the app.
- `설정/명세만 백업` option creates a lightweight archive without IndexedDB images.
- Last backup / restore timestamps and approximate backup file size are shown in the UI.
- Backup ZIP parser supports the STORE-format ZIP created by Webtoon AI Lab itself.


## V23 — SCENE Automatic Production Pipeline
- New `PIPELINE` page groups the current episode by SCENE.
- Per-SCENE preflight checks required MASTER assets and prompt availability before API work starts.
- `SCENE 제작 시작` runs:
  1. sequential Character State calculation
  2. generation of missing rough CONTE frames
  3. automatic stop at the human CONTE approval gate
- The pipeline never auto-approves storyboard frames.
- Once every image CUT in the SCENE has an approved storyboard, `FINAL → QC 실행` runs:
  1. final CUT generation using approved CONTE as composition lock
  2. immediate Continuity QC for each generated/approved CUT
- Pipeline QC can use previously generated cuts in the same scene as temporary continuity references, so QC works before final human image approval.
- Final generated images are deliberately NOT auto-approved. Human review remains required in PRODUCTION.
- Non-image/editing-only CUTs are skipped automatically.
- Scene cards show State / CONTE / Final / QC progress, missing MASTER preflight, continuity issue count, current pipeline status, and execution log.
- Pipeline state/logs persist in localStorage (`wtal_scene_pipeline`).
- API work still passes through V21 trackedFetch, so storyboard/final/QC costs appear in COST.


## V24 — Continuity Auto Repair Loop
- Adds the requested automatic loop: `Continuity FAIL → targeted partial edit → Continuity re-check`.
- New `continuity` partial-edit mode repairs only categories explicitly flagged by QC.
- Auto Repair supports: Scene Look/color temperature, character identity/hair, wardrobe, background structure, prop continuity, and injury/blood/clothing-damage state.
- Each candidate is temporarily applied and immediately re-checked.
- A numeric continuity score compares BEFORE vs AFTER.
- Candidate is kept only when the QC score strictly improves.
- Same/worse results are automatically rolled back to the exact previous CUT image and previous QC report.
- Default maximum repair attempts: 2 per CUT; selectable 1–3 in PIPELINE.
- PIPELINE has `AUTO REPAIR ON/OFF`. When ON, FINAL → QC automatically repairs failed CUTs and rechecks them.
- Scene cards also expose `⚡ 문제 자동 수정` for existing flagged CUTs.
- Production cards and Continuity Report expose per-CUT `AUTO FIX`.
- Approved CUTs require confirmation before a manual auto-repair run; pipeline-generated unapproved images can repair automatically.
- Successful repair history is stored in the normal `editHistory` (max 5 images); auto-repair audit events are stored separately in `wtal_auto_repair_history`.
- Partial-edit and re-QC calls continue to flow through V21 COST tracking.


## V25 — Episode Production Control Center
- New `CONTROL` page for real-production monitoring of a full episode.
- One table shows each CUT's MASTER readiness, storyboard approval, final-image state, Continuity QC, lettering completion, current blocker, and the next recommended action.
- Blocker priority is production-aware:
  1. missing MASTER
  2. storyboard not approved
  3. final image not generated
  4. final image waiting for human approval
  5. QC not run
  6. QC issue
  7. lettering incomplete
  8. CUT complete
- `TOP BLOCKERS` groups current bottlenecks and lists affected CUT IDs.
- `SCENE HEALTH` shows completion percentage plus MASTER/QC problems per scene.
- KPI row shows image-CUT count, MASTER blocks, pending CONTE, final-review queue, QC issues, and estimated API cost for the active episode.
- Filters: SCENE, production status, text/CUT search.
- Each row has a context-aware `NEXT ACTION` button that jumps directly to MASTER linking, CONTE review, final generation, result approval, QC, Auto Fix, or Lettering.
- The dashboard is computed from existing production state, so no duplicate progress database is introduced.


## V26 — UI/UX System Redesign
V26 keeps the V25 production engine but reorganizes the product around a quieter, workflow-first interface.

### Navigation
- Reduces the primary sidebar from many developer-level pages to 5 product-level destinations:
  - Home
  - Create
  - Library
  - Episodes
  - Project Settings
- Cost, Backup, Story Bible, Pipeline and other advanced tools remain available contextually inside these hubs instead of competing in the global navigation.

### Create Workspace
- Unified production stage navigation:
  - Story → Conte → Generate → Review → Lettering → Assemble
- Sticky episode/stage bar keeps the active episode and production flow visible.
- Existing production logic is reused rather than duplicated.

### Inspector
- CUT Inspector is reorganized into 4 tabs:
  - Spec
  - Masters
  - State
  - QC
- Long engineering information is progressively disclosed instead of displayed all at once.

### CUT Cards
- Reduced visual noise.
- Primary content is CUT number + title + short action.
- Status is represented as a small semantic dot:
  - gray draft
  - orange review/generated
  - green approved
- Technical metadata remains in the Inspector.

### Home / Control Center
- Control Center becomes the Home experience.
- Prioritizes “Needs your attention” over raw statistics.
- Shows episode readiness, key blockers, scene health, review queues and cost.
- One primary `Continue creating` action.

### Design System
- Neutral image-review environment:
  - background `#F5F5F7`
  - white surfaces
  - `#1D1D1F` primary text
  - restrained borders and shadows
- Unified success / warning / issue / progress colors.
- Reduced uppercase eyebrow usage and excessive badge/button styling.
- New spacing, radius, typography and focus rules.

### Button Hierarchy
- Primary actions use one dark CTA.
- Secondary utilities are de-emphasized.
- Generate Inspector adds a `···` overflow menu for lower-frequency actions.

### Command Search
- `⌘K` / `Ctrl+K`
- Search and jump to:
  - pages
  - episodes
  - CUTs
  - scenes
  - MASTER assets
- Keyboard arrow navigation + Enter + Escape.

### Activity Queue
- Every tracked API operation automatically appears in Activity.
- Shows running / done / failed state for generation, partial edits, storyboard, QC, character state, master conversion, etc.
- Uses existing `trackedFetch`, so it reflects real production calls rather than a mock queue.
- Session-scoped activity history avoids polluting project persistence.

### Compatibility
- Existing V25 production data and browser storage keys remain intact.
- Existing legacy screens are still reachable contextually.
- API routes were not changed by the UI redesign.


## V26.1 — Project Settings UI polish
- Replaces the sparse legacy Project Setup form with a compact content-driven settings page.
- Project Settings now directly edits the actual stored project data; there is no extra "Open Settings" step.
- Groups fields into:
  - 작품 기본 정보
  - 이야기 방향
  - Visual Generation
- Long text areas automatically fit their actual content instead of leaving large blank areas.
- Separates long-form canon documents into a Story Bible shortcut instead of duplicating them in Project Settings.
- Right rail contains Story Bible, Cost/API and Backup utilities.
- Sticky save bar clearly indicates unsaved/saved state.
- Existing `wtal_project` data and all field keys remain fully compatible.


## V27 — UI/UX Final Pass
This pass finishes the remaining legacy surfaces under the V26 design system without changing production data or API behavior.

### Unified design system
- Adds reusable page headers, surface cards, stats, empty/loading/error states, spacing rules and responsive breakpoints.
- Reduces visual noise and normalizes white surfaces / neutral background / semantic status colors.
- Standard modal component with blurred backdrop, sticky close bar, outside-click close and consistent spacing.

### Story Bible
- Redesigned as a clean document workspace.
- Sticky Canon document navigation.
- Larger distraction-free editor.
- Clear source/tags hierarchy.
- Unsaved / saved state instead of intrusive save alerts.
- Mobile navigation becomes horizontally scrollable.

### Episodes
- Simplified episode cards.
- One primary `열기` action; duplicate/rename/stage-management moved into overflow.
- Compact 7-stage progress visualization.
- Cleaner project-level summary.

### Master Library
- Image-first cards with consistent aspect ratio.
- Cleaner search/filter hierarchy.
- Removes the large explanatory notice from the main workflow.
- Improved empty state and responsive grid.

### Cost & API
- Updated page hierarchy and spacing.
- CSV export moved to the page-level action.
- Log reset is visually de-emphasized.
- Tables/settings follow the same neutral card system.

### Backup
- Simplified page hierarchy and typography.
- Refined drop zone, success/warning surfaces and responsive layout.

### Assemble
- Neutral canvas, compact item controls, sticky tool rail.
- Page header aligned to the Create design system.
- Improved no-approved-CUT empty state.

### Modal / Loading / Error
- All `modalShell` flows now share one consistent UI.
- Generation loading and error messages use standard product states.
- Background click closes non-destructive modal overlays.

### Responsive
- Additional breakpoints for Story Bible, Library, Cost, Backup, Assemble and modal surfaces.
- Better tablet/mobile stacking without changing desktop production density.


## V28 — Data Architecture / Migration Foundation
V28 is a structural cleanup release. It keeps existing browser storage names for backward compatibility, but adds an explicit data schema and migration layer before production testing.

### Schema registry
- Adds `WTAL_SCHEMA_VERSION = 28`.
- Adds a registry for core stores grouped by:
  - project
  - episode
  - cut
  - scene
  - master
  - output
  - system
  - legacy
- Every registered JSON store declares its expected top-level type.

### Safe JSON loading
- Core state stores now use `wtalReadJSON()` instead of repeated unguarded JSON parsing.
- Malformed or type-mismatched values fall back safely instead of crashing app initialization.
- Corrupt data is never automatically deleted.

### Migration foundation
- Adds `wtal_data_schema_version`.
- Migrations run once per schema version before application state is initialized.
- Adds persistent `wtal_migration_log`.
- V28 conservatively normalizes old un-namespaced CUT keys:
  - `13` → `EP01:13`
  - in CUT state, manual links, continuity, lettering and legacy gap stores.
- Old raw Scene Look keys become `EP01::SCENE ...`.
- Old numeric camera keys become `EP01:<cut>`.
- Episodes are normalized / duplicate IDs removed.
- MASTER assets are normalized / duplicate IDs removed / basic type-version metadata repaired.

### Data Health
- Project Settings now includes a Data Health card.
- Shows:
  - schema version
  - registered-store count
  - local data size
  - integrity issues
  - health score.
- `Data Architecture` modal lists every registered store, type, size, item count and status.
- Migration history is visible.
- `무결성 정리` reruns conservative normalization.
- JSON Data Manifest can be downloaded for diagnostics.

### Backup compatibility
- Project backup format version advances to 28.
- Backup manifest includes the V28 data schema version.
- Existing `wtal_*` stores and IndexedDB result records remain compatible.

### Intentional non-changes
- No production image/CUT API behavior changed.
- No cloud database migration yet.
- No existing browser project is deleted or rewritten wholesale.
- Legacy `wtal_assembly_gaps` is retained for compatibility even though the current Assemble layout has its own gap values.


## V29 — Unified Project Settings
V29 consolidates settings that previously lived across Project, Pipeline, Assemble, Cost and Backup screens into one structured Project Settings hub.

### Settings navigation
- General
- Generation
- Continuity
- Export
- Cost & API
- Backup
- Advanced

### General
- Project title
- Genre
- Protagonist
- Logline
- Theme
- Long-term structure
- Direct shortcut to Story Bible

### Generation
- Current image model
- MASTER Lock: Strict / Balanced
- Composition Lock: Strict / Balanced
- Global visual style

### Continuity
- Auto Repair ON/OFF
- Maximum automatic repair attempts (1–3)
- Scene Look Lock status
- Visible QC categories

### Export
- NAVER / KAKAO / ARCHIVE / CUSTOM preset
- Width
- Slice height
- JPG/PNG
- Quality
- File prefix
- Saves to the existing `wtal_export_settings`; Assemble remains fully compatible.

### Cost & API
- USD→KRW rate
- Per-operation cost estimates
- Current tracked cost/call summary
- Detailed usage log remains in Cost Dashboard.

### Backup
- Last backup / restore summary
- One-click Full Project Backup
- Lightweight settings/spec backup
- Restore remains in the dedicated safety screen.

### Advanced
- V28 Data Health summary
- Data Architecture / migration tool
- Conservative project-default reset

### UX
- One settings navigation instead of scattered configuration screens.
- Settings sections use a consistent two-column label/control pattern.
- Save state is explicit and sticky only on tabs that require saving.
- Immediate toggles (Auto Repair, Lock modes) persist instantly.
- Command Search now includes Generation, Continuity, Export and Cost settings.
- Existing storage keys are preserved; this is a UI/configuration consolidation, not another data migration.


## V30 — MASTER Library Final Governance
- Library Audit for duplicate candidates, naming issues, PRIMARY consistency and unused assets.
- MASTER taxonomy stays stable: Identity / Costume / Expression / Hair / Weapon / Prop / Background / Time Look.
- Naming cleanup removes file extensions and accidental duplicate whitespace; generic names are flagged.
- Duplicate registration warns before creating a second same-type/same-name asset.
- Exactly one PRIMARY is maintained per version group. Broken PRIMARY references are repaired conservatively.
- Usage combines automatic production-spec matching and manual CUT overrides.
- Used, PRIMARY, or parent/version-root MASTER assets are deletion-protected.
- Safe Cleanup shows/removes only unused, non-primary, dependency-free MASTER assets.
- Related Space Map entries are removed only when a safely deletable MASTER is deleted.
- Cards show DUPLICATE? / UNUSED markers and Library adds Used / Unused / Needs review filtering.
- No automatic visual merge is performed.


## V31 — Story Bible / Production Spec System
- Finalizes the information architecture before production testing.

### Story Bible structure
- Fixed order:
  1. 세계관
  2. 캐릭터
  3. 스토리
  4. 무공
  5. 비주얼
  6. Episode
- Search across document title, tags, summary and body.
- Each document has:
  - CANON / DRAFT status
  - AI CONTEXT ON/OFF
  - editable key summary
  - source/tags
  - long-form body.
- Draft documents are excluded from normal AI generation context.
- AI-disabled documents are also excluded.
- `storyBibleContext()` now sends only CANON + AI ON documents and prepends each document's key summary.
- Metadata lives in `wtal_story_bible_meta`; original document storage remains compatible.

### AI context transparency
- Story Bible clearly shows whether a document is used by generation.
- Episode Story planner shows the number/groups of active Canon sources.
- New `storyBibleContextManifest()` exposes the exact active context set.

### Production Specs library
- Story System now switches between `Story Bible` and `Production Specs`.
- Production Specs groups all CUTs by SCENE.
- Shows:
  - CUT spec count
  - scene count
  - average completeness
  - active Canon source count
  - scene purpose
  - emotion arc
  - visual lock
  - Story Beat
  - Action
  - Emotion
  - Shot / Camera
  - Character
  - inferred Canon source groups.
- Search by CUT, scene, Story Beat, action and emotion.
- One-click jump from a spec row to the Create CUT Inspector.

### Production Spec completeness
- Completeness checks required directing/acting fields including:
  scene, shot, camera, action, story beat, knowledge state, intention, emotion, facial acting, body acting, gaze, avoid acting and next beat.
- This is a structural completeness check, not a creative quality score.

### Inspector
- V2 Story / Acting now displays `CANON → PRODUCTION SPEC` source groups so the relationship between lore and executable CUT direction is visible.

### Compatibility
- Existing Story Bible document bodies, EP01 V2 overrides, Scene Look, CUT generation and API routes are preserved.


## V32 — CUT Data Editing UX
V32 makes Production Specs directly editable before real production starts.

### Editable CUT spec maps
- Adds `wtal_cut_spec_maps`.
- Built-in EP01 remains unchanged until the first edit.
- On first mutation, the current CUT spec set is materialized into an editable episode map.
- Existing dynamic episodes remain compatible and are synchronized to `wtal_dynamic_cuts`.
- V2 Story/Acting data is frozen into the editable CUT when materialized, preventing ID-based V2 overrides from being accidentally reassigned after structural edits.

### CUT editor
- Edit:
  - title
  - scene
  - shot
  - camera
  - action
  - dialogue/SFX
  - Story Beat
  - Knowledge State
  - Intention
  - primary/secondary emotion
  - emotion intensity
  - facial acting
  - body acting
  - gaze
  - avoid acting
  - next beat.
- Inspector gets a direct `명세 편집` action.

### Multi-select / bulk editing
- Edit Mode adds per-CUT selection.
- Select whole scene.
- Bulk edit:
  - scene
  - continuity mode
  - shot
  - camera.
- Duplicate selected CUTs.
- Delete selected CUT specs with generated/storyboard-state warning.
- Add a new CUT from the current context.

### Scene structure
- Rename Scene.
- Split selected CUTs into a new Scene.
- Merge a Scene into another existing Scene.
- Scene Look key is migrated when a Scene is renamed.

### Renumber
- Sequential CUT renumbering from 001.
- Migrates CUT-scoped local state:
  generation state, manual Master links, QC, lettering, lettering completion, camera plans, character state, storyboard metadata, auto-repair history and Assemble cut IDs.
- IndexedDB final/storyboard result keys are also migrated when possible.

### Undo
- Session-scoped structural/spec Undo, maximum 20 edits.
- Keeps large project snapshots out of persistent LocalStorage.
- Undo restores Production Specs; generated-result cleanup is intentionally not destructive.

### Safety
- Deleting a CUT spec does not immediately erase generated images, allowing a same-session Undo to restore the spec.
- Structural edits are explicit and require confirmation where runtime production data can be affected.


## V33 — Generation Preset System
V33 introduces production presets so repeated image-generation settings do not need to be adjusted CUT by CUT.

### Built-in presets
- `Draft`
  - low quality / low input fidelity
  - compact references
  - intended for fast composition/idea validation.
- `Standard`
  - medium quality / high input fidelity
  - balanced everyday production preset.
- `Final`
  - high quality / high input fidelity
  - strict MASTER + composition lock
  - intended for approval candidates.
- `Character Lock Strong`
  - high quality / high input fidelity
  - strict character MASTER identity focus
  - preserves face/hair/age/costume/body proportions.
- `Background Lock Strong`
  - high quality / high input fidelity
  - strict MASTER + composition lock
  - prioritizes Space Map / background geometry and furniture placement.

### Project default + CUT override
- New `wtal_generation_settings` stores the project default preset.
- New `wtal_cut_generation_overrides` stores only CUTs that override the project default.
- Inspector shows the effective preset and whether it comes from:
  - PROJECT DEFAULT
  - CUT OVERRIDE.
- Removing an override immediately returns the CUT to the current project default.

### Integration
- Preset controls:
  - image generation quality
  - input fidelity
  - reference image compression/size
  - MASTER lock policy
  - composition lock policy
  - generation focus rules
  - WebP output compression.
- Pipeline / silent generation uses the exact same effective preset resolver as manual generation.
- Strong presets add explicit server-side prompt rules; they are not UI-only labels.

### Results / auditability
- Generated result metadata records the preset ID.
- CUT generation state records the preset.
- Activity cost log note includes the preset ID.
- Generation and result modals show the effective preset.

### Settings
- Project Settings → Generation now contains visual preset cards and a comparison table.
- Existing MASTER/Composition lock controls remain as base locks for presets configured to inherit them.


## V34 — Reliability / Error Recovery System
V34 adds a production-safety layer before real episode testing.

### Recovery Center
- Central unresolved failure list for:
  - network
  - API authentication / permission
  - quota / credits / rate limit
  - payload size
  - timeout
  - server errors
  - LocalStorage
  - IndexedDB
  - client runtime errors.
- Groups failures by operation / episode / CUT and counts repeats.
- Shows actionable Korean recovery hints instead of raw technical errors.
- Manual resolve/dismiss keeps the history conservative.

### Failed CUT retry
Recovery Center can retry supported operations:
- Generate CUT
- Generate Conte
- Continuity QC
- Character State
- Episode Story
- Episode Specs.
Paid image generation is **never automatically retried**. This prevents accidental duplicate API cost if the server completed a job but the browser lost the response.

### Network safety
- Browser online/offline state is observed.
- API work started while offline fails immediately with an understandable message.
- Home shows a reliability banner when offline or when the active episode has unresolved failures.
- Reconnection produces a non-blocking toast.

### Request timeout / API classification
- `trackedFetch` now has a default 240-second safety timeout.
- Successful operations automatically resolve matching previous failures.
- HTTP error responses are cloned and inspected without consuming the caller's response body.
- Activity and cost logging continue to work.

### Activity
- Failed activity rows link to Recovery Center.
- Activity panel exposes a Recovery shortcut.

### Storage reliability
- Critical project stores use `safeStorageSet`.
- Quota/storage write failures are recorded rather than silently disappearing.
- MASTER persistence uses the same failure system.
- IndexedDB result reads/writes report failures to Recovery Center.
- Image result write failure shows a clear user-facing warning.

### Generation error UX
- Generation failures are classified and display:
  - human-readable error type
  - original server/client message
  - recommended recovery action
  - Recovery Center
  - manual Retry.

### Advanced Settings
- Project Settings → Advanced now includes Recovery Center beside Data Architecture.
- Command Search includes Recovery Center.

### Safety principle
- V34 intentionally avoids blind automatic retry for paid/generative POST requests.
- Retry is a deliberate user action unless a later queue system can verify request idempotency.


## V35 — Persistent Project History / Recovery
V35 expands V32's session-only CUT Undo into a persistent project-level history system.

### IndexedDB History store
- Upgrades `wtal_db` from version 1 → 2.
- Adds a dedicated `history` object store.
- History does not consume LocalStorage project quota.
- Default retention: latest 60 entries, with pruning support.

### Automatically tracked domains
- Project Settings
- Story Bible document body
- Story Bible metadata / Canon state
- CUT Production Specs
- Scene Look
- Assemble layouts
- Generation Presets
- CUT Generation Overrides
- Export settings
- Cost settings
- MASTER PRIMARY
- selected MASTER metadata operations.

### History Center
Accessible from:
- global header
- Create workspace
- Project Settings → Advanced
- Command Search.
Features:
- chronological list
- domain filter
- search
- before / after summary
- detail view
- restore previous state
- re-apply later state.

### Safe restore
- Before every restore, V35 automatically creates a `복원 직전` checkpoint.
- Restore then reloads the app so all in-memory state is rebuilt from storage.
- Generated CUT images in IndexedDB are not deleted or overwritten by ordinary History restore.

### Manual checkpoints
- Create named checkpoints before large structural edits.
- Captures major non-binary project stores plus MASTER metadata.
- Intended as a lightweight complement to V22/V28 full ZIP Backup, not a replacement.

### MASTER History
- Normal MASTER metadata history strips image binaries to avoid duplicating large base64 images for every small edit.
- Metadata restore merges against the current image by MASTER id.
- A safely deleted single MASTER records the full deleted asset so that deletion can be reversed including its image.
- Bulk unused cleanup records before/after MASTER metadata but does not duplicate all binary images.

### Existing Undo
- V32's fast in-session CUT Undo remains available for immediate edits.
- V35 adds persistent cross-screen History for later recovery.

### Safety model
- History is for editing recovery.
- Full Backup remains the authoritative disaster-recovery mechanism for complete images/IndexedDB/project transfer.


## V36 — Backup System Final
V36 completes the local-first backup / restore layer before project-management and production testing.

### Backup format V36
- `BACKUP_VERSION = 36`
- Manifest now records:
  - backup version
  - data schema version
  - image inclusion
  - project/episode summary
  - Project History entry count.
- Full backup ZIP now contains:
  - manifest.json
  - local-storage.json
  - indexeddb-results.json
  - history.json
  - README.txt.

### Compatibility validation
Before restore the app checks:
- WTAL backup format
- backup version
- schema version
- required project stores
- IndexedDB result shape
- available Episode IDs.
Backups created by a newer app remain blocked.

### Legacy migration
- Older compatible backups are migrated in memory before restore.
- Legacy pre-V28 CUT keys can be namespaced to EP01.
- Scene Look / Camera legacy keys are normalized.
- Episode and MASTER metadata are normalized.
- V33 Generation Preset defaults are added when absent.
- Current `wtal_data_schema_version` is written after restore.
- The source backup file itself is never modified.

### Partial restore
Restore scope is selected after inspecting the ZIP:
1. Full Project
2. Episode Only
3. MASTER Only

Episode restore merges only the selected Episode's:
- episode record
- story/spec data
- CUT state
- manual MASTER links
- storyboard metadata
- continuity
- character state
- camera
- lettering
- Scene Look
- pipeline / auto repair
- Assemble
- generation overrides
- related IndexedDB CUT / storyboard results.

MASTER restore replaces only:
- MASTER Library
- PRIMARY map
- Space Maps.

### Restore safety
- Every restore creates a Project History checkpoint first.
- Full restore can also restore V35 Project History.
- Partial restore preserves all unrelated Episodes / project settings.
- Last restore scope is displayed.

### Auto Safety Snapshot
- Optional browser-internal checkpoint cadence:
  - Off
  - 30 min
  - 2 hours
  - 6 hours.
- Runs through V35 Project History.
- It is explicitly not treated as an external/full backup.
- Full Backup reminders can be set to 1 / 3 / 7 days.
- A manual `지금 Safety Snapshot` action is provided.

### Important safety distinction
`Auto Safety Snapshot` protects against editing mistakes in the same browser.
`PROJECT BACKUP.zip` protects against browser loss, machine changes and larger recovery scenarios.


## V37 — Multi Project Workspace
V37 converts the single-project browser app into a local multi-project workspace.

### Projects hub
- New primary navigation: `Projects`.
- Project cards show:
  - title
  - genre
  - active / archived state
  - last opened time.
- Recent-project chips provide fast switching.
- Search and Active / Archived / All filters.

### Create projects
- `Blank Project`
  - empty Story Bible structure
  - EP.01 shell
  - empty MASTER / CUT / image stores
  - Standard generation preset.
- `현재 프로젝트 복제`
  - clones Story, CUT specs, MASTER, generated results and History into a separate project.
- Blank projects do not inherit 《죽음을 기억하는 자》 Canon text.

### Project switching architecture
- Active project continues using the existing `wtal_*` runtime stores for maximum backward compatibility.
- Inactive projects are serialized into a new IndexedDB `projects` store.
- `wtal_db` upgrades to version 3.
- On switch:
  1. current live project is captured
  2. local project stores + results + history are saved to the inactive-project store
  3. target snapshot is loaded into the live runtime
  4. target inactive snapshot is removed to avoid a stale duplicate
  5. app reloads and rebuilds all in-memory state.
- This avoids changing every existing CUT/EP key to a project-prefixed key in one risky migration.

### Workspace metadata
- `wtal_workspace_projects`
- `wtal_workspace_active_project`
These two keys are workspace-level and are explicitly excluded from normal project snapshots and PROJECT BACKUP.zip payloads.

### Project management
- Rename
- Clone current project
- Archive / unarchive inactive projects
- Delete project
- Active project cannot be archived.
- Last project cannot be deleted.
- Deleting the active project safely activates another project and discards the deleted project's live data only after confirmation.

### Backup compatibility
- Full project backup remains a **single-project** backup.
- Workspace project index is not overwritten by restoring a project backup.
- V36 Episode-only / MASTER-only restore remains scoped to whichever workspace project is currently open.

### Existing project migration
- The pre-V37 live project is automatically registered as the first Workspace project on first load.
- No image/CUT data is moved until the first project switch, minimizing upgrade risk.


## V38 — Onboarding / Help / Usage Guide
V38 completes the pre-production product-hardening roadmap by adding in-app guidance without changing image-generation behavior.

### Help Center
Accessible from:
- global `?` button
- Create header
- Command Search
- Project Settings → Advanced
- keyboard `?`.

Tabs:
- Production Flow
- Current Screen
- Shortcuts
- FAQ.

### Production Flow guide
The canonical workflow is displayed in-app:
`Project → Story → MASTER → Conte → Generate → Review → Lettering → Assemble`

Each step shows a data-derived status:
- 완료
- 진행 가능
- 준비 필요.

The guide links directly to the corresponding screen/stage.

### Contextual Help
- Home, Projects and Create expose contextual guidance.
- Help Center's `현재 화면` tab explains the role of the current page and the recommended next action.
- Create stage buttons include hover descriptions.
- Primary navigation has native title/ARIA descriptions.

### First-run onboarding
- V38 shows a one-time Welcome screen.
- `1분 둘러보기` starts a non-destructive guided tour of:
  - current project
  - Create
  - MASTER Library
  - Episodes
  - Project Settings
  - Command Search
  - Help Center.
- The tour does not generate images, alter CUT data or call an API.
- Welcome can be reopened from Advanced Settings.

### Keyboard shortcuts
- `Ctrl/⌘ + K` — Command Search
- `?` — Help Center
- `Esc` — close panels / tour
- `G → H` — Home
- `G → C` — Create
- `G → L` — Library
- `G → E` — Episodes
- `G → P` — Projects
- `G → S` — Project Settings
G-chords are disabled while typing in input/textarea/select/contenteditable fields.

### FAQ / safety guidance
Includes guidance for:
- where to start
- Draft vs Canon
- MASTER PRIMARY
- generation presets
- Recovery Center
- History vs Full Backup.

### Scope
V38 is deliberately guidance-only:
- no production image test
- no new paid API calls
- no change to generation priority or Continuity behavior.


## V39 — Long Task UX / Cancellation Audit
This release is a focused pre-production audit prompted by slow, uncancellable Review batch operations.

### Main issue found
Review had two sequential API batch actions:
- `STATE 전체 분석`
- `CONTINUITY 전체 검수`

Both ran CUT-by-CUT with a progress bar but had no stop control. Closing the modal only hid the UI; it did not stop the loop.

The same pattern also existed in:
- 전체 콘티 생성
- SCENE Pipeline
- Scene Continuity Auto Repair (between CUTs)
- several single API loading dialogs.

### Long Task Manager
Long sequential tasks now use a shared manager with:
- explicit progress
- completed / total
- elapsed time
- live CUT log
- Cancel button
- cancelling state
- completed items preserved
- no new items started after cancellation.

Covered:
- STATE 전체 분석
- CONTINUITY 전체 검수
- 전체 콘티 생성
- SCENE Pipeline STATE/CONTE
- SCENE Pipeline FINAL/QC
- Scene Auto Repair batch.

### Activity request cancellation
Every `trackedFetch` request now registers its AbortController by Activity ID.
Activity rows expose `요청 취소` while the request is running.

This provides a common cancel path for long single calls as well as batch calls.

### Single-operation cancel controls
Explicit Cancel buttons added to loading UI for:
- Character State analysis
- Continuity QC
- Storyboard generation
- Final CUT generation.

### Server cancellation propagation
All OpenAI POST routes now pass `req.signal` into their upstream OpenAI `fetch`.
Therefore a browser Abort request is propagated from:
browser → Vercel route → OpenAI fetch.

Cancellation is still a best-effort network cancellation: if upstream work has already completed, billing may already have occurred.

### Cancellation semantics
- Cancelled requests are Activity status `Cancelled`, not `Failed`.
- User cancellation is not written to Recovery Center as an application error.
- API usage logs retain a cancellation note because upstream cost cannot be guaranteed to be zero.
- Completed CUT results/states are not rolled back.
- A cancelled batch stops before starting the next CUT.

### Modal safety
Long-task modal `×` and backdrop clicks no longer merely hide a running task.
They route through the same cancellation confirmation.

### Pipeline safety change
V39 stops automatically running Auto Repair inside the large FINAL→QC Scene Pipeline.
If QC finds a continuity issue, it is logged for review / explicit Auto Repair.
This reduces runaway API chains and makes cancellation boundaries predictable.

### Audit findings left intentionally non-cancellable
Local-only operations such as:
- IndexedDB thumbnail hydration
- normal metadata saves
- ZIP parsing
- small History pruning
are not presented as cancellable jobs because they do not issue repeated paid API calls and are normally short.

Full backup/export rendering remains a local CPU/I/O operation; it has status text but is not yet converted into a resumable worker. This is lower risk than the API batch issue and should only be promoted to a worker if real large-project testing shows UI blocking.


## V40 — Final Pre-Production Audit / Fix Pack
V40 does not run paid image generation. It is the final static/data-readiness pass before the planned EP01 sample test.

### Bugs found and fixed
1. **Help Center Production Flow runtime error**
   - V38 called nonexistent `continuityStatus(c.id)`.
   - Replaced with the actual `continuityReport(c.id)?.severity` state.
2. **Builtin EP01 Prompt save was not persistent**
   - `savePrompt()` modified the in-memory builtin CUT but only persisted non-builtin episodes.
   - It now materializes the editable CUT map and saves through V32's persistent CUT spec layer.
3. **User cancellation displayed as normal generation failure**
   - Generate / Storyboard / Character State / Continuity cancellation paths now recognize Abort/user-cancel semantics.
   - Cancelled work no longer opens a scary generic error dialog.
4. **Critical save helpers bypassed Reliability storage handling**
   - Episode Story
   - Episode Stage flags
   - Lettering completion
   - Scene Pipeline
   - Auto Repair History
   now use `safeStorageSet`.

### Static audit results
- Frontend script syntax: PASS
- 10 API route scripts syntax: PASS
- 528 named frontend functions: no duplicate declarations
- 9 client `trackedFetch` API endpoints: all routes exist
- `/api/health` exists as a non-tracked health endpoint
- All OpenAI response routes retain request AbortSignal propagation from V39
- Workspace keys remain excluded from single-project backup payloads.

### In-app V40 Preflight
Home and Command Search now expose `V40 Preflight`.

It checks without paid generation:
- OpenAI API configuration
- Episode Story approval
- CUT spec presence
- MASTER availability for recommended sample CUTs
- MASTER availability across the whole Episode
- Data Health / schema issues
- unresolved Recovery failures
- Full Backup history.

### EP01 sample recommendation
For the built-in EP01, the first sample target is:
- CUT 013
- CUT 014
- CUT 015
- CUT 016

Reason:
they are adjacent CUTs in the same dawn-bedroom sequence and are suitable for testing:
- character identity consistency
- acting progression
- Scene Look continuity
- camera/shot variation
- previous-approved-CUT continuity
without immediately paying for a large Episode batch.

### Planned validation sequence
1. V40 static/data Preflight
2. resolve BLOCK items
3. Full Backup
4. EP01 CUT 013–016:
   - Conte
   - approve Conte
   - Standard Final generation
   - human result approval
   - Continuity QC
5. if stable, run one complete Scene
6. only then expand to full EP01.

V40 intentionally does **not** automatically start the sample production test.


## V40.1 — Request Modal Safety Patch
Prompted by a real workflow issue: a single Conte generation window could disappear while the API request continued.

### Root cause
V39 protected only shared Long Task modals. Single-request modals still used the generic modal behavior:
- backdrop click removed the dialog,
- `×` removed the dialog,
- underlying API could continue,
- user lost visual confirmation of running/completed/cancelled state.

### Generic request-bound modal
V40.1 adds a shared request-modal lifecycle:
- `requestOperation`
- optional CUT id / asset note
- UI AbortController
- protected backdrop
- protected `×`
- explicit cancel confirmation
- browser signal + trackedFetch signal combined.

While a request is active:
- backdrop click does **not** silently close the dialog,
- `×` means “request cancellation”, not “hide UI”,
- opening another modal cannot silently replace the running request modal.

### Covered request UI
Request-bound behavior is now applied to:
- Final CUT generation
- single Conte generation
- Character State analysis
- Continuity QC
- MASTER → Production MASTER transform
- Space Map AI analysis
- Partial Edit.

### Background navigation
Some operations are intentionally inline rather than modal-based, including Episode Story / Episode Specs.
Activity now records the page/stage where a request started. If the user navigates elsewhere before it finishes, a completion / cancellation / failure toast is shown.

### Keyboard safety
`Esc` respects active API dialogs:
- active request → cancellation confirmation
- active Long Task → cancellation confirmation
- normal dialog → close.

### Audit principle
A running API task must now have one of two explicit UX models:
1. request-bound modal with cancellation, or
2. Activity-tracked background task with completion notification.

No paid/API task should become invisible merely because the user clicks outside its loading UI.


## V40.2 — Lettering Editor Fix
A runtime bug was found in the `Edit Lettering` path.

### Root cause
`renderLetterEditor()` rendered `${presetButtons(c.id,x)}`, but `presetButtons()` had never been defined.
The application passed JavaScript syntax checks because the missing symbol is a runtime reference, not a syntax error.
Result: clicking `Edit Lettering` could appear to do nothing after the image was loaded.

### Fix
- Added `presetButtons(cutId, x)`.
- Dialogue/thought/narration/caption rows show Balloon preset buttons.
- SFX rows show SFX preset buttons.
- Active preset is visually selected.
- Preset buttons call the existing `applyPreset()` implementation.
- Lettering editor now catches runtime/open errors and shows a visible message instead of failing silently.
- Lettering editor re-injects the Create header after replacing the page body.
- Back navigation now returns to the Lettering list; Assemble remains a separate forward action.

### Audit note
This bug demonstrates why syntax-only validation is insufficient for template-driven UI.
V40.2 adds a targeted undefined UI-helper reference scan to the release validation.


## V40.3 — Pre-Test Cleanup Patch

### AUTO REPAIR
- Removed misleading `AUTO REPAIR ON/OFF`.
- Scene Pipeline remains `FINAL → QC → manual repair decision`.
- UI now says `AUTO REPAIR · MANUAL`.
- `1–3회` is only the maximum attempt count when the user explicitly runs `⚡ AUTO FIX`.
- Removed obsolete `wtal_auto_repair_enabled` browser setting.

### Actual server model
Project Settings → Generation now displays the actual runtime models from `/api/health`:
- FINAL: `OPENAI_IMAGE_MODEL`
- CONTE: `OPENAI_STORYBOARD_IMAGE_MODEL`, with FINAL fallback.
The health route exposes both values.

### Legacy cleanup
Removed 15 confirmed declaration-only legacy functions:
- closeActiveModal
- setGap
- gapFor
- addCut
- masterUsageScenes
- setProductionPrimary
- stageRowHtml
- controlStatusClass
- setControlFilter
- controlQuickAction
- hydrateAssembly
- exportAssembly
- autoGrowProjectFields
- markProjectDirty
- renderDataHealthCard

### Next
No paid API test is started in V40.3.
Next planned step:
`V40 Preflight → Full Backup → EP01 CUT 013–016 sample production test`.

### Additional dead-code cleanup
Removed declaration-only leftovers after the first cleanup pass:
- saveGaps
- renderControlCenter
- settingsToggleHtml

- commandKeydown


## V40.4 — MASTER Storage Architecture

### Why this patch exists
MASTER images previously lived inside `wtal_assets` as base64 Data URLs in LocalStorage.
LocalStorage is appropriate for small metadata, not production image binaries. Large MASTER libraries could therefore hit browser quota and fail to save.

### New storage split
- `localStorage / wtal_assets`: MASTER metadata only.
- `IndexedDB / wtal_db v4 / master_images`: MASTER image Data URLs.
- Runtime `assets[]`: metadata + hydrated image for compatibility with the existing production pipeline.

Existing code that reads `asset.img` continues to work after startup hydration.

### Automatic migration
On first V40.4 load:
1. existing `wtal_assets` is read,
2. every legacy embedded `img` is copied to IndexedDB,
3. `wtal_assets` is rewritten without image binaries,
4. in-memory assets keep their image for the running session.

No manual re-registration is required for MASTER images that were successfully stored before the previous LocalStorage quota failure.

A MASTER whose save already failed before V40.4 was never committed and must be registered again.

### New MASTER writes
New SOURCE MASTER and accepted PRODUCTION MASTER images are written to IndexedDB first.
Only after the binary write succeeds is metadata committed to LocalStorage.
If metadata commit fails, the new IndexedDB image is rolled back.

### Delete / cleanup
Single safe delete and bulk unused cleanup remove the corresponding IndexedDB image as well as metadata.

### Workspace projects
Project snapshots now carry `masterImages` separately from LocalStorage.
Switch / clone / delete flows preserve or remove the correct project-scoped image namespace.

### Backup V40
Full Backup now contains:
- `data/local-storage.json`
- `data/indexeddb-results.json`
- `data/master-images.json`
- `data/history.json`

Old V36 backups remain accepted. If an old backup has MASTER images embedded in `wtal_assets`, V40.4 migrates them on the reload after restore.

MASTER-only restore also restores `master-images.json` when present.

### Browser storage health
MASTER Library displays browser storage usage/quota when the browser exposes `navigator.storage.estimate()`.
`영구 저장 요청` calls the browser Persistent Storage API as a best-effort protection against automatic eviction.

### IndexedDB version
`wtal_db`: v3 → v4
New object store:
- `master_images`
  - key: `<projectId>::<assetId>`
  - indices: `projectId`, `assetId`

### Next
After deploying V40.4:
1. open MASTER Library once and allow the automatic migration,
2. confirm `IMAGE STORAGE · IndexedDB`,
3. re-register the MASTER that previously failed to save,
4. run V40 Preflight,
5. create a Full Backup,
6. proceed to EP01 CUT 013–016 sample production.


### Final V40.4 validation
- frontend + 10 API routes: `node --check` PASS
- `wtal_assets` production persistence: metadata-only
- Data Integrity manual repair also strips legacy `img` before writing `wtal_assets`
- no direct runtime save path intentionally writes MASTER image binaries back into LocalStorage
- workspace clone/switch/delete, backup/full restore/MASTER restore reviewed for `masterImages`.


## V40.5 — Final CUT Generation Watchdog

Triggered by a real issue: CUT 015 Final generation could remain on the loading screen with no visible stage information.

### Root causes addressed
The previous Final generation UI showed only one spinner across several independent phases:
1. reference compression,
2. oversized payload recompression,
3. browser → Vercel request,
4. OpenAI image generation,
5. response decode,
6. IndexedDB result save.

The browser request timeout was 240 seconds, and the Vercel route could wait up to 300 seconds. To the user this could look like an infinite wait.

### V40.5 behavior
Final generation now shows explicit stages:
1. 생성 준비
2. MASTER 전처리
3. OpenAI 이미지 생성
4. 응답 수신
5. 결과 저장

The dialog shows elapsed time and remains explicitly cancellable.

### Watchdogs
- each MASTER compression: max 30 seconds
- Final CUT browser API request: max 180 seconds
- server → OpenAI image generation: max 175 seconds
- Vercel route `maxDuration=300` remains as platform ceiling, but the internal watchdog should exit first.

If OpenAI does not return in time, the user gets a retryable timeout error instead of an indefinite spinner.

### Important billing note
A timeout/cancel request is best-effort. If upstream generation already completed or was nearly complete, API cost may still have been incurred.

### CUT 015 test
After deploy:
- cancel any stale CUT 015 activity,
- reload,
- retry CUT 015 once,
- watch which generation stage is slow.
If it stops at `MASTER 전처리`, inspect the named MASTER.
If it stops at `OpenAI 이미지 생성`, the request will self-terminate at 180 seconds.


## V40.6 — Final Image Transport Fix

### 변경 사항
- `/api/generate-cut` 가 더 이상 `data:image/...;base64,...`를 JSON으로 반환하지 않습니다.
- 이제 생성 이미지를 **binary image/webp 응답**으로 반환합니다.
- 모델/프리셋 정보는 응답 헤더(`X-OpenAI-Model`, `X-Generation-Preset`)로 전달합니다.
- 클라이언트 `generateCut()` 는 `content-type` 이 `image/*` 인 경우 Blob으로 읽은 뒤 Data URL로 변환하여 기존 IndexedDB 저장 파이프라인을 그대로 사용합니다.
- 오류 응답은 기존처럼 JSON 유지합니다.

### 해결되는 문제
- Final 이미지 응답의 JSON/base64 팽창 제거
- Vercel → Browser 응답 크기 증가 완화
- `res.text() / JSON.parse()` 단계의 비효율 제거
- 생성 완료 후 50초대 부근에서 멈춘 것처럼 보이는 응답 전달 문제 완화


## V40.7 — Recovery UI Polish

The persistent large Home Recovery banner was distracting during production.

### Changes
- Recovery now lives primarily in the top header next to History / Activity.
- The header shows `Recovery <count>` only for actionable unresolved failures.
- Home shows no Recovery banner for ordinary historical failures, timeouts, transient network errors, or cancelled work.
- Home only shows a compact one-line notice for:
  - Offline state
  - critical production blockers such as auth, permission, quota, payload, LocalStorage, or IndexedDB problems.
- Recovery Center is split into:
  - `확인 필요한 작업`
  - `과거 / 일시적 기록`
- Cancellation-like records never contribute to the Home warning or Recovery badge.
- timeout/network records remain visible in history for diagnosis, but no longer dominate the production dashboard.
- Successful matching API calls still automatically resolve their previous Recovery entries.


## V40.8 — Generate CUT Runtime Fix

### Production incident
Vercel runtime logs showed an exact production error on `/api/generate-cut`:

`ReferenceError: presetId is not defined`

The request ran through OpenAI image generation and then failed while constructing the new V40.6 binary response headers.

### Root cause
V40.6 changed the response transport from JSON/base64 to binary WEBP, but the new header used:

`X-Generation-Preset: presetId || 'standard'`

`presetId` did not exist in the server route scope.

### Fix
- resolve preset once as `resolvedPresetId = generationPreset?.id || 'standard'`
- use `resolvedPresetId` in the binary response header
- add structured server runtime error logging
- add `GENERATE_CUT_RUNTIME_ERROR` code to unexpected server failures

No generation prompt, quality, MASTER input, or transport architecture was changed.


## V40.9 — Request Completion Handoff Fix

### Production diagnosis
The latest CUT 016 request returned HTTP 200 from `/api/generate-cut`.
The server/OpenAI/binary transport path therefore completed successfully.

The remaining freeze was a client UI lifecycle bug introduced by V40.1 request-modal protection:

1. Final generation request modal is marked `requestOperation='generate_cut'`.
2. API returns successfully and IndexedDB save completes.
3. `showGeneratedResult()` tries to replace the loading modal.
4. `modalShell()` sees the old request modal as still active and refuses to replace it.
5. The loading screen remains at ~55 seconds and a bottom-right warning appears:
   “현재 API 작업이 실행 중입니다. 먼저 완료하거나 취소해주세요.”
6. `finally` clears the request only after the result modal attempt has already been blocked.

So the latest symptom was not an OpenAI generation failure and not proven to be an IndexedDB quota failure.

### Fix
Added an explicit request completion handoff:
- `completeUiRequest(operation, cutId, note)`
- clears the request controller
- unlocks/removes request metadata from the active modal
- only then opens the success/error result UI

Applied to:
- Final CUT generation
- MASTER transform
- Partial Edit

Generate CUT error UI is also unlocked before `showGenerateError()`, preventing real errors from being hidden behind the loading modal.

### Result
A successful 200 Final generation now transitions:
`OpenAI 생성 → 응답 수신 → IndexedDB 저장 → request unlock → 생성 결과 화면`

instead of remaining on the generation spinner.


## V41 — Canvas-first Lettering Editor Redesign
Lettering is now edited directly on the CUT instead of through a long control form below the image.

### Layout
- Elements list on the left
- large editable CUT canvas in the center
- contextual Inspector on the right

### Direct manipulation
- click selects
- drag moves
- corner handles resize
- top handle rotates
- double-click edits text in place
- zoom / fit
- safe-area guide

### Inspector
Content, type, preset, X/Y, width, rotation, font size, weight, tracking, leading, alignment, font, opacity, layer Z, tail, duplicate/copy/delete.

### Keyboard
Arrow keys move, Shift+Arrow moves faster, Ctrl/Cmd+D duplicate, Ctrl/Cmd+C/V copy/paste, Delete removes, Ctrl/Cmd+Z undo, Ctrl/Cmd+Shift+Z redo.

### Compatibility
Existing `wtal_lettering` data remains supported through runtime normalization. No paid API call is used by the editor.


## V41.1 — Lettering Interaction Fix

### Issue
The first V41 layout rendered correctly, but direct manipulation was not reliable enough:
- move/scale gestures could fail,
- double-click editing was inconsistent,
- zoom/fit used an ambiguous value/delta API,
- Inspector fields often waited for `change` instead of responding live.

### Interaction rewrite
- canvas gestures now use a window-level pointer controller instead of per-element pointer capture,
- `touch-action:none` is applied to draggable lettering and handles,
- move, scale and rotate update continuously,
- corner handles now control a real `scale` value (40–300%),
- Inspector includes a live Scale slider and ±10% buttons,
- double-click opens a dedicated on-canvas textarea overlay,
- X/Y/width/rotation update on `input`,
- Zoom and Fit use explicit delta/absolute modes,
- toolbar buttons are explicitly `type="button"`.

### Data
Adds optional `scale` to normalized lettering items. Existing lettering remains compatible.
No API calls or generation costs are involved.


## V41.2 — Direct Manipulation Hardening
V41.1 still did not respond reliably in the deployed browser. V41.2 removes the fragile per-render event attachment for core canvas gestures.

- Move / scale / rotate use inline pointerdown → one global pointermove/up controller.
- No pointer capture dependency.
- No CSS.escape dependency for selecting lettering objects.
- Editor rendering receives the real CUT id explicitly.
- Visible `V41.2 LIVE` badge proves the deployed editor version.
- `Test` button verifies the canvas, inspector, lettering layer and pointer controller are loaded.
- Double-click editor remains an on-canvas textarea overlay.
- Existing lettering and Assemble data remain compatible.


## V41.3 — Lettering Event Delegation Fix
Core Lettering controls no longer rely on inline onclick handlers. After the editor renders, toolbar, Elements, Inspector, presets, canvas pointer gestures and keyboard shortcuts are bound with `addEventListener`.

A visible `V41.3 LIVE` badge confirms the deployed build. `Test` verifies real DOM controls and controllers. `Log` opens a client-side event/error log so dead controls can no longer fail silently.


## V42 — Standalone Lettering Engine

After repeated dead-button behavior inside the monolithic `index.html`, Lettering is now isolated into `/lettering-editor.html`.

This is an architectural fix, not another event-handler patch.

- Entering Edit Lettering navigates the app iframe to a standalone same-origin editor.
- The editor reads the existing Final image from IndexedDB `wtal_db/results`.
- It reads/writes the existing `wtal_lettering` LocalStorage structure using the same `<episode>:<cut>` key.
- It has no dependency on the main app render cycle, create header injection, modal lifecycle, inspector enhancer, or legacy Lettering event code.
- Bubble/SFX buttons, drag, resize-scale, rotate, inline double-click editing, Inspector, undo/redo, zoom/fit and safe area are implemented in a single isolated script.
- Back uses browser history to return to the main app.

This removes the class of failures where main-app rerenders or legacy listeners interfere with Lettering.


## V42.1 — Lettering Style & Direct Manipulation

### Faster editing
- Floating toolbar appears above selected lettering.
- Scale ±, rotate ±5°, black/white quick style, duplicate, delete.
- Inspector adds Scale/Rotate sliders for drag-like adjustment.
- Arrow keys move the selected object; Shift+Arrow moves faster.
- `[` / `]` scales down/up.

### Color & style
New per-lettering properties:
- `fill`
- `textColor`
- `strokeColor`
- `strokeWidth`
- `radius`
- `opacity`

Quick style presets:
- White bubble
- Black caption: black rectangle + white type
- Cream narration
- Borderless monologue

Color swatches + custom color picker are available for background, text, and stroke.

### Compatibility
Existing V42 lettering records are normalized with defaults, so previous work remains loadable.
No AI/API cost is involved.


## V42.2 — Bubble Shapes, Tail & Saved Styles

### New bubble shapes
- ellipse
- rounded rectangle
- box
- thought cloud
- jagged shout
- borderless
- horizontal / vertical writing

### Bubble tail
- none
- bottom-left / bottom-right
- top-left / top-right

### Saved styles
Save the current visual style with a custom name, reapply it to another lettering object, or delete it.
Stored in `wtal_lettering_saved_styles`.

### Shadow
- none
- soft
- hard

### Fast canvas alignment
- left / center / right
- top / middle / bottom

Existing V42/V42.1 lettering data is normalized so old records keep working.


## V42.3 — Webtoon Typography System

### Added
- Webtoon-oriented font library categorized for:
  - dialogue
  - monologue
  - narration
  - caption
  - muhyeop/sageuk
  - SFX
- Typography presets:
  - 기본 웹툰 대사
  - 속삭임
  - 무협 내레이션
  - 검정 캡션
  - 감정 독백
  - SFX Impact
- Search / category filter / recent fonts / favorite fonts
- Live font preview inside the inspector
- User font upload (`.ttf/.otf/.woff/.woff2`) stored in LocalStorage for the prototype
- Font style toggle (normal / italic)
- License warning note

### Notes
- Existing lettering data remains compatible.
- Uploaded user fonts are persisted in prototype storage, so too many large fonts can use substantial browser storage.


## V42.4 — Direct Bubble Manipulation
- 말풍선 이동 시 10/25/50/75/90% 스냅 + 가이드
- 회전 15° 스냅, Shift 회전 시 15° 고정
- 좌우 핸들로 말풍선 폭 직접 조절
- 기존 코너 핸들 비율 스케일 유지
- Direct Tail ON 시 주황 핸들로 꼬리 방향/길이 직접 드래그
- 드래그 중 위치/스케일/회전/폭/꼬리 길이 실시간 표시


## V42.5 — Multi Select & Layer Editing
- Ctrl/Cmd + click: toggle multi selection.
- Shift + click: additive selection.
- Shift + drag on empty canvas: marquee box selection.
- Ctrl/Cmd + A: select all.
- Esc: clear selection.
- Multi-selected lettering moves together by dragging any selected item.
- Multi toolbar:
  - left / center / right
  - top / middle / bottom
  - horizontal / vertical distribution
  - bring to front / send to back
  - group / ungroup
- Group state is stored per lettering element with `groupId`.


## V42.6 — Lettering Workflow Speed
- 350ms debounced autosave with Saved / Saving / Unsaved status.
- Ctrl/Cmd+C and Ctrl/Cmd+V for lettering objects.
- Clipboard is stored in `wtal_lettering_clipboard`, so copying works across CUTs.
- Previous CUT:
  - import all lettering
  - apply previous CUT's first lettering style to current selection
- Recent style history (up to 8)
- Favorite style library (up to 12)
- Fast duplicate
- Quick Workflow panel added to Inspector.
- Existing explicit Save button remains available.


## V42.7 — Auto Text Layout
- Auto layout toggle per lettering item.
- Auto Fit shrinks text down to `minFontSize` when estimated line count exceeds `maxLines`.
- Auto Expand increases bubble width when necessary.
- Overflow warning for very long dialogue.
- Automatic/manual line-break normalization.
- Editable max lines, minimum font size, horizontal/vertical padding.
- Vertical-writing layout gets a narrow automatic width adjustment.
- Live estimated lines / chars-per-line / font size / bubble width status.


## V42.8 — Lettering Style Complete
- Style Studio with one-click webtoon presets:
  - 기본 말풍선
  - 블랙 캡션
  - 내레이션
  - 어두운 독백
  - 감정 강조
  - 생각 말풍선
  - 외침
  - 무테 독백
  - SFX White
  - SFX Black
- Background opacity independent from element opacity.
- Text outline width / color for readable SFX and captions.
- Reset to default style.
- Style preview.
- New properties are saved into recent/favorite/custom styles.


## V42.9 — Assemble Lettering Integration

This pass upgrades Assemble/Export to understand the standalone Lettering V42.x data model.

### Assemble preview fidelity
- Refreshes `wtal_lettering` from LocalStorage whenever Assemble is rendered.
- Preserves:
  - font family / user font
  - font style / weight / tracking / leading
  - fill + independent background opacity
  - text color
  - border color / width / radius
  - text outline color / width
  - opacity
  - scale / rotation
  - vertical text
  - direct tail direction / length
  - box / rounded / ellipse / thought / jagged / borderless shapes
  - shadow

### Export fidelity
- Long PNG and platform slices use the same V42.8 style data.
- User uploaded fonts are loaded with `FontFace` before canvas export.
- Canvas renderer now honors typography, colors, backgrounds, outline, scale, rotation, vertical writing and direct tail.
- The final platform files therefore use the same Lettering data as the Assemble preview.

No image-generation/API request is involved.


## V43 — Final Export Validation

### Export Preflight
- Blocks output when Assemble is empty or a CUT image is missing.
- Warns about lettering close to canvas edges.
- Warns about low JPG quality, very tall long-PNG canvases, and user-uploaded fonts.
- Reports actual final canvas size and expected slice count.

### File naming
- Sanitized filename prefix.
- Configurable start number.
- 2–5 digit automatic zero padding.
- Example: `EP01_001.jpg`.

### Platform / archive output
- Project presets retained:
  - NAVER project preset: 690 × 2000 slices
  - KAKAO project preset: 720 × 1280 slices
  - ARCHIVE: 1080px PNG
- JPG / PNG selectable.
- JPG quality selectable.
- Long PNG retained.
- Split files retained.
- Split + ZIP retained.

### Manifest
ZIP includes `export-manifest.json` with:
- episode
- canvas dimensions
- slice count
- output format / quality
- file naming setup
- filenames / byte sizes / dimensions
- Lettering fidelity version

These presets are app/project presets, not a claim about current official platform requirements. Check the platform's current upload rules before submission.


## V43.1 — Lettering Reliability Audit

### In-editor Audit
`Audit` button opens a non-destructive reliability panel.

Checks:
- required Lettering DOM controls
- LocalStorage read/write round trip
- V42/V43 normalize compatibility
- duplicate IDs
- numeric transform validity
- canvas bounds
- text overflow warnings
- font state
- layer Z range
- current CUT IndexedDB final image
- saved-state vs in-memory reload consistency

### 30-object Stress Test
Creates 30 temporary lettering objects in memory, verifies:
- DOM render count
- serialization / reload
- unique IDs
- text-layout metrics
- selection state
- renderer completion

The original CUT lettering is restored immediately after the stress test and is not overwritten.

This audit does not call OpenAI or any paid API.


## V43.2 — CUT 013–016 Small Production Test

Adds a non-API small-production test harness for CUT 013–016.

Checks per CUT:
- Final image exists in IndexedDB
- CUT is approved
- Lettering exists
- CUT is present in Assemble

The `다음 미완료 작업` button routes to the next incomplete stage:
- Generate/Review if Final or approval is missing
- Lettering editor if lettering is missing
- Assemble if assembly is missing

This does not generate images and does not call paid APIs.


## V43.2.1 — Create Navigation Fix

Root cause:
- The sidebar `Create` button correctly changed `currentPage` to `CREATE`.
- But `renderCreate()` had no fallback when persisted `wtal_create_stage` contained an old/legacy value.
- Result: Create became highlighted while the previous Home content remained on screen.

Fix:
- Added `normalizeCreateStage()`.
- Added legacy stage mappings.
- Invalid/stale stage values automatically fall back to `generate`.
- `setCreateStage()` now validates the stage and persists `CREATE`.
- Sidebar Create click normalizes the stage before navigation.
- `renderCreate()` now has a defensive fallback instead of silently rendering nothing.


## V43.2.2 — Global Navigation Recovery

Observed symptom:
- Clicking a sidebar item changed the active highlight, but the old page could remain visible.
- This means the click handler ran, then a runtime error occurred during page rendering.

Fixes:
- page name normalization
- isolated page renderer
- guarded Recovery / sidebar metadata / Activity / tooltip rendering
- visible recovery card instead of silently leaving stale page content
- document-level navigation fallback
- V43.2.1 Create-stage normalization retained

No paid API calls.


## V43.2.3 — Create Hard Route Fix

Home navigation was already working, but Create could still fail inside the generic page renderer.

This patch makes the sidebar Create action deterministic:
- Create no longer enters through the generic `goPage('CREATE')` path.
- `openCreateWorkspace()` always opens the Generate/CUT workspace directly.
- It persists `currentPage=CREATE` and `createStage=generate`.
- Create Header, Activity, and tooltips are loaded as optional post-render enhancements so they cannot block the workspace itself.
- Home "Continue creating" and Command Palette "Create" use the same hard route.

No API request is made by navigation.
