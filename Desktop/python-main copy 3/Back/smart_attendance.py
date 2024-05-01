import numpy as np
import face_recognition as face_rec
import os
from datetime import datetime
import cv2

def resize(img, scale):
    return cv2.resize(img, (0, 0), fx=scale, fy=scale)

path = '../images'
student_images = []
student_names = []
my_list = os.listdir(path)

for filename in my_list:
    if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        img = cv2.imread(f'{path}/{filename}')
        if img is not None:
            student_images.append(img)
            student_names.append(os.path.splitext(filename)[0])
        else:
            print(f"Failed to load image: {filename}")
    else:
        print(f"Skipping non-image file: {filename}")

def find_encodings(images):
    encode_list = []
    for img in images:
        img = resize(img, 0.5)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        try:
            encode = face_rec.face_encodings(img)[0]
            encode_list.append(encode)
        except IndexError:
            print(f"No face found in the image!")
    return encode_list

def mark_attendance(name):
    with open('../a.csv', 'r+') as f:
        my_data_list = f.readlines()
        name_list = [line.split(',')[0] for line in my_data_list]
        if name not in name_list:
            now = datetime.now()
            dt_string = now.strftime("%d-%b-%Y %I:%M:%S %p")
            f.write(f'\n{name},{dt_string}')

encoded_list_known = find_encodings(student_images)
print("Encoding complete")

video = cv2.VideoCapture(0)
try:
    while True:
        success, frame = video.read()
        frame_small = resize(frame, 0.25)
        faces_current_frame = face_rec.face_locations(frame_small)
        encodes_current_frame = face_rec.face_encodings(frame_small, faces_current_frame)

        for encode_face, face_loc in zip(encodes_current_frame, faces_current_frame):
            matches = face_rec.compare_faces(encoded_list_known, encode_face)
            face_dist = face_rec.face_distance(encoded_list_known, encode_face)
            best_match_index = np.argmin(face_dist)
            if matches[best_match_index]:
                name = student_names[best_match_index].upper()
                y1, x2, y2, x1 = [coordinate * 4 for coordinate in face_loc]
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.rectangle(frame, (x1, y2 - 35), (x2, y2), (0, 255, 0), cv2.FILLED)
                cv2.putText(frame, name, (x1 + 6, y2 - 6), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)
                mark_attendance(name)

        cv2.imshow('Video', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
finally:
    video.release()
    cv2.destroyAllWindows()