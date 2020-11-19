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
    OUTPUT_PATH = filename + "_output" + file_extension

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


def blend_transparent(face_img, overlay_t_img):
    # Split out the transparency mask from the colour info
    overlay_img = overlay_t_img[:, :, :3]  # Grab the BRG planes
    overlay_mask = overlay_t_img[:, :, 3:]  # And the alpha plane

    # Again calculate the inverse mask
    background_mask = 255 - overlay_mask

    # Turn the masks into three channel, so we can use them as weights
    overlay_mask = cv2.cvtColor(overlay_mask, cv2.COLOR_GRAY2BGR)
    background_mask = cv2.cvtColor(background_mask, cv2.COLOR_GRAY2BGR)

    # Create a masked out face image, and masked out overlay
    # We convert the images to floating point in range 0.0 - 1.0
    face_part = (face_img * (1 / 255.0)) * (background_mask * (1 / 255.0))
    overlay_part = (overlay_img * (1 / 255.0)) * (overlay_mask * (1 / 255.0))

    # And finally just add them together, and rescale it back to an 8bit integer image
    return np.uint8(cv2.addWeighted(face_part, 255.0, overlay_part, 255.0, 0.0))


with open("/var/www/backend/face_cut/mask.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=",")
    src_pts = []
    for i, row in enumerate(csv_reader):
        # skip head or empty line if it's there
        try:
            src_pts.append(np.array([float(row[1]), float(row[2])]))
        except ValueError:
            continue
src_pts = np.array(src_pts, dtype="float32")

mask_img = cv2.imread("/var/www/backend/face_cut/mask.png", -1)

input_img = cv2.imread(IMAGE_PATH)
# input_img = cv2.cvtColor(input_img, cv2.COLOR_BGR2RGB)

h, w = input_img.shape[:2]
centerface = CenterFace()

dets, lms = centerface(input_img, h, w, threshold=0.35)

if len(lms) == 0:
    exit()

left_eye = (lms[0][0], lms[0][1])
right_eye = (lms[0][2], lms[0][3])

delta_x = right_eye[0] - left_eye[0]
delta_y = right_eye[1] - left_eye[1]
angle = np.arctan(delta_y / delta_x)
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

dst_pts = np.array(
    [
        [lms[0][0], lms[0][1]],
        [lms[0][2], lms[0][3]],
        [lms[0][4], lms[0][5]],
        [lms[0][6], lms[0][7]],
        [lms[0][8], lms[0][9]],
    ],
    dtype="float32",
)

M, _ = cv2.findHomography(src_pts, dst_pts)

# transformed masked image
transformed_mask = cv2.warpPerspective(
    mask_img,
    M,
    (rotated.shape[1], rotated.shape[0]),
    None,
    cv2.INTER_LINEAR,
    cv2.BORDER_CONSTANT,
)

rotated = blend_transparent(rotated, transformed_mask)

for det in dets:
    boxes, score = det[:4], det[4]

    x1 = int(boxes[0])
    y1 = int(boxes[1])
    x2 = int(boxes[2])
    y2 = int(boxes[3])

    crop_img = rotated[y1:y2, x1:x2]
    cv2.imwrite(OUTPUT_PATH, crop_img)
    break