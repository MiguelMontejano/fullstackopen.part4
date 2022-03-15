const dummy = (array) => {
    return 1
}

const totalLikes = (listaBlogs) => {
    let totalLikes = 0
    for (let i = 0; i < listaBlogs.length; i++) {
        totalLikes += listaBlogs[i].likes
    }

    return totalLikes
}

const favoriteBlog = (listaBlogs) => { //Ejercicio 4.5
    const noBlogs = {
        error: 'there are no blogs in this list'
    }
    let favoriteBlog
    let maxLikes = -1 //Variable auxiliar para obtener el blog ocn mas likes
    for (let i = 0; i < listaBlogs.length; i++) {
        if(listaBlogs[i].likes > maxLikes){
            maxLikes = listaBlogs[i].likes
            favoriteBlog = listaBlogs[i]
        }
    }

    return listaBlogs.length === 0
    ? noBlogs
    : favoriteBlog
}

module.exports = {
    dummy, totalLikes, favoriteBlog
}