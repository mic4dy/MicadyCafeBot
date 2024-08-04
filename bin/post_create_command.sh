#!/bin/bash

set -e -x

if ! [ -d .git ]; then
    git config --global --add safe.directory /home/vscode/workspace
    rsync -rlpt ../hostdir/.git/ .git/
    git checkout -- .
fi

if ! [ -d .env ]; then
    rsync -rlpt ../hostdir/.env .env
fi
