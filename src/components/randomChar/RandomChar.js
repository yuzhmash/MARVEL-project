import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import useMarvelService from '../../services/MarvelServer';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {

    const [char, setChar] = useState({})
    const [objectFit, setObjectFit] = useState("cover")

    const onCharLoaded = (char) => {
        if (char.description === '') { 
            char.description = 'There is no information available about this character. Please visit the homepage to find more info'
        } else if (char.description.length >= 209) {
            const str = char.description.slice(0, 209).trim()
            char.description = `${str}...`
        }
        if (char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            setObjectFit("contain")
        } else {
            setObjectFit("cover")
        }
        setChar(char)
    }
    const {getCharacter, error, loading, clearError} = useMarvelService();

    const updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        clearError()
        getCharacter(id)
            .then(onCharLoaded)
    }

    useEffect(() => {
        updateChar();
    }, [])


    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <Error/> : null;
    const content = !(spinner || error) ? <View char={char} objectFit={objectFit}/> : null

    return (
        <div className="randomchar">
            {errorMessage}
            {spinner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button onClick={updateChar} className="button button__main">
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}

const View = ({char, objectFit}) => {
    const {name, description, thumbnail, homepage, wiki} = char;
    return (
        <div className="randomchar__block">
            <img style={{objectFit: objectFit}} src={thumbnail} alt="Random character" className="randomchar__img"/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;