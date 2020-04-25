import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react'
import { Route, useLocation, useRouteMatch, Link } from 'react-router-dom';
import Game from './Game';
import GameSettingsProvider, { GameSettingsContext } from './GameSettingsProvider';
import { GameSettings } from '../game';
import { useImmer } from 'use-immer';
import { Controller } from '../game/players';

const GameSettings: React.SFC<{
    mode: 'single' | 'hotseat'
}> = ({ mode }) => {
    const routeMatch = useRouteMatch()
    const location = useLocation()

    const [ran, setRan] = useState(false);

    const timeoutHandle = useRef<number>(null);

    const initialSettings = useMemo(() => {
        const settingsItem = localStorage.getItem("settings." + mode);
        const settings = Object.assign({
            fieldSize: [30, 30],            
            lives: 3,
            gameMode: 'experimental'
        }, settingsItem
            ? JSON.parse(settingsItem)
            : {});
        
        settings.players = mode === 'single' ? [{
            id: 'player1',
            name: 'Player 1',
            controller: mode === 'single' ? Controller.arrows | Controller.wasd : null
        }] : [];

        return settings;
    }, [mode])
    const [settings, updateSettings] = useImmer<GameSettings>(initialSettings);

    useEffect(() => {
        const settingsClone = Object.assign({}, settings);
        delete settingsClone.players;
        localStorage.setItem("settings." + mode, JSON.stringify(settingsClone));
    }, [mode, settings])

    useEffect(() => {
        if (ran)
            return;
        const onKeyDown = (e: KeyboardEvent) => {
            const playersCount = settings.players.length;
            const id = playersCount + 1;

            if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
                updateSettings(d => {
                    if (settings.players.every(p => p.controller !== Controller.wasd))
                        d.players.push({
                            id: 'player' + id,
                            name: 'Player ' + id,
                            controller: Controller.wasd
                        })
                })
            }
            if (['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(e.code)) {
                updateSettings(d => {
                    if (settings.players.every(p => p.controller !== Controller.arrows))
                        d.players.push({
                            id: 'player' + id,
                            name: 'Player ' + id,
                            controller: Controller.arrows
                        })
                })
            }
        }

        const onGamepadConnected = (e: GamepadEvent) => {
            const gp = e.gamepad;
            //var gp = navigator.getGamepads()[0];
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
                gp.index, gp.id,
                gp.buttons.length, gp.axes.length);
        }

        const waitGamepadButton = () => {
            const gamepads = [...navigator.getGamepads()].filter(gp => gp)
            gamepads.forEach(gp => {
                if (gp.connected) {
                    if (gp.buttons[0].pressed) {
                        updateSettings(d => {
                            const id = settings.players.length + 1;
                            const controller = Controller['gamepad' + (gp.index + 1)];
                            if (d.players.every(p => p.controller !== controller))
                                d.players.push({
                                    id: 'player' + id,
                                    name: 'Player ' + id,
                                    controller: controller
                                })
                        })
                    }
                    else if (gp.buttons[9].pressed) {
                        setRan(true);
                    }
                }
            })
            timeoutHandle.current = setTimeout(waitGamepadButton, 30);
        }
        waitGamepadButton()

        if (mode != 'single') {
            window.addEventListener('keydown', onKeyDown)
            window.addEventListener('gamepadconnected', onGamepadConnected)
        }
        return () => {
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('gamepadconnected', onGamepadConnected)
            clearTimeout(timeoutHandle.current);
        }
    }, [mode, ran, settings])

    return (
        <GameSettingsProvider>
            {!ran && <>
                <button onClick={() => setRan(true)}>Начать игру</button>
                <div>
                    <label>Ширина поля</label>
                    <input type='number' value={settings.fieldSize[0]} onChange={e => {
                        const v = e.target.value;
                        updateSettings(d => { d.fieldSize[0] = parseInt(v) })
                    }} />
                </div>
                <div>
                    <label>Высота поля</label>
                    <input type='number' value={settings.fieldSize[1]} onChange={e => {
                        const v = e.target.value;
                        updateSettings(d => { d.fieldSize[1] = parseInt(v) })
                    }} />
                </div>
                <div>
                    <label>Количество жизней</label>
                    <input type='number' value={settings.lives} onChange={e => {
                        const v = e.target.value;
                        updateSettings(d => { d.lives = parseInt(v) });
                    }} />
                </div>
                <div>
                    <label>Режим игры</label>
                    <select value={settings.gameMode} onChange={e => {
                        const v = e.target.value;
                        updateSettings(d => { d.gameMode = v as any });
                    }}>
                        <option value='classic'>Классический</option>
                        <option value='experimental'>Экспериментальный</option>
                    </select>
                </div>
                {mode === 'hotseat' && <>
                    <div>Для подключения игрока нажмите что-нибудь</div>
                    {settings.players.map(p => (
                        <div key={p.id}>{p.name}: {Object.entries(Controller).find(([key, value]) => value === p.controller)?.[0]}</div>
                    ))}
                </>}
            </>}
            {ran && <>
                <button onClick={() => setRan(false)}>Завершить игру</button>
                <Game {...settings} />
            </>}
        </GameSettingsProvider>
    )
}

export default GameSettings;