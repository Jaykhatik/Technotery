const getPokemonImg = (id) => {
    id = id.toString().padStart(3, "0");
    return `${import.meta.env.VITE_IMG_UTIL_URL}/${id}.png`;
}
export default getPokemonImg;