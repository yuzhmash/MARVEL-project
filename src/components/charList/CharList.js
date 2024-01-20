import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types'; 

import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import useMarvelService from '../../services/MarvelServer';
import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([])
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(210)
    const [charEnded, setCharEnded] = useState(false)
    
    const {loading, error, getAllCharacters} = useMarvelService();    

    const handleScroll = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            this.onRequest(this.state.offset)
        }
    }

    useEffect(() => {
        // window.addEventListener("scroll", handleScroll)
        onRequest(offset, true);
        // return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList])
        setNewItemLoading(false)
        setOffset(offset => offset + 9)
        setCharEnded(ended)
    }

    const myRef = useRef([])

    const focusOnItem = (id) => {
        myRef.current.forEach(item => item.classList.remove('char__item_selected'));
        myRef.current[id].classList.add('char__item_selected');
        myRef.current[id].focus();
    }


    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    function renderItems(arr) { 
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item"
                    key={item.id}
                    tabIndex={0}
                    ref={el => myRef.current[i] = el}
                    onClick={() => {
                        props.onSelectedChar(item.id);  
                        focusOnItem(i);
                        }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onSelectedChar(item.id);
                            focusOnItem(i);
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(charList);

    const errorMessage = error ? <Error/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}
                style={{"display": charEnded ? "none" : "block"}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onSelectedChar: PropTypes.func
}

export default CharList;