# Setup of the .env environment variables.

In order for the databases to initialise you will need to set the correct .env environmental vairables first. 

Please create two deperate files in the main diretory, called .env.test and .env.development. Each file will contain the single line PGDATABASE=database_name_here. Please replace the 'database_name_here' with the appropriate database name, which can be found in the /db/setup.sql file.