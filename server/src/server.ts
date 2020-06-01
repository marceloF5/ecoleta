import express from 'express'

const app = express()

app.get('/users', (request, response) => {
  console.log('User List')

  response.json(['Marcelo', 'Yasmin', 'Hugo'])
})

app.listen(3333, () => {
  console.log('Listen on port 3333')
})
