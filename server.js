const express = require('express');
const bodyParser = require('body-parser');

class Server {
    constructor() {
        this.app = express();
        this.setup();
    }

    setup() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(express.static(__dirname + '/frontend/assets'));
        this.app.engine('ejs', require('ejs-locals'));
        this.app.set('views', __dirname + '/frontend/templates');
        this.app.set('view engine', 'ejs');

        this.createRoutes();
        this.createServer();
    }

    createRoutes() {
        this.app.get('/', (req, res) => {
            const query = req.query;
            console.log(query);

            const teams = (query.teams)? query.teams.split(':') : null;
            res.render("index", {
                teams
            });
        });
    }

    createServer() {
        const port = 8080 || process.env.NODE_PORT;
        this.server = require('http').createServer(this.app);
        this.server.listen(port, () =>
            console.log(`Start listening on localhost:${port}`)
        );
    }
}

module.exports = new Server;
