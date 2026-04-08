import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

export default app;
