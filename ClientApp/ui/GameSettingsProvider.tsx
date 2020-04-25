import React, { createContext, useEffect } from 'react'
import { GameSettings } from '../game'
import { useImmer } from 'use-immer'

export const GameSettingsContext = createContext<{
    settings: GameSettings;
    updateSettings: (f: (draft: GameSettings) => void | GameSettings) => void;
}>(null)

const GameSettingsProvider: React.SFC = ({children}) => {
    const [settings, updateSettings] = useImmer<GameSettings>({
        fieldSize: [20, 20],
        players: [],
        lives: 3
    });

    return <GameSettingsContext.Provider value={{
        settings,
        updateSettings
    }}>
        {children}
    </GameSettingsContext.Provider>
}

export default GameSettingsProvider;