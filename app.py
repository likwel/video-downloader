from flask import Flask
from flask import render_template, send_file, jsonify
from flask import redirect
from flask import request
import youtube_dl
import yt_dlp
import os
import tkinter as tk
from tkinter import filedialog
import getpass, time

ulink = ""

app = Flask(__name__)

default_download_folder = os.path.join("C:\\Users", getpass.getuser(), "Downloads", "VideoDownloader")
progress = 0
# To show Home page!
@app.route("/")
@app.route("/home")
@app.route("/index")
@app.route("/formats", methods=["GET","POST"])
def home():

    if request.method == "POST":
        uLink = request.form['url']
        with yt_dlp.YoutubeDL() as ydl:
            url = ydl.extract_info(uLink, download=False)
            # print(url)
            vidFormats = url["formats"]
            sorted_formats = sorted(
                vidFormats,
                key=lambda f: (f.get('tbr', float('inf')) or float('inf')),  # Use 'inf' for missing bitrates
            )
            best_formats = sorted_formats[:4]  # Get the top 4 formats
            
        return render_template("index.html", vFormats=best_formats, iFr=url, tLink=uLink)
    
    return render_template("index.html", vFormats = [],iFr = '', tLink='')


# To download videos!
@app.route("/download/<formatsID>", methods=["GET", "POST"])
def download(formatsID):
    dnLink = request.form['fUrl']
    # formatsID = request.form["fId"]

    folder = default_download_folder

    ydl_opts = {
        'format': formatsID,
        #'outtmpl': 'downloads/%(title)s.%(ext)s',  # Stocker les vidéos téléchargées dans le dossier 'downloads'
        'outtmpl': os.path.join(folder, '%(title)s.%(ext)s'),
        'noplaylist': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            #info_dict = ydl.extract_info(dnLink, download=True)
            #filename = ydl.prepare_filename(info_dict)
            #filename = os.path.join(os.getcwd(), filename)

            info_dict = ydl.extract_info(dnLink, download=False)
            video_title = info_dict.get('title', 'video')
            video_ext = info_dict.get('ext', 'mp4')
            video_resolution = info_dict.get('height', 'unknown')  # Get the resolution
            video_resolution2 = info_dict.get('width', 'unknown')  # Get the resolution

            # Construct the filename with resolution
            filename = f"{video_title}_{video_resolution}x{video_resolution2}.{video_ext}"
            file_path = os.path.join(folder, filename)

            # Check if the file already exists
            if os.path.exists(file_path):
                return jsonify({"message": f"The file '{filename}' already exists in the storage folder."}), 999

            # If the file does not exist, download it
            info_dict = ydl.extract_info(dnLink, download=True)
            filename = ydl.prepare_filename(info_dict)
            filename = os.path.join(os.getcwd(), filename)
            

        return send_file(filename, as_attachment=True)
    except Exception as e:
        return str(e), 500
    # return render_template("download.html", vals=formatsID)


@app.route('/get_formats', methods=['POST'])
def get_formats():
    url = request.form['url']
    ydl_opts = {
        'format': 'best',
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:

        try:
            info_dict = ydl.extract_info(url, download=False)
            formats = info_dict.get('formats', [])  # Assurez-vous que formats est une liste
            
            if formats is None:
                formats = []  # Initialiser formats à une liste vide si None
            
            video_formats = []
            for f in formats:
                if f.get('vcodec') != 'none':
                    format_info = {
                        'format_id': f.get('format_id'),
                        'ext': f.get('ext'),
                        'width': f.get('width'),
                        'height': f.get('height'),
                        'filesize': f.get('filesize')  # Ajouter la taille du fichier
                    }
                    video_formats.append(format_info)
            
             # Trier les fichiers par taille en ordre décroissant
            return jsonify(video_formats)

        except Exception as e:
            return {"error": str(e)}


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8077)  # Change the port number as needed
    app.run(debug=True)