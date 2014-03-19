#!/usr/bin/env bash

echo "--- Let's get to work. Installing now. ---"

echo "--- Installing node.js ---"
sudo apt-get update
sudo apt-get install -y python-software-properties python g++ make
sudo add-apt-repository -y ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install -y  nodejs

# Laravel stuff here, if you want

npm install grunt-cli -g
npm install supervisor -g

cd /vagrant
npm install
cd ./client
npm install
grunt

cp /vagrant/start.sh /etc/init.d/project-run
chmod 755 /etc/init.d/project-run
echo "--- service project runned ---"
update-rc.d project-run defaults 97 03
#service project-run

echo "--- All done, enjoy! :) ---"
