import insightface
import urllib
import urllib.request
import cv2
import numpy as np
import os, csv
from numpy.linalg import norm
from centerface import CenterFace
import time
import codecs, json 
import threading
import time
from pymongo import MongoClient 
my_client = MongoClient("mongodb://localhost:27017/")

# pip install insightface
# pip install mxnet==1.6.0

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

with open("./mask_retinaface.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=",")
    src_pts = []
    for i, row in enumerate(csv_reader):
        # skip head or empty line if it's there
        try:
            src_pts.append(np.array([float(row[1]), float(row[2])]))
        except ValueError:
            continue
src_pts = np.array(src_pts, dtype="float32")

mask_img = cv2.imread("./mask.png", -1)

det_model = insightface.model_zoo.get_model('retinaface_r50_v1')
det_model.prepare(-1, 0.4)

rec_name = insightface.model_zoo.get_model('arcface_r100_v1')
rec_name.prepare(-1)

known_face_files = os.listdir('./known_face')
target_face_files = os.listdir('./target_face')

emb_list = []
emb_norm_list = []
emb_label_list = []
embs = []

def getClosestFace(emb):
    closest_sim = 0
    closest_label = ''

    for i, origin_emb in enumerate(emb_list):
        sim = np.dot(emb, origin_emb) / (norm(emb) * norm(origin_emb))

        if sim > closest_sim:
            closest_sim = sim
            closest_label = emb_label_list[i]

    return closest_sim, closest_label

print("known_file 얼굴 인식중\n")
for known_face_file in known_face_files:
    # print(f'Start to known process {known_face_file}')
    face_img = cv2.imread(os.path.join('./known_face', known_face_file))
    face_label = os.path.splitext(os.path.basename(known_face_file))[0]

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
        break

    if not find:
        continue
    
    emb = rec_name.get_embedding(crop_img).flatten()
    emb_list.append(emb)
    emb_norm_list.append(norm(emb))
    emb_label_list.append(face_label)

    # print(f'{face_label} face was added.')
# print("known_file 얼굴 인식 종료\n")
# print("taget_file 얼굴 인식중\n")
# for target_face_file in target_face_files:
#     # print(f'Start to target process {target_face_file}')
#     face_img = cv2.imread(os.path.join('./target_face', target_face_file))
#     face_label = os.path.splitext(os.path.basename(target_face_file))[0]
#     save_path = os.path.join('./result_face', os.path.basename(target_face_file))

#     h, w = face_img.shape[:2]

#     bboxes, landmarks = det_model.detect(face_img, threshold=0.3, scale=1.0)

#     for i in range(bboxes.shape[0]):
#         bbox = bboxes[i, 0:4].astype(np.int)
#         det_score = bboxes[i, 4]
#         landmark = landmarks[i]

#         # 마스크 씌우는 로직
#         dst_pts = np.array(
#             [
#                 [landmark[0][0], landmark[0][1]],
#                 [landmark[1][0], landmark[1][1]],
#                 [landmark[2][0], landmark[2][1]],
#                 [landmark[3][0], landmark[3][1]],
#                 [landmark[4][0], landmark[4][1]],
#             ],
#             dtype="float32",
#         )

#         M, _ = cv2.findHomography(src_pts, dst_pts)

#         # transformed masked image
#         transformed_mask = cv2.warpPerspective(
#             mask_img,
#             M,
#             (face_img.shape[1], face_img.shape[0]),
#             None,
#             cv2.INTER_LINEAR,
#             cv2.BORDER_CONSTANT,
#         )

#         # mask overlay
#         face_img = blend_transparent(face_img, transformed_mask)

#         crop_img = insightface.utils.face_align.norm_crop(face_img, landmark=landmark)

#         cv2.rectangle(
#             face_img,
#             (bbox[0], bbox[1]),
#             (bbox[2], bbox[3]),
#             (2, 255, 0),
#             2
#         )

#         # emb = rec_name.get_embedding(crop_img).flatten()
#         embs.append({"face":rec_name.get_embedding(crop_img).flatten(),"label":face_label})
#     #     sim, label = getClosestFace(emb)

#     #     print(emb)
#     #     print(f'{face_label} find {i} face - {label}, acc: {sim}')

#     #     sim_height = int((bbox[3] - bbox[1]) * sim)
#     #     sim_x1 = bbox[2]
#     #     sim_x2 = bbox[2]+10
#     #     sim_y1 = bbox[3]-sim_height
#     #     sim_y2 = bbox[3]

#     #     cv2.rectangle(
#     #         face_img,
#     #         (sim_x1, sim_y1),
#     #         (sim_x2, sim_y2),
#     #         (255, 255, 0),
#     #         -1
#     #     )
#     #     fontFace = cv2.FONT_HERSHEY_DUPLEX
#     #     cv2.putText(face_img, '{} {:.2}'.format(label, sim) , (bbox[0], bbox[3] + 24), fontFace, 1, (255, 255, 0), 2)
    
#     # cv2.imwrite(save_path, face_img)
# print("taget_file 얼굴 인식 종료\n")

obj_text = codecs.open('./file.json', 'r', encoding='utf-8').read()
b_new = json.loads(obj_text)
a_new = np.array(b_new)

print("파일 비교 시작")
start = time.time()
for emb in a_new:
    face = np.array(emb["face"])
    sim, label = getClosestFace(face)
    # print(sim, emb["label"])
# print(len(a_new))
print("파일 비교 종료 time :", time.time() - start)

# print("\n배열 비교 시작")
# start = time.time()
# for emb in embs:
#     sim, label = getClosestFace(emb["face"])
#     print(sim, emb["label"])
# print("배열 비교 종료 time :", time.time() - start)