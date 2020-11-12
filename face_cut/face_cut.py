from PIL import Image
import face_recognition
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("-f", action='store', dest="input",type=str, help="file input")
parser.add_argument("-o", action='store', dest="output", type=str, help="file output")
args = parser.parse_args()

image = face_recognition.load_image_file(args.input)
face_locations = face_recognition.face_locations(image)

if(not face_locations):
    print('detecting failed')

for face_location in face_locations:
    top, right, bottom, left = face_location
    
    if top >= 30:
        top = top-30
    else :
        top = 0
    
    if left >= 10:
        left = left-10
    else :
        left = 0

    face_image = image[top:bottom+30, left:right+10]
    pil_image = Image.fromarray(face_image)

    pil_image.save(args.output)