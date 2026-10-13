# 자재코드 표준화 도구 - Netlify 배포

## 수정 사항
- `index.html`은 `/.netlify/functions/gemini`로 요청합니다.
- 기존 배포에서 누락된 `netlify/functions/gemini.js`를 추가했습니다.
- API Key는 브라우저나 GitHub 파일에 저장하지 않습니다.
- 기본 Gemini 모델은 `gemini-2.5-flash`입니다. 필요하면 Netlify 환경변수 `GEMINI_MODEL`로 변경할 수 있습니다.

## GitHub 배포
1. ZIP 압축을 해제합니다.
2. 압축을 푼 **내용물** (`index.html`, `netlify.toml`, `netlify` 폴더)을 GitHub 저장소 `main` 브랜치의 최상위에 업로드합니다. ZIP 파일 자체를 업로드하지 마세요.
3. GitHub에 Commit하면 Netlify가 자동으로 재배포합니다.
4. Netlify > Environment variables에서 `GEMINI_API_KEY`가 설정되어 있는지 확인합니다. API Key는 GitHub에 업로드하지 마세요.
5. Netlify > Deploys에서 새 배포가 Published가 되었는지 확인합니다.
6. 브라우저에서 테스트용 자재명으로 기능을 시험합니다. 실제 계약단가표 업로드는 회사 정보보안 승인 후 진행하세요.

## 주의
- Netlify 사이트가 Public이면 누구나 접근할 수 있고 API 사용량/비용이 발생할 수 있습니다. 사내 배포 전에 인증, 사용량 제한 및 비용 모니터링을 추가하세요.
- 계약단가표에서 매칭된 일부 행이 AI API로 전송될 수 있습니다. 사내 데이터 외부 전송 정책을 확인하세요.
- 원본 매뉴얼 PDF는 제공되지 않아 다운로드 링크가 작동하지 않습니다. 필요하면 PDF 파일도 저장소 최상위에 올리세요.
- 외부 Gemini API 응답/모델 접근권한/검색 grounding 조합에 따라 별도 오류가 발생할 수 있습니다. 실제 호출 성공은 배포 후 확인해야 합니다.
