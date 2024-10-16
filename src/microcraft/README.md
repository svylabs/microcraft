# Microcraft CLI Commands

This README provides details on how to use the CLI commands for creating, running, and building apps in the Microcraft platform.

## Table of Contents

- [Create a New App](#create-a-new-app)
- [Run or Open an App](#run-or-open-an-app)
- [Build an App](#build-an-app)
- [Working with Sample Apps](#working-with-sample-apps)

## Create a New App

To create a new app, use the following command:

```
node bin/index.js app new <app-name> "<app-description>"
```

### Example:

1. Create a `hello-world` app with the description "Sample App":
   ```
   node bin/index.js app new hello-world "Sample App"
   ```

2. Create a `total-lusd-circulation` app with the description "Total LUSD in Circulation":
   ```
   node bin/index.js app new total-lusd-circulation "Total LUSD in Circulation"
   ```

## Run or Open an App

To run or open an app locally, use the following command:

```
node bin/index.js app open local <app-name>
```

### Example:

1. Run or open the `hello-world` app:
   ```
   node bin/index.js app open local hello-world
   ```

2. Run or open the `total-lusd-circulation` app:
   ```
   node bin/index.js app open local total-lusd-circulation
   ```

## Build an App

To build an app, use the following command:

```
node bin/index.js app build <app-name>
```

### Example:

1. Build the `hello-world` app:
   ```
   node bin/index.js app build hello-world
   ```

2. Build the `total-lusd-circulation` app:
   ```
   node bin/index.js app build total-lusd-circulation
   ```

## Working with Sample Apps

For apps located in the `sample_apps` folder, use the following commands:

### Create a New App in `sample_apps`

```
node bin/index.js app new sample_apps/<app-name> "<app-description>"
```

#### Example:
Create a `total-lusd-circulation` app inside `sample_apps`:
```
node bin/index.js app new sample_apps/total-lusd-circulation "Total LUSD in Circulation"
```

### Run or Open a Sample App

```
node bin/index.js app open local sample_apps/<app-name>
```

#### Example:
Run or open the `total-lusd-circulation` app inside `sample_apps`:
```
node bin/index.js app open local sample_apps/total-lusd-circulation
```

### Build a Sample App

```
node bin/index.js app build sample_apps/<app-name>
```

#### Example:
Build the `total-lusd-circulation` app inside `sample_apps`:
```
node bin/index.js app build sample_apps/total-lusd-circulation
```