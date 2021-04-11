// express reacts with the front end
const express = require('express');
// needs path const for a file name 
const path = require('path');
// fs to read, wirite and append files."fs" needs to be in quotes. 
const fs = require("fs")

// Sets up the Express app

const app = express();
// create a port to listen in on in localhost
const PORT = 3000;

// Sets up the Express app to handle data parsing and middleware static
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// route that displays start page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
// route that takes user to data entry page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//  code that reads my db.json file
app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});
// code that post info into my db file
app.post("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
        if (err) throw err;
        const details = JSON.parse(data);
        const newDetail = [];

        details.push(req.body);

        for (let i = 0; i < details.length; i++) {
            const newNote = {
                title: details[i].title,
                text: details[i].text,
                id: i
            };

            newDetail.push(newNote);
        }

        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(newDetail, null, 2), (err) => {
            if (err) throw err;
            res.json(req.body);
        });
    });
});
//  delete 
app.delete("/api/notes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
        if (err) throw err;
        const details = JSON.parse(data);
        const newDetail = [];

        for (let i = 0; i < details.length; i++) {
            if (i !== id) {
                const newNote = {
                    title: details[i].title,
                    text: details[i].text,
                    id: newDetail.length
                };

                newDetail.push(newNote);
            }
        }

        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(newDetail, null, 2), (err) => {
            if (err) throw err;
            res.json(req.body);
        });
    });
});
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));