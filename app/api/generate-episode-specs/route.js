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
function parseJson(text){
  const cleaned=String(text||'').replace(/^```json\s*/i,'').replace(/^```\s*/,'').replace(/```\s*$/,'').trim();
  try{return JSON.parse(cleaned)}catch(e){}
  const a=cleaned.indexOf('{'),b=cleaned.lastIndexOf('}');
  if(a>=0&&b>a) return JSON.parse(cleaned.slice(a,b+1));
  throw new Error('JSON 결과를 파싱하지 못했습니다.');
}

export async function POST(req){
  try{
    if(!process.env.OPENAI_API_KEY) return Response.json({error:'OPENAI_API_KEY가 없습니다.'},{status:503});
    const body=await req.json();
    const {episode,story='',project={},storyBible='',availableMasters=[]}=body||{};
    const masterNames=availableMasters.map(x=>`${x.type}:${x.name}`).join(', ');
    const prompt=`너는 한국 세로형 액션/무협 웹툰의 콘티 감독이자 제작 명세 설계자다.
확정된 화별 스토리를 실제 이미지 제작 가능한 CUT 단위로 분해한다.

[GLOBAL CANON]
${storyBible}

[EPISODE]
EP.${String(episode?.number||'').padStart(2,'0')} ${episode?.title||''}

[CONFIRMED EPISODE STORY]
${story}

[PROJECT VISUAL STYLE]
${project.style||''}

[REGISTERED MASTER NAMES]
${masterNames||'없음'}

중요 규칙:
- 스토리를 바꾸지 말고 시각적으로 분해한다.
- 웹툰 호흡을 위해 Establishing / Medium / Close-Up / Insert / Reaction / Transition을 적절히 섞는다.
- 한 CUT에 너무 많은 행동을 넣지 않는다.
- 동일 인물은 캐릭터 이름을 일관되게 쓴다.
- 이미 등록된 MASTER와 이름이 같은 자산이 있다면 그 정확한 이름을 우선 사용한다.
- 이미지 내부 대사·효과음·자막·한글 생성은 금지하고 dialogue 필드에만 적는다.
- continuity는 LOCKED, MEMORY, TRANSITION 중 하나.
- MEMORY는 과거 기억/전생 컷, TRANSITION은 매치컷·암흑·전환 컷, 나머지는 LOCKED.
- prompt는 한국 무협 웹툰, 강한 클린 선화, 2~3단계 셀 셰이딩, 포토리얼/3D/웹소설 표지풍 금지를 포함하고 해당 CUT의 구도·인물·배경·행동을 구체적으로 적는다.
- 보통 한 화 60~100 CUT 수준을 목표로 하되, 스토리 길이에 맞춰 적절히 결정한다.
- V2 핵심: 각 CUT을 만들기 전에 스토리에서 현재 인물이 무엇을 알고 있는지, 왜 반응하는지, 다음 CUT에서 무엇을 알게 되는지를 분석한다.
- 미래 CUT의 정보를 현재 표정/행동에 선반영하지 않는다.
- 장르 관습만으로 결의, 분노, 살기, 전투 자세를 임의로 추가하지 않는다.
- 같은 SCENE의 시간, 날씨, 색온도, 광원 방향, 노출, 팔레트, 세트 상태, 의상 상태를 sceneLook에 명시하고 모든 CUT에 상속한다.

반드시 JSON만 출력한다. 마크다운 금지.
{
 "scenes":[{"scene":"SCENE 01 · 이름","purpose":"장면 목적","emotionArc":"장면 감정 변화","sceneLook":{"time":"시간대","weather":"날씨","temperature":"색온도","palette":"팔레트","lighting":"광원 방향/세기","setState":"공간 상태","wardrobeState":"의상 상태"}}],
 "cuts":[
  {
   "scene":"SCENE 01 · 이름",
   "title":"짧은 컷 제목",
   "continuity":"LOCKED",
   "characters":["진무현 17세"],
   "backgrounds":["진무현 침실"],
   "props":[],
   "shot":"Medium Close-Up",
   "camera":"Eye level / 3/4",
   "action":"이미지에 보여야 할 단일 행동",
   "dialogue":"후편집할 대사나 SFX, 없으면 빈 문자열",
   "v2":{"storyBeat":"현재 CUT의 핵심 사건","previousContext":"직전 사건 중 현재 반응의 원인","knowledgeState":"현재 시점에서 인물이 알고 있는 사실만","intention":"현재 인물의 의도","primaryEmotion":"주감정","secondaryEmotion":"보조감정","emotionIntensity":5,"facialActing":"눈/눈썹/입/턱/시선의 구체적 연기","bodyActing":"자세/어깨/손/호흡/중심의 구체적 연기","gazeTarget":"시선 대상","avoidActing":"현재 스토리와 충돌하는 금지 표정·포즈·행동","nextBeat":"다음 CUT으로 이어질 감정/인지 변화"},
   "prompt":"실제 이미지 생성용 상세 프롬프트"
  }
 ]
}`;
    const r=await fetch('https://api.openai.com/v1/responses',{
      signal:req.signal,
      method:'POST',
      headers:{'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({model:process.env.OPENAI_TEXT_MODEL||'gpt-5',input:prompt})
    });
    const data=await r.json();
    if(!r.ok) return Response.json({error:data?.error?.message||'OpenAI spec request failed'},{status:r.status});
    const text=outputText(data);
    const parsed=parseJson(text);
    if(!Array.isArray(parsed.cuts)) return Response.json({error:'CUT 배열이 없습니다.'},{status:502});
    return Response.json({ok:true,scenes:parsed.scenes||[],cuts:parsed.cuts,responseId:data.id});
  }catch(err){
    console.error(err);
    return Response.json({error:err?.message||'Unexpected server error'},{status:500});
  }
}
