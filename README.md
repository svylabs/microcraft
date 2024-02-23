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