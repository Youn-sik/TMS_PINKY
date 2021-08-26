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
import random
import shutil
import re
import socket
import base64
from pymongo import MongoClient
from bson.objectid import ObjectId
import pathlib
from ast import literal_eval
import paho.mqtt.client as mqtt
import tracemalloc
import ssl
import re
from insightface.app import FaceAnalysis #모델 다운로드를 위한 import
my_client = MongoClient("mongodb://localhost:27017/")
db = my_client.get_database("cloud40")
acc_collection = db.get_collection('accesses')
camera_collection = db.get_collection('cameras')
user_collection = db.get_collection('users')
stat_collection = db.get_collection('statistics')
group_collection = db.get_collection('groups')

users_cursor = user_collection.find({"authority":{"$regex":""}})
users = []
for user in users_cursor :
    users.append(user)
random.shuffle(users)

original_emb = None
original_emb_label = None

with open('/var/www/backend/face_cut/cloud40.json') as json_file:
    json_data = json.load(json_file)

with open('/var/www/backend/face_cut/visit.json') as json_file:
    visitor_data = json.load(json_file)

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("connected OK")
    else:
        print("Bad connection Returned code=", rc)

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
server_ip = s.getsockname()[0]

def on_message(client, userdata, msg):
    global users
    if(msg.topic.find("/access/realtime/") != -1):
        print("/access/realtime/")
        access_json = json.loads(msg.payload)
        camera = camera_collection.find_one({"serial_number":access_json['stb_sn']})
        auth = camera["authority"]
        if(camera["authority"] == "admin") :
            auth = ''

        start = time.time()
        print("time :", time.time() - start)

        # origin_emb = np.array(literal_eval(users[0]['face_detection']))
        # origin_emb = origin_emb.flatten()

        folder_date_path = "/uploads/accesss/temp/" + time.strftime('%Y%m%d', time.localtime(time.time()))
        file_path = json_data['base_server_document'] + folder_date_path + "/" + access_json['stb_sn'] + "/"

        pathlib.Path(file_path).mkdir(parents=True, exist_ok=True)

        time_cnt = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

        insert_array = []

        employee = 0
        black = 0
        stranger = 0
        for value in access_json['values'] :
            current_time = time.strftime('%Y%m%d%H%M%S', time.localtime(time.time()))
            current_time_db = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
            current_date = time.strftime('%Y%m%d', time.localtime(time.time()))
            current_date_stat = time.strftime('%Y-%m-%d', time.localtime(time.time()))
            current_hour = time.strftime('%H', time.localtime(time.time()))
            imgdata = base64.b64decode(value['avatar_file'])
            time_cnt[int(current_hour)] += 1
            file_name = access_json['stb_sn']+"_temp_file_"+current_time+".png"
            name = 'unknown'
            avatar_type = 3
            max_sim = 0
            max_name = 'unknown'
            max_type = 3
            max_gender = ''
            max_employee_id = ''
            max_group_id = ''
            max_position = ''
            group_name = ''

            with open(file_path+file_name, 'wb') as f:
                f.write(imgdata)

            result = detect_face(file_path+file_name)
            if result is None :
                name = 'unknown'
                avatar_type = 3
            else :
                recog_result,max_sim,max_name,max_type,max_gender,max_employee_id,max_group_id,max_position = recog_face(users,auth)

                if(max_group_id != '') :
                    cursor = group_collection.find({"_id":ObjectId(max_group_id)})
                    for group in cursor :
                        group_name = group['name']

            if(max_sim >= 0.625) :
                name = max_name
                avatar_type = max_type
                if(avatar_type == 5):
                    avatar_type = 4
                    black += 1
                elif(avatar_type == 1):
                    employee += 1
            else :
                stranger += 1


            os.remove(file_path+file_name)
            file_name = access_json['stb_sn']+"_"+name+"_"+str(avatar_type)+"_"+value['avatar_temperature']+"_"+time.strftime('%Y%m%d%H%M%S', time.localtime(time.time()))+".png"

            with open(file_path+file_name, 'wb') as f:
                f.write(imgdata)

            upload_url = "http://" + server_ip + ":3000" + "/uploads/accesss/temp/" + time.strftime('%Y%m%d', time.localtime(time.time())) + "/" + access_json['stb_sn'] + "/" + file_name

            insert_data = {
                "avatar_file" : 'avatar_file',
                "avatar_file_checksum" : "element.avatar_file_checksum",
                "avatar_type" : avatar_type,
                'avatar_distance' : value['avatar_distance'],
                'avatar_contraction_data' : 'element.avatar_contraction_data',
                'avatar_file_url' : upload_url,
                'avatar_temperature' : value['avatar_temperature'],
                'access_time' : current_time_db,
                'stb_sn' : access_json['stb_sn'],
                'stb_obid' : str(camera['_id']),
                'stb_name' : camera['name'],
                'stb_location' : camera['location'],
                'authority': camera['authority'],
                'name' : name,
                "gender" : max_gender,
                "employee_id" : max_employee_id,
                "group_name" : group_name,
                "position" : max_position
            }

            insert_array.append(insert_data)

            todayStatistics = stat_collection.find_one(
                {
                    "$and":[
                        {
                            "serial_number":access_json['stb_sn']
                        },
                        {
                            "access_date":current_date_stat
                        }
                    ]
                }
            )

            if(todayStatistics) :
                stat_collection.update_one({"serial_number":access_json['stb_sn'],"access_date":current_date_stat},{
                    "$inc":{
                        "all_count":1,
                        'employee':employee,
                        'black' : black,
                        'stranger' : stranger,
                        str(current_hour) : 1
                    }
                })
            else :
                stat_collection.insert_one({
                    'camera_obid' : camera['_id'],
                    'authority' : camera['authority'],
                    'serial_number' : access_json['stb_sn'],
                    'access_date': current_date_stat,
                    'all_count' : 1,
                    '0' : time_cnt[0],
                    '1' : time_cnt[1],
                    '2' : time_cnt[2],
                    '3' : time_cnt[3],
                    '4' : time_cnt[4],
                    '5' : time_cnt[5],
                    '6' : time_cnt[6],
                    '7' : time_cnt[7],
                    '8' : time_cnt[8],
                    '9' : time_cnt[9],
                    '10' : time_cnt[10],
                    '11' : time_cnt[11],
                    '12' : time_cnt[12],
                    '13' : time_cnt[13],
                    '14' : time_cnt[14],
                    '15' : time_cnt[15],
                    '16' : time_cnt[16],
                    '17' : time_cnt[17],
                    '18' : time_cnt[18],
                    '19' : time_cnt[19],
                    '20' : time_cnt[20],
                    '21' : time_cnt[21],
                    '22' : time_cnt[22],
                    '23' : time_cnt[23],
                    'employee' : employee,
                    'black' : black,
                    'stranger' : stranger
                })


        acc_collection.insert_many(insert_array)
        del insert_array[0]['_id']
        send_data = {
            'stb_sn': access_json['stb_sn'],
            'values': insert_array
        }
        client.publish('/access/realtime/result/'+access_json['stb_sn'], json.dumps(send_data), 1)


    elif(msg.topic.find("/user/add/") != -1) :
        print("/user/add/")
        user_json = json.loads(msg.payload)
        user_json['groups_obids'][0] = ObjectId(user_json['groups_obids'][0])
        file_path = '/var/www/backend/image/'
        file_name = 'temp_'+user_json['id']+".jpg"
        imgdata = base64.b64decode(user_json['avatar_file'])

        with open(file_path+file_name, 'wb') as f:
            f.write(imgdata)

        result = []
        result = detect_face(file_path+file_name)
        if result is None :
            os.remove(file_path+file_name)
            client.publish('/user/add/result/'+user_json['id'], json.dumps({"result":False,"msg":"인식할수 없는 사진 입니다."}), 1)
        elif result is False :
            client.publish('/user/add/result/'+user_json['id'], json.dumps({"result":False,"msg":"더 낮은 해상도의 사진을 사용해주세요."}), 1)
        else :
            os.remove(file_path+file_name)

            face_detection = result.tolist()
            user_json['face_detection'] = face_detection
            user_json['avatar_file_url'] = ''
            user_json['avatar_file'] = ''

            user_collection.insert_one(user_json)
            user_objectid = str(user_json['_id'])

            file_name = user_objectid+"profile.jpg"

            avatar_file_url = upload_url = "http://" + server_ip + ":3000" + "/image/" + file_name

            user_collection.update_one({"_id":ObjectId(user_objectid)},{"$set":{"avatar_file_url":avatar_file_url}})

            with open(file_path+file_name, 'wb') as f:
                f.write(imgdata)

            client.publish('/user/add/result/'+user_json['id'], json.dumps({"result":True}), 1)

        users_cursor = user_collection.find({"authority":{"$regex":""}})
        users = []
        for user in users_cursor :
            users.append(user)
        random.shuffle(users)

    elif(msg.topic.find("/stranger/add/") != -1) :
        print("/stranger/add/")
        user_json = json.loads(msg.payload)
        url_split = user_json['avatar_file_url'].split(":3000")
        file_path = "/var/www/backend"+url_split[1]

        detect_result = detect_face(file_path)

        if detect_result is None :
            client.publish('/stranger/add/result/'+user_json['id'], json.dumps({"result":False}), 1)
        else :
            user_json['face_detection'] = detect_result.tolist()
            user_json['groups_obids'][0] = ObjectId(user_json['groups_obids'][0])
            user_collection.insert_one(user_json)
            user_objectid = str(user_json['_id'])

            file_name = user_objectid+"profile.jpg"
            _file_path = "/var/www/backend/image/"

            shutil.copyfile(file_path,_file_path+file_name)

            avatar_file_url = "http://" + server_ip + ":3000/image/"+file_name

            user_collection.update_one({"_id":user_json['_id']},{
                "$set":{
                    'avatar_file_url' : avatar_file_url
                }
            })

            client.publish('/stranger/add/result/'+user_json['id'], json.dumps({"result":True}), 1)

        users_cursor = user_collection.find({"authority":{"$regex":""}})
        users = []
        for user in users_cursor :
            users.append(user)
        random.shuffle(users)
    elif(msg.topic.find("/user/edit/") != -1) :
        print("/user/edit/")
        user_json = json.loads(msg.payload)
        user_json['groups_obids'][0] = ObjectId(user_json['clicked_groups'][0])
        file_path = '/var/www/backend/image/'
        file_name = user_json['id']+"profile_updated_temp.jpg"
        user_objectid = ObjectId(user_json['_id'])
        del user_json['_id']
        if not user_json.get("avatar_file") :
            user_collection.update_one({"_id":ObjectId(user_objectid)},{"$set":user_json})
            client.publish('/user/edit/result/'+user_json['id'], json.dumps({"result":True}), 1)
        else :
            imgdata = base64.b64decode(user_json['avatar_file'])
            with open(file_path+file_name, 'wb') as f:
                f.write(imgdata)

            detect_result = detect_face(file_path+file_name)

            if detect_result is None :
                os.remove(file_path+file_name)
                client.publish('/user/edit/result/'+user_json['id'], json.dumps({"result":False}), 1)
            else :
                updated_file_name = file_path+file_name.split('_temp')[0]+".jpg"
                os.remove("/var/www/backend"+user_json['avatar_file_url'].split(":3000")[1])
                os.rename(file_path+file_name , updated_file_name)

                avatar_file_url = "http://" + server_ip + ":3000/image/" + file_name.split('_temp')[0]+".jpg"

                user_json['face_detection'] = detect_result.tolist()
                user_json['avatar_file_url'] = avatar_file_url

                user_collection.update_one({"_id":user_objectid},{"$set":user_json})

                client.publish('/user/edit/result/'+user_json['id'], json.dumps({"result":True}), 1)

        users_cursor = user_collection.find({"authority":{"$regex":""}})
        users = []
        for user in users_cursor :
            users.append(user)
        random.shuffle(users)

    elif(msg.topic.find("/user/delete/") != -1) :
        users_cursor = user_collection.find({"authority":{"$regex":""}})
        users = []
        for user in users_cursor :
            users.append(user)
        random.shuffle(users)

    elif(msg.topic.find("/access/RFID/") != -1) :
        print("/access/RFID/")
        rfid_json = json.loads(msg.payload)
        rfid = rfid_json['RFID']

        insert_data = {
            'name' : "unknown",
            "gender" : '',
            "employee_id" : '',
            "group_name" : '',
            "position" : '',
            "avatar_type" : 0
        }

        camera = camera_collection.find_one({"serial_number":rfid_json['stb_sn']})
        auth = camera["authority"]
        if(camera["authority"] == "admin") :
            auth = ''

        for user in users :
            if(user.get("rfid")) :
                if(user['rfid'] == rfid) :

                    # 그룹 찾기
                    cursor = group_collection.find({"_id":ObjectId(user['groups_obids'][0])})
                    for group in cursor :
                        group_name = group['name']

                    insert_data['name'] = user['name']
                    insert_data['gender'] = user['gender']
                    insert_data['employee_id'] = user['user_id']
                    insert_data['position'] = user['position']
                    insert_data['group_name'] = group_name
                    insert_data['avatar_type'] = 1

        if(insert_data['avatar_type'] != 1) :
            for visitor in visitor_data :
                if(visitor == rfid) :
                    insert_data['name'] = "방문자"
                    insert_data['group_name'] = "손님"
                    insert_data['avatar_type'] = 2


        client.publish('/access/RFID/result/'+rfid_json['stb_sn'], json.dumps({"stb_sn":rfid_json['stb_sn'], "values":[
            insert_data
        ]},ensure_ascii=False), 1)

    elif(msg.topic.find("/access/QR/") != -1) :
        print("/access/QR/")
        qr_json = json.loads(msg.payload)
        qr = qr_json['qrData']

        insert_data = {
            'name' : "unknown",
            "gender" : '',
            "employee_id" : '',
            "group_name" : '',
            "position" : '',
            "avatar_type" : 0
        }

        camera = camera_collection.find_one({"serial_number":qr_json['stb_sn']})
        auth = camera["authority"]
        if(camera["authority"] == "admin") :
            auth = ''

        for user in users :
            if(user.get("rfid")) :
                if(user['rfid'] == qr) :

                    # 그룹 찾기
                    cursor = group_collection.find({"_id":ObjectId(user['groups_obids'][0])})
                    for group in cursor :
                        group_name = group['name']

                    insert_data['name'] = user['name']
                    insert_data['gender'] = user['gender']
                    insert_data['employee_id'] = user['user_id']
                    insert_data['position'] = user['position']
                    insert_data['group_name'] = group_name
                    insert_data['avatar_type'] = 1

        if(insert_data['avatar_type'] != 1) :
            for visitor in visitor_data :
                if(visitor == qr) :
                    insert_data['name'] = "방문자"
                    insert_data['group_name'] = "손님"
                    insert_data['avatar_type'] = 2


        client.publish('/access/QR/result/'+qr_json['stb_sn'], json.dumps({"stb_sn":qr_json['stb_sn'], "values":[
            insert_data
        ]},ensure_ascii=False), 1)










def on_disconnect(client, userdata, flags, rc=0):
    print(str(rc))

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
# det_model = FaceAnalysis(name=['retinaface_r50_v1'])
det_model.prepare(-1, 0.4)

rec_name = insightface.model_zoo.get_model('arcface_r100_v1')
# rec_name = FaceAnalysis(name=['arcface_r100_v1'])
rec_name.prepare(-1)

def detect_face(path) :
        global original_emb
        global original_emb_label
        face_img = cv2.imread(path)
        face_img = cv2.resize(face_img, dsize=(122,172), interpolation=cv2.INTER_AREA)
        crop_img = None
        print(face_img.shape)
        if(face_img.shape[0] * face_img.shape[1] > 1500000) :
            return False

        face_label = path
        # Mask

        bboxes, landmarks = det_model.detect(face_img, threshold=0.3, scale=1.0)

        for i in range(bboxes.shape[0]):
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

        if crop_img is None :
            return None

        emb = rec_name.get_embedding(crop_img).flatten()
        original_emb = emb
        original_emb_label = face_label

        return emb

def str2ndarray(a):
    print(a)
    a = np.frombuffer(a, dtype=np.float32)
    return np.array(a)

def getClosestFace(emb):
    global original_emb_label
    global original_emb
    closest_sim = 0
    closest_label = ''
    sim = np.dot(emb, original_emb) / (norm(emb) * norm(original_emb))

    if sim > closest_sim:
        closest_sim = sim
        closest_label = original_emb_label

    return closest_sim, closest_label

def recog_face(users,auth) :
    result = []
    max_sim = 0
    max_name = 'unknown'
    max_position = ''
    max_gender = ''
    max_group_id = ''
    max_employee_id = ''
    max_employee_id = ''
    max_type = 3
    start = time.time()
    for emb in users:
        # print(auth,emb['authority'])
        if(re.match(auth,emb['authority']) is None) :
            continue
        # if(emb['name'].find("샘플") == -1):
        face = np.array(emb["face_detection"])
        # face = face.flatten()
        sim, label = getClosestFace(face)
        del face
        result.append({"sim":sim,"name":emb['name'],"type":emb['type']})
        if(max_sim < sim):
            max_sim = sim
            max_name = emb['name']
            max_group_id = emb['groups_obids'][0]
            if 'user_id' in emb:
                max_employee_id = emb['user_id']
            else:
                max_employee_id = "0"
            # max_employee_id = emb['user_id'] if emb['user_id'] else "0"
            max_gender = emb['gender']
            max_type = emb['type']
            max_position = emb['position']

        # if(max_sim >= 0.625):
        #     break
    print("time :", time.time() - start)
    return result,max_sim,max_name,max_type,max_gender,max_employee_id,max_group_id,max_position

# def interval_db() :
#     results=collection.find({"detected":{"$exists":False}})
#     for result in results:
#         url = result["avatar_file_url"]
#         path = url.split(":3000/")
#         path = "/var/www/backend/" + path[1]
#         detect_result = detect_face(path)
#         emb_list = [detect_result]
#         emb_label_list = [path]
#         recog_result,max_sim,max_name,max_type = recog_face()
#         print(max_sim,max_name,max_type)
#         collection.update({"_id":result["_id"]},{"$set":{"detected":True,"name":max_name,"type":max_type}})


client = mqtt.Client()
client.on_connect = on_connect
client.on_disconnect = on_disconnect
client.on_message = on_message
client.connect('localhost', 1883)
client.subscribe("/access/realtime/+")
client.subscribe("/access/RFID/+")
client.subscribe("/access/QR/+")
client.subscribe("/user/add/+")
client.subscribe("/user/delete/+")
client.subscribe("/user/edit/+")
client.subscribe("/stranger/add/+")
client.loop_forever()


