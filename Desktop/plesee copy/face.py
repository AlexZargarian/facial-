# import library
import cv2
import numpy as np
import face_recognition as face_rec


#functions
def resize(img, size):
    width = int(img.shape[1] * size)
    height = int(img.shape[0] * size)
    dimension = (width, height)
    return cv2.resize(img, dimension, interpolation=cv2.INTER_AREA)


#image declaration
alex = face_rec.load_image_file('/Users/alex/Desktop/plesee/same_image/Alex-Zargarian.png')
resize(alex, 0.40)
alex = cv2.cvtColor(alex, cv2.COLOR_BGR2RGB)

alex_test = face_rec.load_image_file('/Users/alex/Desktop/plesee/same_image/elon musk.jpg')
resize(alex_test, 0.40)
alex_test = cv2.cvtColor(alex_test, cv2.COLOR_BGR2RGB)

# finding face location
faceLocation_alex = face_rec.face_locations(alex)[0]
encode_alex = face_rec.face_encodings(alex)[0]
cv2.rectangle(alex, (faceLocation_alex[3], faceLocation_alex[0]), (faceLocation_alex[1], faceLocation_alex[2]),
              (0, 255, 0), 3)

faceLocation_alex_test = face_rec.face_locations(alex_test)[0]
encode_alex_test = face_rec.face_encodings(alex_test)[0]
cv2.rectangle(alex_test, (faceLocation_alex[3], faceLocation_alex[0]), (faceLocation_alex[1], faceLocation_alex[2]),
              (0, 255, 0), 3)


result= face_rec.compare_faces([encode_alex], encode_alex_test)
print(result)
cv2.putText(alex_test,f'{result}',(50,50),cv2.FONT_HERSHEY_SIMPLEX,1,(0,255,0),2)



cv2.imshow('main-image', alex)
cv2.imshow('test-image', alex_test)

cv2.waitKey(0)
cv2.destroyAllWindows()
