#Installation script for setting up a server/VM to run docker.
#run as SU/sudo
apt-get update
#apt-get install -y mosh mc tmux htop iotop iftop nano # not required, but useful utilities
apt-get install -y git python python-pip nodejs
apt-get install -y apt-transport-https ca-certificates
apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
apt-get update
apt-get purge lxc-docker
apt-cache policy docker-engine
apt-get install -y linux-image-extra-$(uname -r)
apt-get install -y apparmor
apt-get install -y docker-engine
apt-get install -y npm
#need to add docker to its own group to run without sudo?
service dockert start
docker run hello-world
#at this point, the hello-world docket runs, to confirm successful installation
apt-get install -y nginx
npm install express httpdispatcher
npm install pm2 -g
npm install formidable
npm install express

