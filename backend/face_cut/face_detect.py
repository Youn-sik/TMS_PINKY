import insightface
import urllib
import urllib.request
import cv2
import numpy as np
import os, csv
from numpy.linalg import norm
from centerface import CenterFace
import argparse
import time
import codecs, json 
# pip install insightface
# pip install mxnet==1.6.0

parser = argparse.ArgumentParser()
parser.add_argument("-f", action='store', dest="input",type=str, help="file input")
parser.add_argument("-n", action='store', dest="name",type=str, help="file input")
parser.add_argument("-t", action='store', dest="type",type=str, help="file input")
args = parser.parse_args()

def blend_transparent(face_t_img, overlay_t_img):
    # Split out the transparency mask from the colour info
    overlay_img = overlay_t_img[:,:,:3] # Grab the BRG planes
    overlay_mask = overlay_t_img[:,:,3:]  # And the alpha plane

    # Again calculate the inverse mask
    background_mask = 255 - overlay_mask

    # Turn the masks into three channel, so we can use them as weights
    overlay_mask = cv2.cvtColor(overlay_mask, cv2.COLOR_GRAY2BGR)
    background_mask = cv2.cvtColor(background_mask, cv2.COLOR_GRAY2BGR)

    # Create a masked out face image, and masked out overlay
    # We convert the images to floating point in range 0.0 - 1.0
    face_part = (face_t_img * (1 / 255.0)) * (background_mask * (1 / 255.0))
    overlay_part = (overlay_img * (1 / 255.0)) * (overlay_mask * (1 / 255.0))

    # And finally just add them together, and rescale it back to an 8bit integer image    
    return np.uint8(cv2.addWeighted(face_part, 255.0, overlay_part, 255.0, 0.0))

with open("/var/www/backend/face_cut/mask_retinaface.csv") as csv_file:
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

det_model = insightface.model_zoo.get_model('retinaface_r50_v1')
det_model.prepare(-1, 0.4)

rec_name = insightface.model_zoo.get_model('arcface_r100_v1')
rec_name.prepare(-1)

# print(f'Start to known process {known_face_file}')
face_img = cv2.imread(os.path.join(args.input))
face_label = os.path.splitext(os.path.basename(args.input))[0]

# Mask
h, w = face_img.shape[:2]

bboxes, landmarks = det_model.detect(face_img, threshold=0.3, scale=1.0)

find = False

for i in range(bboxes.shape[0]):
    find = True
    bbox = bboxes[i, 0:4]
    det_score = bboxes[i, 4]
    landmark = landmarks[i]

    # 마스크 씌우는 로직
    dst_pts = np.array(
        [
            [landmark[0][0], landmark[0][1]],
            [landmark[1][0], landmark[1][1]],
            [landmark[2][0], landmark[2][1]],
            [landmark[3][0], landmark[3][1]],
            [landmark[4][0], landmark[4][1]],
        ],
        dtype="float32",
    )

    M, _ = cv2.findHomography(src_pts, dst_pts)

    # transformed masked image
    transformed_mask = cv2.warpPerspective(
        mask_img,
        M,
        (face_img.shape[1], face_img.shape[0]),
        None,
        cv2.INTER_LINEAR,
        cv2.BORDER_CONSTANT,
    )

    # mask overlay
    face_img = blend_transparent(face_img, transformed_mask)

    crop_img = insightface.utils.face_align.norm_crop(face_img, landmark=landmark)

emb = rec_name.get_embedding(crop_img).flatten()
embs = []

obj_text = codecs.open('/var/www/backend/face_cut/users_file.json', 'r', encoding='utf-8').read()
b_new = json.loads(obj_text)
# a_new = np.array(b_new)

b_new.append({
    "face": emb.tolist(),
    "name": args.name,
    "type": args.type
})
# a_new = np.append(a_new,{
#     "face": emb.tolist(),
#     "name": args.name,
#     "type": args.type
# })

with open("/var/www/backend/face_cut/users_file.json", 'w') as outfile:
    json.dump(b_new, outfile)

print(emb.tolist())