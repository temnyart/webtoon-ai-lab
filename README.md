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

- Fixed malformed standalone Lettering HTML/script boundary (`<div id="toast" class="t<script>`).
- Restored the missing Reliability Audit panel DOM referenced by the editor JavaScript.
- Preserved V43.3.4 image source recovery: IndexedDB → Project Snapshot → Session fallback.
- Added a visible `SOURCE · ...` badge so the actual image source path is observable.
- Bumped Lettering route cache bust to V43.3.5.

This patch does not require image regeneration.
