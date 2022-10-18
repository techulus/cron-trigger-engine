FROM postgres:14

RUN apt-get update && apt-get -y install postgresql-14-cron postgresql-server-dev-14 libcurl4-openssl-dev make g++ wget

WORKDIR /tmp

# Install PG HTTP 
RUN wget https://github.com/pramsey/pgsql-http/archive/refs/tags/v1.5.0.tar.gz && \
    tar -xvzf v1.5.0.tar.gz && \
    cd pgsql-http-1.5.0 && \
    make && \
    make install

WORKDIR /

COPY runtime/ /