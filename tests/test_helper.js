const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'HTTP masters',
        author: 'Federico Rico',
        url: 'www.httpmasters.es',
        likes: 0
    },
    {
        title: 'Marvel fans',
        author: 'Steve Ditko',
        url: 'www.marvelfans.com',
        likes: 1
    }
]

const nonExistingId = async () => {
    const blog = new Blog({
        title: 'Will remove this son',
        author: 'remover',
        url: 'www.remove.es',
        likes: 0
    })

    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
}