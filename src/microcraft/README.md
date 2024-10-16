# Microcraft CLI Commands

This README provides details on how to use the CLI commands for creating, running, and building apps in the Microcraft platform.

## Table of Contents

- [Create a New App](#create-a-new-app)
- [Run or Open an App](#run-or-open-an-app)
- [Build an App](#build-an-app)
- [Working with Apps Folder](#working-with-apps-folder)

## Create a New App

To create a new app, use the following command:

```
node bin/index.js app new <app-name> "<app-description>"
```

### Examples

1. **Create a `hello-world` app** with the description "Sample App":
   ```
   node bin/index.js app new hello-world "Sample App"
   ```

2. **Create a `total-lusd-circulation` app** with the description "Total LUSD in Circulation":
   ```
   node bin/index.js app new total-lusd-circulation "Total LUSD in Circulation"
   ```

## Run or Open an App

To run or open an app locally, use the following command:

```
node bin/index.js app open local <app-name>
```

### Examples

1. **Run or open the `hello-world` app**:
   ```
   node bin/index.js app open local hello-world
   ```

2. **Run or open the `total-lusd-circulation` app**:
   ```
   node bin/index.js app open local total-lusd-circulation
   ```

## Build an App

To build an app, use the following command:

```
node bin/index.js app build <app-name>
```

### Examples

1. **Build the `hello-world` app**:
   ```
   node bin/index.js app build hello-world
   ```

2. **Build the `total-lusd-circulation` app**:
   ```
   node bin/index.js app build total-lusd-circulation
   ```

## Working with Apps Folder

For apps located in the `apps` folder, use the following commands:

### Create a New App in `apps`

```
node bin/index.js app new apps/<app-name> "<app-description>"
```

#### Example:
**Create a `total-lusd-circulation` app** inside the `apps` folder with the description "Total LUSD in Circulation":
```
node bin/index.js app new apps/total-lusd-circulation "Total LUSD in Circulation"
```

### Run or Open an App from `apps`

```
node bin/index.js app open local apps/<app-name>
```

#### Example:
**Run or open the `total-lusd-circulation` app** inside the `apps` folder:
```
node bin/index.js app open local apps/total-lusd-circulation
```

### Build an App from `apps`

```
node bin/index.js app build apps/<app-name>
```

#### Example:
**Build the `total-lusd-circulation` app** inside the `apps` folder:
```
node bin/index.js app build apps/total-lusd-circulation
```