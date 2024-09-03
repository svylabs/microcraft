const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Create uploads folder if it doesn't exist
const uploadsFolderPath = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsFolderPath)) {
    fs.mkdirSync(uploadsFolderPath);
    console.log('Uploads folder created successfully.');
} else {
    console.log('Uploads folder already exists.');
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsFolderPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).single('file');

app.use(express.static(path.join(__dirname, 'public')));

app.post('/converter/Secure-Pdf', (req, res) => {
    upload(req, res, (err) => {
        if (req.file) {
            const outputfile = Date.now() + 'protected.pdf';
            const password = req.body.password;
            const process = spawn('python', ['app.py', req.file.path, outputfile, password]);

            process.on('exit', (code) => {
                if (code === 0) {
                    const destinationFolder = path.join(__dirname, 'public/downloads');
                    const outputPath = path.join(destinationFolder, outputfile);
                    
                    fs.renameSync(outputfile, outputPath);
                    
                    res.download(outputPath, (err) => {
                        if (err) {
                            console.error('Error:', err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            fs.unlinkSync(outputPath);
                        }
                    });
                }
            });
        }
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
