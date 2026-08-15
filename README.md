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
