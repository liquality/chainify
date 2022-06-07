FROM alpine

COPY mine.sh /home/mine.sh

WORKDIR /home

RUN apk add curl curl-dev

CMD /bin/sh mine.sh