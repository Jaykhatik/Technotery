import React, { useEffect, useState } from 'react'
import '../styles/indexPage.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
// import axios from 'axios'
import Card from '../components/card'
import getPokemon from '../services/pokemonService'
import getPokemonImg from '../utils/getPokemonImg'

function Index() {

    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getPokemon()
            .then((res) => setData(res))
            .catch((err) => console.log(err))
    }, [])
    // console.log(getPokemon)
    // console.log(data, 'data');
    // console.log(getPokemonImg)
    return (
        <>
            <Header />

            <div className="container">

                <div className="searchBar">
                    <h3>Name or Number :</h3>

                    <div className="searchInputWrapper">
                        <input
                            type="text"
                            placeholder="Search Pokémon..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <span className="searchIcon">🔍</span>
                    </div>
                </div>
                <div className="card-container">

                    {
                        data
                            .filter(item =>
                                item.name.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((item, index) => (
                                <Card
                                    key={index}
                                    pokeName={item.name}
                                    id={index + 1}
                                    img={getPokemonImg(index + 1)}
                                />
                            ))
                    }

                </div>

            </div>


            <Footer />
        </>
    )
}

export default Index;