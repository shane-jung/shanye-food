import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Router } from 'express';
import path from 'path';

export default function initializeServer(router: Router) {
    const app = express();
    const isProduction = process.env.NODE_ENV === 'production';
    const origin = {
        origin: isProduction
            ? [
                  'https://shanyefood.com',
                  'https://www.shanyefood.com',
                  'https://api.shanyefood.com',
              ]
            : 'http://localhost:3000',
        methods: 'GET,POST,PUT,DELETE',
        credentials: true,
    };

    app.use(cookieParser());
    app.set('trust proxy', 1);
    app.set('Content-Type', 'application/json');
    app.use(express.json());
    app.use(cors(origin));

    app.use('/api', router);

    if (isProduction) {
        const __dirname = path.resolve();
        app.use(express.static(path.join(__dirname, 'assets')));
        app.get('*', (_req, res) =>
            res.sendFile(path.resolve(__dirname, 'index.html')),
        );
    } else {
        app.get('/', (_req, res) => {
            res.send('Hello World!');
        });
    }

    return app;
}
