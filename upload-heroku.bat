@echo off
echo Login to your heroku account
heroku login
echo Initiating git repository
git init
git add .
git commit -m "First Commit"
echo Making a heroku app page
heroku create
echo Setting up heroku server
git push heroku master
heroku ps:scale web=1
echo web: node index.js > Procfile.txt
git add .
git commit -m "Adding Procfile.txt"
git push heroku master