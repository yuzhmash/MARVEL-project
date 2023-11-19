import './appHeader.scss';

const AppHeader = () => {
    return (
        <header className="app__header">
            <h1 className="app__title">
                <a href="#n">
                    <span>Marvel</span> information portal
                </a>
            </h1>
            <nav className="app__menu">
                <ul>
                    <li><a href="#n">Characters</a></li>
                    /
                    <li><a href="#n">Comics</a></li>
                </ul>
            </nav>
        </header>
    )
}

export default AppHeader;