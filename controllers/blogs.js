const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)

    /*Blog.find({}).then(blogs => {
        response.json(blogs)
    })*/
})

blogsRouter.get('/:id', async (request, response, next) => {

    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }

})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body

    if(!body.title || !body.author || !body.url){
        response.status(400).end()
    } else {
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: 0 //Como es una nueva entrada empieza en cero
        })
        
        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)

    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()

})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.status(200).json(updatedBlog)
})

module.exports = blogsRouter