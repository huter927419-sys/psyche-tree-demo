import type { BookId } from '../types'
import type { Locale } from '../../i18n/locale'
import { resolveContentLocale, toTraditionalChinese } from '../../i18n/traditionalChinese'
import type { BookContent } from './createBook'

type L = Record<'zh' | 'en' | 'ja', string>

export interface DimensionTheory {
  /** Esoteric seal tag on the question (观·界石) */
  sealTag: L
  /** Ground psychology + mystic reading for guides */
  guideLine: L
  /** Reserved for guide/oracle context; not shown on answer cards */
  sealResonant: L
  /** Reserved for guide/oracle context; not shown on answer cards */
  sealStrained: L
}

export interface BookTheoryLayer {
  volumeField: L
  sixfoldFacet: L
  dimensions: DimensionTheory[]
  integration: DimensionTheory
}

const dim = (
  sealTag: L,
  guideLine: L,
  sealResonant: L,
  sealStrained: L,
): DimensionTheory => ({ sealTag, guideLine, sealResonant, sealStrained })

const THEORY: Record<BookId, BookTheoryLayer> = {
  'psyche-tree': {
    volumeField: { zh: '心湖场', en: 'Inner-lake field', ja: '心湖場' },
    sixfoldFacet: { zh: '六向·心象', en: 'Sixfold · Mindscape', ja: '六向·心象' },
    dimensions: [
      dim(
        { zh: '观·界石', en: 'Boundary stone', ja: '観·界石' },
        {
          zh: '底层照见自我边界；玄义读作外缘靠近时，界石如何在心湖场中立',
          en: 'Ground: self-boundary. Mystic: how the boundary stone stands when the outer shore leans close',
          ja: '底層で照見：自己境界。玄義では外縁接近時、界石が心湖場にどう立つか',
        },
        {
          zh: '【雾中释义】界石稳固，灵息不因外缘轻易改道——诚心所择，场域自明。',
          en: '[Mist reading] The boundary stone holds; spirit-tide does not reroute at every outer call—sincerity leaves a clear trace.',
          ja: '【霧中释义】界石は穏；霊息は外縁に易々改道せず——誠心の選択、場域自明。',
        },
        {
          zh: '【雾中释义】界石未稳或偏高，外缘一动心湖先起纹——仍在寻岸。',
          en: '[Mist reading] Stone unset or too tight; outer stir ripples the lake first—still seeking shore.',
          ja: '【霧中释义】界石未穏か偏高；外縁動けば湖先に紋——岸をなお求む。',
        },
      ),
      dim(
        { zh: '观·映波', en: 'Ripple mirror', ja: '観·映波' },
        {
          zh: '底层照见情绪觉察；玄义读作湖纹起时，先照见抑或先被浪带走',
          en: 'Ground: affect awareness. Mystic: when ripples rise, mirror first or wave carries you first',
          ja: '底層で照見：感情覚察。玄義では湖紋起時、先に照見か先に浪か',
        },
        {
          zh: '【雾中释义】湖纹先被看见，心流不追浪——灵息自观而升，留痕于雾。',
          en: '[Mist reading] Ripples seen before riding; flow does not chase waves—spirit-tide rises in witness.',
          ja: '【霧中释义】湖紋先見；心流は浪を追わず——霊息は観により昇る。',
        },
        {
          zh: '【雾中释义】浪先于镜，外缘扰动先入卷——映波之觉仍在养成。',
          en: '[Mist reading] Wave before mirror; outer perturbation enters the rite first—ripple-sight still growing.',
          ja: '【霧中释义】浪が鏡に先立つ；外の扰動が先に入巻——映波の覚はまだ養われている。',
        },
      ),
      dim(
        { zh: '观·定息', en: 'Still breath', ja: '観·定息' },
        {
          zh: '底层照见情绪调节；玄义读作波动之后，湖如何归镜、灵息如何回源',
          en: 'Ground: regulation after arousal. Mystic: how lake returns to mirror and tide to source',
          ja: '底層で照見：感情調節。玄義では波動後、湖がどのように鏡へ、霊息がどのように源へ',
        },
        {
          zh: '【雾中释义】定息有归处，如湖归镜、烛重明——能量不耗散于外场。',
          en: '[Mist reading] Still breath finds home—lake to mirror, flame relit—energy not spent into the outer field.',
          ja: '【霧中释义】定息に帰処；湖は鏡へ、灯は再明——エネルギー外場に耗散せず。',
        },
        {
          zh: '【雾中释义】归息路偏长，叶仍逐风——场域未散，候下一泊之岸。',
          en: '[Mist reading] Long path back; leaf still follows wind—the field holds; wait for the next shore.',
          ja: '【霧中释义】帰息路長し；葉はまだ風に従う——場域未散、次の岸を待つ。',
        },
      ),
      dim(
        { zh: '观·自照', en: 'Inner mirror', ja: '観·自照' },
        {
          zh: '底层照见内省清晰度；玄义读作向内在照镜子，真影显抑或雾中行',
          en: 'Ground: introspective clarity. Mystic: inward mirror—true shadow or walking in fog',
          ja: '底層で照見：内省の明瞭。玄義では内向の鏡——真影か霧中行か',
        },
        {
          zh: '【雾中释义】静湖自照，自观回路活跃——整象之一面在雾中缓缓显形。',
          en: '[Mist reading] Still lake mirrors; inner sight active—one facet of the whole image forms in mist.',
          ja: '【霧中释义】静湖自照；自観の回路活性——整象の一面が霧に显形。',
        },
        {
          zh: '【雾中释义】镜蒙雾，自照少行——真影仍在深处，候诚心再临。',
          en: '[Mist reading] Fog on the glass; little mirroring—true shadow waits deeper for sincere return.',
          ja: '【霧中释义】鏡に霧；自照稀——真影は深処に、誠心の再臨を待つ。',
        },
      ),
      dim(
        { zh: '观·内守', en: 'Tree-heart guard', ja: '観·内守' },
        {
          zh: '底层照见压力下自我稳定；玄义读作外风起时，树心如何内守',
          en: 'Ground: stability under stress. Mystic: when outer winds rise, how tree-heart guards within',
          ja: '底層で照見：圧力下の安定。玄義では外風起時、樹心をどう内守するか',
        },
        {
          zh: '【雾中释义】树心内守，干稳而不拒光——外缘过枝，整象不散。',
          en: '[Mist reading] Tree-heart holds; trunk steady yet open to light—outer winds pass; whole image intact.',
          ja: '【霧中释义】樹心内守；幹穏で光を拒まず——外縁過ぎても整象不散。',
        },
        {
          zh: '【雾中释义】外风易入干中，内守之垣尚在养——请允许多次召回。',
          en: '[Mist reading] Outer wind enters the trunk; inner wall still growing—allow many returns to guard.',
          ja: '【霧中释义】外風幹に入りやすし；内守の垣はまだ養われている——何度も召還を許せ。',
        },
      ),
      dim(
        { zh: '观·根息', en: 'Root breath', ja: '観·根息' },
        {
          zh: '底层照见自我连续性与源感；玄义读作感内在之源，根息深抑或舟暂泊',
          en: 'Ground: self-continuity and sense of source. Mystic: feeling inner root—deep soil or drifting boat',
          ja: '底層で照見：自己連続と源感。玄義では内なる源を感じるか——根が深いか、舟が仮泊するか',
        },
        {
          zh: '【雾中释义】根息深扎暗土，旧痕与源呼应——树脉有回处，灵息自根向冠。',
          en: '[Mist reading] Root-breath in dark soil; old traces echo source—tree-path returns; tide root to crown.',
          ja: '【霧中释义】根息暗土に深く；旧痕と源呼应——樹脈に帰処、霊息根より冠へ。',
        },
        {
          zh: '【雾中释义】源在深处未常触，如舟暂泊——根仍在暗土等待辨认。',
          en: '[Mist reading] Source felt far; boat moored awhile—root still waits in dark soil to be known.',
          ja: '【霧中释义】源は深く未常触；舟暫泊の如く——根は暗土で認められるを待つ。',
        },
      ),
    ],
    integration: dim(
      { zh: '观·整象', en: 'Whole image', ja: '観·整象' },
      {
        zh: '底层照见自我整合；玄义读作界、湖、根交织时，整象偏明抑或仍雾',
        en: 'Ground: self-integration. Mystic: boundary, lake, root woven—whole clear or still mist',
        ja: '底層で照見：自己統合。玄義では界湖根織り——整象明かなお霧か',
      },
      {
        zh: '【雾中释义】界湖根一脉相通，六向之一面与此刻整象共鸣——候六卷齐时神示更全。',
        en: '[Mist reading] Boundary, lake, root one pulse—this facet resonates with the whole— fuller oracle when six align.',
        ja: '【霧中释义】界湖根一脉相通——此面向整象と共鳴；六巻揃えば神示更全。',
      },
      {
        zh: '【雾中释义】整象如雾，诸印仍对话——非断优劣，只在雾中留痕。',
        en: '[Mist reading] Whole image still mist; seals still in dialogue—not judgment, only trace in fog.',
        ja: '【霧中释义】整象如霧；諸印なお対話——優劣を断たず、霧に痕のみ。',
      },
    ),
  },
  'emotional-flow': {
    volumeField: { zh: '情流域', en: 'Feeling-current field', ja: '情流域' },
    sixfoldFacet: { zh: '六向·映心', en: 'Sixfold · Heart Mirror', ja: '六向·映心' },
    dimensions: [
      dim(
        { zh: '观·流势', en: 'Flow tide', ja: '観·流勢' },
        {
          zh: '底层照见情感强度与平稳；玄义读作情湖之流势，静湖抑或激流',
          en: 'Ground: affect intensity and steadiness. Mystic: tide of the feeling lake—still or torrent',
          ja: '底層で照見：感情強度と平穏。玄義では情湖の流勢——静湖か激流か',
        },
        {
          zh: '【雾中释义】情湖平稳，灵息清澈——场域扰动小，映心不追分。',
          en: '[Mist reading] Feeling lake steady; spirit-tide clear—field quiet; heart mirror does not chase scores.',
          ja: '【霧中释义】情湖平穏；霊息澄——場域扰動小、映心は点数を追わず。',
        },
        {
          zh: '【雾中释义】激流穿石，能量涨落大——河终将入海，请信节奏。',
          en: '[Mist reading] Torrent through stone; great tide swings—the river reaches sea; trust your rhythm.',
          ja: '【霧中释义】激流穿石；霊息涨落大——河は海に達す、节奏を信せ。',
        },
      ),
      dim(
        { zh: '观·流言', en: 'Feeling word', ja: '観·流言' },
        {
          zh: '底层照见情感表达；玄义读作情流如何化为可见之语、光印如何外显',
          en: 'Ground: emotional expression. Mystic: how feeling becomes visible word and outward seal',
          ja: '底層で照見：感情表出。玄義では情流どのように可視の言葉・光印となるか',
        },
        {
          zh: '【雾中释义】柔光外显，内外同频——雾收诚心，不收戏语。',
          en: '[Mist reading] Soft light outward; inner and outer one tone—mist receives sincerity, not jest.',
          ja: '【霧中释义】柔光外显；内外同調——霧は誠心のみ受く。',
        },
        {
          zh: '【雾中释义】情藏深雾，语未成行——表达之路仍在寻光。',
          en: '[Mist reading] Feeling hides in deep fog; words not yet formed—the path of expression seeks light.',
          ja: '【霧中释义】情は深霧に在り；語未成行——表出の路はなお光を求む。',
        },
      ),
      dim(
        { zh: '观·流联', en: 'Flow bond', ja: '観·流聯' },
        {
          zh: '底层照见他人情感靠近时的反应；玄义读作缘丝场中耦合之温与距',
          en: 'Ground: response to others’ feeling drawing near. Mystic: warmth and distance in bond-thread field',
          ja: '底層で照見：他者感情接近への反応。玄義では縁糸場の温と距',
        },
        {
          zh: '【雾中释义】缘温可传，场域耦合适度——可近可守，如柔丝之桥。',
          en: '[Mist reading] Bond-warmth flows; field coupling balanced—near and guard, silk bridge between.',
          ja: '【霧中释义】縁温伝わる；場域結合適度——柔糸の橋の如く。',
        },
        {
          zh: '【雾中释义】场域偏疏或盾立——远星相望亦是情流一面，候温度合适。',
          en: '[Mist reading] Field distant or shield raised—stars apart is also a face of feeling; wait for fit warmth.',
          ja: '【霧中释义】場域疎か盾立——遠星相望も情流の一面；温の合适を待つ。',
        },
      ),
      dim(
        { zh: '观·流身', en: 'Flow body', ja: '観·流身' },
        {
          zh: '底层照见情在身中的显れ；玄义读作身心同频抑或风叶根なし',
          en: 'Ground: somatic emotion. Mystic: body and feeling in sync, or leaf without root',
          ja: '底層で照見：身体への感情显れ。玄義では身心同調か風葉根なしか',
        },
        {
          zh: '【雾中释义】身情同拍，稳流绕岸——灵息可读身体之语。',
          en: '[Mist reading] Body and feeling one rhythm; steady river along shore—spirit-tide reads the body’s speech.',
          ja: '【霧中释义】身情同拍；霊息は身体の語を読む。',
        },
        {
          zh: '【雾中释义】身感飘浮或紧绑——请先向岸索取一次深呼吸。',
          en: '[Mist reading] Body floats or binds—take one breath from the shore first.',
          ja: '【霧中释义】身感漂うか緊ぶ——岸から一度深呼吸を。',
        },
      ),
      dim(
        { zh: '观·流息', en: 'Flow rest', ja: '観·流息' },
        {
          zh: '底层照见情感恢复力；玄义读作起伏之后，湖能否重归明镜',
          en: 'Ground: recovery after swings. Mystic: after swell, can the lake mirror again',
          ja: '底層で照見：感情回復力。玄義では起伏後、湖は再び鏡となるか',
        },
        {
          zh: '【雾中释义】湖静镜明，恢复如暮光中的叶——树与雾皆不催促。',
          en: '[Mist reading] Lake still, mirror bright—recovery like leaves at dusk; tree and mist do not hurry.',
          ja: '【霧中释义】湖静鏡明——樹も霧も急がせない。',
        },
        {
          zh: '【雾中释义】小舟迟归，雾径漫长——每向前一步，都在河上留光痕。',
          en: '[Mist reading] Boat returns late; mist path long—each step leaves light on the river.',
          ja: '【霧中释义】小舟帰遅し；霧径長——一歩ごとに河上光痕。',
        },
      ),
      dim(
        { zh: '观·流变', en: 'Flow change', ja: '観·流変' },
        {
          zh: '底层照见面对变化的情感适应；玄义读作情潮遇变，化为新芽抑或收紧',
          en: 'Ground: adaptation to change. Mystic: feeling tide meets change—new sprout or tightening',
          ja: '底層で照見：変化への適応。玄義では情潮にに遇う変化——新芽か収束か',
        },
        {
          zh: '【雾中释义】变化作养分，种子破土——情流不亡于变，而长于变。',
          en: '[Mist reading] Change as nourishment; seed breaks soil—feeling does not die in change but grows through it.',
          ja: '【霧中释义】変化を養分に；種破土——情流は変に亡びず変に長ず。',
        },
        {
          zh: '【雾中释义】变来情紧或散——山守不动，候更清晰的季节再择印。',
          en: '[Mist reading] Change tightens or scatters feeling—mountain guards; wait for clearer season to choose again.',
          ja: '【霧中释义】変来れ情緊か散——山守不动、更に澄む季を待て。',
        },
      ),
    ],
    integration: dim(
      { zh: '流·整湖', en: 'Flow · Whole lake', ja: '流·整湖' },
      {
        zh: '底层照见情感整合；玄义读作诸情归湖，整湖澄明抑或仍浊',
        en: 'Ground: emotional integration. Mystic: all feelings return to one lake—clear or still clouded',
        ja: '底層で照見：感情統合。玄義では諸情帰湖——澄かなお濁か',
      },
      {
        zh: '【雾中释义】诸情归湖，六向之一面与此刻整湖共鸣——非汇总，只一气照见。',
        en: '[Mist reading] Feelings return to lake; this facet resonates with the whole—not summary, one breath of mirroring.',
        ja: '【霧中释义】諸情帰湖——総括せず、一気に照見。',
      },
      {
        zh: '【雾中释义】整湖如雾，诸脉交错——请信河会引你归岸。',
        en: '[Mist reading] Whole lake still mist; currents cross—trust the river leads you to shore.',
        ja: '【霧中释义】整湖如霧；諸脈交錯——河が岸へ導くを信せ。',
      },
    ),
  },
  'mind-light': {
    volumeField: { zh: '思脉场', en: 'Mind-vein field', ja: '思脈場' },
    sixfoldFacet: { zh: '六向·明思', en: 'Sixfold · Mind Light', ja: '六向·明思' },
    dimensions: [
      dim(
        { zh: '观·思流', en: 'Thought stream', ja: '観·思流' },
        {
          zh: '底层照见思维路径；玄义读作岔路前思脉如何分叉、不评判只留痕',
          en: 'Ground: thought pathways. Mystic: before the fork, how mind-veins branch—trace, not verdict',
          ja: '底層で照見：思考経路。玄義では岐路前、思脈どう分かれるか',
        },
        {
          zh: '【雾中释义】思流分明，如星脉各行其道——雾中只留痕，不断优劣。',
          en: '[Mist reading] Thought streams clear; star-veins each their path—only trace in mist, no ranking.',
          ja: '【霧中释义】思流分明——優劣を断たず、霧に痕のみ。',
        },
        {
          zh: '【雾中释义】思流易散或滞，雾中多影——请先息定再择下一印。',
          en: '[Mist reading] Thought scatters or stalls; many shadows in fog—still breath, then next seal.',
          ja: '【霧中释义】思流散るか滞る；霧中多影——先に息定めよ。',
        },
      ),
      dim(
        { zh: '观·学纹', en: 'Learning trace', ja: '観·学紋' },
        {
          zh: '底层照见学习吸收；玄义读作新纹入卷，写入旧痕抑或拒收于雾',
          en: 'Ground: learning absorption. Mystic: new trace enters volume—written into memory or refused in fog',
          ja: '底層で照見：学習吸収。玄義では新紋入巻——旧痕に書くか霧に拒むか',
        },
        {
          zh: '【雾中释义】新纹可入思脉，旧痕与新光相织——诚心则雾留痕。',
          en: '[Mist reading] New traces enter mind-vein; old marks weave with new light—sincerity, then mist keeps trace.',
          ja: '【霧中释义】新紋思脈に入る；旧痕と新光相織——誠心あれば霧留痕。',
        },
        {
          zh: '【雾中释义】纹重雾厚，一时难入——非拒学，只候场域稍澄。',
          en: '[Mist reading] Heavy trace, thick fog—hard to enter awhile—not refusal of learning, wait for clearer field.',
          ja: '【霧中释义】紋重霧厚——学を拒にではない、場域の澄みを待つ。',
        },
      ),
      dim(
        { zh: '观·专镜', en: 'Focus mirror', ja: '観·専鏡' },
        {
          zh: '底层照见注意焦点；玄义读作一念既起，光停于专镜抑或游光',
          en: 'Ground: attention focus. Mystic: once thought rises, light on one mirror or wandering beam',
          ja: '底層で照見：注意焦点。玄義では一念起り、光は専鏡か游ぶ光か',
        },
        {
          zh: '【雾中释义】心流之中，光聚于一印——一页一择，不散于游思。',
          en: '[Mist reading] In flow, light gathers on one seal—one page, one choice; not scattered in drift-thought.',
          ja: '【霧中释义】心流の中、光は一印に聚る——一頁一択。',
        },
        {
          zh: '【雾中释义】游光四散，专镜未稳——对话确认可召回临在之祷。',
          en: '[Mist reading] Wandering light; focus mirror unset—dialogue check recalls prayer of presence.',
          ja: '【霧中释义】游ぶ光四散——対話確認で臨在の祈祷を召還。',
        },
      ),
      dim(
        { zh: '观·辨光', en: 'Discern light', ja: '観·辨光' },
        {
          zh: '底层照见辨别判断；玄义读作雾中多影，辨光清抑或定まりにくい',
          en: 'Ground: discrimination and judgment. Mystic: many shadows in fog—light discerned or hard to fix',
          ja: '底層で照見：弁別判断。玄義では霧中多影——辨光清か定まりにくいか',
        },
        {
          zh: '【雾中释义】辨光于雾，影各归位——思脉不断罪，只照见结构。',
          en: '[Mist reading] Discern light in fog; shadows find place—mind-vein does not condemn, only mirrors structure.',
          ja: '【霧中释义】霧中辨光；影各帰位——罪を断たず構造を映す。',
        },
        {
          zh: '【雾中释义】雾浓影叠，辨光需时——请允许多问一印，不急于定论。',
          en: '[Mist reading] Thick fog, stacked shadows—discernment needs time; allow many seals, no hasty verdict.',
          ja: '【霧中释义】霧浓影叠——急いで定論せず、多印を許せ。',
        },
      ),
      dim(
        { zh: '观·创泉', en: 'Creation spring', ja: '観·創泉' },
        {
          zh: '底层照见创造性思维；玄义读作泉眼将开，思流涌向新脉',
          en: 'Ground: creative thinking. Mystic: spring opening; thought streams toward new veins',
          ja: '底層で照見：創造思考。玄義では泉眼が開、思流新脈へ',
        },
        {
          zh: '【雾中释义】创泉涌动，新光自暗土升起——动向于雾中留痕，非命令。',
          en: '[Mist reading] Creation spring rises; new light from dark soil—direction traced in mist, not command.',
          ja: '【霧中释义】創泉涌動；新光暗土より——命令にではない痕を留む。',
        },
        {
          zh: '【雾中释义】泉眼暂闭，创流藏于雾——候时机，树不催泉。',
          en: '[Mist reading] Spring veiled; creative flow hides in mist—wait season; tree does not hurry the spring.',
          ja: '【霧中释义】泉眼暫閉——樹は泉を急がせない。',
        },
      ),
      dim(
        { zh: '观·择印', en: 'Choose seal', ja: '観·擇印' },
        {
          zh: '底层照见决策择路；玄义读作印将落纸，心流之中如何择光',
          en: 'Ground: decision style. Mystic: seal about to fall—how to choose light within flow',
          ja: '底層で照見：決定様式。玄義では印が落、心流の中どう擇光か',
        },
        {
          zh: '【雾中释义】择印与所重相契，步履与光向同频——先静后感，再择光印。',
          en: '[Mist reading] Seal matches weight; steps sync with beam—be still, feel, then choose light.',
          ja: '【霧中释义】擇印と所重相契——先静後感、光印を選ぶ。',
        },
        {
          zh: '【雾中释义】择路犹豫，外缘声重——请问此刻指向，非应当如何。',
          en: '[Mist reading] Hesitant path; loud outer voices—ask what points now, not what should be.',
          ja: '【霧中释义】擇路躊躇——今指すものを問え、「すべき」ではなく。',
        },
      ),
    ],
    integration: dim(
      { zh: '脉·归光', en: 'Vein · Return light', ja: '脈·帰光' },
      {
        zh: '底层照见思维整合；玄义读作思与感同席，主光落于何脉',
        en: 'Ground: cognitive integration. Mystic: thought and feeling at one table—which vein holds main light',
        ja: '底層で照見：思考統合。玄義では思感同席、主光何脈に',
      },
      {
        zh: '【雾中释义】思脉归光，六向之一面与此刻主光共鸣——照见即可，勿执执行。',
        en: '[Mist reading] Mind-veins return to light; this facet resonates—mirror only, do not grasp execution.',
        ja: '【霧中释义】思脈帰光——照見のみ、実行を執るな。',
      },
      {
        zh: '【雾中释义】诸脉交错，主光未一——仍在思脉场中对话。',
        en: '[Mist reading] Veins cross; main light not one—still in dialogue within mind-vein field.',
        ja: '【霧中释义】諸脈交錯；主光未一——思脈場でなお対話。',
      },
    ),
  },
  'bond-thread': {
    volumeField: { zh: '缘丝场', en: 'Bond-thread field', ja: '縁糸場' },
    sixfoldFacet: { zh: '六向·缘书', en: 'Sixfold · Bond Book', ja: '六向·縁書' },
    dimensions: [
      dim(
        { zh: '观·丝近', en: 'Thread nearness', ja: '観·糸近' },
        {
          zh: '底层照见亲密距离；玄义读作缘丝场中，靠近之温与退守之距',
          en: 'Ground: intimacy distance. Mystic: in bond field, warmth of nearness and retreat',
          ja: '底層で照見：親密距離。玄義では縁糸場の近温と退距',
        },
        {
          zh: '【雾中释义】丝近有温，界石不蚀——缘来可迎，岸仍在。',
          en: '[Mist reading] Thread draws near with warmth; boundary stone unharmed—bond may approach, shore remains.',
          ja: '【霧中释义】糸近に温；界石侵まず——岸はなお在る。',
        },
        {
          zh: '【雾中释义】丝距偏远，远星相望——守护本身亦是缘书一面。',
          en: '[Mist reading] Thread stays far; stars gaze apart—guard itself is a face of bond book.',
          ja: '【霧中释义】糸距偏远——守ることも縁書の一面。',
        },
      ),
      dim(
        { zh: '观·丝温', en: 'Thread warmth', ja: '観·糸温' },
        {
          zh: '底层照见情感温度传递；玄义读作缘温能否穿透缘丝场',
          en: 'Ground: warmth transmission. Mystic: can bond-warmth cross the thread field',
          ja: '底層で照見：温度伝達。玄義では縁温が縁糸場を貫くか',
        },
        {
          zh: '【雾中释义】温光沿丝传递，如共振之叶——关系场密度适中。',
          en: '[Mist reading] Warm light along threads; leaves in resonance—relational field balanced.',
          ja: '【霧中释义】温光糸を伝う——関係場の密度适中。',
        },
        {
          zh: '【雾中释义】温滞于胸，未达对岸——非无情，只候更诚之择。',
          en: '[Mist reading] Warmth stalls in chest, not reaching far shore—not loveless, wait for sincerer choosing.',
          ja: '【霧中释义】温胸に滞る——情なきにではない、更誠の択を待つ。',
        },
      ),
      dim(
        { zh: '观·丝距', en: 'Thread distance', ja: '観·糸距' },
        {
          zh: '底层照见关系距离调节；玄义读作亲近与退守之交，丝距如何伸缩',
          en: 'Ground: distance regulation. Mystic: nearness and retreat woven—how thread distance breathes',
          ja: '底層で照見：距離調節。玄義では近退の交、糸距どう伸縮',
        },
        {
          zh: '【雾中释义】丝距弹性，如月有盈亏——场域不迫你偏进偏止。',
          en: '[Mist reading] Thread distance elastic; moon waxes and wanes—field does not force bold or still.',
          ja: '【霧中释义】糸距弾性——場域は偏進偏止を迫らず。',
        },
        {
          zh: '【雾中释义】丝距僵固，难随缘风——请观距观温，毋饰毋避。',
          en: '[Mist reading] Thread distance rigid; hard to move with bond-wind—watch distance and warmth, neither adorn nor flee.',
          ja: '【霧中释义】糸距僵固——距と温を観、飾らず避けず。',
        },
      ),
      dim(
        { zh: '观·丝信', en: 'Thread trust', ja: '観·糸信' },
        {
          zh: '底层照见信任建立；玄义读作旧痕与缘丝能否织就信网',
          en: 'Ground: trust building. Mystic: old traces and threads weaving trust-net',
          ja: '底層で照見：信頼構築。玄義では旧痕と糸が信網を織るか',
        },
        {
          zh: '【雾中释义】丝信渐织，旧痕作纬——因果如链，一环诚则一环光。',
          en: '[Mist reading] Trust-thread weaves; old traces as woof—karma a chain; one ring sincere, one ring light.',
          ja: '【霧中释义】糸信渐織；旧痕を緯に——誠一環、光一環。',
        },
        {
          zh: '【雾中释义】丝信尚薄，缘风易断——非判无缘，只候再择之时。',
          en: '[Mist reading] Trust-thread thin; bond-wind breaks easily—not fateless, only wait to choose again.',
          ja: '【霧中释义】糸信尚薄——無縁と断ずるな、再択の時を待て。',
        },
      ),
      dim(
        { zh: '观·丝守', en: 'Thread guard', ja: '観·糸守' },
        {
          zh: '底层照见关系中边界；玄义读作缘风起时，界石与柔桥如何并存',
          en: 'Ground: boundary in relationship. Mystic: when bond-wind rises, stone and soft bridge together',
          ja: '底層で照見：関係境界。玄義では縁風起時、界石と柔橋の并存',
        },
        {
          zh: '【雾中释义】丝守有界，门扉半开——雾收诚心，关系场可安。',
          en: '[Mist reading] Thread-guard holds line; door half open—mist receives sincerity; relational field safe.',
          ja: '【霧中释义】糸守有界；門半開——誠心あれば関係場安。',
        },
        {
          zh: '【雾中释义】过守或过度放，缘丝易缠——请如实择光，不饰不避。',
          en: '[Mist reading] Over-guard or over-open; threads tangle—choose in truth, neither adorn nor avoid.',
          ja: '【霧中释义】過守か過開——如実に光を選べ。',
        },
      ),
      dim(
        { zh: '观·丝复', en: 'Thread repair', ja: '観·糸復' },
        {
          zh: '底层照见关系修复；玄义读作缘丝受挫后，能否重织于缘丝场',
          en: 'Ground: repair after rupture. Mystic: after thread breaks, can field be rewoven',
          ja: '底層で照見：関係修復。玄義では糸挫後、縁糸場に再織可か',
        },
        {
          zh: '【雾中释义】丝可重织，旧痕不抹——神谕呼应诸卷，不推翻已示之诚。',
          en: '[Mist reading] Threads reweave; old traces not erased—oracles echo volumes, never overturn prior sincerity.',
          ja: '【霧中释义】糸再織可；旧痕抹せず——既示の誠を否定せず。',
        },
        {
          zh: '【雾中释义】修复路长，或暂避缘风——请信雾中留痕，非终局。',
          en: '[Mist reading] Long repair or brief retreat from bond-wind—trust trace in mist is not final sentence.',
          ja: '【霧中释义】修復路長——霧の痕は終局にではない。',
        },
      ),
    ],
    integration: dim(
      { zh: '缘·整丝', en: 'Bond · Whole thread', ja: '縁·整糸' },
      {
        zh: '底层照见关系整合；玄义读作诸缘交织，整丝成图抑或仍散',
        en: 'Ground: relational integration. Mystic: bonds cross—whole thread map or still loose',
        ja: '底層で照見：関係統合。玄義では諸縁交錯——整糸成図かなお散か',
      },
      {
        zh: '【雾中释义】缘丝成图，六向之一面与此刻整丝共鸣——缘分作场域密度，非命定。',
        en: '[Mist reading] Threads form map; this facet resonates—affinity as field density, not fixed fate.',
        ja: '【霧中释义】縁糸成図——縁は場域密度、命定にではない。',
      },
      {
        zh: '【雾中释义】诸丝未织，整缘仍雾——六卷齐时，整象神谕将更完整地呼应。',
        en: '[Mist reading] Threads loose; whole bond still mist—when six align, whole oracle echoes fuller.',
        ja: '【霧中释义】諸糸未織——六巻揃えば整象神託より完整地呼应。',
      },
    ),
  },
  'flow-balance': {
    volumeField: { zh: '守流场', en: 'Guarded-flow field', ja: '守流場' },
    sixfoldFacet: { zh: '六向·流衡', en: 'Sixfold · Flow Balance', ja: '六向·流衡' },
    dimensions: [
      dim(
        { zh: '观·分力', en: 'Split force', ja: '観·分力' },
        {
          zh: '底层照见精力分配；玄义读作守流场中，灵息如何分注诸脉',
          en: 'Ground: energy allocation. Mystic: in guarded-flow field, how spirit-tide splits among veins',
          ja: '底層で照見：精力配分。玄義では守流場で霊息どう分注',
        },
        {
          zh: '【雾中释义】分力有序，如河有渠——守衡非止息，是应变之律。',
          en: '[Mist reading] Force split ordered; river has channels—balance is not stopping but law of adaptation.',
          ja: '【霧中释义】分力有序——守衡は止息にではない、応変の律。',
        },
        {
          zh: '【雾中释义】分力失序，灵息或耗或淤——请感流守源，再择下一印。',
          en: '[Mist reading] Split disordered; tide spent or stagnant—feel flow, guard source, then next seal.',
          ja: '【霧中释义】分力失序——流を感じ源を守り、次印を。',
        },
      ),
      dim(
        { zh: '观·守源', en: 'Guard source', ja: '観·守源' },
        {
          zh: '底层照见不确定下的守势；玄义读作雾来头时，源在何处守',
          en: 'Ground: conservation under uncertainty. Mystic: when mist arrives, where source is guarded',
          ja: '底層で照見：不確実下の守勢。玄義では霧来頭、源を何处に守るか',
        },
        {
          zh: '【雾中释义】守源有恒，如山峰不动——外缘扰动不迫你妄进。',
          en: '[Mist reading] Source guarded steady; mountain unmoved—outer stir does not force rash advance.',
          ja: '【霧中释义】守源有恒——外縁は妄進を迫らず。',
        },
        {
          zh: '【雾中释义】守过度或守不足，舟摇源远——流衡是六向之一，异于入卷心流。',
          en: '[Mist reading] Over- or under-guard; boat sways, source far—Flow Balance is a facet, not rite-flow state.',
          ja: '【霧中释义】過守か守不足——流衡は六向の一、入巻心流にではない。',
        },
      ),
      dim(
        { zh: '观·雾行', en: 'Mist walk', ja: '観·霧行' },
        {
          zh: '底层照见模糊中行动；玄义读作雾中行路，定步抑或停于岸',
          en: 'Ground: action in ambiguity. Mystic: walking in mist—fixed step or waiting on shore',
          ja: '底層で照見：曖昧下の行動。玄義では霧中行、定步か岸待ちか',
        },
        {
          zh: '【雾中释义】雾行有律，小步试探——心流之中，一页一印，不示分数。',
          en: '[Mist reading] Mist-walk rhythmic; small probing steps—in flow, one seal per page, no scores shown.',
          ja: '【霧中释义】霧行有律；心流一印一頁、点数を示さず。',
        },
        {
          zh: '【雾中释义】雾中盲冲或久滞——请问此刻真实，非应当激进或止息。',
          en: '[Mist reading] Rush or freeze in fog—ask what is true now, not what should be bold or still.',
          ja: '【霧中释义】霧中盲進か久滞——今真実を問え。',
        },
      ),
      dim(
        { zh: '观·急缓', en: 'Haste and pause', ja: '観·急緩' },
        {
          zh: '底层照见行动节奏；玄义读作灵息急缓，与场域是否同拍',
          en: 'Ground: action tempo. Mystic: spirit-tide hasty or slow—aligned with field or not',
          ja: '底層で照見：行動节奏。玄義では霊息急緩、場域と同拍か',
        },
        {
          zh: '【雾中释义】急缓合境，如潮汐有时——树与雾皆不催促。',
          en: '[Mist reading] Haste and pause fit the hour—like tides in season; tree and mist do not hurry.',
          ja: '【霧中释义】急緩合境——樹も霧も急がせない。',
        },
        {
          zh: '【雾中释义】节奏失调，浪涌或淤滞——请允许多泊一岸再择印。',
          en: '[Mist reading] Tempo off; surge or stagnation—allow mooring awhile before next seal.',
          ja: '【霧中释义】リズムが乱れ——一岸に多泊を許せ。',
        },
      ),
      dim(
        { zh: '观·转势', en: 'Turn tide', ja: '観·転勢' },
        {
          zh: '底层照见突变应变；玄义读作势变突至，守流场中如何转舟',
          en: 'Ground: pivot under change. Mystic: sudden shift—how to turn boat in guarded-flow field',
          ja: '底層で照見：突变応変。玄義では勢変突至、守流場で舟どう転ずるか',
        },
        {
          zh: '【雾中释义】转势灵活，如舟借风而不拒岸——变化作外缘，非判命运。',
          en: '[Mist reading] Turn tide flexible; boat uses wind yet keeps shore—change as outer edge, not verdict of fate.',
          ja: '【霧中释义】転勢柔軟——変化は外縁、運命の判にではない。',
        },
        {
          zh: '【雾中释义】转势僵，旧纹锁新雾——请信守衡是应变，非迫你止息。',
          en: '[Mist reading] Turn rigid; old trace locks new mist—balance is adaptation, not command to stop.',
          ja: '【霧中释义】転勢僵——守衡は応変、止息命令にではない。',
        },
      ),
      dim(
        { zh: '观·定舟', en: 'Anchor boat', ja: '観·定舟' },
        {
          zh: '底层照见压力下稳定；玄义读作压力下，舟能否定、源能否在',
          en: 'Ground: stability under pressure. Mystic: under weight, can boat anchor and source stay near',
          ja: '底層で照見：圧力下安定。玄義では圧下、舟定か源在か',
        },
        {
          zh: '【雾中释义】舟定源在，守流场稳——灵息沿树脉可回，不耗散于外。',
          en: '[Mist reading] Boat moored, source near; guarded field steady—tide returns on tree-path, not lost outward.',
          ja: '【霧中释义】舟定源在——霊息樹脈に沿い帰る。',
        },
        {
          zh: '【雾中释义】舟摇雾急，定所难寻——非弱，只候下一季之风。',
          en: '[Mist reading] Boat sways, mist urgent; mooring hard—not weakness, wait next season’s wind.',
          ja: '【霧中释义】舟揺霧急——次季の風を待て。',
        },
      ),
    ],
    integration: dim(
      { zh: '衡·整流', en: 'Balance · Whole flow', ja: '衡·整流' },
      {
        zh: '底层照见守衡整合；玄义读作诸流交汇，整流归衡抑或仍湍',
        en: 'Ground: balance integration. Mystic: flows meet—whole stream balanced or still turbulent',
        ja: '底層で照見：守衡統合。玄義では諸流交——整流帰衡かなお湍か',
      },
      {
        zh: '【雾中释义】诸流归衡，六向之一面与此刻整流共鸣——守源不是怯，是场域智。',
        en: '[Mist reading] Flows return to balance; this facet resonates—guarding source is field wisdom, not fear.',
        ja: '【霧中释义】諸流帰衡——守源は怯にではない、場域の智。',
      },
      {
        zh: '【雾中释义】整流仍湍，诸力未一——六卷齐时，整象将收束诸卷已示之河象。',
        en: '[Mist reading] Whole flow still turbulent; forces not one—when six align, whole image gathers river oracles shown.',
        ja: '【霧中释义】整流なお湍——六巻揃えば整象が既示河象を収束。',
      },
    ),
  },
  'direction-light': {
    volumeField: { zh: '向光场', en: 'Path-light field', ja: '向光場' },
    sixfoldFacet: { zh: '六向·向光', en: 'Sixfold · Path Light', ja: '六向·向光' },
    dimensions: [
      dim(
        { zh: '观·光向', en: 'Light direction', ja: '観·光向' },
        {
          zh: '底层照见方向感；玄义读作立雾中感内在那束光，明抑或渺',
          en: 'Ground: sense of direction. Mystic: stand in mist, feel inner beam—bright or veiled',
          ja: '底層で照見：方向感。玄義では霧中立ち内光を感ず——明か渺か',
        },
        {
          zh: '【雾中释义】光向可辨，如径初现——只问此刻指向，非应当如何。',
          en: '[Mist reading] Direction readable; path first shows—only what points now, not what should be.',
          ja: '【霧中释义】光向可辨——今指すものを問え。',
        },
        {
          zh: '【雾中释义】光渺或游移——径未明时，探径本身即是向光。',
          en: '[Mist reading] Beam faint or wandering—when path unclear, probing is already path-light.',
          ja: '【霧中释义】光渺游移——径が未明、探径即向光。',
        },
      ),
      dim(
        { zh: '观·光义', en: 'Light weight', ja: '観·光義' },
        {
          zh: '底层照见价值軽重；玄义读作所重所轻，如何映于光义',
          en: 'Ground: value weighting. Mystic: what weighs heavy or light in the beam of meaning',
          ja: '底層で照見：価値軽重。玄義では所重所軽、光義にどう映るか',
        },
        {
          zh: '【雾中释义】光义分明，如星定轨——结构在雾中留痕，不断罪。',
          en: '[Mist reading] Light-meaning clear; stars on track—structure traced in mist, no condemnation.',
          ja: '【霧中释义】光義分明——罪を断たず霧に痕。',
        },
        {
          zh: '【雾中释义】光义摇摆，轻重难序——请先静后感，再择光印。',
          en: '[Mist reading] Meaning sways; weights unordered—be still, feel, then choose seal.',
          ja: '【霧中释义】光義揺れ——先静後感、光印を選ぶ。',
        },
      ),
      dim(
        { zh: '观·步履', en: 'Walking step', ja: '観·步履' },
        {
          zh: '底层照见意向与行动一致；玄义读作心向与步伐是否同频',
          en: 'Ground: intention–action alignment. Mystic: heart-direction and steps in same rhythm',
          ja: '底層で照見：意向行動一致。玄義では心向と步履同調か',
        },
        {
          zh: '【雾中释义】步履随光，行止有律——动向在雾中显现，非神谕命令。',
          en: '[Mist reading] Steps follow light; walk and rest rhythmic—direction shows in mist, oracle does not command.',
          ja: '【霧中释义】步履随光——神託は命令にではない。',
        },
        {
          zh: '【雾中释义】想行分离，光在前而步未随——请感向感步，诚心来答。',
          en: '[Mist reading] Thought and walk split; light ahead, feet lag—feel direction, feel step, answer sincerely.',
          ja: '【霧中释义】想行分離——向きと歩みを感じ、誠心で答えよ。',
        },
      ),
      dim(
        { zh: '观·共振', en: 'Resonance', ja: '観·共振' },
        {
          zh: '底层照见行动与价值共振；玄义读作所行与所信是否同场共鸣',
          en: 'Ground: action–value resonance. Mystic: deed and belief vibrating in one field',
          ja: '底層で照見：行動価値共鳴。玄義では所行と所信が同場共鳴か',
        },
        {
          zh: '【雾中释义】行动与光义共振，场域反馈清明——每一道光都是回答。',
          en: '[Mist reading] Action and meaning resonate; field feedback clear—every beam is an answer.',
          ja: '【霧中释义】行と光義共鳴——一筋の光も答え。',
        },
        {
          zh: '【雾中释义】共振弱，行与信错位——非永错，只示此刻张力之痕。',
          en: '[Mist reading] Weak resonance; deed and faith misaligned—not forever wrong, only trace of present tension.',
          ja: '【霧中释义】共振弱——永错にではない、今の張力の痕。',
        },
      ),
      dim(
        { zh: '观·持愿', en: 'Hold vow', ja: '観·持願' },
        {
          zh: '底层照见短期承诺；玄义读作短雾来头，愿能否持、印能否守',
          en: 'Ground: holding commitment through fog. Mystic: short mist arrives—vow held or seal lost',
          ja: '底層で照見：短期誓約。玄義では短霧来頭、願持か印守か',
        },
        {
          zh: '【雾中释义】愿存旧痕，持愿如烛不灭——外缘过而不灭整向。',
          en: '[Mist reading] Vow lives in old trace; held like unextinguished candle—outer edge passes, direction whole.',
          ja: '【霧中释义】願旧痕に在；烛の如く持愿——外縁過ぎても向整。',
        },
        {
          zh: '【雾中释义】愿易散于风——请以诚心留印，使六卷记忆相认。',
          en: '[Mist reading] Vow scatters in wind—leave sincere seal so six memories recognize each other.',
          ja: '【霧中释义】願風に散りやす——誠心留印、六巻記憶相認。',
        },
      ),
      dim(
        { zh: '观·探径', en: 'Probe path', ja: '観·探径' },
        {
          zh: '底层照见路径不明时的探索；玄义读作径未明，如何探光而不妄断',
          en: 'Ground: exploration when path unclear. Mystic: path veiled—how to probe light without false verdict',
          ja: '底層で照見：経路不明時探索。玄義では径が未明、どう探光せず妄断せず',
        },
        {
          zh: '【雾中释义】小步探径，如星探路——命运非预设，是雾中结构的约束。',
          en: '[Mist reading] Small steps probe path; star explores road—fate not preset, constraint of structure in mist.',
          ja: '【霧中释义】小步探径——運命は予定にではない、霧中構造の制約。',
        },
        {
          zh: '【雾中释义】探径停或盲进——请信树会引路，雾会留诚痕。',
          en: '[Mist reading] Probe stops or blind rush—trust tree guides; mist keeps sincere trace.',
          ja: '【霧中释义】探径止か盲進——樹引路、霧誠痕を留む。',
        },
      ),
    ],
    integration: dim(
      { zh: '向·整光', en: 'Path · Whole light', ja: '向·整光' },
      {
        zh: '底层照见方向整合；玄义读作诸向交汇，整光归一束抑或仍散',
        en: 'Ground: directional integration. Mystic: directions cross—whole light one beam or scattered',
        ja: '底層で照見：方向統合。玄義では諸向交——整光一束かなお散か',
      },
      {
        zh: '【雾中释义】诸向归光，六向之一面与此刻整光共鸣——光自顶冠落下。',
        en: '[Mist reading] Directions return to light; this facet resonates—light descends from crown.',
        ja: '【霧中释义】諸向帰光——光は頂冠から降る。',
      },
      {
        zh: '【雾中释义】光散多向，整光仍雾——整象神谕将呼应诸卷，不推翻已示。',
        en: '[Mist reading] Light scatters; whole beam still mist—whole oracle will echo volumes, not overturn shown.',
        ja: '【霧中释义】光散多向——整象神託は既示を否定せず呼应。',
      },
    ),
  },
}

function promptPrefix(
  layer: BookTheoryLayer,
  dim: DimensionTheory,
  locale: Locale,
): string {
  const contentLocale = resolveContentLocale(locale)
  const field = layer.volumeField[contentLocale]
  const facet = layer.sixfoldFacet[contentLocale]
  const seal = dim.sealTag[contentLocale]
  if (contentLocale === 'en') {
    return `[Rite · ${seal} · ${field} · ${facet}] `
  }
  if (contentLocale === 'ja') {
    return `【儀·${seal}｜${field}｜${facet}】`
  }
  const prefix = `【仪轨·${seal}｜${field}｜${facet}】`
  return locale === 'zhTw' ? toTraditionalChinese(prefix) : prefix
}

export function enrichBookContent(
  content: BookContent,
  bookId: BookId,
  locale: Locale,
): BookContent {
  const layer = THEORY[bookId]
  if (!layer) return content

  const enrichDim = (dim: BookContent['dimensions'][0], theory: DimensionTheory) => ({
    ...dim,
    prompt: `${promptPrefix(layer, theory, locale)}${dim.prompt}`,
    cards: dim.cards,
  })

  return {
    ...content,
    dimensions: content.dimensions.map((d, i) =>
      enrichDim(d, layer.dimensions[i]),
    ),
    integration: enrichDim(content.integration, layer.integration),
  }
}

export function getTheoryGuideSupplement(
  bookId: BookId,
  questionId: string,
  locale: Locale,
): string | null {
  const layer = THEORY[bookId]
  if (!layer) return null

  const dimIndex = resolveDimensionIndex(bookId, questionId)
  if (dimIndex === null) return null

  const theory =
    dimIndex === 6 ? layer.integration : layer.dimensions[dimIndex]
  if (!theory) return null

  const line = theory.guideLine[resolveContentLocale(locale)]
  return locale === 'zhTw' ? toTraditionalChinese(line) : line
}

function resolveDimensionIndex(
  bookId: BookId,
  questionId: string,
): number | null {
  const ids: Record<BookId, string[]> = {
    'psyche-tree': [
      'psyche-boundary',
      'psyche-wave',
      'psyche-still',
      'psyche-mirror',
      'psyche-guard',
      'psyche-root',
      'psyche-whole',
    ],
    'emotional-flow': [
      'flow-overall',
      'flow-expression',
      'flow-connection',
      'flow-body',
      'flow-recovery',
      'flow-change',
      'flow-whole',
    ],
    'mind-light': [
      'mind-flow',
      'mind-learn',
      'mind-focus',
      'mind-analyze',
      'mind-create',
      'mind-decide',
      'mind-whole',
    ],
    'bond-thread': [
      'bond-near',
      'bond-warm',
      'bond-distance',
      'bond-trust',
      'bond-guard',
      'bond-repair',
      'bond-whole',
    ],
    'flow-balance': [
      'balance-split',
      'balance-source',
      'balance-mist',
      'balance-pace',
      'balance-turn',
      'balance-boat',
      'balance-whole',
    ],
    'direction-light': [
      'dir-light',
      'dir-meaning',
      'dir-step',
      'dir-resonance',
      'dir-vow',
      'dir-probe',
      'dir-whole',
    ],
  }
  const list = ids[bookId]
  const idx = list.indexOf(questionId)
  return idx >= 0 ? idx : null
}
