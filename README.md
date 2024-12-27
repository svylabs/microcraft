# microcraft

Microcraft is a project build to create and publish micro-frontend applications. The code is a monorepo containing the code for centralized `microcraft.dev` as well as `app.microcraft.dev` - which is a lite version of the microcraft, with no connections to backend and with the ability to run frontend applications configured as JSON manifest.

# Centralized Application
1. `src/lib` - A backend component that is used to authenticate / store published apps.
2. `src/app` - The frontend application used to create frontends and publish them to `microcraft.dev` 
3. `src/microcraft-registry` - The CLI used to publish contract ABIs to the backend.

# Decentralized CLI / Frontend 
5. `src/microcraft`:  This is a command line tool, that bundles a web application (microcraft-lite) hosted at `app.microcraft.dev` that could work as Decentralized Frontend. If you are interested in Decentralized frontends, you must look into this.

# Microcraft-lib

Both `microcraft.dev` and `app.microcraft.dev` uses the [microcraft-lib library](https://github.com/svylabs-com/microcraft-lib) - a typescript react library [npm link: ](https://www.npmjs.com/package/@svylabs/microcraft-lib). The library exposes a component called `DynamicApp` that takes in the app manifest and renders the application UI based on the app definition.

# Developing
## Using docker

### Building the image

```
  docker build -t microcraft-dev-img .
```

### Run the image

```
  docker run -it -v <fullpath-to-local-handycraft-repo>:/app/microcraft -p 8081:8081 -p 8080:8080 -p 5173:5173  microcraft-dev-img
```

To run the application with specific local repositories:

```
    docker run -it -v /Users/rohitbharti/Desktop/MICROCRAFT-LIB/microcraft-lib:/app/microcraft-lib -v /Users/rohitbharti/Desktop/handycraft-main/handycraft:/app/microcraft -p 8081:8081 -p 8080:8080 microcraft-dev-img
```
Note: If needed to run locally without Docker, include the -p 5173:5173 flag.

This will run the docker image and also run the datastore by default

### Terminal 1: Run server

```
   docker container list
   docker exec -it b2cd307fe419 /bin/bash  #b2cd307fe419 is the container id from previous step
   cd microcraft
   npm run dev
```

### Terminal 2: Run app

```
   docker container list
   docker exec -it b2cd307fe419 /bin/bash  #b2cd307fe419 is the container id from previous step
   cd microcraft/src/app
   npm run dev
```

You should be able to access the 
