#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
docco --output $DIR/docs $DIR/js/*.js
docco --output $DIR/docs $DIR/server/server.js