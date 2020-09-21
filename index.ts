import express = require('express');
import config = require('config')
import path from 'path'
import authRouter from './routes/Auth'
import booksRouter from './routes/Books'

const app: express.Application = express();
const PORT = config.get('express.PORT')


// configure app
app.use(express.json())
app.use('/img', express.static(path.join(__dirname, 'img')))


// routes
app.use('/api/auth', authRouter)
app.use('/api/book', booksRouter)
app.use((req: express.Request, res: express.Response) => {
  res.status(404).send({ ok: false, message: 'Invalid request' })
})

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, 'client', 'build')));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// to handle error
app.use((err: any, req: express.Request, res: express.Response, next: any) => {
  // some error
})

app.listen(PORT, () => {
  console.log(`Server has alredy started at port: ${PORT}`);
})