import React, {useEffect, useState} from "react";
import Tmdb from "./Tmdb";
import MovieRow from "./components/MovieRow";
import './App.css';
import FeaturedMovie from './components/FeaturedMovie';
import Header from "./components/Header";


export default () => {
  const[movieList, setMovieList] = useState([]);
  const[featuredData, setFeaturedData] = useState(null);
  const[blackHeader, setBlackHeader] = useState(false);

  useEffect(()=>{
    const loadAll = async () => {
      //Requisição da lista
      let list = await Tmdb.getHomeList();
      //var funciona global e o let só funciona dentro do bloco
      setMovieList(list);
      
      //Pegando destaque:
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random()* (originals[0].items.results.length -1)) 
      let chosen = originals[0].items.results[randomChosen];
      let chosenInform = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInform);
      console.log('Teste!!!');
      console.log(chosenInform);

    }

    loadAll();
  }, []);

  useEffect(()=>{
    const scrollListener = () =>{
      if(window.scrollY > 10){
        setBlackHeader(true);
      }else
        setBlackHeader(false);
    }

    window.addEventListener('scroll', scrollListener);
    return () =>{
      window.removeEventListener('scroll', scrollListener);
    }
  }, []);

  return (
    <div className="page">
      <Header black={blackHeader}/>
      
      {featuredData &&
        <FeaturedMovie item={featuredData} />//Só passa a key quando é um loop (map)
      }

      <section className="lists">
        {movieList.map((item/* Esse item é cada lista*/, key)=>( //Map faz um callback de cada elemento do array, retornando os valores e índices do array;
          <MovieRow key={key} title={item.title} items={item.items} />//Aqui eu passo o título e os items de cada lista
        ))}
      </section>

      <footer>
        Feito com <span role="img" aria-label="coração">❤️️</span> por Jonas<br/>
        Direitos de imagem para a Netflix<br/>
        Dados pegos do site Themoviedb.org
      </footer>

      {movieList.length <= 0 &&
        <div className="loading">
          <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="LOADING"/>
        </div>
      }
    </div>
  );
}