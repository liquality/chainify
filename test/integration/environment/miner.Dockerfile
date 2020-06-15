FROM alpine
COPY mine.sh /home/mine.sh
WORKDIR /home
CMD /bin/sh mine.sh