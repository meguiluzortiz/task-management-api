heroku-restart:
	heroku ps:scale web=0 && heroku ps:scale web=1

heroku-logs:
	heroku logs --tail

# Reads the Procfile
heroku-local:
	yarn build && heroku local web