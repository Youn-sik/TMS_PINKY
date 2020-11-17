import os, sys, getopt
from PIL import Image,ImageStat
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("-f", action='store', dest="input",type=str, help="file input")
args = parser.parse_args()

def brightness( im_file ):
    try:
        im = Image.open(im_file).convert('L')
        stat = ImageStat.Stat(im)
        return stat.rms[0]
    except:
        return "파일이 존재 하지 않습니다."

print(brightness(args.input))
exit()