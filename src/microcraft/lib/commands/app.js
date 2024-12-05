const fs = require('fs');
const path = require('path');
const express = require('express');

const createApp = async (name, description) => {
    try {
        // Check if the directory already exists
        if (!fs.existsSync(name)) {
            fs.mkdirSync(name);
        } else {
            console.error(`Directory ${name} already exists.`);
            return;
        }

        // Create a new app json locally
        const app = {
            name,
            description,
            components: [
                {
                    type: "text",
                    label: "Enter your name",
                    id: "name",
                    placement: "input"
                },
                {
                    type: "button",
                    label: "Submit",
                    id: "submit",
                    placement: "action",
                    code: "alert(`Hello, ${data[\"name\"]}`);"
                }
            ],
            contracts: [
                {
                    name: "Lock",
                    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
                    abi: []
                }
            ],
            networks: [
                {
                    type: "ethereum",
                    config: {
                        rpcUrl: "your_rpc_url",
                        chainId: "your_chain_id",
                        exploreUrl: "your_explore_url"
                    }
                }
            ]
        };

        // Store app.json in the newly created directory
        fs.writeFileSync(`${name}/app.json`, JSON.stringify(app, null, 2));
        console.log("A simple app has been created", app);
        console.log("You can run the app using `microcraft app open <dir>` command");
    } catch (error) {
        console.error('Error creating app:', error.message);
    }
}

const new_command = async (name, description, options) => {
    try {
        // Create a new app json locally
        await createApp(name, description);
    } catch (error) {
        console.error('Error creating app:', error.message);
    }
}

const open_command = async (source, url) => {
    try {
        const app = express();
        app.use(express.static(path.join(__dirname, '../../microcraft-lite/dist')));
        // Serve static files from the current working directory
        app.use(express.static(process.cwd()));

        app.use("/app", (req, res) => {
            res.sendFile(path.join(__dirname, "..", "..", "microcraft-lite", 'dist', 'index.html'));
        });
        let pathParam = `source=${source}&path=${url}`;
        if (source === 'local') {
            app.use("/applet/files", (req, res) => {
                const basePath = req.query.base_path;
                const filePath = req.query.file_path;
                //console.log(name, file);
                res.sendFile(path.join(process.cwd(), basePath, filePath));
            });
            app.use("/applet/app.json", (req, res) => {
                //console.log(req.query.path, 'app.json');
                res.sendFile(path.join(process.cwd(), req.query.base_path, 'app.json'));
            });
        }
        const open = await import('open');
        //console.log(open);
        app.listen(2112, () => {
            console.log('Server started at http://localhost:2112');
            console.log("Opening app in browser..");
            open.default('http://localhost:2112/?' + pathParam);
        });

    } catch (error) {
        console.log(error);
        console.error('Error opening app:', error.message);
    }
}

// Function to merge content from JS files into the app JSON
const buildApp = async (appDirectory) => {
    try {
        // Read the app.json file
        const appPath = path.join(appDirectory, 'app.json');
        const appData = JSON.parse(fs.readFileSync(appPath, 'utf-8'));

        // Process each component to update 'code' with the content from the referenced js file (if `codeRef` or `coderef` exists)
        appData.components = await Promise.all(appData.components.map(async (component) => {
            // Check for both `coderef` and `codeRef`
            const codeReference = component.coderef || component.codeRef;

            if (codeReference) {
                const codePath = path.join(appDirectory, codeReference);  // Holds the path to JS file
                if (fs.existsSync(codePath)) {
                    const codeContent = fs.readFileSync(codePath, 'utf-8');
                    component.code = codeContent;  // Replace the reference with actual code content
                    delete component.coderef;  // Remove `coderef` after merging the code
                    delete component.codeRef;  // Remove `codeRef` after merging the code
                } else {
                    console.error(`Code file not found: ${codePath}`);
                }
            }
            if (component.events && component.events.length > 0) {
                for (let event of component.events) {
                    const codeReference = event.coderef || event.codeRef;
                    if (codeReference) {
                        const codePath = path.join(appDirectory, codeReference);
                        if (fs.existsSync(codePath)) {
                            const codeContent = fs.readFileSync(codePath, 'utf-8');
                            event.code = codeContent;
                            delete event.coderef;
                            delete event.codeRef;
                        } else {
                            console.error(`Code file not found: ${codePath}`);
                        }
                    }
                }
            }
            return component;
        }));
        fs.mkdirSync(path.join(appDirectory, "dist"));
        // Write the new app.json file with merged code
        const outputPath = path.join(appDirectory, "dist", 'app.json');
        fs.writeFileSync(outputPath, JSON.stringify(appData, null, 2));

        console.log(`App has been built successfully! Merged app.json saved as app.build.json in the ${appDirectory} directory.`);
    } catch (error) {
        console.error('Error building the app:', error.message);
    }
};


// Command to build the app and merge code references
const build_command = async (appDirectory) => {
    try {
        await buildApp(appDirectory);
    } catch (error) {
        console.error('Error building app:', error.message);
    }
};


module.exports = { new_command, open_command, build_command };