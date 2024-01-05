const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/', require('./routes/root'))

app.all('*', (req, res)=>{
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(__dirname, 'views', '404.html')
    }else if (req.accepts('json')) {
        res.json({message: '404 Not found'})
    }else {
        res.type('txt').send('404 Not found')
    }
})

app.listen(PORT, () => {
  console.log(`server up on http://localhost:${PORT}`);
});