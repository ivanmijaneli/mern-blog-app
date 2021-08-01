const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('./../app')
const api = supertest(app)
const Blog = require('../models/Blog')
const User = require('../models/User')
const RefreshToken = require('../models/RefreshToken')
const bcrypt = require('bcrypt')

describe('new user', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('secret', 10)
    
        const user = new User({
            email: 'root@bla.com',
            username: 'rooting',
            firstName: 'root',
            lastName: 'rootic',
            passwordHash,
            verificationToken: 'randomtoken'
        })
        
        await user.save()
    })

    test('valid new users are created', async () => {
        const token = await helper.signToken('rooting')
        const usersBefore = await api
            .get('/api/users')
            .set('Authorization', `bearer ${token}`)

        const user = {
            email: 'ola@ola.com',
            username: 'ingleze',
            firstName: 'laru',
            lastName: 'liraziro',
            password: 'blabla'
        }

        const result = await api
            .post('/api/users')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(result.body.message).toBe('registration successful')

        const usersAfter = await api
            .get('/api/users')
            .set('Authorization', `bearer ${token}`)

        expect(usersAfter.body).toHaveLength(usersBefore.body.length + 1)
    })

    test('invalid new users are not created', async () => {
        const token = await helper.signToken('rooting')
        const usersBefore = await api
            .get('/api/users')
            .set('Authorization', `bearer ${token}`)
        
        const user = {
            email: 'totalylegitemail@',
            username: 'kam1',
            firstName: 'Kama',
            password: 'short'
        }

        const result = await api
            .post('/api/users')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toBe('Password of 6 or more characters must be entered')

        const usersAfter = await api
            .get('/api/users')
            .set('Authorization', `bearer ${token}`)

        expect(usersAfter.body).toHaveLength(usersBefore.body.length)
    })

    test('email can be verified', async () => {
        const result = await api
            .post('/api/users/verify-email')
            .send({ token: 'randomtoken' })
            .expect(200)

        expect(result.body.message).toBe('verification successful')
    })

    describe('email is verified', () => {
        beforeEach(async () => {
            await api
                .post('/api/users/verify-email')
                .send({ token: 'randomtoken' })
        })

        test('user can login with valid credentials', async () => {
            const credentials = {
                username: 'rooting',
                password: 'secret'
            }
    
            const result = await api
                .post('/api/users/login')
                .send(credentials)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(result.body.username).toBe('rooting')
        })

        test('user cannot login with invalid credentials', async () => {
            const credentials = {
                username: 'roting',
                password: 'secre'
            }
    
            const result = await api
                .post('/api/users/login')
                .send(credentials)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.error).toBe('invalid username or password')
        })

        describe('user is logged in', () => {
            beforeEach(async() => {
                const credentials = {
                    username: 'rooting',
                    password: 'secret'
                }
        
                await api
                    .post('/api/users/login')
                    .send(credentials)
            })

            test('token can be refreshed', async () => {
                const { id } = await User.findOne({ username: 'rooting' })
                const { token } = await RefreshToken.findOne({ user: id })

                const result = await api
                    .post('/api/users/refresh-token')
                    .set('Cookie', [`refreshToken=${token}`])
                    .expect(200)
                    .expect('Content-Type', /application\/json/)

                expect(result.body.username).toBe('rooting')
            })

            test('token can be revoked - user can logout', async () => {
                const jwtToken = await helper.signToken('rooting')
                const { id } = await User.findOne({ username: 'rooting' })
                const { token } = await RefreshToken.findOne({ user: id })

                const result = await api
                    .post('/api/users/revoke-token')
                    .set('Authorization', `bearer ${jwtToken}`)
                    .set('Cookie', [`refreshToken=${token}`])
                    .expect(200)
                    .expect('Content-Type', /application\/json/)

                expect(result.body.message).toBe('token revoked')
            })

            test('we get 400 without refresh token cookie', async () => {
                const token = await helper.signToken('rooting')

                const result1 = await api
                    .post('/api/users/refresh-token')
                    .set('Authorization', `bearer ${token}`)
                    .expect(400)
                    .expect('Content-Type', /application\/json/)

                expect(result1.body.error).toBe('invalid token')

                const result2 = await api
                    .post('/api/users/revoke-token')
                    .set('Authorization', `bearer ${token}`)
                    .expect(400)
                    .expect('Content-Type', /application\/json/)

                expect(result2.body.error).toBe('invalid token')
            })
        })
    })

    test('forgot password', async () => {
        const result = await api
            .post('/api/users/forgot-password')
            .send({ email: 'root@bla.com' })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(result.body.message).toBe('check email for reset instructions')
    })

    describe('password has been forgotten', () => {
        beforeEach(async () => {
            await api
                .post('/api/users/forgot-password')
                .send({ email: 'root@bla.com' })
        })

        test('validate reset token', async () => {
            const { resetToken } = await User.findOne({ username: 'rooting' })
            const { token } = resetToken

            const result = await api
                .post('/api/users/validate-reset-token')
                .send({ token })
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(result.body.message).toBe('token is valid')
        })

        test('password can be reset', async () => {
            const { resetToken } = await User.findOne({ username: 'rooting' })
            const { token } = resetToken

            const result1 = await api
                .post('/api/users/reset-password')
                .send({ token, password: 'newpass' })
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(result1.body.message).toBe('password reset successful')

            const credentials = {
                username: 'rooting',
                password: 'newpass'
            }

            const result2 = await api
                .post('/api/users/login')
                .send(credentials)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(result2.body.username).toBe('rooting')
        })
    })
})

describe('blogs in db', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
    
        const blogs = helper.initialBlogs.map(blog => new Blog(blog))
        const promises = blogs.map(blog => blog.save())
        await Promise.all(promises)
    })

    test('blogs are saved as json', async () => {
        const token = await helper.signToken('rooting')
        const response = await api
            .get('/api/blogs')
            .set('Authorization', `bearer ${token}`)
    
        await api
            .get('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
    
    test('_id is id', async () => {
        const token = await helper.signToken('rooting')
        const response = await api
            .get('/api/blogs')
            .set('Authorization', `bearer ${token}`)
    
        response.body.forEach(blog => expect(blog.id).toBeDefined())
    
        // or:
        // expect(response.body[0].id).toBeDefined()
    
        // or:
        // const ids = response.body.map(blog => blog.id)
        // expect(ids).toHaveLength(helper.initialBlogs.length)
    })
})

describe('new blog', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})

        const blogs = helper.initialBlogs.map(blog => new Blog(blog))
        const promises = blogs.map(blog => blog.save())
        await Promise.all(promises)

        const passwordHash = await bcrypt.hash('secret', 10)
    
        const user = new User({
            email: 'root@bla.com',
            username: 'rooting',
            firstName: 'root',
            lastName: 'rootic',
            passwordHash
        })
        
        await user.save()
    })

    test('add blog', async () => {
        const token = await helper.signToken('rooting')

        const newBlog = {
            title: 'Bloggie Blog',
            author: 'Blogger',
            url: 'sorry but no',
            likes: 73
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await api
            .get('/api/blogs')
            .set('Authorization', `bearer ${token}`)
        expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    
        const blogs = response.body.map(blog => blog.title)
        expect(blogs).toContain('Bloggie Blog')
    })
    
    test('likes default to 0', async () => {
        const token = await helper.signToken('rooting')

        const newBlog = {
            title: 'Bloggie Blog',
            author: 'Blogger',
            url: 'sorry but no'
        }
    
        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            
        const response = await api
            .get('/api/blogs')
            .set('Authorization', `bearer ${token}`)
        const savedBlog = response.body.find(blog => blog.title === 'Bloggie Blog')
        
        expect(savedBlog.likes).toBe(0)
    })
    
    test('invalid blogs are not saved', async () => {
        const token = await helper.signToken('rooting')
        
        const newBlog = {
            author: 'Blogger'
        }
    
        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(400)
    })

    test('no token returns 401', async () => {
        const token = await helper.signToken('rooting')

        const newBlog = {
            title: 'Bloggie Blog',
            author: 'Blogger',
            url: 'sorry but no',
            likes: 73
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)
    
        const response = await api
            .get('/api/blogs')
            .set('Authorization', `bearer ${token}`)
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    describe('blog is created', () => {
        beforeEach(async () => {
            const token = await helper.signToken('rooting')

            const newBlog = {
                title: 'Bloggie Blog',
                author: 'Blogger',
                url: 'sorry but no',
                likes: 73
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .set('Authorization', `bearer ${token}`)
        })

        test('blog can be liked and disliked', async () => {
            const token = await helper.signToken('rooting')
            const blogs = await api
                .get('/api/blogs')
                .set('Authorization', `bearer ${token}`)
                
            const { id } = blogs.body.find(blog => blog.title === 'Bloggie Blog')

            const response = await api
                .put(`/api/blogs/${id}`)
                // we use username instead of id here, it doesn't matter as long as it's a string
                .send({ likedBy: 'rooting' })
                .set('Authorization', `bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(response.body.likes).toBe(74)
        })

        test('blog can be commented', async () => {
            const token = await helper.signToken('rooting')
            const blogs = await api
                .get('/api/blogs')
                .set('Authorization', `bearer ${token}`)
    
            const { id } = blogs.body.find(blog => blog.title === 'Bloggie Blog')

            const response = await api
                .post(`/api/blogs/${id}/comments`)
                .send({ comment: 'wow' })
                .set('Authorization', `bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(response.body.comments).toContain('wow')
        })

        test('blog can be deleted', async () => {
            const token = await helper.signToken('rooting')
            const blogsBefore = await api
                .get('/api/blogs')
                .set('Authorization', `bearer ${token}`)
    
            const { id } = blogsBefore.body.find(blog => blog.title === 'Bloggie Blog')
    
            const response = await api
                .delete(`/api/blogs/${id}`)
                .set('Authorization', `bearer ${token}`)
                .expect(204)
    
            expect(response.body.message).not.toBeDefined()
    
            const blogsAfter = await api
                .get('/api/blogs')
                .set('Authorization', `bearer ${token}`)
    
            expect(blogsAfter.body).toHaveLength(blogsBefore.body.length - 1)

            expect(blogsAfter.body.find(blog => blog.id === id)).not.toBeDefined()
        })
    })
})

afterAll(() => mongoose.connection.close())