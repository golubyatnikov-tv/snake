import React from 'react'
import Main from './ui/Main'
import { Switch, Route, BrowserRouter, useLocation } from 'react-router-dom'
import { animated, useTransition } from 'react-spring'
import { createGlobalStyle } from 'styled-components'
import GameSettings from './ui/GameSettings'
import AnimatedSwitch from './ui/common/AnimatedSwitch'

const GlobalStyle = createGlobalStyle`
body {
    overflow: hidden;
}

root {
    position: relative;
    height: 100%;
}
`

const App: React.SFC = () => {
    const location = useLocation()
    const transitionConfig = {
        from: { opacity: 0, transform: 'translate3d(20%,0,0)' },
        enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
        leave: { opacity: 0, transform: 'translate3d(-30%,0,0)' },
    }

    return <>
        <GlobalStyle />
        <AnimatedSwitch location={location} transitionConfig={transitionConfig}>
            <Route path='/:mode' render={(props) => (
                <GameSettings mode={props.match.params.mode} />
            )} />
            <Route path='/'>
                <Main />
            </Route>
        </AnimatedSwitch>
    </>
}

export default App;