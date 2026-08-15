export const runtime='nodejs';
export const maxDuration=300;

function imageResult(response){
  for(const item of response?.output||[]){
    if(item?.type==='image_generation_call'){
      if(item.result) return item.result;
      if(item.b64_json) return item.b64_json;
      if(item.output?.b64_json) return item.output.b64_json;
    }
    for(const content of item?.content||[]){
      if(content?.type==='output_image'&&(content.image_base64||content.b64_json)) return content.image_base64||content.b64_json;
    }
  }
  return null;
}
const MODE_RULES={
 expression:['EDIT TARGET: FACIAL EXPRESSION ONLY.','Change only eyes, eyebrows, eyelids, mouth shape, jaw tension, gaze and tiny facial muscle cues needed for the requested emotion.','LOCK: face identity/proportions, hairstyle, head shape, body, hands, pose, costume, background, camera, crop, lighting, palette and all props.','Do not turn an emotion correction into a beauty redesign or a different character.'],
 hand:['EDIT TARGET: HANDS ONLY.','Correct hand anatomy, finger count/shape, grip and hand-object contact only.','LOCK: face, hair, body, pose except the smallest wrist/finger adjustment required, costume, background, camera, lighting and palette.'],
 pose:['EDIT TARGET: BODY POSE / BLOCKING ONLY.','Correct body orientation, limb placement and balance to match ACTION and BODY ACTING.','LOCK: character identity, face design, hair, costume design/colors, background set geometry, scene lighting and palette.','Do not invent a heroic or combat pose unless the CUT specification explicitly requires it.'],
 background:['EDIT TARGET: BACKGROUND / SET ONLY.','Correct architecture, furniture, doors, windows, props and spatial layout to match BACKGROUND MASTER and SCENE LOOK.','LOCK the character as much as possible: identity, face, expression, hair, costume, pose, scale and screen position.','Do not relocate the character just to improve composition.'],
 camera:['EDIT TARGET: CAMERA / FRAMING ONLY.','Recompose to match SHOT and CAMERA while preserving the same narrative instant, action and emotion.','LOCK character identity/costume and set design/scene look. Camera changes may require reprojecting pose or background, but must not change story content.'],
 master:['EDIT TARGET: ONLY DEVIATIONS FROM REGISTERED MASTER ASSETS.','Compare the current CUT with CHARACTER/BACKGROUND/PROP MASTER references and repair only mismatched identity, costume, prop design or set geometry.','LOCK all already-correct areas, the current action, pose, expression, camera, crop, lighting and scene palette.','This is a continuity repair, not a redesign.'],
 continuity:['EDIT TARGET: ONLY THE CONTINUITY QC FAILURES LISTED IN USER EDIT INSTRUCTION.','Repair the smallest possible set of pixels/regions needed to resolve those exact continuity findings.','You MAY correct lighting/color temperature, character identity/hair, wardrobe, background geometry, prop continuity, blood/injury/clothing-damage state when and only when the QC instruction identifies that category.','LOCK every category not identified by QC. Preserve story beat, action, expression, pose, camera, crop, subject scale and screen position unless a listed QC error mathematically requires a small local adjustment.','Never redesign the CUT. This is an automated continuity repair candidate.']
};

export async function POST(req){
 try{
  if(!process.env.OPENAI_API_KEY)return Response.json({error:'OPENAI_API_KEY가 없습니다.'},{status:503});
  const body=await req.json();
  const {cutId,episodeId='',mode='expression',instruction='',sourceImage='',references=[],scene='',sceneLook={},storyActing={},characterState={},spatialContext={},shot='',camera='',action='',characters=[],backgrounds=[],props=[],projectStyle='',storyVisual=''}=body||{};
  if(!sourceImage||!/^data:image\/(png|jpeg|webp);base64,/i.test(sourceImage))return Response.json({error:'수정할 원본 CUT 이미지가 필요합니다.'},{status:400});
  const rules=MODE_RULES[mode]||MODE_RULES.expression;
  const text=[
   'TASK: PARTIAL EDIT of an existing Korean webtoon CUT.',
   'The FIRST image is the current CUT and is the primary pixel/composition reference. Do not create a different scene.',
   ...rules,
   instruction?`USER EDIT INSTRUCTION: ${instruction}`:'',
   `EPISODE/CUT: ${episodeId} / ${String(cutId).padStart(3,'0')}`,
   `SCENE: ${scene}`,`SHOT: ${shot}`,`CAMERA: ${camera}`,`ACTION: ${action}`,
   `CHARACTERS: ${(characters||[]).join(', ')}`,`BACKGROUNDS: ${(backgrounds||[]).join(', ')}`,`PROPS: ${(props||[]).join(', ')}`,
   storyActing?.storyBeat?`STORY BEAT: ${storyActing.storyBeat}`:'',
   characterState&&Object.keys(characterState).length?`CHARACTER STATE LOCK: ${JSON.stringify(characterState)}`:'',
   spatialContext?.spaceMap?`SPACE MAP LOCK: ${JSON.stringify(spatialContext.spaceMap)}`:'',
   spatialContext?.cameraPlan?`CAMERA PLAN: ${JSON.stringify(spatialContext.cameraPlan)}`:'',
   storyActing?.knowledgeState?`CHARACTER KNOWLEDGE: ${storyActing.knowledgeState}`:'',
   storyActing?.primaryEmotion?`EMOTION: ${storyActing.primaryEmotion} ${storyActing.secondaryEmotion||''} ${storyActing.emotionIntensity||''}/10`:'',
   storyActing?.facialActing?`FACIAL ACTING: ${storyActing.facialActing}`:'',
   storyActing?.bodyActing?`BODY ACTING: ${storyActing.bodyActing}`:'',
   storyActing?.gazeTarget?`GAZE: ${storyActing.gazeTarget}`:'',
   storyActing?.avoidActing?`AVOID ACTING: ${storyActing.avoidActing}`:'',
   sceneLook?`SCENE LOOK LOCK: ${JSON.stringify(sceneLook)}`:'',
   projectStyle?`WEBTOON STYLE: ${projectStyle}`:'',
   storyVisual?`VISUAL BIBLE: ${String(storyVisual).slice(0,5000)}`:'',
   'TEXT RULE: do not add speech bubbles, captions, SFX letters, logos, watermarks or any text.',
   'FINAL CHECK: The result must look like the SAME CUT after a localized production correction, not a fresh alternate illustration.'
  ].filter(Boolean).join('\n');

  const content=[{type:'input_text',text},{type:'input_image',image_url:sourceImage,detail:'high'}];
  for(const ref of references||[]){
   if(!ref?.dataUrl)continue;
   content.push({type:'input_text',text:`MASTER REFERENCE · ${ref.type||'ASSET'} · ${ref.name||ref.id||''}. Use only for continuity correction; do not copy its pose/camera unless the selected edit mode requires it.`});
   content.push({type:'input_image',image_url:ref.dataUrl,detail:'high'});
  }
  const payload={model:process.env.OPENAI_ORCHESTRATOR_MODEL||'gpt-5',input:[{role:'user',content}],tools:[{type:'image_generation',model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-1.5',quality:'high',input_fidelity:'high',output_format:'webp',output_compression:94}],tool_choice:{type:'image_generation'}};
  const r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const data=await r.json();
  if(!r.ok)return Response.json({error:data?.error?.message||'OpenAI partial edit request failed',details:data?.error||null},{status:r.status});
  const b64=imageResult(data);
  if(!b64)return Response.json({error:'부분 수정 이미지 결과를 찾지 못했습니다.',responseId:data?.id||null},{status:502});
  return Response.json({ok:true,image:`data:image/webp;base64,${b64}`,model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-1.5',mode,responseId:data.id});
 }catch(err){
  console.error(err);
  return Response.json({error:err?.message||'Unexpected server error'},{status:500});
 }
}
