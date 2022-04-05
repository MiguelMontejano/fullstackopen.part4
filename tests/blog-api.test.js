const { TestWatcher } = require('jest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))

    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('when there is initially some blogs saved', () => {

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
    
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
    
        const titles = response.body.map(r => r.title)
        expect(titles).toContain(
          'HTTP masters'
        )
    })
})

describe('viewing a specific blog', () => {

    test('a specific blog can be viewed', async () => {
        const blogsAtStart = await helper.blogsInDb()
    
        const blogToView = blogsAtStart[0]
    
        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        const processedBlogToView = JSON.parse(JSON.stringify(blogToView))
    
        expect(resultBlog.body).toEqual(processedBlogToView)
    })

})

describe('addition of a new blog', () => {

    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'Blog Prueba',
            author: 'Probador Expertp',
            url: 'www.pruebaspruebas.com',
            likes: 0
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
        //Voy a obtener en esta variable todos los titulos de mis blogs
        const titles = blogsAtEnd.map(r => r.title)
    
        expect(titles).toContain( //Compruebo que entre los titulos recuperados esta el que he añadido
            'Blog Prueba'
        )
    })

    test('blog without title cant be added', async () => {
        const newBlog = {
            author: 'Probador Expertp',
            url: 'www.pruebaspruebas.com',
            likes: 0
        }
    
        await api 
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    
        const blogsAtEnd = await helper.blogsInDb()
    
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

})

describe('deletion of a blog', () => {
    test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
    
        const blogToDelete = blogsAtStart[0]
    
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
    
        const blogsAtEnd = await helper.blogsInDb()
    
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
    
        const titles = blogsAtEnd.map(r => r.title)
    
        expect(titles).not.toContain(blogToDelete.title)
    })
})

describe('updation of a blog', () => {
    test('a blog can be updated', async () => {
        const blogsAtStart = await helper.blogsInDb()

        const blogToUpdate = blogsAtStart[0]
        
        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send({
                title: 'HTTP masters actualizado',
                author: 'Federico Rico',
                url: 'www.pruebaspruebas.com',
                likes: 50
            })
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length) //Compruebo que exista el mismo numero de blogs al inicio y al final

        console.log('Al inicio', blogsAtStart[0]);
        console.log('Al final', blogsAtEnd[0]);
        expect(blogsAtStart[0]).not.toEqual(blogsAtEnd[0])
    })
})

afterAll(() => {
    mongoose.connection.close()
})