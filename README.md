# handycraft

## Create Dynamic component

```
   curl -X POST -H 'Content-Type: application/json' -d '{"title": "test-component", "description": "first component", "image_url": "http://...", "code": "console.log"}' https://handycraft-415122.oa.r.appspot.com/dynamic-component/new -v
```

## List Dynamic Components

This will list all approved components

```
    curl https://handycraft-415122.oa.r.appspot.com/dynamic-component/list
```

The following will list pending components

```
    curl https://handycraft-415122.oa.r.appspot.com/dynamic-component/list?approval_status=pending
```


## Approve a Dynamic component

```
   curl -X POST -H 'Content-Type: application/json' -d '{"id": "test-component"}' https://handycraft-415122.oa.r.appspot.com/dynamic-component/approve -v
```

# Using docker

## Building the image

```
  docker build -t microcraft-dev-img .
```

## Run the image

```
  docker run -it -v <fullpath-to-local-handycraft-repo>:/app/microcraft -p 8081:8081 -p 8080:8080 -p 5173:5173  microcraft-dev-img
```

To run the application with specific local repositories:

```
    docker run -it -v /Users/rohitbharti/Desktop/MICROCRAFT-LIB/microcraft-lib:/app/microcraft-lib -v /Users/rohitbharti/Desktop/handycraft-main/handycraft:/app/microcraft -p 8081:8081 -p 8080:8080 microcraft-dev-img
```
Note: If needed to run locally without Docker, include the -p 5173:5173 flag.

This will run the docker image and also run the datastore by default

## Terminal 1: Run server

```
   docker container list
   docker exec -it b2cd307fe419 /bin/bash  #b2cd307fe419 is the container id from previous step
   cd microcraft
   npm run dev
```

## Terminal 2: Run app

```
   docker container list
   docker exec -it b2cd307fe419 /bin/bash  #b2cd307fe419 is the container id from previous step
   cd microcraft/src/app
   npm run dev
```

You should be able to access the 
