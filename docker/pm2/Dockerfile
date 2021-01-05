FROM ubuntu:latest
RUN apt-get update -y
RUN apt-get install -y python-pip python-dev build-essential
COPY . /var/www/backend/face_cut
WORKDIR /var/www/backend/face_cut
RUN pip install -r requirements.txt
ENTRYPOINT ["python"]
CMD ["access_realtime.py"]