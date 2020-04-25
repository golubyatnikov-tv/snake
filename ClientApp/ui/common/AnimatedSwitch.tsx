import React from 'react'
import { useLocation, Switch } from 'react-router-dom'
import { useTransition, UseTransitionProps, animated } from 'react-spring'

const AnimatedSwitch: React.SFC<{
    location: ReturnType<typeof useLocation>;
    transitionConfig: UseTransitionProps<any, React.CSSProperties> 
}> = ({children, transitionConfig}) => {
    const location = useLocation()
    const transitions = useTransition(location, location => location.pathname, transitionConfig)

    return <>        
        {transitions.map(({ item: location, props, key }) => (            
            <animated.div key={key} style={{...props, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
                <Switch location={location}>
                    {children}
                </Switch>                
            </animated.div>
        ))}
    </>
}

export default AnimatedSwitch;