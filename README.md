# Webtoon AI Lab V43.3.4 — Lettering Source Recovery

## 목표
- 이미지 생성은 성공했지만 레터링 진입 시 원본 이미지를 찾지 못하는 문제를 우선 복구
- 레터링 진입 전에 현재 CUT 이미지 소스를 세션에 백업해 두고, 레터링 에디터에서 IndexedDB → Snapshot → Session fallback 순서로 복구

## 핵심 수정
1. **세션 기반 레터링 소스 캐시 추가**
   - `wtal_lettering_source::<episode:cut>` 키로 최근 3개 CUT 원본 이미지를 sessionStorage에 저장
   - Generate 성공 직후와 Storage Recovery 모달에서 자동 캐시
2. **레터링 진입 직전 소스 확보 강화**
   - IndexedDB 결과 이미지 우선 확인
   - 현재 세션의 `lastGenerated` / DOM 이미지까지 fallback 확보 후 `/lettering-editor.html` 이동
3. **레터링 에디터 복구 강화**
   - IndexedDB에 결과가 없으면 sessionStorage fallback 이미지 사용
   - session fallback을 사용해 열리면 즉시 IndexedDB canonical key로 재저장 시도
4. **진단 메시지 개선**
   - ‘다시 생성해야 하는지’가 아니라 어느 단계에서 소스를 못 찾았는지 보이도록 문구 정리

## 기대 효과
- 생성 성공 + 저장 경고가 있었던 CUT도, 같은 브라우저 세션에서는 레터링을 바로 열 가능성이 크게 높아짐
- 레터링 진입 순간에 fallback으로 복구되면 이후에는 IndexedDB canonical key에도 다시 저장되어 다음 진입도 안정화

## 남은 리스크
- 완전히 다른 브라우저/새 세션에서는 sessionStorage fallback이 없으므로 IndexedDB/Project Snapshot 복구가 여전히 핵심
- 장기적으로는 Result Store 진단/정리 UI를 더 강화하는 것이 좋음


## V43.3.5 — Lettering Runtime Repair

Root structural issue found during full re-check:
- `public/lettering-editor.html` had a malformed HTML/script boundary: `<div id="toast" class="t<script>`.
- The Audit panel controls were referenced by JavaScript but the panel DOM was missing.

Repairs:
- Restored a valid `<div id="toast" class="toast"></div>` followed by a real `<script>` tag.
- Restored the Reliability Audit panel DOM.
- Preserved V43.3.4 source fallback: IndexedDB / project snapshot / session source cache.
- Added a visible `SOURCE · ...` badge showing where the Lettering source image was loaded from.
- Main app opens Lettering with `v=43.3.5` plus timestamp cache busting.

This patch specifically targets the standalone Lettering runtime boot path rather than requiring image regeneration.


## V43.3.6 — Lettering Simplified UI + Webtoon Balloon
- 오른쪽 Inspector를 Content / Bubble Style / Text / Quick Color / Quick Workflow 중심으로 축소.
- 이동, 크기, 회전, 폭은 캔버스 직접 조작만 사용하고 Inspector에서 중복 노출 제거.
- 세부 폰트 라이브러리, Auto Layout, 외곽선 등은 기본 닫힘 `고급 설정`으로 이동.
- 기본 대사 말풍선을 웹툰에서 흔히 쓰는 흰색 타원 + 검정 외곽선 + 뾰족한 꼬리 형태로 교체.
- 기존 50px rounded-rectangle 느낌 대신 `50% / 44%` 타원 geometry 사용.
- 꼬리를 회전 사각형 방식에서 이중 삼각형(outline + fill) 방식으로 교체.
- 새 말풍선 생성 시 기본 꼬리와 웹툰형 padding 적용.


## V43.3.7 — Selection Toolbar + Tail State Fix
- Floating selection toolbar now positions above the selected object's real bounding box, not over the text.
- If there is no room above, the toolbar moves below the object automatically.
- Toolbar is clamped inside the canvas width.
- Non-balloon styles explicitly clear both preset tail and direct-tail state.
- Caption / narration / monologue / thought / SFX no longer inherit a sharp tail from the previous balloon style.
- Standard dialogue / emotion / shout styles restore a normal balloon tail when needed.

## V43.3.8 — Advanced Inspector Cleanup
- Advanced panel open state persists during Inspector rerenders.
- Removed low-value/duplicated advanced UI: direct-tail selector, shadow, font browser/favorites, saved styles, Auto Layout master toggle, Auto Expand, Min Font, Padding X/Y.
- Kept outline/opacity, tracking/leading, text outline, Auto Fit/max lines, fit-now, line-break cleanup.


## V43.3.9 — Lettering Return Route
- Standalone Lettering `돌아가기` no longer uses browser `history.back()`.
- It explicitly returns to `Create → Lettering`.
- Active episode and current CUT context are preserved.
- Lettering error-state back button uses the same route.
- Main app now consumes a one-shot `return=create-lettering` route and restores `currentPage=CREATE`, `createStage=lettering`.
- Normal app reload also restores saved top-level page state from `wtal_ui_page`.

## V43.3.10 — Storage History ReferenceError Fix
- Root cause: Project History code referenced missing globals `historySuppressed`, `HISTORY_TRACKED_KEYS`, and `historyPreferences`.
- Because history logging ran immediately after a successful `localStorage.setItem`, that ReferenceError was incorrectly reported as "브라우저 저장 실패".
- Restored the missing History declarations.
- Added `wtal_cut_states` and `wtal_lettering` to tracked History keys.
- History recording is now isolated from the actual storage write: a History error can no longer make a successful browser save appear failed.
- This does not require regenerating existing images.

## V43.4 — Continuity Identity Lock
- Scene Skin Tone Lock: base complexion, shadow tint, highlight tone, saturation clamp.
- Scene Render Style Lock: line/shading/render-density consistency across the same scene.
- Character Identity Canon with built-in Jin Muhyeon 17 MAIN profile.
- CUT Inspector identity editor.
- Up to 3 matching character MASTER images are automatically reused as identity/face anchors, within the existing 6-reference limit.
- Generation request sends identity profiles and anchor IDs.
- Prompt priority now puts main-character recognizability first and explicitly blocks skin-tone/style drift.
- Existing images remain untouched. Regeneration is only needed when you want new cuts to use the new lock.
