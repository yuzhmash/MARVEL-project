import {useHttp} from "../hooks/http.hook"

const useMarvelService = () => {

    const {loading, error, request, clearError} = useHttp()

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=45478ab9ff7ee07430c216b1ec77e581';
    const _basaOffset = 324;

    const getAllCharacters = async (offset = _basaOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }


    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getComics = async (id = _basaOffset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${id}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const _transformComics = (comics) => {
        return {
            title: comics.title,
            price: `${comics.prices[0].price}$`,
            thumbnail: `${comics.thumbnail.path}.${comics.thumbnail.extension}`
        }
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
    
    return {loading, error, getAllCharacters, getCharacter, clearError, getComics}
}

export default useMarvelService;