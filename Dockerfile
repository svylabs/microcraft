# Use Ubuntu as the base image
FROM ubuntu:latest

# Set environment variables
ENV GOOGLE_CLOUD_SDK_VERSION 368.0.0

# Install required dependencies
RUN apt-get update && \
    apt-get install -y \
    curl \
    git \
    build-essential \
    openjdk-17-jre

ENV NVM_DIR /usr/local/nvm
RUN mkdir -p $NVM_DIR

# Install NVM
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Add NVM environment variables to bashrc

# Set default Node.js version
ARG NODE_VERSION=20

# Add NVM environment variables to bashrc
RUN echo "export NVM_DIR=\"$NVM_DIR\"" >> /root/.bashrc && \
    echo "[ -s \"$NVM_DIR/nvm.sh\" ] && \. \"$NVM_DIR/nvm.sh\"" >> /root/.bashrc

# Install the desired Node.js version
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION && nvm use default"


# Install Google Cloud SDK
RUN apt-get update && \
    apt-get install -y \
    apt-transport-https \
    ca-certificates \
    gnupg \
    && curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add - \
    && echo "deb https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list \
    && apt-get update \
    && apt-get install -y google-cloud-sdk

# Install Google Cloud Datastore Emulator
RUN apt-get install -y google-cloud-cli-datastore-emulator
RUN apt-get install -y google-cloud-cli

# Set the working directory
WORKDIR /app

# Install application dependencies

RUN gcloud config set project microcraft-1

# Expose necessary ports
EXPOSE 8080
EXPOSE 8081
EXPOSE 5173

CMD ["gcloud", "beta", "emulators", "datastore", "start", "--data-dir=/app/microcraft/datastore"]
