import React from 'react'

const Menu: React.SFC = ({children})=>{
    return <div>
        {React.Children.map(children, child=> (
            <div>{child}</div>
        ))}
    </div>
}

export default Menu;