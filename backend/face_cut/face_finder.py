import insightface
import urllib
import urllib.request
import cv2
import numpy as np
import os
from numpy.linalg import norm

# pip install insightface
# pip install mxnet==1.6.0

det_model = insightface.model_zoo.get_model('retinaface_r50_v1')
det_model.prepare(-1, 0.4)

rec_name = insightface.model_zoo.get_model('arcface_r100_v1')
rec_name.prepare(-1)

'./known_face'
'./target_face'

known_face_files = os.listdir('./known_face')
target_face_files = os.listdir('./target_face')

emb_list = []
emb_label_list = []

def getClosestFace(emb):
    closest_sim = 0
    closest_label = ''

    for i, origin_emb in enumerate(emb_list):
        sim = np.dot(emb, origin_emb) / (norm(emb) * norm(origin_emb))

        if sim > closest_sim:
            closest_sim = sim
            closest_label = emb_label_list[i]

    return closest_sim, closest_label

for known_face_file in known_face_files:
    face_img = cv2.imread(os.path.join('./known_face', known_face_file))
    face_label = os.path.splitext(os.path.basename(known_face_file))[0]
    
    bboxes, landmarks = det_model.detect(face_img, threshold=0.6, scale=1.0)

    find = False

    for i in range(bboxes.shape[0]):
        find = True
        bbox = bboxes[i, 0:4]
        det_score = bboxes[i, 4]
        landmark = landmarks[i]
        crop_img = insightface.utils.face_align.norm_crop(face_img, landmark=landmark)
        break

    if not find:
        continue
    
    emb = rec_name.get_embedding(crop_img).flatten()
    emb_list.append(emb)
    emb_label_list.append(face_label)

    print(f'{face_label} face was added.')


for target_face_file in target_face_files:
    face_img = cv2.imread(os.path.join('./target_face', target_face_file))
    face_label = os.path.splitext(os.path.basename(target_face_file))[0]
    save_path = os.path.join('./result_face', os.path.basename(target_face_file))

    bboxes, landmarks = det_model.detect(face_img, threshold=0.6, scale=1.0)

    for i in range(bboxes.shape[0]):
        bbox = bboxes[i, 0:4].astype(np.int)
        det_score = bboxes[i, 4]
        landmark = landmarks[i]
        crop_img = insightface.utils.face_align.norm_crop(face_img, landmark=landmark)

        cv2.rectangle(
            face_img,
            (bbox[0], bbox[1]),
            (bbox[2], bbox[3]),
            (2, 255, 0),
            2
        )

        emb = rec_name.get_embedding(crop_img).flatten()

        sim, label = getClosestFace(emb)

        print(f'{face_label} find {i} face - {label}, acc: {sim}')

        sim_height = int((bbox[3] - bbox[1]) * sim)
        sim_x1 = bbox[2]
        sim_x2 = bbox[2]+10
        sim_y1 = bbox[3]-sim_height
        sim_y2 = bbox[3]

        cv2.rectangle(
            face_img,
            (sim_x1, sim_y1),
            (sim_x2, sim_y2),
            (255, 255, 0),
            -1
        )
        fontFace = cv2.FONT_HERSHEY_DUPLEX
        # cv2.putText(face_img, '{} {:.2}'.format(label, sim) , (bbox[0], bbox[3] + 24), fontFace, 1, (255, 255, 0), 2)
    
    cv2.imwrite(save_path, face_img)