const express = require('express');
const helmet = require('helmet');

const cluster = require('cluster');
let os = require('os')

const { pid } = require('process');

const reInitDatabase = require("./schema/reInitDatabase");

const server = express();
const cors = require('cors');

const authrouter = require('./routes/auth.js');
const studentrouter = require('./routes/student.js'); 
const managerrouter = require('./routes/manager.js'); 

const { generateKey } = require('./RSA/keyGen');

const establishConnection = require('./initializeConnection.js');

const fs = require('fs');

const concurrencyLimit = os.cpus().length;
const PORT = 5000;

server.use(helmet());
server.use(express.json());
server.use(cors());
server.disable('x-powered-by');

// server.use('api/auth', authrouter);
// server.use('api/student', studentrouter);
// server.use('api/manager', managerrouter);
// New routes
server.use('/api/auth', authrouter);
server.use('/api/student', studentrouter);
server.use('/api/manager', managerrouter);


if (cluster.isPrimary) {
    console.log(`[MESSAGE]: Master ${process.pid} is running.`);
    db = establishConnection();

    const initializeOne = () => {
        // dropTables(db[0]);
        // createTables(db[0]);
        // dropAndCreateTables(db[0]);

        if (fs.existsSync('./RSA/public_key.pem') && fs.existsSync('./RSA/private_key.pem')) {
            console.log("[MESSAGE]: Key Exists");
        } else {
            generateKey();
        }

        console.log("[MESSAGE]: Initialization Step 1 done.");
    }

    const initializeTwo = () => {
        reInitDatabase(db[0]);
        console.log("[MESSAGE]: Initialization Step 2 done.");
    }

    initializeOne(); // Run only once in production
    initializeTwo(); // Run only once in production

    console.log(`[MESSAGE]: Forking ${concurrencyLimit} processes.`);

    for (let i = 0; i < concurrencyLimit; i++) {
        cluster.fork();
    }
} else {
    server.listen(PORT, (err) => {
        if (err) {
            console.log('[ERROR]: Error starting server.');
        } else {
            console.log(`[MESSAGE]: Process ${pid} listening on PORT ${PORT}`);
        }
    })
}
