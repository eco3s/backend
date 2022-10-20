-- load pgcrypto extension
CREATE EXTENSION
IF NOT EXISTS pgcrypto;

-- define nanoid() function
CREATE OR REPLACE FUNCTION
nanoid(
	size int DEFAULT 21 -- default length of nanoid
)
RETURNS text AS $$
DECLARE
	id text := '';
	i int := 0;
	-- use all latin alphabets, digits, `_` and `-`
	urlAlphabet char(64) := 'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW';
	-- use completely random value
	bytes bytea := gen_random_bytes(size);
	byte int;
	pos int;
BEGIN
	WHILE i < size LOOP
		byte := get_byte(bytes, i);
		pos := (byte & 63) + 1; -- + 1 because substr starts at 1 for some reason
		id := id || substr(urlAlphabet, pos, 1); -- update id
		i = i + 1;
	END LOOP;
	RETURN id;
END
$$ LANGUAGE PLPGSQL STABLE;

-- CreateTable
CREATE TABLE "User" (
    "id" CHAR(21) NOT NULL DEFAULT nanoid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
