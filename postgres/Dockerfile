FROM ubuntu:16.04

RUN echo "upd" && apt-get -y update
ENV PGVER 9.5
RUN apt-get install -y postgresql-$PGVER

# postgres
USER postgres
RUN /etc/init.d/postgresql start &&\
    psql --command "ALTER USER postgres WITH SUPERUSER PASSWORD '12345';" &&\
    createdb -E utf8 -T template0 -O postgres my_database &&\
    /etc/init.d/postgresql stop

ENV PG_CONF_FILE /etc/postgresql/$PGVER/main/postgresql.conf

RUN echo "synchronous_commit = off" >> $PG_CONF_FILE
RUN echo "fsync = off" >> $PG_CONF_FILE
RUN sed -i '/listen_addresses/s/^#//g' $PG_CONF_FILE
RUN sed -i '/listen_addresses/s/localhost/*/g' $PG_CONF_FILE
RUN sed -i '/password_encryption/s/^#//g' $PG_CONF_FILE

ENV PG_HBA /etc/postgresql/9.5/main/pg_hba.conf

RUN echo "host     all             all             10.0.0.0/8              md5" >> $PG_HBA

EXPOSE 5432

VOLUME  ["/etc/postgresql", "/var/log/postgresql", "/var/lib/postgresql"]

USER root
RUN apt-get update && apt-get install -y openssh-server
RUN mkdir /var/run/sshd
RUN echo 'root:hackathon' | chpasswd
RUN sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile

EXPOSE 22

# start postgres		forever start node	  sshd
CMD service postgresql start && /usr/sbin/sshd -D
