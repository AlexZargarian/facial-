# main.py

import cv2
import numpy as np
import face_recognition as face_rec
from datetime import datetime
from face_encodings import generate_and_save_encodings

def mark_attendance(name):
    with open('a.csv', 'r+') as f:
        my_date_list = f.readlines()
        name_list = [entry.split(',')[0] for entry in my_date_list]

        if name not in name_list:
            now = datetime.now()
            dt_string = now.strftime('%d-%m-%Y %H:%M:%S')
            f.writelines(f'\n{name}, {dt_string}')

path = 'images'
encoding_list, student_names = generate_and_save_encodings(path)

vid = cv2.VideoCapture(0)  # for webcam

while True:
    success, frame = vid.read()
    smaller_frames = cv2.resize(frame, (0, 0), None, 0.25, 0.25)

    faces_in_frame = face_rec.face_locations(smaller_frames)
    encodes_faces_in_frame = face_rec.face_encodings(smaller_frames, faces_in_frame)

    for encode_face, face_loc in zip(encodes_faces_in_frame, faces_in_frame):
        matches = face_rec.compare_faces(encoding_list, encode_face)
        face_distances = face_rec.face_distance(encoding_list, encode_face)
        match_index = np.argmin(face_distances)

        if matches[match_index]:
            name = student_names[match_index].upper()
            y1, x2, y2, x1 = [i * 4 for i in face_loc]  # Scale face location back to original size
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, name, (x1 + 6, y2 - 6), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)
            mark_attendance(name)

    cv2.imshow('video', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

vid.release()
cv2.destroyAllWindows()
