import os
from skyfield.api import Loader

def download_data():
    data_dir = './skyfield_data'
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
        print(f"Created directory: {data_dir}")
    
    load = Loader(data_dir)
    print("Downloading de421.bsp (this may take a minute)...")
    try:
        load('de421.bsp')
        print("Successfully downloaded de421.bsp")
    except Exception as e:
        print(f"Error downloading data: {e}")

if __name__ == "__main__":
    download_data()
