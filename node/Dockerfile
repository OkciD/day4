FROM ubuntu:16.04

RUN echo "update" && apt-get -y update

# root
USER root
RUN apt-get -y update
RUN apt-get install -y nodejs
RUN apt-get install -y npm
RUN apt-get install -y nodejs-legacy

# copy app to container
ENV APP /root/app
ADD ./ $APP

# go to app
WORKDIR $APP

# node proj manager
RUN npm install forever -g

RUN npm install

EXPOSE 80

RUN apt-get update && apt-get install -y openssh-server
RUN mkdir /var/run/sshd
RUN echo 'root:hackathon' | chpasswd
RUN sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile

EXPOSE 22

# go to app
WORKDIR $APP

#    	forever start node	  sshd
CMD forever start index.js && /usr/sbin/sshd -D
