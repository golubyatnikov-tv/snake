import React, { useRef, useCallback, useState, useEffect, useMemo } from 'react'
import { createGame, GameSettings } from '../game';
import { useImmer } from 'use-immer';

const Game: React.SFC<GameSettings> = (gameSettings) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>(null);
  const setCanvasRef = useCallback(node => {
    if (node)
      setCanvas(node)
  }, [])

  const [gameEnd, setGameEnd] = useState(false);

  const [playerInfos, setPlayerInfos] = useState([]);

  useEffect(() => {
    if (canvas && !gameEnd) {
      const newPlayerInfos = gameSettings.players.map(p => ({
        ...p,
        lives: gameSettings.lives,
        score: 0
      }));

      setPlayerInfos(newPlayerInfos)

      const game = createGame({
        canvas,
        onPlayerChange: (p, info) => {
          const player = newPlayerInfos.find(player => player.id === p.id);
          player.lives = info.lives;
          player.score = info.score;
          setPlayerInfos([...newPlayerInfos]);
        },
        onGameEnd: () => setGameEnd(true),
        ...gameSettings
      })
      return () => game.dispose()
    }
  }, [canvas, gameEnd])

  return <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{ display: 'flex', flex: '0 0 30px', justifyContent: 'space-between' }}>
      {playerInfos.map(p => <div key={p.id}>{p.name} 🧡{p.lives} ⭐{p.score}</div>)}
    </div>
    <div style={{ flex: 1, width: '100%', height: '100%', boxSizing: 'content-box' }}>
      <canvas ref={setCanvasRef} style={{outline: '1px solid orange'}} />
    </div>
    {gameEnd && <div style={{ fontSize: 30, fontFamily: 'Arial,Helvetica,sans-serif', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', textAlign: 'center' }}>
      <div>Игра окончена</div>
      <div>
        <button onClick={() => {
          setGameEnd(false)
        }}>Начать заново</button>
      </div>
    </div>}
  </div>
}

export default Game