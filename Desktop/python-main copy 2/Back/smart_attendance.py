import numpy as np
import face_recognition as face_rec
import os
from datetime import datetime
import cv2


def resize(img, size):
    width = int(img.shape[1] * size)
    height = int(img.shape[0] * size)
    demension = (width, height)
    return cv2.resize(img, demension, interpolation=cv2.INTER_AREA)


path = '/Users/alex/Desktop/python-main copy 2/images'
studentimg = []
studentName = []
myList = os.listdir(path)

for cl in myList:
    if cl.lower().endswith(('.png', '.jpg', '.jpeg')):  # Check if the file is an image
        curlImg = cv2.imread(f'{path}/{cl}')
        if curlImg is not None:  # Check if the image is loaded properly
            studentimg.append(curlImg)
            studentName.append(os.path.splitext(cl)[0])
        else:
            print(f"Failed to load image: {cl}")  # Print the name of the file that failed to load
    else:
        print(f"Skipping non-image file: {cl}")  # Notify about non-image files


def findEncoding(studentimg):
    encodeList = []
    for img in studentimg:
        img = resize(img, 0.5)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encodeimg = face_rec.face_encodings(img)[0]
        encodeList.append(encodeimg)
    return encodeList


def MarkAttendance(name):
    with open('a.csv', 'r+') as f:
        myDateLIst = f.readlines()
        nameList = []
        for Line in myDateLIst:
            entry = Line.split(',')
            nameList.append(entry[0])
        if name not in nameList:
            now = datetime.now()
            timetr = now.strftime("%d-%b-%Y %I:%M:%S %p")

            f.writelines(f'\n{name},{timetr}')


encodeList = findEncoding(studentimg)

video = cv2.VideoCapture(0)  #source webcam
while True:
    success, frame = video.read()
    smaller_frame = cv2.resize(frame, (0, 0), None, 0.25, 0.25)

    facesInframe = face_rec.face_locations(smaller_frame)
    encode_in_frame = face_rec.face_encodings(smaller_frame, facesInframe)

    for encodeFace, faceloc in zip(encode_in_frame, facesInframe):
        matches = face_rec.compare_faces(encodeList, encodeFace)
        faceDist = face_rec.face_distance(encodeList, encodeFace)
        print(faceDist)
        matchIndex = np.argmin(faceDist)

        if matches[matchIndex]:
            name = studentName[matchIndex].upper()
            y1, x2, y2, x1 = faceloc
            y1, x2, y2, x1 = y1 * 4, x2 * 4, y2 * 4, x1 * 4
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 3)
            cv2.rectangle(frame, (x1, y2 - 25), (x2, y2), (0, 255, 0), 3, cv2.FILLED)
            cv2.putText(frame, name, (x1 + 6, y2 - 6), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)
            MarkAttendance(name)

    cv2.imshow('video', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):  # Check if 'q' is pressed
        break  # Exit the while loop

video.release()  # Release the video capture object
cv2.destroyAllWindows()