import gzip
import json
import cv2
import numpy as np

def gen_data(grid_size, cap, color_scale=255):
    prev_frame = np.zeros(grid_size[0] * grid_size[1], dtype=np.uint8)
    return list(get_frame_diff(grid_size, prev_frame, cap, color_scale))

def get_frame_diff(grid_size, prev_frame, cap, color_scale=255):
    for frame in get_frames(grid_size, cap, color_scale):
        frame = frame.flatten()
        diff = frame - prev_frame
        prev_frame = frame

        indices = np.nonzero(diff)[0]

        yield list(zip(indices, frame[indices]))

def get_frames(grid_size, cap, color_scale=255):
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.resize(frame, grid_size)
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        yield (frame / 255 * color_scale).astype(np.uint8)

def convert(data):
    # from [[(pixel, color), ...], ...]
    # to
    # [{color:[pixel, ...], ...}, ...]
    out = []
    for frame in data:
        data = {}
        out.append(data)
        for (i, color) in frame:
            data[int(color)] = data.get(int(color), []) + [int(i)]
    
    return out

def serialize(data): # to js object
    json_data = json.dumps(data, separators=(',', ':'))
    return gzip.compress(bytes(json_data, "utf-8"))


def main(video_path):
    num_of_colors = 4
    cap = cv2.VideoCapture(video_path)
    data = gen_data((52, 39), cap, num_of_colors)
    cap.release()

    with open("data.gz", "wb") as f:
        f.write(serialize(convert(data)))

if __name__ == "__main__":
    main("bad_apple.mp4")
