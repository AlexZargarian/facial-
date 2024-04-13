# face_encodings.py
# so we encript the code once so its faster every time..

import cv2
import face_recognition as face_rec
import os
import pickle

def resize(img, size):
    width = int(img.shape[1] * size)
    height = int(img.shape[0] * size)
    dimension = (width, height)
    return cv2.resize(img, dimension, interpolation=cv2.INTER_AREA)

def generate_and_save_encodings(images_path, save_path="encodings.pkl"):
    if os.path.exists(save_path):
        with open(save_path, "rb") as f:
            return pickle.load(f)
    else:
        images, names = load_images(images_path)
        encoding_list = []
        for img in images:
            img = resize(img, 0.4)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            try:
                encoding = face_rec.face_encodings(img)[0]
                encoding_list.append(encoding)
            except IndexError:
                print("No face found in the image.")
                continue

        with open(save_path, "wb") as f:
            pickle.dump((encoding_list, names), f)
        return encoding_list, names

def load_images(images_path):
    student_images = []
    student_names = []
    mylist = os.listdir(images_path)
    for cl in mylist:
        if not cl.startswith('.') and cl.lower().endswith(('png', 'jpg', 'jpeg')):
            img_path = os.path.join(images_path, cl)
            curlimage = cv2.imread(img_path)
            if curlimage is not None:
                student_images.append(curlimage)
                student_names.append(os.path.splitext(cl)[0])  # Extract name without file extension
            else:
                print(f"Warning: could not load image from {img_path}")
    return student_images, student_names
