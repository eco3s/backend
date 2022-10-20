#!/bin/sh

	# variables
	# find username from environment variable
	# load nanoid function
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" < $(CDPATH= cd -- "$(dirname -- "$0")" && pwd)/nanoid.sql
