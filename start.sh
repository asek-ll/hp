#!/bin/bash
cd /vagrant
supervisor -w plugins,server.js,plugins.js server.js &
cd /vagrant/client
grunt watch &

