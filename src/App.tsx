import { useEffect, useRef, useState } from 'react'
import type { AssessmentResult } from './types'
import {
  TreeOfLifeBackground,
  countCompletedDimensions,
} from './components/TreeOfLifeBackground'
import { BookCover } from './components/book/BookCover'
import { BookQuestionFlow } from './components/book/BookQuestionFlow'
import { BookResult } from './components/book/BookResult'
import { TreeProgress } from './components/tree/TreeProgress'
import { TreeAwakeningOverlay } from './components/tree/TreeAwakeningOverlay'
import { AmbientMusicControl } from './components/AmbientMusicControl'
import { allQuestions } from './data/questions'

type AppPhase = 'welcome' | 'questions' | 'result'

function App() {
  const [phase, setPhase] = useState<AppPhase>('welcome')
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [treeRevealStage, setTreeRevealStage] = useState(0)
  const [coverOpening, setCoverOpening] = useState(false)
  const [awakeningStage, setAwakeningStage] = useState<number | null>(null)
  const [treeRecoilKey, setTreeRecoilKey] = useState(0)
  const [musicBootstrap, setMusicBootstrap] = useState(0)
  const prevTreeStage = useRef(0)

  useEffect(() => {
    if (phase !== 'questions' && phase !== 'result') {
      prevTreeStage.current = treeRevealStage
      return
    }
    if (treeRevealStage > prevTreeStage.current && treeRevealStage > 0) {
      setAwakeningStage(treeRevealStage)
    } else if (
      treeRevealStage < prevTreeStage.current &&
      phase === 'questions'
    ) {
      setTreeRecoilKey((k) => k + 1)
    }
    prevTreeStage.current = treeRevealStage
  }, [treeRevealStage, phase])

  const openBook = () => {
    setMusicBootstrap((n) => n + 1)
    setCoverOpening(true)
    window.setTimeout(() => {
      setPhase('questions')
      setCoverOpening(false)
    }, 950)
  }

  const handleComplete = (assessmentResult: AssessmentResult) => {
    setResult(assessmentResult)
    setPhase('result')
    setTreeRevealStage(7)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRestart = () => {
    setResult(null)
    setPhase('welcome')
    setTreeRevealStage(0)
    setTreeRecoilKey(0)
    prevTreeStage.current = 0
    setAwakeningStage(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const treeVariant =
    phase === 'welcome' ? 'welcome' : phase === 'result' ? 'complete' : 'explore'

  return (
    <div className="relative min-h-screen">
      <TreeOfLifeBackground
        revealStage={treeRevealStage}
        variant={treeVariant}
        recoilKey={treeRecoilKey}
      />
      <TreeAwakeningOverlay
        stage={awakeningStage}
        onDone={() => setAwakeningStage(null)}
      />
      <AmbientMusicControl
        phase={phase}
        awakeningStage={awakeningStage}
        bootstrap={musicBootstrap}
      />
      <main className="relative z-10 pb-16">
        {phase === 'welcome' && (
          <BookCover onOpen={openBook} opening={coverOpening} />
        )}
        {phase === 'questions' && (
          <BookQuestionFlow
            treeRevealStage={treeRevealStage}
            onComplete={handleComplete}
            onProgressChange={(index, answers) => {
              setTreeRevealStage(
                countCompletedDimensions(index, answers, allQuestions),
              )
            }}
          />
        )}
        {phase === 'result' && result && (
          <>
            <TreeProgress revealStage={7} />
            <BookResult result={result} onRestart={handleRestart} />
          </>
        )}
      </main>
    </div>
  )
}

export default App
