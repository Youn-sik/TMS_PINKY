import os, sys, getopt

# 기본 선언
argv = sys.argv

PROCESS_NAME = argv[0]
IMAGE_PATH = ""
OUTPUT_PATH = ""


def printHelp():
    print(PROCESS_NAME, "-f <Image path>, --file=<Image path>")
    print("-o, --output=<Output path>. Default: <Image path>_output")
    sys.exit(2)


try:
    opts, etc_args = getopt.getopt(
        argv[1:],
        "f:o:",
        [
            "help",
            "file=",
            "output=",
        ],
    )

except getopt.GetoptError:
    printHelp()

for opt, arg in opts:  # 옵션이 파싱된 경우
    if opt in ("-h", "--help"):  # HELP 요청인 경우 사용법 출력
        printHelp()

    elif opt in ("-f", "--file"):
        IMAGE_PATH = arg

    elif opt in ("-o", "--output"):
        OUTPUT_PATH = arg

if len(IMAGE_PATH) < 1:  # 필수항목 값이 비어있다면
    printHelp()

if len(OUTPUT_PATH) < 1:  # 필수항목 값이 비어있다면
    filename, file_extension = os.path.splitext(IMAGE_PATH)
    OUTPUT_PATH = filename + '_output' + file_extension

# 파일 확인
if not os.path.isfile(IMAGE_PATH):
    print("Input image is not a file.")
    print("")
    printHelp()
    sys.exit(2)

import cv2
import csv
import numpy as np
from centerface import CenterFace

input_img = cv2.imread(IMAGE_PATH)
#input_img = cv2.cvtColor(input_img, cv2.COLOR_BGR2RGB)

h, w = input_img.shape[:2]
centerface = CenterFace()

dets, lms = centerface(input_img, h, w, threshold=0.35)

if len(lms) == 0:
    exit()

left_eye = (lms[0][0], lms[0][1])
right_eye = (lms[0][2], lms[0][3])

delta_x = right_eye[0] - left_eye[0]
delta_y = right_eye[1] - left_eye[1]
angle = np.arctan(delta_y/delta_x)
angle = (angle * 180) / np.pi

# Width and height of the image
h, w = input_img.shape[:2]
# Calculating a center point of the image
# Integer division "//"" ensures that we receive whole numbers
center = (w // 2, h // 2)
# Defining a matrix M and calling
# cv2.getRotationMatrix2D method
M = cv2.getRotationMatrix2D(center, (angle), 1.0)
# Applying the rotation to our image using the
# cv2.warpAffine method
rotated = cv2.warpAffine(input_img, M, (w, h))

dets, lms = centerface(rotated, h, w, threshold=0.35)

for det in dets:
    boxes, score = det[:4], det[4]

    x1 = int(boxes[0])
    y1 = int(boxes[1])
    x2 = int(boxes[2])
    y2 = int(boxes[3])

    crop_img = rotated[y1:y2, x1:x2]
    cv2.imwrite(OUTPUT_PATH, crop_img)
    break