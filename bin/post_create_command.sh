#!/bin/bash

set -e -x

if ! [ -d .git ]; then
    rsync -rlpt ../hostdir/.git/ .git/
    git checkout -- .
fi

if ! [ -d .env ]; then
    rsync -rlpt ../hostdir/.env .env
fi
