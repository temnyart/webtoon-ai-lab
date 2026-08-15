export const runtime = 'nodejs';
export const maxDuration = 300;

function imageResult(response){
  for(const item of response?.output || []){
    if(item?.type === 'image_generation_call'){
      if(item.result) return item.result;
      if(item.b64_json) return item.b64_json;
      if(item.output?.b64_json) return item.output.b64_json;
    }
    for(const content of item?.content || []){
      if(content?.type === 'output_image' && (content.image_base64 || content.b64_json)) return content.image_base64 || content.b64_json;
    }
  }
  return null;
}

export async function POST(req){
  try{
    if(!process.env.OPENAI_API_KEY) return Response.json({error:'OPENAI_API_KEY가 Vercel 환경변수에 등록되지 않았습니다.'},{status:503});
    const body = await req.json();
    const {cutId,scene='',sceneLook=null,sceneDirecting=null,storyActing=null,characterState={},spatialContext={},continuityReference=null,storyboardReference=null,storyboardNote='',prompt,references=[],continuity,shot,camera,action,dialogue='',characters=[],backgrounds=[],props=[],masterLock='strict',compositionLock='strict',generationPreset=null,projectStyle='',storyVisual='',characterCanon='',episodeContext='',episodeId=''} = body || {};
    if(!prompt) return Response.json({error:'prompt is required'},{status:400});
    if(references.length > 6) return Response.json({error:'MASTER reference는 최대 6개까지 전송할 수 있습니다.'},{status:400});
    const strict = masterLock === 'strict';
    const compositionStrict = compositionLock === 'strict';
    const presetQuality=['low','medium','high'].includes(generationPreset?.quality)?generationPreset.quality:'high';
    const presetInputFidelity=['low','high'].includes(generationPreset?.inputFidelity)?generationPreset.inputFidelity:'high';
    const presetFocus=['speed','balanced','final','character','background'].includes(generationPreset?.focus)?generationPreset.focus:'balanced';
    const presetCompression=Math.max(70,Math.min(100,Number(generationPreset?.outputCompression)||92));
    const presetRules=[
      `GENERATION PRESET: ${generationPreset?.name||generationPreset?.id||'Standard'} · quality ${presetQuality} · focus ${presetFocus}.`,
      ...(presetFocus==='speed'?['DRAFT SPEED FOCUS: preserve required identity/composition, but favor fast visual validation over micro-detail. Do not add unnecessary texture or decorative detail.']:[]),
      ...(presetFocus==='final'?['FINAL QUALITY FOCUS: resolve clean linework, anatomy, facial features, material edges, costume details and background construction carefully while preserving every production lock.']:[]),
      ...(presetFocus==='character'?['CHARACTER IDENTITY FOCUS: character MASTER identity outranks stylistic novelty. Pay exceptional attention to face proportions, eye spacing, hair silhouette, age impression, costume construction and body proportions. Do not beautify or redesign the person.']:[]),
      ...(presetFocus==='background'?['BACKGROUND CONTINUITY FOCUS: background MASTER / SPACE MAP geometry outranks cinematic novelty. Pay exceptional attention to walls, doors, windows, furniture, pillars, floor levels, perspective anchors and object placement. Do not redesign the set.']:[])
    ];

    const identityRules = strict ? [
      'STRICT MASTER LOCK IS ACTIVE. Treat every supplied MASTER image as a binding production asset, not as inspiration.',
      'CHARACTER MASTER: preserve the same recognizable person. Lock face shape, eye shape/spacing, nose/mouth proportions, hair silhouette, bangs/parting, body proportions, age impression, costume cut, costume layering, and major colors. Do not redesign, beautify, age up/down, change hairstyle, or replace with a similar person.',
      'BACKGROUND MASTER: treat it as the SAME physical set. Lock room/building geometry, wall layout, floor level, door/window positions, major furniture positions, material language, and architectural proportions. Do not redesign the room, swap furniture, add a different room, move the bed/table/window/door, or invent a new set.',
      'PROP MASTER: preserve silhouette, construction, materials and identifiable details. Do not invent a substitute.'
    ] : ['Use supplied MASTER references consistently while allowing small stylistic adaptation.'];
    const compositionRules = compositionStrict ? [
      'STRICT COMPOSITION LOCK IS ACTIVE.',
      'The CUT production specification is literal blocking. Perform ONLY the requested action and pose. Do not invent a heroic pose, fighting stance, crossed arms, weapon pose, dramatic gesture, walking pose, or camera-facing pose unless explicitly requested.',
      'Subject position must follow the shot/camera/action. If the action says sitting, lying, kneeling, turning, reaching, looking, or standing, preserve that exact state. Do not change seated to standing, lying to sitting, or side view to frontal.',
      'Do not relocate the character to a more visually dramatic place in the set. Place the subject where the action logically occurs in the referenced background.',
      'Do not add extra people, props, weapons, furniture, doors, windows, stairs, pillars, decorations, or scenery unless they are explicitly required.',
      'Camera composition must obey SHOT and CAMERA. Do not default to centered portrait composition. Preserve negative space and off-center blocking when implied by the specification.',
      'If a background MASTER is present, the set continuity has higher priority than cinematic novelty.'
    ] : ['Follow the requested pose, blocking and camera while allowing minor compositional adaptation.'];
    const sceneRules = sceneLook?.locked ? [
      'STRICT SCENE VISUAL LOCK IS ACTIVE. All CUTs in this SCENE must look as if photographed/drawn moments apart under the exact same environmental conditions.',
      `SCENE: ${scene||''}`,
      `TIME OF DAY LOCK: ${sceneLook.time||''}`,
      `WEATHER LOCK: ${sceneLook.weather||''}`,
      `COLOR TEMPERATURE LOCK: ${sceneLook.temperature||''}`,
      `PALETTE LOCK: ${sceneLook.palette||''}`,
      `LIGHTING LOCK: ${sceneLook.lighting||''}`,
      `BACKGROUND/SET LOCK: ${sceneLook.background||''}`,
      `SCENE NOTES: ${sceneLook.notes||''}`,
      'Do not reinterpret the time of day between cuts. Do not switch cool light to warm light or warm light to cool light.',
      'Keep key-light direction, ambient fill, practical-light intensity, exposure, black level, saturation, skin tone, costume colors, wall/floor colors and background brightness consistent across the scene.',
      'A candle/lantern may appear warm locally, but it must NOT recolor the entire scene if the locked scene is cool dawn/night.',
      'Different shot sizes may change depth of field and visible background area, but NOT white balance, overall grade, weather, time, or material colors.'
    ] : [];
    const content=[{type:'input_text',text:[
      'TASK: Render exactly one vertical Korean martial-arts webtoon CUT from a locked production specification.',
      'PRIORITY ORDER: 1) CUT STORY BEAT / KNOWLEDGE / ACTING, 2) APPROVED STORYBOARD composition if supplied, 3) CUT action/pose/blocking, 4) SCENE VISUAL LOCK, 5) SPACE MAP/BACKGROUND MASTER continuity, 6) CHARACTER/PROP MASTER identity, 7) SHOT/CAMERA, 8) visual style, 9) episode/lore context.',
      ...presetRules,
      ...(sceneDirecting ? [
        'SCENE DIRECTING CONTEXT:',
        `SCENE PURPOSE: ${sceneDirecting.purpose||''}`,
        `SCENE EMOTION ARC: ${sceneDirecting.emotionArc||''}`
      ] : []),
      ...(storyActing ? [
        'CUT STORY DIRECTOR / ACTING LOCK — THIS IS AUTHORITATIVE FOR PERFORMANCE:',
        `STORY BEAT: ${storyActing.storyBeat||''}`,
        `PREVIOUS CONTEXT: ${storyActing.previousContext||''}`,
        `CHARACTER KNOWLEDGE STATE: ${storyActing.knowledgeState||''}`,
        `CURRENT INTENTION: ${storyActing.intention||''}`,
        `PRIMARY EMOTION: ${storyActing.primaryEmotion||''}`,
        `SECONDARY EMOTION: ${storyActing.secondaryEmotion||''}`,
        `EMOTION INTENSITY: ${storyActing.emotionIntensity??''}/10`,
        `FACIAL ACTING — FOLLOW LITERALLY: ${storyActing.facialActing||''}`,
        `BODY ACTING — FOLLOW LITERALLY: ${storyActing.bodyActing||''}`,
        `GAZE TARGET: ${storyActing.gazeTarget||''}`,
        `AVOID ACTING — DO NOT SHOW ANY OF THESE: ${storyActing.avoidActing||''}`,
        `NEXT BEAT: ${storyActing.nextBeat||''}`,
        'Do not make the character emotionally aware of information they have not learned yet. Do not skip ahead to the emotion of the next CUT.'
      ] : []),
      ...(characterState && Object.keys(characterState).length ? [
        'CHARACTER STATE LOCK — persistent visible state:',
        JSON.stringify(characterState),
        'Preserve injury, blood/dirt, clothing damage, equipment, hair and other persistent physical state unless the current CUT explicitly changes it.'
      ] : []),
      ...(spatialContext?.spaceMap ? [
        'SPACE MAP LOCK — same physical set across camera angles:',
        JSON.stringify(spatialContext.spaceMap),
        'Fixed architecture and major furniture may not teleport or swap walls.'
      ] : []),
      ...(spatialContext?.cameraPlan ? [
        'CAMERA PLAN:',
        JSON.stringify(spatialContext.cameraPlan)
      ] : []),
      ...(storyboardReference ? [
        'APPROVED STORYBOARD COMPOSITION LOCK IS ACTIVE.',
        'Match its camera side, framing, character screen positions, body blocking, action timing and major negative space.',
        'Use the storyboard ONLY for composition/staging. Do NOT copy its rough monochrome drawing style.',
        storyboardNote ? `DIRECTOR CONTE NOTE: ${storyboardNote}` : ''
      ] : []),
      ...sceneRules,
      ...identityRules,
      ...compositionRules,
      'WEBTOON STYLE: clean controlled line art, 2-3 step cel shading, readable Korean action-webtoon composition. Avoid photorealism, 3D render appearance, glossy novel-cover illustration, excessive skin texture, and unnecessary ornaments.',
      'TEXT RULE: do not render speech bubbles, captions, sound effects, letters, logos, watermarks, or UI. Dialogue is context only and must not appear as text in the image.',
      `Episode: ${episodeId}`,
      `CUT: ${String(cutId).padStart(3,'0')}`,
      `Continuity: ${continuity||'LOCKED'}`,
      `Characters required: ${(characters||[]).join(', ')||'none'}`,
      `Backgrounds required: ${(backgrounds||[]).join(', ')||'none'}`,
      `Props required: ${(props||[]).join(', ')||'none'}`,
      `SHOT: ${shot||''}`,
      `CAMERA: ${camera||''}`,
      `ACTION / BLOCKING — MUST FOLLOW LITERALLY: ${action||''}`,
      dialogue ? `Dialogue/SFX context only, DO NOT DRAW TEXT: ${dialogue}` : '',
      `CUT-SPECIFIC IMAGE PROMPT — obey only if consistent with the locked action and MASTER assets: ${prompt}`,
      projectStyle ? `Visual style: ${projectStyle}` : '',
      storyVisual ? `Visual Bible constraints: ${storyVisual}` : '',
      characterCanon ? `Character canon for identity/personality only. Do not use it to invent a different pose or location:\n${characterCanon.slice(0,8000)}` : '',
      episodeContext ? `Episode context for narrative continuity only. Do not copy unrelated events, poses, locations, or props from this context:\n${episodeContext}` : '',
      'FINAL CHECK BEFORE RENDERING: same SCENE color temperature/white balance/weather/lighting as the SCENE LOCK and previous approved CUT; same set as background MASTER; same character as character MASTER; requested pose only; requested position only; requested camera only; no unrelated action; no extra objects; no text.'
    ].filter(Boolean).join('\n')}];
    if(storyboardReference && /^data:image\/(png|jpeg|webp);base64,/i.test(storyboardReference)){
      content.push({type:'input_text',text:'APPROVED STORYBOARD · COMPOSITION/BLOCKING REFERENCE ONLY. Match framing and staging; render in the final locked webtoon style.'});
      content.push({type:'input_image',image_url:storyboardReference,detail:'high'});
    }
    if(continuityReference?.dataUrl && /^data:image\/(png|jpeg|webp);base64,/i.test(continuityReference.dataUrl)){
      content.push({type:'input_text',text:`PREVIOUS APPROVED CUT CONTINUITY REFERENCE — CUT ${String(continuityReference.cutId||'').padStart(3,'0')}. Use this image ONLY as the authoritative reference for scene color grade, white balance, light direction, exposure, skin tone, costume colors, background brightness and rendering density. Do NOT copy its pose, camera angle, crop or action into the current CUT. Current CUT shot/camera/action remain authoritative.`});
      content.push({type:'input_image',image_url:continuityReference.dataUrl,detail:'high'});
    }
    let ri=0;
    for(const ref of references){
      if(ref?.dataUrl && /^data:image\/(png|jpeg|webp);base64,/i.test(ref.dataUrl)){
        ri++;
        content.push({type:'input_text',text:
          ref.type==='BACKGROUND'
          ? `BACKGROUND MASTER ${ri}: ${ref.name||ref.id||''}. This is the exact physical set for this CUT. Preserve geometry and object positions. Do not redesign or substitute the environment.`
          : ref.type==='CHARACTER'
          ? `CHARACTER MASTER ${ri}: ${ref.name||ref.id||''}. This is the exact character identity. Preserve face, hair, age, proportions and costume. Pose must still come only from the CUT specification.`
          : `PROP MASTER ${ri}: ${ref.name||ref.id||''}. Preserve this exact prop design.`
        });
        content.push({type:'input_image',image_url:ref.dataUrl,detail:'high'});
      }
    }
    const payload={
      model: process.env.OPENAI_ORCHESTRATOR_MODEL || 'gpt-5',
      input:[{role:'user',content}],
      tools:[{type:'image_generation',model:process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1.5',quality:presetQuality,size:'1024x1536',input_fidelity:presetInputFidelity,output_format:'webp',output_compression:presetCompression}],
      tool_choice:{type:'image_generation'}
    };
    const r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data=await r.json();
    if(!r.ok) return Response.json({error:data?.error?.message || 'OpenAI API request failed',details:data?.error || null},{status:r.status});
    const b64=imageResult(data);
    if(!b64) return Response.json({error:'이미지 결과를 찾지 못했습니다.',responseId:data?.id || null},{status:502});
    return Response.json({ok:true,cutId,image:`data:image/webp;base64,${b64}`,responseId:data.id,model:process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1.5',preset:generationPreset?.id||'standard',quality:presetQuality,inputFidelity:presetInputFidelity});
  }catch(err){
    console.error(err);
    return Response.json({error:err?.message || 'Unexpected server error'},{status:500});
  }
}
