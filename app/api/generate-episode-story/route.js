export const runtime='nodejs';
export const maxDuration=300;

function outputText(data){
  if(data?.output_text) return data.output_text;
  const parts=[];
  for(const item of data?.output||[]){
    for(const c of item?.content||[]){
      if(c?.type==='output_text'&&c?.text) parts.push(c.text);
      else if(typeof c?.text==='string') parts.push(c.text);
    }
  }
  return parts.join('\n').trim();
}

export async function POST(req){
  try{
    if(!process.env.OPENAI_API_KEY) return Response.json({error:'OPENAI_API_KEY가 없습니다.'},{status:503});
    const body=await req.json();
    const {episode,brief='',project={},storyBible='',previousEpisode=''}=body||{};
    const prompt=`너는 장기 연재 한국 무협 웹툰의 메인 스토리 작가다.
아래 설정은 이미 확정된 CANON이며 임의로 변경하거나 모순시키면 안 된다.

[PROJECT]
작품명: ${project.title||''}
장르: ${project.genre||''}
핵심 주제: ${project.theme||''}
장기 구조: ${project.structure||''}

[GLOBAL STORY BIBLE]
${storyBible}

[PREVIOUS EPISODE]
${previousEpisode||'이전 화 없음'}

[CURRENT EPISODE]
EP.${String(episode?.number||'').padStart(2,'0')} ${episode?.title||''}

[USER DIRECTION]
${brief||'별도 지시 없음. 장기 플롯과 이전 화를 자연스럽게 이어간다.'}

요구사항:
- 웹소설 문장체가 아니라 실제 웹툰 한 화 기획/스토리 문서처럼 작성한다.
- 독자가 읽는 최종 대본이 아니라 콘티와 제작명세로 분해하기 쉬운 구조로 쓴다.
- 각 SCENE 제목과 장면 목적, 사건 진행, 핵심 대사, 감정 변화, 다음 장면 연결을 명확히 쓴다.
- 기존 설정의 미스터리를 너무 빨리 설명하지 않는다.
- 인물의 성격, 나이, 무공 경지, 이미 확정된 관계를 유지한다.
- 새 설정이 필요하면 기존 설정과 충돌하지 않는 최소 범위에서만 추가한다.
- 마지막에는 다음 화로 넘어가는 훅을 만든다.
- 한국어로만 작성한다.

출력 구조:
# 화 목표
# 핵심 훅
# SCENE 1 — ...
...
# END HOOK
# 이 화에서 새로 확정되는 정보
# 다음 화 연결`;
    const r=await fetch('https://api.openai.com/v1/responses',{
      signal:req.signal,
      method:'POST',
      headers:{'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({model:process.env.OPENAI_TEXT_MODEL||'gpt-5',input:prompt})
    });
    const data=await r.json();
    if(!r.ok) return Response.json({error:data?.error?.message||'OpenAI story request failed'},{status:r.status});
    const story=outputText(data);
    if(!story) return Response.json({error:'스토리 텍스트 결과가 없습니다.'},{status:502});
    return Response.json({ok:true,story,responseId:data.id});
  }catch(err){
    console.error(err);
    return Response.json({error:err?.message||'Unexpected server error'},{status:500});
  }
}
