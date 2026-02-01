import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Slider } from "./ui/slider"; // We might need to create this or use range input
import { Label } from "./ui/label";

const ImageEditor = ({ imageSrc, isOpen, onClose, onSave }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Filter State
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    hueRotate: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
    blur: 0,
    opacity: 100,
    warmth: 0,
  });

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getFilterString = (filters) => {
    // Warmth simulation: Sepia + Saturation adjustment
    const warmthSepia = filters.warmth * 0.5;
    const warmthSaturate = filters.warmth > 0 ? 100 + filters.warmth : 100;

    return `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturate + (filters.warmth ? filters.warmth : 0)}%)
      hue-rotate(${filters.hueRotate}deg)
      grayscale(${filters.grayscale}%)
      sepia(${filters.sepia + warmthSepia}%)
      invert(${filters.invert}%)
      blur(${filters.blur}px)
      opacity(${filters.opacity}%)
    `;
  };

  const getCroppedImg = async (imageSrc, pixelCrop, currentFilters) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Apply filters
    ctx.filter = getFilterString(currentFilters);

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        blob.name = "cropped.jpeg";
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleSave = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        filters
      );
      onSave(croppedImageBlob);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filterOptions = [
    { name: "Brightness", key: "brightness", min: 0, max: 200, step: 1 },
    { name: "Contrast", key: "contrast", min: 0, max: 200, step: 1 },
    { name: "Saturation", key: "saturate", min: 0, max: 200, step: 1 },
    { name: "Hue", key: "hueRotate", min: 0, max: 360, step: 1 },
    { name: "Grayscale", key: "grayscale", min: 0, max: 100, step: 1 },
    { name: "Sepia", key: "sepia", min: 0, max: 100, step: 1 },
    { name: "Invert", key: "invert", min: 0, max: 100, step: 1 },
    { name: "Blur", key: "blur", min: 0, max: 10, step: 0.1 },
    { name: "Opacity", key: "opacity", min: 0, max: 100, step: 1 },
    { name: "Warmth", key: "warmth", min: 0, max: 100, step: 1 },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile Picture</DialogTitle>
        </DialogHeader>

        <div className="relative h-[300px] w-full bg-black rounded-md overflow-hidden my-4 shrink-0">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            style={{
              containerStyle: {
                filter: getFilterString(filters),
              },
            }}
          />
        </div>

        <div className="space-y-6 pr-4">
          <div className="space-y-2">
            <Label>Zoom</Label>
            <Slider
              min={1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={(val) => setZoom(val[0])}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filterOptions.map((option) => (
              <div key={option.key} className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs font-medium">{option.name}</Label>
                  <span className="text-xs text-muted-foreground">
                    {filters[option.key]}
                  </span>
                </div>
                <Slider
                  min={option.min}
                  max={option.max}
                  step={option.step}
                  value={[filters[option.key]]}
                  onValueChange={(val) =>
                    handleFilterChange(option.key, val[0])
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditor;
