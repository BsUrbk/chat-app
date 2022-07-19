import app from "./app";

app.listen(process.env.PORT || 3000, ()=>{console.log(`Up and running at ${process.env.HOSTNAME}:${process.env.PORT}`)})