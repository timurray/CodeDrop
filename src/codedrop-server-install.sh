#run as root/sudo
apt-get update
apt-get install -y mosh mc tmux htop iotop iftop nano # not required, but useful utilities
apt-get install -y openjdk-7-jdk openjdk-7-jre openjdk-7-jre-headless
/ openjdk-7-jre-lib openjdk-7-jre-zero openjdk-7-doc python python-pip tomcat7
wget -qO- https://get.docker.com/ | sh # installs docker
usermod -aG docker dean #replace with the application user account that auto runs
reboot #probably need to reboot here to get the docker daemon running and have all permissions set appropriately
