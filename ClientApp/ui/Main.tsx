import React from 'react'
import { Link } from 'react-router-dom';
import Menu from './common/Menu';

const Main: React.SFC = () => {
    return <Menu>        
        <Link to='/single'>Одиночная игра</Link>
        <Link to='/hotseat'>Локальная многопользовательская игра</Link>
    </Menu>
}

export default Main;