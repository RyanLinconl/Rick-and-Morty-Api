import './CharacterList.css'
import React, { useEffect, useState } from 'react';

const CharacterList = () => {
    const [characters, setCharacters] = useState([]); //Armazena o estado
    const [page, setPage] = useState(1); //Avançar página
    const [searchQuery, setSearchQuery] = useState(''); //Guarda o que é colocado na barra de pesquisa
    const [filteredCharacters, setFilteredCharacters] = useState([]);

    useEffect(() => {
        //Função para buscar dados da API
        const fetchCharacters = async () => {
          try {
            let allCharacters = [];
            let page = 1;
            let totalPages = 1; // Inicializa com 1 para entrar no loop
            // Loop até que todas as páginas tenham sido buscadas
            while (page <= totalPages) {
                const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}&name=${searchQuery}`);
                const data = await response.json();
                allCharacters = [...allCharacters, ...data.results];
                totalPages = data.info.pages;
                page++;
            }
            setCharacters(allCharacters);
            } catch (error) {
                console.error('Erro ao buscar personagens:', error)
            }
        //A função "fetchCharacters" é definida como assíncrona 'async' e utiliza 'await' para esperar a resposta da chamada do 'fetch', em caso de erro ele é capturado e é exibido no console.
        };

        fetchCharacters(); //Chamando a função
    }, [page]);

    // Função para lidar com mudanças na barra de pesquisa
      const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
     };

    //Função para filtrar o que é pesquisado e retornar
    useEffect(() => {
      const filtered = characters.filter(character =>
          character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          character.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
          character.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
          character.gender.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCharacters(filtered);
  }, [searchQuery, characters]); // Dependências incluídas: searchQuery e characters

    //Função para passar de página ou retornar
    const nextPage = () => setPage(page + 1);
    const prevPage = () => setPage(page - 1);

    //Função para voltar ao topo
    const scrollToTop = () => {
      const scrollStep = -window.scrollY / (500 / 15); // Controla a velocidade da animação
      const scrollInterval = setInterval(() => {
        if (window.scrollY !== 0) {
            window.scrollBy(0, scrollStep);
        } else {
            clearInterval(scrollInterval);
        }
    }, 15);
  };  

    return (
        <div>
          <div>
            <header>
              <h1 className='title-name'>Personagens de Rick and Morty</h1> 
            </header>
          </div>
        <div className='div-search'>
          <input
            type="text"
            placeholder="Procure por Nome, espécie ou gênero"
            value={searchQuery}
            onChange={handleSearchChange}
          />
      </div>
        <div className="character-list">
          {filteredCharacters.map(character => (
            <div key={character.id} className="character-card">
              <img src={character.image} alt={character.name} />
              <h2>{character.name}</h2>
              <p>Status: {character.status}</p>
              <p>Espécie: {character.species}</p>
              <p>Gênero: {character.gender}</p>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button onClick={prevPage} disabled={page === 1}>Anterior</button>
          <button onClick={scrollToTop}>Voltar ao Topo</button>
          <button onClick={nextPage}>Próximo</button>
        </div>
      </div>
    );
};

export default CharacterList;