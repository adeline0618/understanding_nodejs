// @ts-check
// Formatting(Prettier), Linting(ESLint), Type Checking(TypeScript)

const http = require('http')

// JSDoc 이용
/**
 * @typedef Post
 * @property {string} id
 * @property {string} title
 * @property {string} content
 */

/** @type {Post[]} */

const posts = [
  {
    id: 'my_first_post',
    title: 'My first post',
    content: 'Hello',
  },
  {
    id: 'my_second_post',
    title: 'My second post',
    content: 'Second!!',
  },
]

const server = http.createServer((req, res) => {
  const POST_ID_REGEX = /^\/posts\/([a-zA-Z0-9-_]+)$/
  const postIdRegexResult =
    (req.url && POST_ID_REGEX.exec(req.url)) || undefined

  if (req.url === '/posts' && req.method === 'GET') {
    const result = {
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
      })),

      totalCount: posts.length,
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify(result))
  } else if (postIdRegexResult && req.method === 'GET') {
    const postId = postIdRegexResult[1]
    const post = posts.find((_post) => _post.id === postId)
    if (post) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(post))
    } else {
      res.statusCode = 404
      res.end('Post not found.')
    }
  } else if (req.url === '/posts' && req.method === 'POST') {
    req.setEncoding('utf-8')
    req.on('data', (data) => {
      /**
       * @typedef CreatePostBody
       * @property {string} title
       * @property {string} content
       */
      /** @type {CreatePostBody} */
      const body = JSON.parse(data)
      posts.push({
        id: body.title.toLocaleLowerCase().replace(/\s/g, '_'),
        title: body.title,
        content: body.content,
      })
    })

    res.statusCode = 200
    res.end('Creating post')
  } else {
    res.statusCode = 404
    res.end('Not found.')
  }
})

const PORT = 4000
server.listen(PORT, () => {
  console.log(`The server is listening at port: ${PORT}.`)
})
