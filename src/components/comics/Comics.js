import { useEffect, useState, useRef } from "react"

import useMarvelService from "../../services/MarvelServer"

import Error from "../error/Error"
import Spinner from "../spinner/Spinner"

import "./comics.sass"

import Marvel from "./Avengers.png"
import Avengers from "./AvengersLogo.png"

const Comics = () => {

    const [comics, setComics] = useState([])
    const [offset, setOffset] = useState(123)
    const [newItemLoading, setNewItemLoading] = useState(false)

    const {getComics, error, loading} = useMarvelService()

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getComics(offset)
            .then(onCharListLoaded)
    }

    const onCharListLoaded = (newComics) => {
        setComics(comics => [...comics, ...newComics])
        setOffset(offset => offset + 9)
        setNewItemLoading(false)
    }

    const myRef = useRef([])

    const focusOnItem = (id) => {
        myRef.current.forEach(item => item.classList.remove('char__item_selected'));
        myRef.current[id].classList.add('char__item_selected');
        myRef.current[id].focus();
    }


    function renderItems(arr) { 
        const items =  arr.map((item, i) => {

            if (item.price[0] === "0") item.price = "NOT AVAILABLE"
            
            return (
                <li 
                    className="comics__item"
                    key={i}
                    tabIndex={0}
                    ref={el => myRef.current[i] = el}
                    onClick={() => {;  
                        focusOnItem(i);
                        }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {;
                            focusOnItem(i);
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.title}/>
                        <div className="comics__title">{item.title}</div>
                        <div className="comics__price">{item.price}</div>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(comics)


    const errorMessage = error ? <Error/> : null;
    const spinner = loading ? <Spinner/> : null;

    return (
        <div className="comics">
            <div className="comics__header">
                <img src={Marvel} alt={Marvel} ></img>
                <div className="comics__header_title" >
                New comics every week <br></br> Stay tuned!
                </div>
                <img src={Avengers} alt={Avengers} ></img>
            </div>
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}
                >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default Comics