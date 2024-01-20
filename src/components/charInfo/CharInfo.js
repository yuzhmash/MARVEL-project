import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'; 


import useMarvelService from '../../services/MarvelServer';
import Error from '../error/Error';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

const CharInfo = props => {

    const [char, setChar] = useState(null)
    const [objectFit, setObjectFit] = useState('cover')

    const {getCharacter, loading, error} = useMarvelService();

    // useEffect(() => {
    //     updateChar()
    // })

    // componentDidCatch() {
    //     this.updateChar()
    // }

    const prevCharIdRef = useRef();

    useEffect(() => {
        if (prevCharIdRef.current !== props.charId) {
          updateChar();
        }
        prevCharIdRef.current = props.charId;
      }, [props.charId]);

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }
        getCharacter(charId)
            .then(onCharLoaded)
    }

    const onCharLoaded = (char) => {
        // if (char.description === '') { 
        //     char.description = 'There is no information available about this character. Please visit the homepage to find more info'
        // } else if (char.description.length >= 209) {
        //     const str = char.description.slice(0, 209).trim()
        //     char.description = `${str}...`
        // }
        // if (char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        //     this.setState({
        //         objectFit: 'contain'
        //     })
        // } else {
        //     this.setState({
        //         objectFit: 'cover'
        //     })
        // }
        setChar(char)
    }

    const skeleton = char || loading || error ? null : <Skeleton/>;
    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <Error/> : null;
    const content = !(spinner || error || !char) ? <View char={char}/> : null

    return (
        <div className="char__info">
            {skeleton}
            {spinner}
            {errorMessage}  
            {content}
        </div>
    )
}

const View = ({char}) => {
    const {name, thumbnail, description, homepage, wiki, comics} = char

    let imgStyle = {'objectFit': 'cover'}
    if (char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit': 'contain'}
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics with this character'}
                {
                    comics.map((item, i) => {
                        if (i > 9) return
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}


export default CharInfo;