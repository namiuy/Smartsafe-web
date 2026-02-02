import os
from PIL import Image

TARGET_DIR = r"c:/Users/Luisito/Desktop/LaunchWebVFinal/launch-uruguay-web/public/images"
MAX_DIMENSION = 1600  # Safe for hero, overkill for thumbnails but ensures quality
EXTENSIONS = {'.png', '.jpg', '.jpeg', '.webp'}

def optimize_images():
    count = 0
    saved_space = 0

    print(f"Starting optimization in: {TARGET_DIR}")

    for root, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in EXTENSIONS:
                file_path = os.path.join(root, file)
                try:
                    original_size = os.path.getsize(file_path)
                    
                    with Image.open(file_path) as img:
                        # Convert RGBA to RGB if saving as JPEG
                        if img.mode == 'RGBA' and file_path.lower().endswith(('.jpg', '.jpeg')):
                            img = img.convert('RGB')
                        
                        width, height = img.size
                        if width > MAX_DIMENSION or height > MAX_DIMENSION:
                            # Calculate new size maintaining aspect ratio
                            ratio = min(MAX_DIMENSION / width, MAX_DIMENSION / height)
                            new_size = (int(width * ratio), int(height * ratio))
                            
                            img = img.resize(new_size, Image.Resampling.LANCZOS)
                            
                            # Save back to same path
                            img.save(file_path, optimize=True, quality=85)
                            
                            new_size_bytes = os.path.getsize(file_path)
                            saved = original_size - new_size_bytes
                            saved_space += saved
                            count += 1
                            print(f"[RESIZED] {file}: {width}x{height} -> {new_size[0]}x{new_size[1]} | Saved {saved / 1024 / 1024:.2f} MB")
                        
                        # Even if not resized, we can optimize file size if it's large?
                        # Let's simple check: if > 1MB and not resized, try saving with optimize=True
                        elif original_size > 1024 * 1024:
                             img.save(file_path, optimize=True, quality=85)
                             new_size_bytes = os.path.getsize(file_path)
                             saved = original_size - new_size_bytes
                             if saved > 0:
                                saved_space += saved
                                count += 1
                                print(f"[OPTIMIZED] {file}: Saved {saved / 1024 / 1024:.2f} MB")

                except Exception as e:
                    print(f"[ERROR] Could not process {file_path}: {e}")

    print(f"\nFinished! Processed {count} images.")
    print(f"Total space saved: {saved_space / 1024 / 1024:.2f} MB")

if __name__ == "__main__":
    optimize_images()
