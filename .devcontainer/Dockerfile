# From debian latest
FROM mcr.microsoft.com/devcontainers/javascript-node

# persistent dependencies
RUN set -eux; \
    apt-get update; \
    # upgrade installed packages
    apt-get upgrade --yes --no-install-recommends; \
    apt-get install default-jre-headless --yes --no-install-recommends; \
    rm -rf /var/lib/apt/lists/*

RUN set -eux; \
    su node -c "umask 0002 && npm install -g npm@latest"; \
    npm cache clean --force > /dev/null 2>&1; \
    su node -c "umask 0002 && npm install -g typescript"